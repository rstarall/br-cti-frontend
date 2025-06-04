import { create } from 'zustand';

// 游戏发现数据类型定义
export interface GameStrategyImages {
  strategy1?: string;
  strategy2?: string;
  strategy3?: string;
  attacker?: string;
  effect?: string;
}

export interface IPStrategyData {
  reduce: number;
  game_cost: number;
  single_cost: number;
  input1: number;
  input2: number;
  input3: number;
  images: GameStrategyImages;
}

export interface FiveGStrategyData {
  reduce: number;
  game_cost: number;
  single_cost: number;
  budget: number;
  atrategy1: number;
  atrategy2: number;
  atrategy3: number;
  images: GameStrategyImages;
}

export interface SatelliteStrategyData {
  reduce: number;
  game_cost: number;
  single_cost: number;
  images: GameStrategyImages;
}

export interface GameDiscoveryState {
  // 数据状态
  ipData: IPStrategyData | null;
  fiveGData: FiveGStrategyData | null;
  satelliteData: SatelliteStrategyData | null;

  // 加载状态
  isLoading: boolean;
  error: string | null;

  // 操作方法
  fetchIPStrategy: (input1: number, input2: number, input3: number) => Promise<void>;
  fetch5GStrategy: (budget: number) => Promise<void>;
  fetchSatelliteStrategy: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// API调用函数
const callGameAPI = async (endpoint: string, data?: any) => {
  // 从localStorage获取客户端服务器地址
  const clientServerHost = typeof window !== 'undefined'
    ? localStorage.getItem('clientServerHost') || 'http://127.0.0.1:5000'
    : 'http://127.0.0.1:5000';
  const url = `${clientServerHost}/game/${endpoint}`;

  try {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // 只有在有数据时才添加请求体
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 检查API返回的错误格式
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const useGameDiscoveryStore = create<GameDiscoveryState>((set) => ({
  // 初始状态
  ipData: null,
  fiveGData: null,
  satelliteData: null,
  isLoading: false,
  error: null,

  // 获取IP网络策略
  fetchIPStrategy: async (input1: number, input2: number, input3: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await callGameAPI('ip_strategy', {
        input1,
        input2,
        input3
      });

      if (response.status === 'success' && response.data) {
        set({
          ipData: response.data,
          isLoading: false
        });
      } else {
        throw new Error('获取IP策略数据失败');
      }
    } catch (error) {
      console.error('获取IP策略失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取IP策略失败',
        isLoading: false
      });
    }
  },

  // 获取5G网络策略
  fetch5GStrategy: async (budget: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await callGameAPI('5g_strategy', {
        budget
      });

      if (response.status === 'success' && response.data) {
        set({
          fiveGData: response.data,
          isLoading: false
        });
      } else {
        throw new Error('获取5G策略数据失败');
      }
    } catch (error) {
      console.error('获取5G策略失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取5G策略失败',
        isLoading: false
      });
    }
  },

  // 获取卫星网络策略
  fetchSatelliteStrategy: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await callGameAPI('satellite_strategy');

      if (response.status === 'success' && response.data) {
        set({
          satelliteData: response.data,
          isLoading: false
        });
      } else {
        throw new Error('获取卫星策略数据失败');
      }
    } catch (error) {
      console.error('获取卫星策略失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取卫星策略失败',
        isLoading: false
      });
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 重置状态
  reset: () => {
    set({
      ipData: null,
      fiveGData: null,
      satelliteData: null,
      isLoading: false,
      error: null
    });
  }
}));
