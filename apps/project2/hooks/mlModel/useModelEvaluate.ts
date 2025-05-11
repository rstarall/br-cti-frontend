import { useState } from 'react';
import { localMLApi } from '@/api/localML';
import { useLocalMLStore } from '@/store/localMLStore';
import { message } from 'antd';

interface EvaluationImage {
  image_type: string;
  image_data: string; // Base64 encoded image
}

export function useModelEvaluate() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [evaluationStage, setEvaluationStage] = useState('');
  const [evaluationMessage, setEvaluationMessage] = useState('');
  const [evaluationMetrics, setEvaluationMetrics] = useState<any>(null);
  const [evaluationImages, setEvaluationImages] = useState<EvaluationImage[]>([]);
  
  const { 
    updateTaskStatus, 
    updateTaskProgress,
    updateTaskEvaluationMetrics
  } = useLocalMLStore();

  // 开始评估
  const startEvaluation = async (requestId: string) => {
    setIsEvaluating(true);
    setEvaluationProgress(0);
    setEvaluationStage('准备评估');
    setEvaluationMessage('');
    
    const messageKey = `evaluate-${Date.now()}`;
    
    try {
      message.loading({ content: '正在开始模型评估...', key: messageKey });
      
      // 这里可以添加开始评估的API调用，如果有的话
      // 目前假设评估是训练过程的一部分，不需要单独启动
      
      // 开始轮询评估进度
      pollEvaluationProgress(requestId);
      
      message.success({ content: '评估任务已开始', key: messageKey });
      return { success: true };
    } catch (error) {
      console.error('Start evaluation error:', error);
      setIsEvaluating(false);
      message.error({ content: '开始评估任务失败', key: messageKey });
      return { success: false };
    }
  };

  // 轮询评估进度
  const pollEvaluationProgress = async (requestId: string) => {
    let intervalId: NodeJS.Timeout | null = null;
    
    const checkProgress = async () => {
      try {
        const response = await localMLApi.getModelProgress(requestId);
        
        if (response.code === 200 && response.data) {
          const progress = response.data.progress || 0;
          const stage = response.data.stage || '';
          const currentMessage = response.data.message || '';
          
          // 更新状态
          setEvaluationProgress(progress);
          setEvaluationStage(stage);
          setEvaluationMessage(currentMessage);
          
          // 如果评估完成
          if (progress >= 100 && stage.includes('Evaluation')) {
            setIsEvaluating(false);
            
            // 获取评估结果
            getEvaluationResult(requestId);
            
            if (intervalId) clearInterval(intervalId);
            message.success('模型评估完成');
          }
          
          // 如果有错误
          if (response.data.error) {
            setIsEvaluating(false);
            if (intervalId) clearInterval(intervalId);
            message.error(response.data.error);
          }
        }
      } catch (error) {
        console.error('Error checking evaluation progress:', error);
      }
    };
    
    // 每秒检查一次进度
    intervalId = setInterval(checkProgress, 1000);
    
    // 设置超时，防止无限轮询
    setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
      if (isEvaluating) {
        setIsEvaluating(false);
        message.warning('评估任务超时，请检查服务器状态');
      }
    }, 300000); // 5分钟超时
  };

  // 获取评估结果
  const getEvaluationResult = async (requestId: string) => {
    try {
      const response = await localMLApi.getModelTrainRecordByRequestId(requestId);
      
      if (response.code === 200 && response.data) {
        // 更新评估指标
        if (response.data.model_info && response.data.model_info.evaluation_results) {
          setEvaluationMetrics(response.data.model_info.evaluation_results);
          
          // 更新store中的评估指标
          const fileHash = response.data.source_file_hash;
          if (fileHash) {
            updateTaskEvaluationMetrics(fileHash, response.data.model_info.evaluation_results);
          }
        }
        
        // 获取评估图像
        await getEvaluationImages(requestId);
      }
    } catch (error) {
      console.error('Error getting evaluation result:', error);
    }
  };

  // 获取评估图像
  const getEvaluationImages = async (requestId: string) => {
    try {
      const response = await localMLApi.getModelEvaluateImage(requestId);
      
      if (response.code === 200 && response.data && response.data.images) {
        setEvaluationImages(response.data.images);
        return response.data.images;
      } else {
        setEvaluationImages([]);
        return [];
      }
    } catch (error) {
      console.error('Error getting evaluation images:', error);
      setEvaluationImages([]);
      return [];
    }
  };

  // 刷新评估数据
  const refreshEvaluationData = async (requestId: string) => {
    try {
      await getEvaluationResult(requestId);
      return true;
    } catch (error) {
      console.error('Error refreshing evaluation data:', error);
      return false;
    }
  };

  return {
    isEvaluating,
    evaluationProgress,
    evaluationStage,
    evaluationMessage,
    evaluationMetrics,
    evaluationImages,
    startEvaluation,
    getEvaluationImages,
    refreshEvaluationData
  };
}
