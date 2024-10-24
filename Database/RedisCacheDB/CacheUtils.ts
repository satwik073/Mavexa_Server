import { SetOptions } from "redis";
import { redisClusterConnection } from "./RedisConfigurations";

const parsingTheDataJSONValues = (dataBufferingRequest: Buffer | null): any | null => {
    try {
        return (!dataBufferingRequest) ? null : (JSON.parse(dataBufferingRequest.toString()))
    } catch (error_value: any) {
        console.error('Error in Parsing the JSON Data from Cache', error_value)
        return null
    }
}

export const retrieveCachedDataWithPerformanceMetricsAndSafety = async (cacheKeyIdentifierString: string): Promise<any> => {
    const cacheRetrievalStartTimestamp: number = Date.now();
    try {
        const cachedDataBuffer: Buffer | null = await redisClusterConnection.getBuffer(cacheKeyIdentifierString);
        const parsedData = parsingTheDataJSONValues(cachedDataBuffer);
        return parsedData
    } catch (error) {
        console.error(`An error occurred while attempting to fetch cache for key: ${cacheKeyIdentifierString}`, error);
        return null;
    }
    finally {
        const cacheRetrievalEndTimestamp: number = Date.now();
        const cacheRetrievalDurationInMilliseconds: number = cacheRetrievalEndTimestamp - cacheRetrievalStartTimestamp;
        console.log(`[PERFORMANCE] Cache GET operation for key "${cacheKeyIdentifierString}" took ${cacheRetrievalDurationInMilliseconds}ms`);
    }
}


export const setCacheWithAdvancedTTLHandlingAndPipelining = async (
    cacheKeyIdentifierString: string,  // Cache key
    cacheValueObjectToStore: any,      // Value to cache (object)
    cacheTimeToLiveInSeconds?: number  // TTL in seconds (optional)
): Promise<void> => {
    const cacheSetOperationStartTimestamp: number = Date.now();
    
    try {
        // Step 1: Serialize the object into a string (JSON)
        const serializedCacheValueString: string = JSON.stringify(cacheValueObjectToStore);
        
        // Step 2: Ensure Redis connection is ready
        if (!redisClusterConnection || redisClusterConnection.status !== 'ready') {
            console.error('Redis connection is not initialized or ready.');
            await redisClusterConnection.connect();  // Manually trigger connection if needed
        }

        // Step 3: Use Redis pipeline or direct `set` depending on preference
        const pipelineInstanceForSettingCacheData = redisClusterConnection.pipeline();
        
        // If TTL is provided, set with expiration; otherwise, set without expiration
        if (cacheTimeToLiveInSeconds) {
            // Using expiration 'EX' and TTL (in seconds)
            pipelineInstanceForSettingCacheData.set(
                cacheKeyIdentifierString,
                serializedCacheValueString,
                'EX', cacheTimeToLiveInSeconds
            );
        } else {
            // Set without expiration
            pipelineInstanceForSettingCacheData.set(
                cacheKeyIdentifierString,
                serializedCacheValueString
            );
        }

        // Step 4: Execute the pipeline (or direct set)
        await pipelineInstanceForSettingCacheData.exec();
        console.log(`Cache set for key "${cacheKeyIdentifierString}" successfully.`);

    } catch (error) {
        console.error(`An error occurred while setting cache for key: ${cacheKeyIdentifierString}`, error);
        throw error;  // Re-throw the error to handle it higher up the call stack
    } finally {
        const cacheSetOperationEndTimestamp: number = Date.now();
        const cacheSetOperationDurationInMilliseconds: number = cacheSetOperationEndTimestamp - cacheSetOperationStartTimestamp;
        console.log(`[PERFORMANCE] Cache SET operation for key "${cacheKeyIdentifierString}" took ${cacheSetOperationDurationInMilliseconds}ms`);
    }
};

export const deleteCacheKeyWithDetailedPerformanceMetrics = async (cacheKeyIdentifierString: string): Promise<void> => {
    const cacheDeletionStartTimestamp: number = Date.now();
    try {
        await redisClusterConnection.del(cacheKeyIdentifierString);
    } catch (error) {
        console.error(`An error occurred while attempting to delete cache for key: ${cacheKeyIdentifierString}`, error);
    } finally {
        const cacheDeletionEndTimestamp: number = Date.now();
        const cacheDeletionDurationInMilliseconds: number = cacheDeletionEndTimestamp - cacheDeletionStartTimestamp;
        console.log(`[PERFORMANCE] Cache DEL operation for key "${cacheKeyIdentifierString}" took ${cacheDeletionDurationInMilliseconds}ms`);
    }
};

export const deleteMultipleCacheKeysWithAdvancedPipeliningAndLogging = async (cacheKeyIdentifierArray: string[]): Promise<void> => {
    const batchCacheDeletionStartTimestamp: number = Date.now();
    try {
        if (cacheKeyIdentifierArray.length === 0) return;

        const pipelineInstanceForBatchDeletion = redisClusterConnection.pipeline();
        cacheKeyIdentifierArray.forEach((cacheKeyIdentifierString) => pipelineInstanceForBatchDeletion.del(cacheKeyIdentifierString));

        await pipelineInstanceForBatchDeletion.exec();
    } catch (error) {
        console.error('An error occurred while attempting to delete multiple cache keys in batch:', error);
    } finally {
        const batchCacheDeletionEndTimestamp: number = Date.now();
        const batchCacheDeletionDurationInMilliseconds: number = batchCacheDeletionEndTimestamp - batchCacheDeletionStartTimestamp;
        console.log(`[PERFORMANCE] Batch Cache DEL operation for multiple keys took ${batchCacheDeletionDurationInMilliseconds}ms`);
    }
};