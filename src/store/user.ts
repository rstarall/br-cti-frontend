import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CtiData } from './ctiStore'

export interface UserInfo {
  walletId: string
  userName: string
  tokenNumber: number
  transactions: Transaction[]
  extraInfo: ExtraInfo
  ownerCtiList: CtiData[]
}

export interface ExtraInfo {
  cryptoKey: string
}

export interface Transaction {
  transactionId: string
  transactionUserId: string //walletId
  transactionType: string
  transactionFrom: string //walletId
  transactionTo: string //walletId
  transactionToken: number
  timestamp: string
  refInfoId: string
}

export enum TransactionTypeEnum {
  OUTCOME = 'out',
  INCOME = 'in'
}

export enum StakeStatusEnum {
  UNSTAKED = 0,  // 未抵押
  STAKING = 1,   // 抵押中
  RETURNED = 2,   // 已返回
  DEDUCTED = 3   // 已扣除
}

export const stakeStatusNameMap = {
  [StakeStatusEnum.UNSTAKED]: '未抵押',
  [StakeStatusEnum.STAKING]: '抵押中',
  [StakeStatusEnum.RETURNED]: '已返回',
  [StakeStatusEnum.DEDUCTED]: '已扣除'
}

export interface UserEvaluateStake {
  ctiId: string
  walletId: string
  evaluateQuality: number
  avgEvaluateQuality: number
  stake: number
  stakeStatus: StakeStatusEnum
}

interface UserState {
  userInfo: UserInfo
  userInfoDic: Record<string, UserInfo>
  setUserInfo: (info: UserInfo) => void
  updateUserInfoDic: (walletId: string, info: UserInfo) => void
  addTransaction: (walletId: string, transaction: Transaction) => void
  clearUserInfo: () => void
  initializeUserInfo: () => void
}




export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: {
        walletId: '',
        userName: '',
        tokenNumber: 0,
        transactions: [],
        extraInfo: {
          cryptoKey: ''
        }
      },
      userInfoDic: {},
      setUserInfo: (info) => {
        set({ userInfo: info })
      },
      updateUserInfoDic: (walletId: string, info: UserInfo) => {
        set((state) => ({ userInfoDic: { ...state.userInfoDic, [walletId]: info } }))
      },
      addTransaction: (walletId: string, transaction: Transaction) => {
        set((state) => {
          if(!walletId){
            console.error('userWalletId not found')
            return state;
          }
          const txUserInfo = state.userInfoDic[walletId];
          if(!txUserInfo){
            console.error('userInfo not found')
            return state;
          }
          let newTokenNumber = txUserInfo.tokenNumber;
          if(transaction.transactionType === TransactionTypeEnum.INCOME){
            newTokenNumber += transaction.transactionToken;
          }else{
            newTokenNumber -= transaction.transactionToken;
          }
          const newTransactions = [transaction,...txUserInfo.transactions];
          if(!txUserInfo){
            console.error('userInfo not found')
            return state;
          }
          return {
            userInfoDic: {
              ...state.userInfoDic,
              [walletId]: {
                ...txUserInfo,
                tokenNumber: parseFloat(newTokenNumber.toFixed(2)),
                transactions: newTransactions
              }
            }
          };
        });
        // 更新当前用户信息
        set((state) => {
          const currentUserInfo = state.userInfo;
          if(!currentUserInfo){
            console.error('userInfo not found')
            return state;
          }
          if(walletId !== currentUserInfo.walletId){
            return state;
          }
          let newTokenNumber = currentUserInfo.tokenNumber;
          if(transaction.transactionType === TransactionTypeEnum.INCOME){
            newTokenNumber += transaction.transactionToken;
          }else{
            newTokenNumber -= transaction.transactionToken;
          }
          currentUserInfo.tokenNumber = parseFloat(newTokenNumber.toFixed(2));
          currentUserInfo.transactions = [transaction,...currentUserInfo.transactions];
          return {
            userInfo: currentUserInfo,
          }
        })
      },
      clearUserInfo: () => {
        set({ userInfo: undefined })
      },
      initializeUserInfo: () => {
        set((state) => {
          if(state.userInfo.walletId !== ''){
            return state;
          }
          const userInfo = {
            userName: 'user1',
            tokenNumber: 100,
            walletId: '0xacb123abc01',
            transactions: [],
            extraInfo: {
              cryptoKey: 'ACBF256789012345'
            }
          }
          const platformUserInfo = {
            userName: 'platform',
            tokenNumber: 1000,
            walletId: 'platform',
            transactions: [],
            extraInfo: {
              cryptoKey: 'ACBF2567890FC2345'
            }
          }
          return {
            userInfo: userInfo,
            userInfoDic: { ...state.userInfoDic,
              [userInfo.walletId]: userInfo,
              [platformUserInfo.walletId]: platformUserInfo
            } 
          }
        })
      },
    }),
    {
      name: 'user-store',
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
)
