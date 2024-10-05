import Redis from "ioredis";

const isProductionEnviornmentLoaded = process.env.MODE === 'production'
const redisConnectionLoaded = isProductionEnviornmentLoaded
    ? process.env.REDIS_CONNECTION
    : 'redis://localhost:6379'

const redisClusterConnection = new Redis({
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
    reconnectOnError: (error_fetched : any) => {
        const targetError = 'READONLY';
        return (error_fetched?.message?.includes(targetError)) ? true : false;
    },
    keepAlive: 30000,
    enableOfflineQueue: true,
    maxLoadingRetryTime:20000,
    tls: process.env.REDIS_TLS_ENABLED ? { rejectUnauthorized: false } : undefined
})

redisClusterConnection.on('error', (error_value : any) => {
    console.error('Redis Connection Error', error_value?.message , error_value?.stack)
})
redisClusterConnection.on('connect', () => {
    console.log('Successfully connected to Redis');
});

redisClusterConnection.on('reconnecting', () => {
    console.log('Attempting to reconnect to Redis...');
});

redisClusterConnection.on('end', () => {
    console.error('Connection to Redis has ended. Investigating...');
});

export { redisClusterConnection };