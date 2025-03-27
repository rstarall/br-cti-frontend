import Paragraph from 'antd/es/skeleton/Paragraph'
import { UserEvaluateStake } from './user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StakeStatusEnum } from './user'
export interface CtiData {
    id: string
    ctiId: string
    ctiType: number
    userId: string
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
  createCti: (userId: string) => Promise<void>
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
      createCti: async (userId: string) => {
        const res = await mockCreateCTI(userId);
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


const mockCreateCTI = async (userId: string): Promise<{ cti_info: CtiData }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const value = Math.floor(Math.random() * 100);
      const ctiInfo: CtiData = {
        id: Date.now().toString(),
        ctiId: `20250325${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        ctiType: Math.floor(Math.random() * 6),
        userId,
        tags: CTI_TAG_MAP[Math.floor(Math.random() * 6)],
        ctiHash: 'hash' + Math.random().toString(36).substring(2, 15),
        createdTime: new Date().toISOString(),
        incentiveMechanism: Math.floor(Math.random() * 3) + 1,
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
      const users = Array.from({length: 10}, (_, i) => `user${i + 1}`);

      for (let i = 0; i < 50; i++) {
        const userId = users[i % 10];
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
          userId,
          tags: CTI_TAG_MAP[i % 6], // 使用CTI_TAG_MAP
          ctiHash: 'hash' + Math.random().toString(36).substring(2, 15),
          createdTime: new Date().toISOString(),
          incentiveMechanism: (i % 3) + 1, // 使用INCENTIVE_MAP
          value,
          reward: i % 2 !== 0 ? reward : 0,
          stake: i % 2 !== 0 ? stake : 0,
          stakeStatus: StakeStatusEnum.UNSTAKED,
          evaluateStatus: i % 2 !== 0, // 每2个中有1个未评估
          evaluateQuality: i % 2 !== 0 ? evaluateQualityList[0]: 0,
          avgEvaluateQuality: avgEvaluateQuality,
          requesterEvaluateList: Array.from([0,1,2]).map((index: number) => ({
            ctiId: `20250325${String(i + 1).padStart(6, '0')}`,
            userId: evalUserList[index],
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