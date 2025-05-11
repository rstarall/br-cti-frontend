import api from './api';
import { IPFSFileUrlResponse } from './types/ipfs';

/**
 * IPFS API 函数
 */
export const ipfsApi = {
  /**
   * 通过哈希获取 IPFS 文件 URL
   * @param hash IPFS 哈希
   * @returns 返回包含 IPFS 文件 URL 的 Promise
   */
  getIPFSFileUrl: async (hash?: string): Promise<string> => {
    try {
      console.log('获取IPFS文件URL:', hash);

      // 验证参数
      if (!hash) {
        throw new Error('IPFS哈希不能为空');
      }

      const response = await api.post<IPFSFileUrlResponse>('/ipfs/getIPFSFileUrl', {
        hash
      });

      console.log('IPFS URL响应状态:', response.status);

      if (response.data && response.data.url) {
        console.log('获取IPFS URL成功:', response.data.url);
        return response.data.url;
      } else {
        console.error('无效的IPFS URL响应:', response.data);
        throw new Error('服务器返回的IPFS URL格式不正确');
      }
    } catch (error) {
      console.error('获取IPFS URL失败:', error);

      // 提供更具体的错误信息
      if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          throw new Error('网络连接错误，请检查您的网络连接和服务器状态');
        }
        throw error;
      }

      throw new Error('获取 IPFS 文件 URL 失败');
    }
  },

  /**
   * 通过哈希获取 IPFS 文件内容
   * @param hash IPFS 哈希
   * @returns 返回包含 IPFS 文件 URL 和内容的 Promise
   */
  getIPFSContent: async (hash: string): Promise<{ url: string; content: string }> => {
    try {
      console.log('获取IPFS内容:', hash);

      // 验证参数
      if (!hash) {
        throw new Error('IPFS哈希不能为空');
      }

      const response = await api.post<{ url: string; content: string }>('/ipfs/getIPFSContent', {
        hash
      });

      console.log('IPFS内容响应状态:', response.status);

      if (response.data && response.data.content) {
        // 记录内容长度而不是整个内容（可能很大）
        console.log('获取IPFS内容成功, 内容长度:', response.data.content.length);
        return response.data;
      } else {
        console.error('无效的IPFS内容响应:', response.data);
        throw new Error('服务器返回的IPFS内容格式不正确');
      }
    } catch (error) {
      console.error('获取IPFS内容失败:', error);

      // 提供更具体的错误信息
      if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          throw new Error('网络连接错误，请检查您的网络连接和服务器状态');
        }
        throw error;
      }

      throw new Error('获取 IPFS 文件内容失败');
    }
  },

  /**
   * 后端下载 IPFS 文件到指定路径
   * @param hash IPFS 哈希
   * @param savePath 保存路径
   * @returns 返回包含文件路径的 Promise
   */
  downloadFileToPath: async (hash: string, savePath: string): Promise<{ file_path: string; message: string }> => {
    try {
      console.log('下载IPFS文件到指定路径:', { hash, savePath });

      // 确保参数有效
      if (!hash) {
        throw new Error('IPFS哈希不能为空');
      }

      if (!savePath) {
        throw new Error('保存路径不能为空');
      }

      const response = await api.post<{ file_path: string; message: string }>('/ipfs/downloadIPFSFileToPath', {
        hash,
        save_path: savePath
      });

      console.log('下载响应:', response.data);

      if (response.data && response.data.file_path) {
        return response.data;
      } else {
        console.error('无效的响应数据:', response.data);
        throw new Error('服务器返回的数据格式不正确');
      }
    } catch (error) {
      console.error('IPFS下载错误:', error);

      // 如果是网络错误，提供更具体的错误信息
      if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          throw new Error('网络连接错误，请检查您的网络连接和服务器状态');
        }
        throw error;
      }

      throw new Error('下载IPFS文件到指定路径失败');
    }
  }
};
