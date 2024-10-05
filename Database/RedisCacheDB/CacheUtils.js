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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMultipleCacheKeysWithAdvancedPipeliningAndLogging = exports.deleteCacheKeyWithDetailedPerformanceMetrics = exports.setCacheWithAdvancedTTLHandlingAndPipelining = exports.retrieveCachedDataWithPerformanceMetricsAndSafety = void 0;
const RedisConfigurations_1 = require("./RedisConfigurations");
const parsingTheDataJSONValues = (dataBufferingRequest) => {
    try {
        return (!dataBufferingRequest) ? null : (JSON.parse(dataBufferingRequest.toString()));
    }
    catch (error_value) {
        console.error('Error in Parsing the JSON Data from Cache', error_value);
        return null;
    }
};
const retrieveCachedDataWithPerformanceMetricsAndSafety = (cacheKeyIdentifierString) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheRetrievalStartTimestamp = Date.now();
    try {
        const cachedDataBuffer = yield RedisConfigurations_1.redisClusterConnection.getBuffer(cacheKeyIdentifierString);
        const parsedData = parsingTheDataJSONValues(cachedDataBuffer);
        return parsedData;
    }
    catch (error) {
        console.error(`An error occurred while attempting to fetch cache for key: ${cacheKeyIdentifierString}`, error);
        return null;
    }
    finally {
        const cacheRetrievalEndTimestamp = Date.now();
        const cacheRetrievalDurationInMilliseconds = cacheRetrievalEndTimestamp - cacheRetrievalStartTimestamp;
        console.log(`[PERFORMANCE] Cache GET operation for key "${cacheKeyIdentifierString}" took ${cacheRetrievalDurationInMilliseconds}ms`);
    }
});
exports.retrieveCachedDataWithPerformanceMetricsAndSafety = retrieveCachedDataWithPerformanceMetricsAndSafety;
const setCacheWithAdvancedTTLHandlingAndPipelining = (cacheKeyIdentifierString, cacheValueObjectToStore, cacheTimeToLiveInSeconds) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheSetOperationStartTimestamp = Date.now();
    try {
        const serializedCacheValueString = JSON.stringify(cacheValueObjectToStore);
        const pipelineInstanceForSettingCacheData = RedisConfigurations_1.redisClusterConnection.pipeline();
        if (cacheTimeToLiveInSeconds) {
            pipelineInstanceForSettingCacheData.set(cacheKeyIdentifierString, serializedCacheValueString, 'EX', cacheTimeToLiveInSeconds);
        }
        else {
            pipelineInstanceForSettingCacheData.set(cacheKeyIdentifierString, serializedCacheValueString);
        }
        yield pipelineInstanceForSettingCacheData.exec();
    }
    catch (error) {
        console.error(`An error occurred while attempting to set cache for key: ${cacheKeyIdentifierString}`, error);
    }
    finally {
        const cacheSetOperationEndTimestamp = Date.now();
        const cacheSetOperationDurationInMilliseconds = cacheSetOperationEndTimestamp - cacheSetOperationStartTimestamp;
        console.log(`[PERFORMANCE] Cache SET operation for key "${cacheKeyIdentifierString}" took ${cacheSetOperationDurationInMilliseconds}ms`);
    }
});
exports.setCacheWithAdvancedTTLHandlingAndPipelining = setCacheWithAdvancedTTLHandlingAndPipelining;
const deleteCacheKeyWithDetailedPerformanceMetrics = (cacheKeyIdentifierString) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheDeletionStartTimestamp = Date.now();
    try {
        yield RedisConfigurations_1.redisClusterConnection.del(cacheKeyIdentifierString);
    }
    catch (error) {
        console.error(`An error occurred while attempting to delete cache for key: ${cacheKeyIdentifierString}`, error);
    }
    finally {
        const cacheDeletionEndTimestamp = Date.now();
        const cacheDeletionDurationInMilliseconds = cacheDeletionEndTimestamp - cacheDeletionStartTimestamp;
        console.log(`[PERFORMANCE] Cache DEL operation for key "${cacheKeyIdentifierString}" took ${cacheDeletionDurationInMilliseconds}ms`);
    }
});
exports.deleteCacheKeyWithDetailedPerformanceMetrics = deleteCacheKeyWithDetailedPerformanceMetrics;
const deleteMultipleCacheKeysWithAdvancedPipeliningAndLogging = (cacheKeyIdentifierArray) => __awaiter(void 0, void 0, void 0, function* () {
    const batchCacheDeletionStartTimestamp = Date.now();
    try {
        if (cacheKeyIdentifierArray.length === 0)
            return;
        const pipelineInstanceForBatchDeletion = RedisConfigurations_1.redisClusterConnection.pipeline();
        cacheKeyIdentifierArray.forEach((cacheKeyIdentifierString) => pipelineInstanceForBatchDeletion.del(cacheKeyIdentifierString));
        yield pipelineInstanceForBatchDeletion.exec();
    }
    catch (error) {
        console.error('An error occurred while attempting to delete multiple cache keys in batch:', error);
    }
    finally {
        const batchCacheDeletionEndTimestamp = Date.now();
        const batchCacheDeletionDurationInMilliseconds = batchCacheDeletionEndTimestamp - batchCacheDeletionStartTimestamp;
        console.log(`[PERFORMANCE] Batch Cache DEL operation for multiple keys took ${batchCacheDeletionDurationInMilliseconds}ms`);
    }
});
exports.deleteMultipleCacheKeysWithAdvancedPipeliningAndLogging = deleteMultipleCacheKeysWithAdvancedPipeliningAndLogging;
//# sourceMappingURL=CacheUtils.js.map