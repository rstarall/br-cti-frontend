import { UserEvaluateStake } from './user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StakeStatusEnum } from './user'

//CTI类型
export enum CtiTypeEnum {
  IP = 1,
  DOMAIN = 2,
  URL = 3,
  HASH = 4,
  PHISHING = 5,
  OTHERS = 0
}

//CTI激励机制
export enum CtiIncentiveEnum {
  // INTEGRAL = 1,
  // THREE_PARTY = 2,
  EVOLUTION = 3
}

export const ctiKeyNameMap = {
  'id': 'ID',
  'ctiId': 'CTI ID',
  'ctiType': 'CTI类型',
  'walletId': '用户ID',
  'ctiTrafficType': 'CTI流量类型',
  'tags': '标签',
  'ctiHash': 'CTI哈希',
  'createdTime': '创建时间',
  'incentiveMechanism': '激励机制',
  'value': '积分',
  'reward': '奖励',
  'stake': '押金',
  'stakeStatus': '押金状态',
  'evaluateStatus': '评估状态',
  'evaluateQuality': '评估质量',
  'avgEvaluateQuality': '平均评估质量',
  'requesterEvaluateList': '评估列表',
}

export interface CtiData {
    id: string
    ctiId: string
    ctiType: number
    walletId: string
    ctiTrafficType?: number
    tags: string
    ctiHash: string
    createdTime: string
    incentiveMechanism: number
    value: number
    reward: number|0
    stake: number|0
    stakeStatus: StakeStatusEnum|StakeStatusEnum.UNSTAKED //是否扣除押金
    evaluateStatus: boolean|false //是否评估
    evaluateQuality?: number|0 //评估质量
    avgEvaluateQuality?: number|0 //平均评估质量
    requesterEvaluateList?: UserEvaluateStake[]|[] //评估列表
}

interface CtiState {
  ctiItems: CtiData[]
  createCti: (walletId: string) => Promise<void>
  updateCtiItem: (ctiId: string, updateCti: CtiData) => void
  addCti: (cti: CtiData) => void
  removeCti: (ctiId: string) => void
  clearCti: () => void
  initializeCti: () => Promise<void>
}

export const useCtiStore = create<CtiState>()(
  persist(
    (set) => ({
      ctiItems: [],
      createCti: async (walletId: string) => {
        const res = await mockCreateCTI(walletId);
        set((state) => ({ ctiItems: [...state.ctiItems, res.cti_info] }));
      },
      updateCtiItem: (ctiId: string, updateCti: CtiData) => set((state) => ({
        ctiItems: state.ctiItems.map(item => item.ctiId === ctiId ? updateCti : item)
      })),
      addCti: (cti) => 
        set((state) => {
          const exists = state.ctiItems.some(item => item.ctiId === cti.ctiId)
          if (!exists) {
            return { ctiItems: [...state.ctiItems, cti] }
          }
          return state
        }),
      removeCti: (ctiId) =>
        set((state) => ({
          ctiItems: state.ctiItems.filter((item) => item.ctiId !== ctiId)
        })),
      clearCti: () => set({ ctiItems: [] }),
      initializeCti: async () => {
        const storedItems = localStorage.getItem('cti-store');
        if (!storedItems || JSON.parse(storedItems).ctiItems.length === 0) {
          const res = await mockFetchUserCTI();
          set({ ctiItems: res.cti_infos });
        }
      }
    }),
    {
      name: 'cti-store',
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
const CTI_TAG_MAP = {
  1: "IP",
  2: "domain",
  3: "URL",
  4: "hash",
  5: "phishing",
  0: "others"
} as { [key: number]: string }


const mockCreateCTI = async (walletId: string): Promise<{ cti_info: CtiData }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const value = Math.floor(Math.random() * 100);
      const ctiInfo: CtiData = {
        id: Date.now().toString(),
        ctiId: `20250325${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        ctiType: Math.floor(Math.random() * 6),
        walletId,
        tags: CTI_TAG_MAP[Math.floor(Math.random() * 6)],
        ctiHash: 'hash' + Math.random().toString(36).substring(2, 15),
        createdTime: new Date().toISOString(),
        incentiveMechanism: CtiIncentiveEnum.EVOLUTION,
        value,
        reward:0,
        stake:0,
        stakeStatus: StakeStatusEnum.UNSTAKED,
        evaluateStatus: false,
        evaluateQuality: 0,
        avgEvaluateQuality: 0,
        requesterEvaluateList: []
      }

      resolve({ cti_info: ctiInfo });
    }, 500);
  });
}
// 模拟获取用户提供的情报数据
const mockFetchUserCTI = async (): Promise<{ cti_infos: CtiData[] }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const ctiInfos: CtiData[] = [];
      const users = Array.from({length: 10}, (_, i) => `test${i + 1}`);

      for (let i = 0; i < 50; i++) {
        const walletId = users[i % 10];
        const ctiType = i % 6; // 根据CTI_TYPE_MAP的key数量
        const evaluateQualityList = Array.from({length: 3}, () => Math.floor(Math.random() * 101));
        const avgEvaluateQuality = parseFloat((evaluateQualityList.reduce((acc, curr) => acc + curr, 0) / evaluateQualityList.length).toFixed(2));
        const evalUserList = Array.from([0,1,2], (index: number) => users[(i + index) % 50]);
        const value = Math.floor(Math.random() * 100);
        const reward = Math.floor(value * 0.8);
        const stake = Math.floor(value * 0.2);
        ctiInfos.push({
          id: (i + 1).toString(),
          ctiId: `20250325${String(i + 1).padStart(6, '0')}`,
          ctiType,
          walletId,
          tags: CTI_TAG_MAP[i % 6], // 使用CTI_TAG_MAP
          ctiHash: 'hash' + Math.random().toString(36).substring(2, 15),
          createdTime: new Date().toISOString(),
          incentiveMechanism: CtiIncentiveEnum.EVOLUTION, // 只使用EVOLUTION
          value,
          reward: i % 2 !== 0 ? reward : 0,
          stake: i % 2 !== 0 ? stake : 0,
          stakeStatus: StakeStatusEnum.UNSTAKED,
          evaluateStatus: i % 2 !== 0, // 每2个中有1个未评估
          evaluateQuality: i % 2 !== 0 ? evaluateQualityList[0]: 0,
          avgEvaluateQuality: avgEvaluateQuality,
          requesterEvaluateList: Array.from([0,1,2]).map((index: number) => ({
            ctiId: `20250325${String(i + 1).padStart(6, '0')}`,
            walletId: evalUserList[index],
            evaluateQuality: evaluateQualityList[index],
            avgEvaluateQuality: avgEvaluateQuality,
            stake: i % 2 !== 0 ? parseFloat((0.1 * evaluateQualityList[index]).toFixed(2)) : 0,
            stakeStatus: i % 2 !== 0 ?
            (Math.abs(evaluateQualityList[index] - avgEvaluateQuality) > 0.3 * avgEvaluateQuality ? 
            StakeStatusEnum.DEDUCTED : StakeStatusEnum.RETURNED) : StakeStatusEnum.UNSTAKED
          }))
        });
      }

      resolve({ cti_infos: ctiInfos });
    }, 500);
  });
};