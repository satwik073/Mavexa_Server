"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./Common/instrument");
const userRouter_1 = __importDefault(require("./Routes/user_routers/userRouter"));
const adminRoutes_1 = __importDefault(require("./Routes/admin_routes/adminRoutes"));
const db_config_1 = __importDefault(require("./DB/DB/db_config"));
const path_1 = __importDefault(require("path"));
const ioredis_1 = __importDefault(require("ioredis"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const crypto_1 = __importDefault(require("crypto"));
const cors_1 = __importDefault(require("cors"));
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
        environmentVariableManager.config({ path: path_1.default.resolve(__dirname, activeEnvironmentConfigFile) });
        console.info(`✅ Environment loaded from: ${activeEnvironmentConfigFile}`);
        return activeEnvironmentConfigFile === './.env.staging'
            ? process.env.PRODUCTION_INSTANCE_STAGING
            : process.env.PRODUCTION_INSTANCE_PROD;
    }
    catch (error) {
        console.error(`❌ Error loading environment variables: ${error.message}`);
        return process.env.PRODUCTION_INSTANCE_STAGING;
    }
};
loadEnvironmentVariablesFromConfigFile();
(0, db_config_1.default)();
const redisClusterConnection = new ioredis_1.default(process.env.REDIS_CONNECTION || '');
const generateCryptographicSessionSecret = () => crypto_1.default.randomBytes(32).toString('hex');
const sessionManagementMiddleware = (0, express_session_1.default)({
    store: new connect_redis_1.default({ client: redisClusterConnection }),
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
const globalRequestRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "❌ Too many requests from this IP address. Please try again later." }
});
const initializeStructuredLoggingSystem = () => {
    const systemLogger = winston_1.default.createLogger({
        level: 'info',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        transports: [
            new winston_1.default.transports.Console(),
            new winston_1.default.transports.File({ filename: 'system-logs.log' })
        ],
    });
    return systemLogger;
};
const initializeAndConfigureServerApplication = () => __awaiter(void 0, void 0, void 0, function* () {
    const httpServerApplication = expressServerFramework();
    const systemLoggerInstance = initializeStructuredLoggingSystem();
    const CORSValidator = loadEnvironmentVariablesFromConfigFile();
    httpServerApplication.use(express_winston_1.default.logger({
        winstonInstance: systemLoggerInstance,
        level: 'info',
        msg: 'HTTP {{req.method}} {{req.url}}',
    }));
    const corsOrigin = CORSValidator;
    httpServerApplication.use((0, cors_1.default)({
        origin: corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }));
    httpServerApplication.use((0, helmet_1.default)());
    httpServerApplication.use(dataCompressionMiddleware());
    httpServerApplication.use(httpRequestBodyParsingLibrary.json({ limit: '10kb' }));
    httpServerApplication.use((0, cookie_parser_1.default)());
    httpServerApplication.use(globalRequestRateLimiter);
    httpServerApplication.use(sessionManagementMiddleware);
    httpServerApplication.use((req, res, next) => {
        req.redisClient = redisClusterConnection;
        next();
    });
    applicationPerformanceMonitoring.init({ dsn: process.env.SENTRY_DSN });
    const activePortForServer = process.env.PORT_ESTAIBLISHED || 8000;
    httpServerApplication.use('/api/v1/', userRouter_1.default);
    httpServerApplication.use('/api/v1/controls', adminRoutes_1.default);
    httpServerApplication.listen(activePortForServer, () => console.info(`✅ Server running on port ${activePortForServer}`));
});
if (process.env.VERCEL_ENV) {
    initializeAndConfigureServerApplication();
}
else {
    if (multiProcessClusterManager.isPrimary) {
        const cpuCoreCount = operatingSystemModule.cpus().length;
        console.info(`✅ Primary process ${process.pid} is running. Forking ${cpuCoreCount} worker processes.`);
        for (let i = 0; i < cpuCoreCount; i++)
            multiProcessClusterManager.fork();
        multiProcessClusterManager.on('exit', (workerProcess) => {
            console.warn(`👷 Worker process ${workerProcess.process.pid} exited unexpectedly. Forking a new worker process.`);
            multiProcessClusterManager.fork();
        });
    }
    else {
        initializeAndConfigureServerApplication();
    }
}
//# sourceMappingURL=server.js.map