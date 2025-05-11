import api from './api';
import {
  WalletListResponse,
  WalletStatusResponse,
  UserInfo,
  TransactionRecord,
  CreateWalletResponse,
  RegisterAccountResponse,
  UserStatisticsResponse
} from './types/wallet';

/**
 * Wallet API functions
 */
export const walletApi = {
  /**
   * Get list of local wallets
   * @returns Promise with wallet IDs
   */
  getLocalWalletList: async (): Promise<string[]> => {
    const response = await api.get<{ code: number; data: WalletListResponse; message: string }>('/user/getLocalUserAccountMulti');
    if (response.data.code === 200) {
      return response.data.data.wallet_ids;
    }
    throw new Error(response.data.message || 'Failed to get wallet list');
  },

  /**
   * Check if a local wallet is registered on the blockchain
   * @param walletId Wallet ID to check
   * @returns Promise with wallet status
   */
  checkLocalWalletOnchainStatus: async (walletId: string): Promise<WalletStatusResponse> => {
    const response = await api.post('/user/checkLocalWalletOnchainStatus', {
      wallet_id: walletId
    });
    return response.data;
  },

  /**
   * Get user information by user ID
   * @param userId User ID
   * @returns Promise with user information
   */
  getUserInfo: async (userId: string): Promise<UserInfo> => {
    const response = await api.post('/user/queryUserInfo', {
      user_id: userId
    });
    console.log("response.data:", JSON.parse(response.data.data));
    if (response.data.data) {
      return JSON.parse(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to get user info');
  },

  /**
   * Get user transaction records
   * @param userId User ID
   * @returns Promise with transaction records
   */
  getUserTransactionRecords: async (userId: string): Promise<TransactionRecord[]> => {
    try {
      const response = await api.post('/user/queryPointTransactions', {
        user_id: userId
      });
      console.log("queryPointTransactions:", response.data);

      // Check if response.data exists and is an array
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // If response.data exists but is not an array, it might be wrapped in a result property
      if (response.data && response.data.result) {
        const result = typeof response.data.result === 'string'
          ? JSON.parse(response.data.result)
          : response.data.result;

        if (Array.isArray(result)) {
          return result;
        }
      }

      // If we couldn't find an array, return an empty array
      console.warn('Transaction data is not in expected format:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching transaction records:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get transaction records');
    }
  },

  /**
   * Create a new local wallet
   * @param password Wallet password
   * @returns Promise with created wallet information
   */
  createLocalUserWallet: async (password: string): Promise<CreateWalletResponse> => {
    const response = await api.post('/user/createLocalUserWallet', {
      password
    });
    return response.data;
  },

  /**
   * Register a wallet on the blockchain
   * @param walletId Wallet ID
   * @param userName User name
   * @returns Promise with registration information
   */
  registerOnchainAccount: async (walletId: string, userName: string): Promise<RegisterAccountResponse> => {
    const response = await api.post('/user/registerOnchainUserAccount', {
      wallet_id: walletId,
      user_name: userName
    });
    return response.data;
  },

  /**
   * Get user statistics
   * @param userId User ID
   * @returns Promise with user statistics
   */
  getUserStatistics: async (userId: string): Promise<UserStatisticsResponse> => {
    const response = await api.post('/user/getUserStatistics', {
      user_id: userId
    });
    return response.data;
  }
};
