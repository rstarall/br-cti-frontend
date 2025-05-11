import { useCallback } from 'react';
import { useDataStore } from '@/store/dataStore';
import { localDataApi } from '@/api/localData';
import type {
  CTIUpchainConfig
} from '@/api/types/localData';

/**
 * 用于CTI和模型上链处理流程的 hooks，封装 API 调用和 store 更新
 */
export function useUpchainProcess() {
  const { updateTaskStatus, updateTaskProgress } = useDataStore();

  // 轮询CTI上链进度
  const pollCTIUpchainProgress = useCallback(async (fileHash: string) => {
    let pollInterval: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 5; // 增加最大重试次数
    const pollDelay = 2000; // 增加轮询间隔，减少服务器压力

    const cleanup = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };


    pollInterval = setInterval(async () => {
      try {
        console.log(`[上链进度] 正在查询文件 ${fileHash} 的上链进度...`);
        const res = await localDataApi.getCTIUpchainProgress(fileHash);
        console.log(`[上链进度] 查询结果:`, res);

        if (res.code === 200 || res.code === 0) {
          // 确保data和progress字段存在
          if (res.data && typeof res.data.progress === 'number') {
            const { progress } = res.data;
            console.log(`[上链进度] 当前进度: ${progress}%`);

            // 更新进度
            updateTaskProgress(fileHash, 'upchain', progress);

            // 如果处理完成
            if (progress === 100) {
              console.log(`[上链进度] 上链完成!`);
              updateTaskStatus(fileHash, 'upchain', true);
              cleanup();
            }
          } else {
            console.warn(`[上链进度] 响应中缺少进度数据:`, res);
            retryCount++;
          }
        } else {
          console.warn(`[上链进度] 查询失败:`, res);
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error(`[上链进度] 达到最大重试次数 ${maxRetries}，停止轮询`);
            cleanup();
          }
        }
      } catch (error) {
        console.error(`[上链进度] 查询出错:`, error);
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error(`[上链进度] 达到最大重试次数 ${maxRetries}，停止轮询`);
          cleanup();
        }
      }
    }, pollDelay);

    return cleanup;
  }, [updateTaskProgress, updateTaskStatus]);

  // 轮询模型上链进度
  const pollModelUpchainProgress = useCallback(async (fileHash: string) => {
    let pollInterval: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 5; // 增加最大重试次数
    const pollDelay = 2000; // 增加轮询间隔，减少服务器压力

    const cleanup = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };

    // 先设置初始进度为10%，确保用户看到进度条
    updateTaskProgress(fileHash, 'upchain', 10);

    pollInterval = setInterval(async () => {
      try {
        console.log(`[模型上链进度] 正在查询文件 ${fileHash} 的上链进度...`);
        const res = await localDataApi.getModelUpchainProgress(fileHash);
        console.log(`[模型上链进度] 查询结果:`, res);

        if (res.code === 200 || res.code === 0) {
          // 确保data和progress字段存在
          if (res.data && typeof res.data.progress === 'number') {
            const { progress } = res.data;
            console.log(`[模型上链进度] 当前进度: ${progress}%`);

            // 更新进度
            updateTaskProgress(fileHash, 'upchain', progress);

            // 如果处理完成
            if (progress === 100) {
              console.log(`[模型上链进度] 上链完成!`);
              updateTaskStatus(fileHash, 'upchain', true);
              cleanup();
            }
          } else {
            console.warn(`[模型上链进度] 响应中缺少进度数据:`, res);
            retryCount++;
          }
        } else {
          console.warn(`[模型上链进度] 查询失败:`, res);
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error(`[模型上链进度] 达到最大重试次数 ${maxRetries}，停止轮询`);
            cleanup();
          }
        }
      } catch (error) {
        console.error(`[模型上链进度] 查询出错:`, error);
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error(`[模型上链进度] 达到最大重试次数 ${maxRetries}，停止轮询`);
          cleanup();
        }
      }
    }, pollDelay);

    return cleanup;
  }, [updateTaskProgress, updateTaskStatus]);

  // CTI上链（带进度轮询）
  const upchainCTI = useCallback(async (config: CTIUpchainConfig) => {
    try {
      console.log(`[CTI上链] 开始上链处理，参数:`, config);

      // 验证必要参数
      if (!config.file_hash) {
        console.error('[CTI上链] 文件哈希不能为空');
        throw new Error('文件哈希不能为空');
      }
      if (!config.ipfs_address) {
        console.error('[CTI上链] IPFS地址不能为空');
        throw new Error('IPFS地址不能为空');
      }
      if (!config.upchain_account) {
        console.error('[CTI上链] 上链账户不能为空');
        throw new Error('上链账户不能为空');
      }
      if (!config.upchain_account_password) {
        console.error('[CTI上链] 账户密码不能为空');
        throw new Error('账户密码不能为空');
      }

      // 开始处理前更新进度
      updateTaskProgress(config.file_hash, 'upchain', 0);
      console.log(`[CTI上链] 正在调用上链API...`);

      // 调用上链API
      try {
        const res = await localDataApi.uploadCTIToBlockchain(config);
        console.log(`[CTI上链] API响应:`, res);

        if (res.code === 200 || res.code === 0) {
          console.log(`[CTI上链] 上链请求成功，开始轮询进度`);
          // 开始轮询进度
          pollCTIUpchainProgress(config.file_hash);
          return res;
        } else {
          console.error(`[CTI上链] 上链请求失败，错误码: ${res.code}，消息: ${res.message || res.msg || '未知错误'}`);
          throw new Error(res.message || res.msg || res.error || '上链失败');
        }
      } catch (apiError) {
        console.error(`[CTI上链] API调用异常:`, apiError);
        throw apiError;
      }
    } catch (error) {
      console.error(`[CTI上链] 处理异常:`, error);
      throw error instanceof Error ? error : new Error('上链失败');
    }
  }, [updateTaskProgress, pollCTIUpchainProgress]);



  // 模型上链（通过源文件哈希，带进度轮询）
  const upchainModelBySourceFileHash = useCallback(async (
    fileHash: string,
    upchainAccount: string,
    upchainAccountPassword: string
  ) => {
    try {
      // 验证必要参数
      if (!fileHash) {
        throw new Error('文件哈希不能为空');
      }
      if (!upchainAccount) {
        throw new Error('上链账户不能为空');
      }
      if (!upchainAccountPassword) {
        throw new Error('账户密码不能为空');
      }

      // 开始处理前更新进度
      updateTaskProgress(fileHash, 'upchain', 0);

      // 调用上链API
      const res = await localDataApi.uploadModelToBlockchainBySourceFileHash(
        fileHash,
        upchainAccount,
        upchainAccountPassword
      );

      if (res.code === 200 || res.code === 0) {
        // 开始轮询进度
        pollModelUpchainProgress(fileHash);
        return res;
      }
      throw new Error(res.message || '模型上链失败');
    } catch (error) {
      throw error instanceof Error ? error : new Error('模型上链失败');
    }
  }, [updateTaskProgress, pollModelUpchainProgress]);

  // 模型上链（通过模型哈希，带进度轮询）
  const upchainModelByModelHash = useCallback(async (
    fileHash: string,
    modelHash: string,
    upchainAccount: string,
    upchainAccountPassword: string
  ) => {
    try {
      // 验证必要参数
      if (!fileHash) {
        throw new Error('文件哈希不能为空');
      }
      if (!modelHash) {
        throw new Error('模型哈希不能为空');
      }
      if (!upchainAccount) {
        throw new Error('上链账户不能为空');
      }
      if (!upchainAccountPassword) {
        throw new Error('账户密码不能为空');
      }

      // 开始处理前更新进度
      updateTaskProgress(fileHash, 'upchain', 0);

      // 调用上链API
      const res = await localDataApi.uploadModelToBlockchainByModelHashDirect(
        fileHash,
        modelHash,
        upchainAccount,
        upchainAccountPassword
      );

      if (res.code === 200 || res.code === 0) {
        // 开始轮询进度
        pollModelUpchainProgress(fileHash);
        return res;
      }
      throw new Error(res.message || '模型上链失败');
    } catch (error) {
      throw error instanceof Error ? error : new Error('模型上链失败');
    }
  }, [updateTaskProgress, pollModelUpchainProgress]);

  return {
    upchainCTI,
    upchainModelBySourceFileHash,
    upchainModelByModelHash,
    pollCTIUpchainProgress,
    pollModelUpchainProgress
  };
}
