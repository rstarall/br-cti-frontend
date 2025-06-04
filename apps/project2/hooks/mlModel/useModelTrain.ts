import { useState } from 'react';
import { localMLApi } from '@/api/localML';
import { useLocalMLStore } from '@/store/localMLStore';
import { message } from 'antd';

export function useModelTrain() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStage, setTrainingStage] = useState('');
  const [trainingMessage, setTrainingMessage] = useState('');
  const [modelMetrics, setModelMetrics] = useState<any>(null);

  const {
    updateTaskStatus,
    updateTaskProgress,
    updateTaskModelHash,
    updateTaskTrainRequestId
  } = useLocalMLStore();

  const getFeatureList = async (fileHash: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/ml/get_feature_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_hash: fileHash })
      });

      const data = await response.json();

      if (data.code === 200 && data.data) {
        // 返回特征列表（分号分隔的字符串）
        return data.data;
      } else {
        message.error(data.error || '获取特征列表失败');
        return '';
      }
    } catch (error) {
      console.error('Error getting feature list:', error);
      message.error('获取特征列表失败');
      return '';
    }
  };

  const startTraining = async (fileHash: string, labelColumn: string, ctiId?: string) => {
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingStage('准备训练');
    setTrainingMessage('');

    const messageKey = `train-${Date.now()}`;

    try {
      message.loading({ content: '正在创建训练任务...', key: messageKey });

      const response = await localMLApi.createModelTask(fileHash, labelColumn, ctiId);

      if (response.code === 200 && response.data) {
        const requestId = response.data.request_id;

        // 更新任务状态
        updateTaskTrainRequestId(fileHash, requestId);

        // 开始轮询训练进度
        pollTrainingProgress(requestId, fileHash);

        message.success({ content: '训练任务已创建', key: messageKey });
        return { success: true, requestId };
      } else {
        setIsTraining(false);
        message.error({ content: response.error || '创建训练任务失败', key: messageKey });
        return { success: false };
      }
    } catch (error) {
      console.error('Start training error:', error);
      setIsTraining(false);
      message.error({ content: '创建训练任务失败', key: messageKey });
      return { success: false };
    }
  };

  const pollTrainingProgress = async (requestId: string, fileHash: string) => {
    let intervalId: NodeJS.Timeout | null = null;

    const checkProgress = async () => {
      try {
        const response = await localMLApi.getModelProgress(requestId);

        if (response.code === 200 && response.data) {
          const progress = response.data.progress || 0;
          const stage = response.data.stage || '';
          const currentMessage = response.data.message || '';

          // 更新状态
          setTrainingProgress(progress);
          setTrainingStage(stage);
          setTrainingMessage(currentMessage);

          // 更新任务进度
          updateTaskProgress(fileHash, 'train', progress);

          // 如果训练完成
          if (progress >= 100) {
            updateTaskStatus(fileHash, 'train', true);
            setIsTraining(false);

            // 获取训练结果
            getTrainingResult(requestId, fileHash);

            // 更新评估状态
            if (stage.includes('Evaluation')) {
              updateTaskStatus(fileHash, 'evaluate', true);
              updateTaskProgress(fileHash, 'evaluate', 100);
            }

            if (intervalId) clearInterval(intervalId);
            message.success('模型训练完成');
          }

          // 如果有错误
          if (response.data.error) {
            setIsTraining(false);
            if (intervalId) clearInterval(intervalId);
            message.error(response.data.error);
          }
        }
      } catch (error) {
        console.error('Error checking training progress:', error);
      }
    };

    // 每秒检查一次进度
    intervalId = setInterval(checkProgress, 1000);

    // 设置超时，防止无限轮询
    setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
      if (isTraining) {
        setIsTraining(false);
        message.warning('训练任务超时，请检查服务器状态');
      }
    }, 1800000); // 30分钟超时
  };

  const getTrainingResult = async (requestId: string, fileHash: string) => {
    try {
      const response = await localMLApi.getModelTrainRecordByRequestId(requestId);

      if (response.code === 200 && response.data) {
        // 更新模型哈希
        if (response.data.model_info && response.data.model_info.model_hash) {
          updateTaskModelHash(fileHash, response.data.model_info.model_hash);
        }

        // 更新模型指标
        if (response.data.metrics) {
          setModelMetrics(response.data.metrics);
        }
      }
    } catch (error) {
      console.error('Error getting training result:', error);
    }
  };

  const getTrainProgressDetail = async (requestId: string) => {
    try {
      const response = await localMLApi.getTrainProgressDetail(requestId);

      if (response.code === 200 && response.data) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting train progress detail:', error);
      return null;
    }
  };

  const getModelEvaluateImage = async (requestId: string) => {
    try {
      const response = await localMLApi.getModelEvaluateImage(requestId);

      if (response.code === 200 && response.data) {
        // 将后端返回的单个图像数据转换为数组格式
        const imageData = {
          image_type: response.data.image_type,
          image_data: response.data.image_base64
        };
        
        return [imageData];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting model evaluate image:', error);
      return [];
    }
  };

  return {
    isTraining,
    trainingProgress,
    trainingStage,
    trainingMessage,
    modelMetrics,
    getFeatureList,
    startTraining,
    getTrainProgressDetail,
    getModelEvaluateImage
  };
}

