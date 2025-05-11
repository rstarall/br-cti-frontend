import { create } from 'zustand';
import { walletApi } from '@/api/wallet';
import { userApi } from '@/api/user';

// Import the TransactionRecord type from wallet.ts
import { UserInfo as ApiUserInfo, TransactionRecord } from '@/api/types/wallet';
import { UserDetailInfo } from '@/api/types/user';

// Create a combined interface for user detail info and user point info
interface CombinedUserDetailInfo extends UserDetailInfo {
  user_level?: number;
  user_cti_map?: Record<string, number>;
  cti_buy_map?: Record<string, number>;
  cti_sale_map?: Record<string, number>;
  user_model_map?: Record<string, number>;
  model_buy_map?: Record<string, number>;
  model_sale_map?: Record<string, number>;
}

// Local Transaction interface that maps to the API's TransactionRecord
interface Transaction {
  transaction_id: string;
  transaction_type: string;
  points: number;
  other_party: string;
  info_id: string;
  timestamp: string;
  status: string;
  doctype?: string;
}

// Extended user info that includes both basic info and point info
interface ExtendedUserInfo extends ApiUserInfo {
  user_level?: number;
  user_cti_map?: Record<string, number>;
  cti_buy_map?: Record<string, number>;
  cti_sale_map?: Record<string, number>;
  user_model_map?: Record<string, number>;
  model_buy_map?: Record<string, number>;
  model_sale_map?: Record<string, number>;
}

interface WalletState {
  walletId: string | null;
  walletList: string[];
  userInfo: ExtendedUserInfo | null;
  transactions: Transaction[];
  weeklyPoints: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  setWalletId: (id: string) => void;
  loadWalletId: () => string | null; // 新增方法，只在需要时加载 walletId
  fetchWalletList: () => Promise<void>;
  fetchUserDetailInfo: () => Promise<void>; // 获取用户详细信息(包括用户信息和交易列表)
  checkWalletOnchain: (walletId: string) => Promise<boolean>;
  calculateWeeklyPoints: (transactions: Transaction[]) => number;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  walletId: typeof window !== 'undefined' ? localStorage.getItem('userWalletId') || null : null, // 检查是否在浏览器环境
  walletList: [],
  userInfo: null,
  transactions: [],
  weeklyPoints: 0,
  isLoading: false,
  error: null,

  setWalletId: (id) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userWalletId', id);
    }
    set({ walletId: id });
  },

  loadWalletId: () => {
    if (typeof window !== 'undefined') {
      const walletId = localStorage.getItem('userWalletId');
      if (walletId) {
        set({ walletId });
        return walletId;
      }
    }
    return null;
  },

  fetchWalletList: async () => {
    try {
      set({ error: null });
      const walletIds = await walletApi.getLocalWalletList();
      set({ walletList: walletIds});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch wallet list'
      });
    }
  },
  fetchUserDetailInfo: async () => {
    const { walletId, calculateWeeklyPoints } = get();
    if (!walletId) {
      set({ error: 'No wallet ID available' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Get user detail info from API
      const userDetailInfo = await userApi.getUserDetailInfo(walletId) as CombinedUserDetailInfo;
      console.log('Fetched user detail info:', userDetailInfo);

      console.log("userDetailInfo",userDetailInfo)
      // Create extended user info by combining basic user info with point info
      const extendedUserInfo: ExtendedUserInfo = {
        user_id: userDetailInfo.user_id,
        user_name: userDetailInfo.user_name,
        public_key: userDetailInfo.public_key,
        public_key_type: userDetailInfo.public_key_type,
        value: userDetailInfo.user_value,
        create_time: userDetailInfo.create_time,
        // Optional fields from UserPointInfo
        user_level: userDetailInfo.user_level,
        user_cti_map: userDetailInfo.user_cti_map,
        cti_buy_map: userDetailInfo.cti_buy_map,
        cti_sale_map: userDetailInfo.cti_sale_map,
        user_model_map: userDetailInfo.user_model_map,
        model_buy_map: userDetailInfo.model_buy_map,
        model_sale_map: userDetailInfo.model_sale_map
      };
      // Update state with new data
      set({
        userInfo: extendedUserInfo
      });

      // Get transaction records from API
      try {
        const apiTransactions = await walletApi.getUserTransactionRecords(walletId);
        console.log('Fetched transactions:', apiTransactions);

        // Check if apiTransactions is an array
        if (Array.isArray(apiTransactions)) {
          // Map API TransactionRecord to local Transaction format
          const transactions: Transaction[] = apiTransactions.map(record => ({
            transaction_id: record.transaction_id,
            transaction_type: record.transaction_type,
            points: record.points,
            other_party: record.other_party,
            info_id: record.info_id,
            timestamp: record.timestamp,
            status: record.status,
            doctype: record.doctype
          }));

          // Calculate weekly points
          const weeklyPoints = calculateWeeklyPoints(transactions);

          // Update state with new data
          set({
            userInfo: extendedUserInfo,
            transactions,
            weeklyPoints,
            isLoading: false
          });
        } else {
          console.error('API did not return an array of transactions:', apiTransactions);
          // Set empty transactions array if API response is not an array
          set({
            userInfo: extendedUserInfo,
            transactions: [],
            weeklyPoints: 0,
            isLoading: false
          });
        }
      } catch (transactionError) {
        console.error('Failed to fetch transaction records:', transactionError);
        // Continue with user info but empty transactions
        set({
          userInfo: extendedUserInfo,
          transactions: [],
          weeklyPoints: 0,
          isLoading: false
        });
      }


    } catch (error) {
      console.log('Failed to fetch user detail info:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user detail info',
        isLoading: false
      });
    }
  },

  checkWalletOnchain: async (walletId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await walletApi.checkLocalWalletOnchainStatus(walletId);
      const isOnchain = response.data?.onchain === true;
      set({ isLoading: false });
      return isOnchain;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to check wallet status',
        isLoading: false
      });
      return false;
    }
  },

  calculateWeeklyPoints: (transactions) => {
    let weeklyPoints = 0;
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];

    transactions.forEach(transaction => {
      // Handle different date formats
      const transactionDate = transaction.timestamp.includes('T')
        ? transaction.timestamp.split('T')[0]
        : transaction.timestamp.split(' ')[0];

      if (transactionDate === currentDateStr) {
        weeklyPoints += transaction.points;
      }
    });

    return weeklyPoints;
  },

  reset: () => {
    set({
      walletId: null,
      userInfo: null,
      transactions: [],
      weeklyPoints: 0,
      error: null
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userWalletId');
    }
  }
}));
