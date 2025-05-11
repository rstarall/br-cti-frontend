import api from './api';
import { NetworkConfig, BlockInfo, BlockchainStats, BlockResponse } from './types/network';

/**
 * Network API functions
 */
export const networkApi = {
  /**
   * Get blockchain network configuration
   * @returns Promise with network configuration
   */
  getBlockchainNetworkConfig: async (): Promise<NetworkConfig> => {
    const response = await api.get('/blockchain/query-network-info');
    return response.data.data || response.data;
  },

  /**
   * Query block information by height
   * @param blockHeight Block height
   * @returns Promise with block information
   */
  queryBlockInfoByHeight: async (blockHeight: number): Promise<BlockInfo> => {
    const response = await api.get<BlockResponse>(`/blockchain/queryBlock/${blockHeight}`);
    if (response.data.data) {
      return JSON.parse(response.data.data);
    }
    throw new Error('Failed to query block data');
  },

  /**
   * Get blockchain statistics
   * @returns Promise with blockchain statistics
   */
  getBlockchainStats: async (): Promise<BlockchainStats> => {
    const response = await api.get('/blockchain/getBlockchainStats');
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to get blockchain statistics');
  },

  /**
   * Check network connection status
   * @param url URL to check
   * @returns Promise with connection status
   */
  checkNetworkStatus: async (url: string): Promise<boolean> => {
    try {
      const response = await api.head(url, { timeout: 5000 });
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get latest blocks
   * @param count Number of blocks to retrieve
   * @returns Promise with latest blocks
   */
  getLatestBlocks: async (count: number = 10): Promise<BlockInfo[]> => {
    const response = await api.get(`/blockchain/getLatestBlocks?count=${count}`);
    if (response.data.data) {
      return JSON.parse(response.data.data);
    }
    throw new Error('Failed to get latest blocks');
  },

  /**
   * Get latest transactions
   * @param count Number of transactions to retrieve
   * @returns Promise with latest transactions
   */
  getLatestTransactions: async (count: number = 10): Promise<any[]> => {
    const response = await api.get(`/blockchain/getLatestTransactions?count=${count}`);
    if (response.data.data) {
      return JSON.parse(response.data.data);
    }
    throw new Error('Failed to get latest transactions');
  }
};
