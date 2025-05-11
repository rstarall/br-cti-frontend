import { useCallback } from 'react';
import { useDataStore } from '@/store/dataStore';
import { localDataApi } from '@/api/localData';
import type {
  ProcessCTIConfig,
  ProcessCTIResponse
} from '@/api/types/localData';

/**
 * 用于CTI处理流程的 hooks，封装 API 调用和 store 更新
 */
export function useCtiProcess() {
  const { updateTaskStatus, updateTaskProgress } = useDataStore();

  // CTI 转换
  const processCti = useCallback(async (config: ProcessCTIConfig) => {
    try {
      // 开始处理前更新进度
      updateTaskProgress(config.file_hash, 'cti', 0);

      const res = await localDataApi.processStixToCTI(config);
      if (res.code === 200 || res.code === 0) {
        // 处理完成后更新状态
        updateTaskStatus(config.file_hash, 'cti', true);
        return res;
      }
      throw new Error(res.message || 'CTI转换失败');
    } catch (error) {
      throw error instanceof Error ? error : new Error('CTI转换失败');
    }
  }, [updateTaskStatus, updateTaskProgress]);

  // cti 转换（带进度轮询）
  const processStixToCTI = useCallback(async (config: ProcessCTIConfig) => {
    try {
      // 开始处理前更新进度
      updateTaskProgress(config.file_hash, 'cti', 0);

      const res = await localDataApi.processStixToCTI(config);
      if (res.code === 200 || res.code === 0) {
        // 开始轮询进度
        pollCTIProcessProgress(config.file_hash);
        return res;
      }
      throw new Error(res.message || 'cti转换失败');
    } catch (error) {
      throw error instanceof Error ? error : new Error('cti转换失败');
    }
  }, [updateTaskProgress]);

  // 轮询CTI处理进度
  const pollCTIProcessProgress = useCallback(async (fileHash: string) => {
    let pollInterval: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 3;

    const cleanup = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };

    pollInterval = setInterval(async () => {
      try {
        const res = await localDataApi.getCTIProcessProgress(fileHash);

        if (res.code === 200 || res.code === 0) {
          const { progress } = res.data;

          // 更新进度
          updateTaskProgress(fileHash, 'cti', progress);

          // 如果处理完成
          if (progress === 100) {
            updateTaskStatus(fileHash, 'cti', true);
            cleanup();
          }
        } else {
          retryCount++;
          if (retryCount >= maxRetries) {
            cleanup();
          }
        }
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          cleanup();
        }
      }
    }, 1000);

    return cleanup;
  }, [updateTaskProgress, updateTaskStatus]);

  return {
    processCti,
    processStixToCTI,
    pollCTIProcessProgress
  };
}
