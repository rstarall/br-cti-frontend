import { useState } from 'react';
import { localMLApi } from '@/api/localML';
import { useLocalMLStore } from '@/store/localMLStore';
import { message } from 'antd';

export function useModelUpchain() {
  const [isUpchaining, setIsUpchaining] = useState(false);
  const [upchainProgress, setUpchainProgress] = useState(0);
  const { updateTaskStatus, updateTaskProgress } = useLocalMLStore();

  const getIPFSAddress = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/upchain/getIPFSAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data.ipfs_address;
      } else {
        message.error(data.error || '获取IPFS地址失败');
        return '';
      }
    } catch (error) {
      console.error('Error getting IPFS address:', error);
      message.error('获取IPFS地址失败');
      return '';
    }
  };

  const checkWalletPassword = async (walletId: string, password: string) => {
    try {
      const response = await localMLApi.checkWalletPassword(walletId, password);
      
      if (response.code === 200) {
        return response.data;
      } else {
        message.error(response.error || '检查钱包密码失败');
        return false;
      }
    } catch (error) {
      console.error('Error checking wallet password:', error);
      message.error('检查钱包密码失败');
      return false;
    }
  };

  const startUpchain = async (
    fileHash: string,
    modelHash: string,
    modelType: number,
    ipfsAddress: string,
    upchainAccount: string,
    upchainAccountPassword: string
  ) => {
    setIsUpchaining(true);
    setUpchainProgress(0);
    
    const messageKey = `upchain-${Date.now()}`;
    
    try {
      message.loading({ content: '正在上链...', key: messageKey });
      
      const response = await localMLApi.uploadModelToBlockchainByModelHashDirect(
        fileHash,
        modelHash,
        upchainAccount,
        upchainAccountPassword
      );
      
      if (response.code === 200 && response.data) {
        // 开始轮询上链进度
        pollUpchainProgress(fileHash);
        
        message.success({ content: '上链任务已创建', key: messageKey });
        return { success: true };
      } else {
        setIsUpchaining(false);
        message.error({ content: response.error || '上链失败', key: messageKey });
        return { success: false };
      }
    } catch (error) {
      console.error('Start upchain error:', error);
      setIsUpchaining(false);
      message.error({ content: '上链失败', key: messageKey });
      return { success: false };
    }
  };

  const pollUpchainProgress = async (fileHash: string) => {
    let intervalId: NodeJS.Timeout | null = null;
    
    const checkProgress = async () => {
      try {
        const response = await localMLApi.getModelUpchainProgress(fileHash);
        
        if (response.code === 200 && response.data) {
          const progress = response.data.progress || 0;
          
          // 更新状态
          setUpchainProgress(progress);
          
          // 更新任务进度
          updateTaskProgress(fileHash, 'upchain', progress);
          
          // 如果上链完成
          if (progress >= 100) {
            updateTaskStatus(fileHash, 'upchain', true);
            setIsUpchaining(false);
            
            if (intervalId) clearInterval(intervalId);
            message.success('模型上链完成');
          }
        }
      } catch (error) {
        console.error('Error checking upchain progress:', error);
      }
    };
    
    // 每秒检查一次进度
    intervalId = setInterval(checkProgress, 1000);
    
    // 设置超时，防止无限轮询
    setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
      if (isUpchaining) {
        setIsUpchaining(false);
        message.warning('上链任务超时，请检查服务器状态');
      }
    }, 600000); // 10分钟超时
  };

  return {
    isUpchaining,
    upchainProgress,
    getIPFSAddress,
    checkWalletPassword,
    startUpchain
  };
}
