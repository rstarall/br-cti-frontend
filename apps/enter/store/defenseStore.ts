import { create } from 'zustand';

// 时间线数据类型定义
export interface TimelineEntry {
  step: string;
  recv?: number;
  sent?: number;
  is_ddos?: boolean;
  ip?: string[];
  success?: boolean;
  message?: string;
  description?: string;
  profit?: number[];
}

// 防御数据类型定义
export interface DefenseData {
  timeline: TimelineEntry[];
  isStarted: boolean;
  logs: string[];
  currentIndex: number;
  trafficCount: number;
}

// 防御状态接口
export interface DefenseState {
  // 三个网络场景的数据
  ipData: DefenseData | null;
  fiveGData: DefenseData | null;
  satelliteData: DefenseData | null;

  // 加载状态
  isLoading: boolean;
  error: string | null;

  // 操作方法
  fetchIPDefenseData: () => Promise<void>;
  fetch5GDefenseData: () => Promise<void>;
  fetchSatelliteDefenseData: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// API调用函数
const callDefenseAPI = async (filename: string) => {
  const baseUrl = 'http://127.0.0.1:5000';
  const url = `${baseUrl}/ddos/ddos_ability/${encodeURIComponent(filename)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API调用失败 ${filename}:`, error);
    throw error;
  }
};

export const useDefenseStore = create<DefenseState>((set) => ({
  // 初始状态
  ipData: null,
  fiveGData: null,
  satelliteData: null,
  isLoading: false,
  error: null,

  // 获取IP网络防御数据
  fetchIPDefenseData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await callDefenseAPI('ip_result.jsonl');

      if (response && response.timeline) {
        const defenseData: DefenseData = {
          timeline: response.timeline,
          isStarted: false,
          logs: [],
          currentIndex: 0,
          trafficCount: 0
        };

        set({
          ipData: defenseData,
          isLoading: false
        });
      } else {
        throw new Error('获取IP网络防御数据失败');
      }
    } catch (error) {
      console.error('获取IP网络防御数据失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取IP网络防御数据失败',
        isLoading: false
      });
    }
  },

  // 获取5G网络防御数据
  fetch5GDefenseData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await callDefenseAPI('5g_result.jsonl');

      if (response && response.timeline) {
        const defenseData: DefenseData = {
          timeline: response.timeline,
          isStarted: false,
          logs: [],
          currentIndex: 0,
          trafficCount: 0
        };

        set({
          fiveGData: defenseData,
          isLoading: false
        });
      } else {
        throw new Error('获取5G网络防御数据失败');
      }
    } catch (error) {
      console.error('获取5G网络防御数据失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取5G网络防御数据失败',
        isLoading: false
      });
    }
  },

  // 获取卫星网络防御数据
  fetchSatelliteDefenseData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await callDefenseAPI('satellite_result.jsonl');

      if (response && response.timeline) {
        const defenseData: DefenseData = {
          timeline: response.timeline,
          isStarted: false,
          logs: [],
          currentIndex: 0,
          trafficCount: 0
        };

        set({
          satelliteData: defenseData,
          isLoading: false
        });
      } else {
        throw new Error('获取卫星网络防御数据失败');
      }
    } catch (error) {
      console.error('获取卫星网络防御数据失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取卫星网络防御数据失败',
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
