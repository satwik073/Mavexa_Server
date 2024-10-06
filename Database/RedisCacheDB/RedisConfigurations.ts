import Redis from "ioredis";

const isProductionEnviornmentLoaded = process.env.MODE === 'production';
const redisConnectionLoaded: string | URL = isProductionEnviornmentLoaded
    ? process.env.REDIS_CONNECTION as string
    : process.env.REDIS_CONNECTION as string
const redisHostName = isProductionEnviornmentLoaded
    ? process.env.REDIS_HOSTNAME_CLOUD
    : process.env.REDIS_HOSTNAME_CLOUD

const redisOptionsConfig = new URL(redisConnectionLoaded)

const redisClusterConnection = new Redis({
    host: redisOptionsConfig.hostname || redisHostName,
    port: Number(redisOptionsConfig.port) || 6379,
    password: process.env.REDIS_PASSWORD_GRANTED || redisOptionsConfig.password || undefined,
    maxRetriesPerRequest: 5,
    connectTimeout: isProductionEnviornmentLoaded ? 50000 : 100000,
    retryStrategy: (times_retry) => Math.min(times_retry * 50, 5000),
    lazyConnect: true,
    enableReadyCheck: true,
    enableAutoPipelining: true,
    showFriendlyErrorStack: !isProductionEnviornmentLoaded,
    keyPrefix: 'Mavexa-Cache',
    reconnectOnError: (error_fetched) => {
        const targetError = 'READONLY';
        return (error_fetched?.message?.includes(targetError));
    },
    keepAlive: 30000,
    enableOfflineQueue: true,
    maxLoadingRetryTime: 20000,
    // tls: process.env.REDIS_TLS_ENABLED ? { rejectUnauthorized: false } : undefined
});

console.log('Attempting to connect to Redis with:', redisConnectionLoaded);

redisClusterConnection.ping((err, res) => {
    if (err) {
        console.error('Error connecting to Redis:', err);
    } else {
        console.log('Connected to Redis:', res);
    }
});

redisClusterConnection.on('error', (error_value) => {
    console.error('Redis Connection Error', error_value?.message, error_value?.stack);
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

export { redisClusterConnection };
