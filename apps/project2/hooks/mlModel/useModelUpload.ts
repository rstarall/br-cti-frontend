import { useState } from 'react';
import { localMLApi } from '@/api/localML';
import { useLocalMLStore } from '@/store/localMLStore';
import { message } from 'antd';

export function useModelUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { addTask, updateTaskStatus, updateTaskProgress } = useLocalMLStore();

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const messageKey = `upload-${Date.now()}`;

    try {
      message.loading({ content: '正在上传文件...', key: messageKey });

      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', file);

      // 生成临时文件ID
      const fileId = Date.now().toString();
      formData.append('file_id', fileId);

      // 上传文件
      const response = await localMLApi.uploadDatasetFile(formData);

      if (response.code === 200 && response.data && response.data.file_hash) {
        // 创建任务对象（确保有有效的文件哈希）
        const task = {
          file_id: fileId,
          file_hash: response.data.file_hash,
          file_name: file.name,
          file_size: file.size || response.data.file_size,
          status: {
            upload: true, // 已上传成功
            train: false,
            evaluate: false,
            info: false,
            upchain: false
          },
          progress: {
            upload: 100, // 上传已完成
            train: 0,
            evaluate: 0,
            info: 0,
            upchain: 0
          }
        };

        // 添加任务
        addTask(task);

        message.success({ content: '文件上传成功', key: messageKey });

        return {
          success: true,
          fileHash: response.data.file_hash,
          fileSize: response.data.file_size
        };
      } else {
        message.error({ content: response.error || '文件上传失败', key: messageKey });
        return { success: false };
      }
    } catch (error) {
      console.error('File upload error:', error);
      message.error({ content: '文件上传失败', key: messageKey });
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  const downloadDatasetFromIPFS = async (dataSourceHash: string, ipfsHash: string) => {
    const messageKey = `download-${Date.now()}`;

    try {
      message.loading({ content: '正在从IPFS下载数据集...', key: messageKey });

      const response = await localMLApi.downloadDatasetFromIPFS(dataSourceHash, ipfsHash);

      if (response.code === 200 && response.data) {
        // 创建任务对象
        const fileId = Date.now().toString();
        const task = {
          file_id: fileId,
          file_hash: dataSourceHash,
          file_name: response.data.file_path || 'Unknown',
          file_size: response.data.file_size || 0,
          status: {
            upload: false,
            train: false,
            evaluate: false,
            info: false,
            upchain: false
          },
          progress: {
            upload: 0,
            train: 0,
            evaluate: 0,
            info: 0,
            upchain: 0
          }
        };

        // 添加任务
        addTask(task);

        // 开始轮询下载进度
        pollDownloadProgress(dataSourceHash);

        message.success({ content: '开始下载数据集', key: messageKey });
        return { success: true, fileId };
      } else {
        const errorMessage = response.message || '下载数据集失败';
        message.error({ content: errorMessage, key: messageKey });
        return { success: false };
      }
    } catch (error) {
      console.error('Download dataset error:', error);
      message.error({ content: '下载数据集失败', key: messageKey });
      return { success: false };
    }
  };

  const pollDownloadProgress = async (fileHash: string) => {
    let intervalId: NodeJS.Timeout | null = null;

    const checkProgress = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/ml/get_download_progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data_source_hash: fileHash })
        });

        const data = await response.json();

        if (data.code === 200 && data.data) {
          const progress = data.data.progress || 0;

          // 更新进度
          updateTaskProgress(fileHash, 'upload', progress);

          // 如果下载完成
          if (progress >= 100) {
            updateTaskStatus(fileHash, 'upload', true);
            if (intervalId) clearInterval(intervalId);
            message.success('数据集下载完成');
          }
        }
      } catch (error) {
        console.error('Error checking download progress:', error);
      }
    };

    // 每秒检查一次进度
    intervalId = setInterval(checkProgress, 1000);

    // 设置超时，防止无限轮询
    setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
    }, 300000); // 5分钟超时
  };

  return {
    isUploading,
    uploadFile,
    downloadDatasetFromIPFS
  };
}
