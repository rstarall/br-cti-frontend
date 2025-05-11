import { create } from 'zustand';

export enum TransactionTypeEnum {
  INCOME = 'in',
  OUTCOME = 'out'
}

export interface Transaction {
  transactionId: string;
  transactionType: TransactionTypeEnum;
  transactionToken: number;
  transactionFrom: string;
  transactionTo: string;
  refInfoId: string;
  timestamp: number;
  status: string;
}

export interface UserExtraInfo {
  publicKey: string;
  privateKey: string;
  searchKey: string;
  cryptoKey?: string;
  iv?: string;
}

export interface UserInfo {
  walletId: string;
  userName: string;
  tokenNumber: number;
  transactions: Transaction[];
  ownerCtiList: string[];
  extraInfo?: UserExtraInfo;
}

interface UserState {
  userInfo: UserInfo;
  userInfoDic: Record<string, UserInfo>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUserInfo: (userInfo: UserInfo) => void;
  updateUserInfoDic: (walletId: string, userInfo: UserInfo) => void;
  initializeUserInfo: () => void;
}

// 默认用户信息
const defaultUserInfo: UserInfo = {
  walletId: '',
  userName: '',
  tokenNumber: 0,
  transactions: [],
  ownerCtiList: []
};

export const useUserStore = create<UserState>((set, get) => ({
  userInfo: defaultUserInfo,
  userInfoDic: {},
  isLoading: false,
  error: null,

  setUserInfo: (userInfo) => {
    set({ userInfo });
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentWalletId', userInfo.walletId);
    }
  },

  updateUserInfoDic: (walletId, userInfo) => {
    const { userInfoDic } = get();
    set({ 
      userInfoDic: { 
        ...userInfoDic, 
        [walletId]: userInfo 
      } 
    });
    
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfoDic', JSON.stringify({
        ...userInfoDic,
        [walletId]: userInfo
      }));
    }
  },

  initializeUserInfo: () => {
    if (typeof window !== 'undefined') {
      // 从 localStorage 加载用户信息
      const userInfoDicStr = localStorage.getItem('userInfoDic');
      const currentWalletId = localStorage.getItem('currentWalletId');
      
      let userInfoDic:any = {};
      let userInfo = defaultUserInfo;
      
      if (userInfoDicStr) {
        try {
          userInfoDic = JSON.parse(userInfoDicStr);
        } catch (e) {
          console.error('Failed to parse userInfoDic from localStorage', e);
        }
      }
      
      if (currentWalletId && userInfoDic[currentWalletId]) {
        userInfo = userInfoDic[currentWalletId];
      }
      
      set({ userInfoDic, userInfo });
    }
  }
}));
