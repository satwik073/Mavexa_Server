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
const redis_1 = require("redis");
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
    dotenv.config({ path: path_1.default.resolve(__dirname, envFile) });
    console.log(`Loaded environment from ${envFile}`);
};
loadEnvironmentVariables();
(0, db_config_1.default)();
const initializeRedisClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const redisUrl = process.env.REDIS_CONNECTION;
    if (!redisUrl) {
        throw new Error('REDIS_CONNECT is not defined in the environment variables');
    }
    const redisClient = (0, redis_1.createClient)({
        url: redisUrl
    });
    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });
    redisClient.on('error', (err) => {
        console.error('Redis error:', err);
    });
    yield redisClient.connect();
    return redisClient;
});
const server_configs = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    const redisClient = yield initializeRedisClient();
    app.use(compression());
    app.use(bodyParser.json());
    app.use(cors());
    app.use((req, res, next) => {
        req.redisClient = redisClient;
        next();
    });
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    const PORT_ESTAIBLISHED = process.env.PORT_ESTAIBLISHED || 8000;
    app.use('/api/v1/', userRouter_1.default);
    app.use('/api/v1/controls', adminRoutes_1.default);
    app.listen(PORT_ESTAIBLISHED, () => {
        console.log(`Server running successfully on port ${PORT_ESTAIBLISHED}`);
    });
});
if (!process.env.VERCEL_ENV) {
    if (clusterPremises.isMaster) {
        const numCPUs = operatingSystem.cpus().length;
        console.log(`Master process ${process.pid} is running`);
        console.log(`Forking server for ${numCPUs} CPUs`);
        for (let i = 0; i < numCPUs; i++) {
            clusterPremises.fork();
        }
        clusterPremises.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
            clusterPremises.fork();
        });
    }
    else {
        server_configs();
    }
}
else {
    server_configs();
}
//# sourceMappingURL=server.js.map