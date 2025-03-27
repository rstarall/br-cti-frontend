import { create } from 'zustand'

export interface UserInfo {
  userId: string
  username: string
  tokenNumber: number
}
export interface UserEvaluateStake {
  ctiId: string
  userId: string
  evaluateQuality: number
  avgEvaluateQuality: number
  deductStake: boolean
}


interface UserState {
  userInfo: UserInfo | null
  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
  initializeUserInfo: () => void
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
  setUserInfo: (info) => {
    localStorage.setItem('userInfo', JSON.stringify(info))
    set({ userInfo: info })
  },
  clearUserInfo: () => {
    localStorage.removeItem('userInfo')
    set({ userInfo: null })
  },
  initializeUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      set({ userInfo: JSON.parse(userInfo) })
    }else{
      //测试用户
      set({ userInfo: {
        userId: 'user1',
        username: '用户1',
        tokenNumber: 1000
      } })
    }
  }
}))
