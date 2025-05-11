import { useState } from 'react';
import { message } from 'antd';
import { localDataApi, StixProcessConfig, StixProcessProgress } from '@/api/localData';
import { useDataStore } from '@/store/dataStore';

export type { StixProcessConfig, StixProcessProgress };

export const useStixProcess = () => {
  const [processingStatus, setProcessingStatus] = useState<Record<string, 'idle' | 'processing' | 'finished' | 'failed'>>({});
  const [progress, setProgress] = useState<Record<string, StixProcessProgress>>({});
  const { updateTaskProgress, updateTaskStatus } = useDataStore();

  const getTrafficFeatures = async (fileHash: string) => {
    try {
      const response = await localDataApi.getTrafficFeatures(fileHash);
      if (response.code === 200) {
        return response.data;
      }
      throw new Error(response.error || '获取特征字段失败');
    } catch (error: any) {
      message.error(error.message || '获取特征字段失败');
      throw error;
    }
  };

  const startStixProcess = async (config: StixProcessConfig) => {
    try {
      // 验证必要的参数
      if (!config.file_hash) {
        throw new Error('文件哈希不能为空');
      }
      if (!config.stix_type) {
        throw new Error('请选择情报类型');
      }

      // 设置处理状态
      setProcessingStatus(prev => ({ ...prev, [config.process_id]: 'processing' }));

      // 初始化进度
      setProgress(prev => ({
        ...prev,
        [config.process_id]: {
          progress: 0,
          current_step: 0,
          total_step: 100
        }
      }));

      // 调用API开始处理
      const response = await localDataApi.processDataToStix(config);

      if (response.code === 200) {
        const { current_step, total_step } = response.data;

        // 更新进度信息
        setProgress(prev => ({
          ...prev,
          [config.process_id]: {
            progress: Math.floor((current_step / total_step) * 100) || 0,
            current_step,
            total_step
          }
        }));

        // 开始轮询进度
        pollStixProcessProgress(config.process_id, config.file_hash);
        return true;
      }

      throw new Error(response.error || 'STIX处理失败');
    } catch (error: any) {
      setProcessingStatus(prev => ({ ...prev, [config.process_id]: 'failed' }));
      message.error(error.message || 'STIX处理失败');
      return false;
    }
  };

  const pollStixProcessProgress = async (processId: string, fileHash: string) => {
    // 初始化进度
    updateTaskProgress(fileHash, 'stix', 0);
    let pollInterval: NodeJS.Timeout;

    // 创建一个清理函数，用于在组件卸载或轮询结束时清理定时器
    const cleanup = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };

    // 开始轮询
    pollInterval = setInterval(async () => {
      try {
        const response = await localDataApi.getStixProcessProgress(fileHash);

        if (response.code === 200) {
          const data = response.data;

          // 如果没有数据，表示处理失败
          if (!data) {
            cleanup();
            setProcessingStatus(prev => ({ ...prev, [processId]: 'failed' }));
            message.error('获取STIX处理进度失败');
            return;
          }

          // 更新进度信息
          setProgress(prev => ({
            ...prev,
            [processId]: {
              progress: data.progress,
              current_step: data.current_step,
              total_step: data.total_step
            }
          }));

          // 更新任务进度
          updateTaskProgress(fileHash, 'stix', data.progress);

          // 如果有错误信息，显示错误
          if (data.errors && data.errors.length > 0) {
            message.warning(`处理警告: ${data.errors.join(', ')}`);
          }

          // 如果进度为100%，表示处理完成
          if (data.progress === 100) {
            cleanup();
            setProcessingStatus(prev => ({ ...prev, [processId]: 'finished' }));
            // 更新任务状态
            updateTaskStatus(fileHash, 'stix', true);
            message.success('STIX处理完成');
          }
        } else {
          // API返回错误
          message.error(response.error || '获取STIX处理进度失败');
        }
      } catch (error: any) {
        cleanup();
        setProcessingStatus(prev => ({ ...prev, [processId]: 'failed' }));
        message.error(error.message || '获取STIX处理进度失败');
      }
    }, 1000);

    // 返回清理函数
    return cleanup;
  };

  return {
    processingStatus,
    progress,
    getTrafficFeatures,
    startStixProcess
  };
};