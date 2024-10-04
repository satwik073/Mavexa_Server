require("./Common/instrument");
import { Request, Response, NextFunction } from 'express';
import user_controlling_routes from './Routes/user_routers/userRouter';
import admin_controlling_routes from './Routes/admin_routes/adminRoutes';
import connection_DB_estaiblished from './DB/DB/db_config';
import path from 'path';
import { RedisClientType, createClient } from 'redis'; 

const operatingSystem = require('os');
const clusterPremises = require('cluster');
const Sentry = require("@sentry/node");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');

const loadEnvironmentVariables = () => {
    const envFile = process.env.VERCEL_ENV === 'production' 
        ? './.env.production' 
        : './.env.staging';
    dotenv.config({ path: path.resolve(__dirname, envFile) });
    console.log(`Loaded environment from ${envFile}`);
};

loadEnvironmentVariables();
connection_DB_estaiblished();
const initializeRedisClient = async (): Promise<RedisClientType> => {
    const redisUrl = process.env.REDIS_CONNECTION;

    if (!redisUrl) {
        throw new Error('REDIS_CONNECT is not defined in the environment variables');
    }

    const redisClient = createClient({
        url: redisUrl
    });


const server_configs = async () => {
    const app = express();
    const redisClient = await initializeRedisClient();
    app.use(compression());
    app.use(bodyParser.json());
    app.use(cors());
    app.use((req: Request, res: Response, next: NextFunction) => {
        req.redisClient = redisClient;
        next();
    });
    Sentry.init({ dsn: process.env.SENTRY_DSN });

    const PORT_ESTAIBLISHED = process.env.PORT_ESTAIBLISHED || 8000;
    app.use('/api/v1/', user_controlling_routes);
    app.use('/api/v1/controls', admin_controlling_routes);
    app.listen(PORT_ESTAIBLISHED, () => {
        console.log(`Server running successfully on port ${PORT_ESTAIBLISHED}`);
    });
};

if (!process.env.VERCEL_ENV) {
    if (clusterPremises.isMaster) {
        const numCPUs = operatingSystem.cpus().length;
        console.log(`Master process ${process.pid} is running`);
        console.log(`Forking server for ${numCPUs} CPUs`);
        for (let i = 0; i < numCPUs; i++) {
            clusterPremises.fork();
        }
        clusterPremises.on('exit', (worker: { process: { pid: any; }; }) => {
            console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
            clusterPremises.fork();
        });
    } else {
        server_configs(); 
    }
} else {
    server_configs();
}
