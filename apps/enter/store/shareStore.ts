import { create } from 'zustand';
import { shareApi } from '@/api';

// 定义CTI相关接口
interface CTIInfo {
  cti_id: string;
  cti_hash: string;
  cti_name: string;
  cti_type: number;
  cti_traffic_type: number;
  open_source: number;
  creator_user_id: string;
  tags: string[];
  iocs: string[];
  stix_data: string;
  stix_ipfs_hash: string;
  statistic_info: string;
  description: string;
  data_size: number;
  data_source_hash: string;
  data_source_ipfs_hash: string;
  need: number;
  incentive_mechanism: number;
  value: number;
  compre_value: number;
  create_time: string;
  doctype: string;
}

// 定义激励机制相关接口
interface IncentiveEventInfo {
  incentive_id: string;
  ref_id: string;
  incentive_doctype: string;
  history_value: number;
  incentive_mechanism: number;
  incentive_value: number;
  comment_score?: number;
  need?: number;
  total_user_num?: number;
  create_time: string;
  doctype: string;
}

// 定义威胁信息接口
interface ThreatInfo {
  threat_id: string;
  threat_name: string;
  threat_type: string;
  source_ip: string;
  target_ip: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  status: 'active' | 'mitigated' | 'resolved';
  description: string;
}

// 定义共享状态类型
interface ShareState {
  // 情报共享数据
  intelligenceData: CTIInfo[];
  intelligenceTotal: number;
  intelligencePage: number;
  intelligencePageSize: number;

  // 激励机制数据
  incentiveEvents: IncentiveEventInfo[];
  incentiveTotal: number;
  incentivePage: number;
  incentivePageSize: number;

  // 威胁态势数据
  threatData: ThreatInfo[];
  threatTotal: number;
  threatPage: number;
  threatPageSize: number;

  // 状态
  isLoading: boolean;
  error: string | null;

  // 操作
  fetchIntelligenceData: (page?: number, pageSize?: number) => Promise<void>;
  fetchIncentiveEvents: (page?: number, pageSize?: number) => Promise<void>;
  fetchThreatData: (page?: number, pageSize?: number) => Promise<void>;
  reset: () => void;
}

// 创建共享状态存储
export const useShareStore = create<ShareState>((set, get) => ({
  // 情报共享数据
  intelligenceData: [],
  intelligenceTotal: 0,
  intelligencePage: 1,
  intelligencePageSize: 10,

  // 激励机制数据
  incentiveEvents: [],
  incentiveTotal: 0,
  incentivePage: 1,
  incentivePageSize: 10,

  // 威胁态势数据
  threatData: [],
  threatTotal: 0,
  threatPage: 1,
  threatPageSize: 10,

  // 状态
  isLoading: false,
  error: null,

  // 操作
  fetchIntelligenceData: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });

    try {
      const response = await shareApi.queryCTIData(page, pageSize);

      set({
        intelligenceData: response.cti_infos,
        intelligenceTotal: response.total,
        intelligencePage: response.page,
        intelligencePageSize: response.page_size,
        isLoading: false
      });
    } catch (error) {
      console.error('获取情报数据失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取情报数据失败',
        isLoading: false
      });
    }
  },

  fetchIncentiveEvents: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });

    try {
      const response = await shareApi.queryIncentiveEvents(page, pageSize);

      set({
        incentiveEvents: response.incentive_infos,
        incentiveTotal: response.total,
        incentivePage: response.page,
        incentivePageSize: response.page_size,
        isLoading: false
      });
    } catch (error) {
      console.error('获取激励事件数据失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取激励事件数据失败',
        isLoading: false
      });
    }
  },

  fetchThreatData: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });

    try {
      const response = await shareApi.queryThreatData(page, pageSize);

      set({
        threatData: response.threat_infos,
        threatTotal: response.total,
        threatPage: response.page,
        threatPageSize: response.page_size,
        isLoading: false
      });
    } catch (error) {
      console.error('获取威胁数据失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取威胁数据失败',
        isLoading: false
      });
    }
  },

  reset: () => {
    set({
      intelligenceData: [],
      intelligenceTotal: 0,
      intelligencePage: 1,
      intelligencePageSize: 10,

      incentiveEvents: [],
      incentiveTotal: 0,
      incentivePage: 1,
      incentivePageSize: 10,

      threatData: [],
      threatTotal: 0,
      threatPage: 1,
      threatPageSize: 10,

      isLoading: false,
      error: null
    });
  }
}));
