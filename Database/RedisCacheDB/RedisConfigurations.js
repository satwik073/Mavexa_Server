"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClusterConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const isProductionEnviornmentLoaded = process.env.MODE === 'production';
const redisConnectionLoaded = isProductionEnviornmentLoaded
    ? process.env.REDIS_CONNECTION
    : 'redis://localhost:6379';
const redisClusterConnection = new ioredis_1.default({
    host: redisConnectionLoaded || process.env.REDIS_CONNECTION || 'localhost',
    password: process.env.REDIS_PASSWORD_GRANTED || undefined,
    maxRetriesPerRequest: 5,
    connectTimeout: isProductionEnviornmentLoaded ? 50000 : 100000,
    retryStrategy: (times_retry) => Math.min(times_retry * 50, 5000),
    lazyConnect: true,
    enableReadyCheck: true,
    enableAutoPipelining: true,
    showFriendlyErrorStack: !isProductionEnviornmentLoaded,
    keyPrefix: 'Mavexa-Cache',
    reconnectOnError: (error_fetched) => {
        var _a;
        const targetError = 'READONLY';
        return ((_a = error_fetched === null || error_fetched === void 0 ? void 0 : error_fetched.message) === null || _a === void 0 ? void 0 : _a.includes(targetError)) ? true : false;
    },
    keepAlive: 30000,
    enableOfflineQueue: true,
    maxLoadingRetryTime: 20000,
    tls: process.env.REDIS_TLS_ENABLED ? { rejectUnauthorized: false } : undefined
});
exports.redisClusterConnection = redisClusterConnection;
redisClusterConnection.on('error', (error_value) => {
    console.error('Redis Connection Error', error_value === null || error_value === void 0 ? void 0 : error_value.message, error_value === null || error_value === void 0 ? void 0 : error_value.stack);
});
redisClusterConnection.on('connect', () => {
    console.log('Successfully connected to Redis');
});
redisClusterConnection.on('reconnecting', () => {
    console.log('Attempting to reconnect to Redis...');
});
redisClusterConnection.on('end', () => {
    console.error('Connection to Redis has ended. Investigating...');
});
//# sourceMappingURL=RedisConfigurations.js.map