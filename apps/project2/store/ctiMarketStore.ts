import { create } from 'zustand';
import { CTIInfo } from './ctiStore';
import { ctiApi } from '@/api';
import { CTIQueryParams } from '@/api/types/cti';

interface CTIMarketState {
  // 列表数据
  ctiList: CTIInfo[];

  // 状态
  isLoading: boolean;
  error: string | null;

  // 分页
  currentPage: number;
  pageSize: number;
  totalCount: number;

  // 筛选
  filterType: number;
  filterTrafficType: number;
  filterIncentiveMechanism: number;
  searchKeyword: string;

  // 操作
  fetchCtiList: (page?: number, pageSize?: number, type?: number, trafficType?: number, incentiveMechanism?: number, keyword?: string) => Promise<void>;
  setFilter: (type: number, trafficType: number, incentiveMechanism: number, keyword: string) => void;
  reset: () => void;
}

export const useCtiMarketStore = create<CTIMarketState>((set, get) => ({
  // 列表数据
  ctiList: [],

  // 状态
  isLoading: false,
  error: null,

  // 分页
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,

  // 筛选
  filterType: -1,
  filterTrafficType: -1,
  filterIncentiveMechanism: -1,
  searchKeyword: '',

  // 操作
  fetchCtiList: async (page = 1, pageSize = 10, type = -1, trafficType = -1, incentiveMechanism = -1, keyword = '') => {
    set({ isLoading: true, error: null, currentPage: page, pageSize: pageSize });

    try {
      // 构建查询参数
      const queryParams: CTIQueryParams = {
        page: page,
        page_size: pageSize
      };

      // 添加类型筛选
      if (type !== -1) {
        queryParams.cti_type = type;
      }

      // 添加激励机制筛选
      if (incentiveMechanism !== -1) {
        queryParams.incentive_mechanism = incentiveMechanism;
      }

      // 调用API获取数据
      const response = await ctiApi.queryCTIData(queryParams);

      // 将API返回的数据转换为本地数据结构
      const ctiList: CTIInfo[] = response.cti_infos.map(item => ({
        cti_id: item.cti_id,
        cti_name: item.cti_name,
        cti_type: item.cti_type,
        cti_traffic_type: item.cti_traffic_type || 1,
        creator_user_id: item.creator_user_id,
        creator_user_name: item.creator_user_id,
        tags: item.tags || [],
        description: item.description || '',
        data_size: item.data_size || 0,
        create_time: item.create_time,
        price: item.value || 0,
        status: item.open_source === 1 ? 'active' : 'pending',
        incentive_mechanism: item.incentive_mechanism,
        hash: item.stix_ipfs_hash || item.cti_hash || '',
        ipfs_hash: item.stix_ipfs_hash||'',
        data_source_ipfs_hash: item.data_source_ipfs_hash||'',
      }));

      // 如果有关键词搜索，在客户端进行过滤
      // 注意：理想情况下，关键词搜索应该在服务器端完成
      let filteredList = ctiList;
      if (keyword) {
        filteredList = ctiList.filter(item =>
          item.cti_name.includes(keyword) ||
          item.description.includes(keyword) ||
          item.tags.some(tag => tag.includes(keyword))
        );
      }

      // 如果有流量类型筛选，在客户端进行过滤
      // 注意：理想情况下，流量类型筛选应该在服务器端完成
      if (trafficType !== -1) {
        filteredList = filteredList.filter(item => item.cti_traffic_type === trafficType);
      }

      set({
        ctiList: filteredList,
        totalCount: response.total,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch CTI list:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch CTI list',
        isLoading: false
      });
    }
  },

  setFilter: (type: number, trafficType: number, incentiveMechanism: number, keyword: string) => {
    set({
      filterType: type,
      filterTrafficType: trafficType,
      filterIncentiveMechanism: incentiveMechanism,
      searchKeyword: keyword
    });

    // 重新获取数据
    get().fetchCtiList(1, get().pageSize, type, trafficType, incentiveMechanism, keyword);
  },

  reset: () => {
    set({
      error: null,
      filterType: -1,
      filterTrafficType: -1,
      filterIncentiveMechanism: -1,
      searchKeyword: ''
    });
  }
}));
