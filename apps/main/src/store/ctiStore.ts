import { UserEvaluateStake } from './user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StakeStatusEnum } from './user'
import { UserInfo } from './user'
//CTI类型
export enum CtiTypeEnum {
  IP = 1,
  DOMAIN = 2,
  URL = 3,
  HASH = 4,
  PHISHING = 5,
  REDOSTCTI = 6,
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
  'ipfsAddress': 'IPFS地址',
  'cryptoKey': '密钥',
  'onChain': '上链状态',
  'data': '情报内容',
  'createdTime': '创建时间',
  'incentiveMechanism': '激励机制',
  'value': '积分',
  'reward': '奖励',
  'stake': '押金',
  'stakeStatus': '押金状态',
  'evaluateStatus': '评估状态',
  'evaluateQuality': '评估质量',
  'avgEvaluateQuality': '平均评估质量',
  'paymentUserList': '购买用户列表',
  'requesterEvaluateList': '评估列表',
}


export const ReDoSCTIInfoMap = {
  'threatIntelligenceId': { name: '威胁情报ID', score: 2 },
  'vulnerableRegex': { name: '含漏洞的正则表达式', score: 15 },
  'programmingLanguageEnv': { name: '编程语言环境', score: 10 },
  'attackDuration': { name: '攻击时长', score: 3 },
  'regexDeploymentLocation': { name: '正则表达式部署位置', score: 5 },
  'regexVulnerabilityPoint': { name: '正则表达式脆弱点', score: 10 },
  'attackString': { name: '可用的攻击字符串', score: 10 },
  'vulnerabilityStaticPattern': { name: '漏洞的静态模式', score: 5 },
  'timeComplexity': { name: '时间复杂度', score: 5 },
  'openSourceComponent': { name: '正则表达式所在开源组件', score: 10 },
  'solution': { name: '解决方案', score: 15 },
  'description': { name: '其他描述', score: 10 }
}


export interface ReDoSCTI {
  threatIntelligenceId: string // 威胁情报ID
  vulnerableRegex: string // 包含漏洞的正则表达式
  programmingLanguageEnv: number // 编程语言环境
  attackDuration: string // 攻击时长
  regexDeploymentLocation: number // 正则表达式部署位置
  regexVulnerabilityPoint: string // 正则表达式脆弱点
  attackString: string // 可用的攻击字符串
  vulnerabilityStaticPattern: string // 漏洞的静态模式
  timeComplexity: string // 时间复杂度
  openSourceComponent: string // 正则表达式所在开源组件
  solution: string // 解决方案
  description: string // 其他描述
}

export const ExampleReDoSCTIList: ReDoSCTI[] = [
  {
    threatIntelligenceId: '1',
    vulnerableRegex: 'ata+b',
    programmingLanguageEnv: 1,
    attackDuration: '1014ms',
    regexDeploymentLocation: 1,
    regexVulnerabilityPoint: '>a+a+< b',
    attackString: '""+"aa"*5000+"@',
    vulnerabilityStaticPattern: '指数重叠相邻',
    timeComplexity: '多项式',
    openSourceComponent: '无',
    solution: '将该表达式等价转化为aa+b',
    description: '僵尸网络的分布式攻击'
  }
]



export interface CtiData {
    id: string
    ctiId: string
    ctiType: number
    walletId: string
    ctiTrafficType?: number
    tags: string
    ctiHash: string
    ipfsAddress: string
    onChain: boolean|false //是否上链
    cryptoKey: string
    data: ReDoSCTI|string
    createdTime: string
    incentiveMechanism: number
    value: number
    reward: number|0
    stake: number|0
    stakeStatus: StakeStatusEnum|StakeStatusEnum.UNSTAKED //是否扣除押金
    evaluateStatus: boolean|false //是否评估
    evaluateQuality?: number|0 //评估质量
    avgEvaluateQuality?: number|0 //平均评估质量
    paymentUserList: string[] //购买用户列表
    requesterEvaluateList?: UserEvaluateStake[]|[] //评估列表
}

interface CtiState {
  ctiItems: CtiData[]
  createCti: (walletId: string,userInfo: UserInfo) => Promise<void>
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
      createCti: async (walletId: string,userInfo: UserInfo) => {
        set((state) => {
          const info = mockCreateCTI(walletId,userInfo,state.ctiItems.length+1);
          return {
            ctiItems: [info,...state.ctiItems]
          }   
        });
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
        // const storedItems = localStorage.getItem('cti-store');
        // if (!storedItems || JSON.parse(storedItems).ctiItems.length === 0) {
        //   // const res = await mockFetchUserCTI();
        //   // set({ ctiItems: res.cti_infos });
        // }
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

const generateHashKey = (): string => {
  // 生成64位小写字母和数字组合的密钥
  const chars = 'abcdef0123456789';
  let key = '';
  for (let i = 0; i < 64; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

const mockCreateCTI = (walletId: string,userInfo: UserInfo,currentCtiNum: number): CtiData => {
  const ctiData = ExampleReDoSCTIList[0];
  const ctiId = `20250325${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
  ctiData.threatIntelligenceId = ctiId;
    const ctiInfo: CtiData = {
      id: currentCtiNum.toString()+1,
      ctiId: ctiId,
      ctiType: CtiTypeEnum.REDOSTCTI,
      walletId,
      tags: CTI_TAG_MAP[Math.floor(Math.random() * 6)],
      ctiHash: 'hash' + Math.random().toString(36).substring(2, 15),
      ipfsAddress: generateHashKey(),
      cryptoKey: userInfo.extraInfo?.cryptoKey||generateHashKey(),
      onChain: false,
      data: ctiData,
      createdTime: new Date().toISOString(),
      incentiveMechanism: CtiIncentiveEnum.EVOLUTION,
      value:50,
      reward:0,
      stake:0,
      stakeStatus: StakeStatusEnum.UNSTAKED,
      evaluateStatus: false,
      evaluateQuality: 0,
      avgEvaluateQuality: 0,
      paymentUserList: [],
      requesterEvaluateList: []
    }

    return ctiInfo;
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
          ipfsAddress: generateHashKey(),
          cryptoKey: generateHashKey(),
          onChain: false,
          ctiHash: 'hash' + Math.random().toString(36).substring(2, 15),
          data: '{ this is an redos cti data }',
          createdTime: new Date().toISOString(),
          incentiveMechanism: CtiIncentiveEnum.EVOLUTION, // 只使用EVOLUTION
          value,
          reward: i % 2 !== 0 ? reward : 0,
          stake: i % 2 !== 0 ? stake : 0,
          stakeStatus: StakeStatusEnum.UNSTAKED,
          evaluateStatus: i % 2 !== 0, // 每2个中有1个未评估
          evaluateQuality: i % 2 !== 0 ? evaluateQualityList[0]: 0,
          avgEvaluateQuality: avgEvaluateQuality,
          paymentUserList: evalUserList,
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