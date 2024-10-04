require("./Common/instrument");
import { Request, Response, NextFunction } from 'express';
import userManagementRoutingController from './Routes/user_routers/userRouter';
import adminPrivilegesRouteManagement from './Routes/admin_routes/adminRoutes';
import databaseConnectionEstablishmentProcess from './DB/DB/db_config';
import absolutePathModuleResolver from 'path';
import RedisClusterClient from 'ioredis';
import httpSecurityHeadersManager from 'helmet';
import requestRateLimitingMiddleware from 'express-rate-limit';
import structuredLoggingFramework from 'winston';
import advancedLoggingMiddleware from 'express-winston';
import sessionManagementController from 'express-session';
import distributedRedisSessionStore from 'connect-redis';
import httpCookieProcessingMiddleware from 'cookie-parser';
import cryptographicRandomBytesGenerator from 'crypto';
import httpCrossOriginResourceSharingMiddleware from 'cors';
import { DefaultRequestMethods } from './Common/structure';
import { ADMIN_SUPPORT_CONFIGURATION, USER_SUPPORT_CONFIGURATION } from './Constants/RoutesDefined/RoutesFormed';
const operatingSystemModule = require('os');
const multiProcessClusterManager = require('cluster');
const applicationPerformanceMonitoring = require("@sentry/node");
const expressServerFramework = require('express');
const httpRequestBodyParsingLibrary = require('body-parser');
const environmentVariableManager = require('dotenv');
const dataCompressionMiddleware = require('compression');

const loadEnvironmentVariablesFromConfigFile = () => {
    try {
        const activeEnvironmentConfigFile = process.env.VERCEL_ENV === 'production' ? './.env.production' : './.env.staging';
        environmentVariableManager.config({ path: absolutePathModuleResolver.resolve(__dirname, activeEnvironmentConfigFile) });
        console.info(`✅ Environment loaded from: ${activeEnvironmentConfigFile}`);
        return activeEnvironmentConfigFile === './.env.staging' 
        ? process.env.PRODUCTION_INSTANCE_STAGING
        : process.env.PRODUCTION_INSTANCE_PROD;
    } catch (error : any) {
        console.error(`❌ Error loading environment variables: ${error.message}`);
        return process.env.PRODUCTION_INSTANCE_STAGING
    }
};

loadEnvironmentVariablesFromConfigFile();
databaseConnectionEstablishmentProcess();

const redisClusterConnection = new RedisClusterClient(process.env.REDIS_CONNECTION || '');

interface CustomRequest extends Request {
    redisClient: RedisClusterClient.Redis;
}
const generateCryptographicSessionSecret = () => cryptographicRandomBytesGenerator.randomBytes(32).toString('hex');

const sessionManagementMiddleware = sessionManagementController({
    store: new distributedRedisSessionStore({ client: redisClusterConnection }),
    secret: generateCryptographicSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15,
    }
});

const globalRequestRateLimiter = requestRateLimitingMiddleware({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "❌ Too many requests from this IP address. Please try again later." }
});

const initializeStructuredLoggingSystem = () => {
    const systemLogger = structuredLoggingFramework.createLogger({
        level: 'info',
        format: structuredLoggingFramework.format.combine(
            structuredLoggingFramework.format.timestamp(),
            structuredLoggingFramework.format.json()
        ),
        transports: [
            new structuredLoggingFramework.transports.Console(),
            new structuredLoggingFramework.transports.File({ filename: 'system-logs.log' })
        ],
    });

    return systemLogger;
};

const initializeAndConfigureServerApplication = async () => {
    const httpServerApplication = expressServerFramework();
    const systemLoggerInstance = initializeStructuredLoggingSystem();
    const CORSValidator = loadEnvironmentVariablesFromConfigFile();

    httpServerApplication.use(advancedLoggingMiddleware.logger({
        winstonInstance: systemLoggerInstance,
        level: 'info',
        msg: 'HTTP {{req.method}} {{req.url}}',
    }));

    const corsOrigin = CORSValidator?.startsWith('https://') || CORSValidator?.startsWith('http://');
    httpServerApplication.use(httpCrossOriginResourceSharingMiddleware({
        origin: corsOrigin,
        methods: [DefaultRequestMethods.GET , DefaultRequestMethods.POST , DefaultRequestMethods.DELETE , DefaultRequestMethods.OPT , DefaultRequestMethods.PUT],
        credentials: true,
    }));

    httpServerApplication.use(httpSecurityHeadersManager());
    httpServerApplication.use(dataCompressionMiddleware());
    httpServerApplication.use(httpRequestBodyParsingLibrary.json({ limit: '10kb' }));
    httpServerApplication.use(httpCookieProcessingMiddleware());
    httpServerApplication.use(globalRequestRateLimiter);
    httpServerApplication.use(sessionManagementMiddleware);
    httpServerApplication.use((req: CustomRequest, res: Response, next: NextFunction) => {
        req.redisClient = redisClusterConnection;
        next();
    });
    applicationPerformanceMonitoring.init({ dsn: process.env.SENTRY_DSN });
    const activePortForServer = process.env.PORT_ESTAIBLISHED || 8000;
    httpServerApplication.use(USER_SUPPORT_CONFIGURATION.global_request, userManagementRoutingController);
    httpServerApplication.use(ADMIN_SUPPORT_CONFIGURATION.admin_global_request, adminPrivilegesRouteManagement);
    httpServerApplication.listen(activePortForServer, () => console.info(`✅ Server running on port ${activePortForServer}`));
};

if (process.env.VERCEL_ENV) {
    initializeAndConfigureServerApplication();
} else {
    if (multiProcessClusterManager.isPrimary) {
        const cpuCoreCount = operatingSystemModule.cpus().length;
        console.info(`✅ Primary process ${process.pid} is running. Forking ${cpuCoreCount} worker processes.`);
        for (let i = 0; i < cpuCoreCount; i++) multiProcessClusterManager.fork();

        multiProcessClusterManager.on('exit', (workerProcess: any) => {
            console.warn(`👷 Worker process ${workerProcess.process.pid} exited unexpectedly. Forking a new worker process.`);
            multiProcessClusterManager.fork();
        });
    } else {
        initializeAndConfigureServerApplication();
    }
}
