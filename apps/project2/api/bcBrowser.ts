import api from './api';
import { ChainInfoResponse, ChainInfo, BlockInfoResponse, BlockInfo } from './types/bcBrowser';

/**
 * 区块链浏览器API函数
 */
export const bcBrowserApi = {
  /**
   * 查询区块链信息
   * @returns 包含链信息的Promise
   */
  queryChainInfo: async (): Promise<ChainInfo> => {
    try {
      const response = await api.get<ChainInfoResponse>('/blockchain/queryChain');

      if (response.data && response.data.code === 200 && response.data.data) {
        try {
          // 解析数据字段中的JSON字符串
          return JSON.parse(response.data.data);
        } catch (parseError) {
          console.error('解析链信息数据错误:', parseError);
          throw new Error('解析链信息数据失败');
        }
      }

      throw new Error('获取区块链信息失败');
    } catch (error) {
      console.error('queryChainInfo错误:', error);
      throw error;
    }
  },

  /**
   * 通过区块ID查询区块信息
   * @param blockId 区块ID
   * @returns 包含区块信息的Promise
   */
  queryBlockInfo: async (blockId: string): Promise<BlockInfo> => {
    try {
      // 确保blockId是有效的
      if (!blockId) {
        throw new Error('区块ID不能为空');
      }

      // 尝试转换为数字，但不强制要求是数字（可能是哈希）
      if (!isNaN(Number(blockId)) && Number(blockId) <= 0) {
        throw new Error(`无效的区块ID: ${blockId}`);
      }

      // 使用 try-catch 包装 API 调用
      try {
        const response = await api.get<BlockInfoResponse>(`/blockchain/queryBlock/${blockId}`);

        if (response.data && response.data.code === 200 && response.data.data) {
          try {
            // 解析数据字段中的JSON字符串
            console.log(`成功获取区块 ${blockId} 原始数据，开始解析...`);
            let parsedData = JSON.parse(response.data.data);

            // 检查解析后的数据结构
            // 支持两种可能的数据结构：
            // 1. {data: {header: {...}, data: [...]}}
            // 2. {data: {...}, header: {...}, metadata: {...}}
            if ((!parsedData.data || !parsedData.data.header) && !parsedData.header) {
              console.warn(`区块 ${blockId} 数据结构不完整:`, parsedData);
              console.log(`区块 ${blockId} 数据结构:`, JSON.stringify(parsedData, null, 2).substring(0, 500) + '...');
            } else {
              console.log(`区块 ${blockId} 数据解析成功，包含有效的header`);

              // 如果数据结构是第二种格式，转换为第一种格式以保持一致性
              if (parsedData.header && !parsedData.data?.header) {
                console.log(`转换区块 ${blockId} 数据结构为标准格式`);
                parsedData = {
                  data: {
                    header: parsedData.header,
                    data: parsedData.data ? [parsedData.data] : [],
                    metadata: parsedData.metadata
                  }
                };
              }
            }

            return parsedData;
          } catch (parseError) {
            console.error(`解析区块数据错误 ${blockId}:`, parseError);
            throw new Error(`解析区块数据失败: ${blockId}`);
          }
        } else {
          console.error(`获取区块信息失败，响应:`, response.data);
          throw new Error(`获取区块信息失败，区块ID: ${blockId}`);
        }
      } catch (apiError) {
        console.error(`API调用错误，区块ID ${blockId}:`, apiError);
        throw new Error(`获取区块信息失败，区块ID: ${blockId}`);
      }
    } catch (error) {
      console.error(`区块ID ${blockId} 的queryBlockInfo错误:`, error);
      throw error;
    }
  }
};
