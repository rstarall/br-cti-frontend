import { create } from 'zustand';
import { ctiApi, userApi, incentiveApi } from '@/api';
import { IncentiveEventInfo, IncentiveTrendDataPoint } from '@/api/types/incentive';

// 导入API类型
import { CTIInfo as APICTIInfo } from '@/api/types/cti';

// 本地UI使用的CTI类型
export interface CTIInfo {
  cti_id: string;
  cti_name: string;
  cti_type: number;
  cti_traffic_type: number;
  creator_user_id: string;
  creator_user_name?: string;
  tags: string[];
  description: string;
  data_size: number;
  create_time: string;
  price: number;
  status: string;
  hash: string;
  incentive_mechanism: number;
  ipfs_hash?: string;
  data_source_ipfs_hash?: string; //数据源的IPFS地址
}

export interface CTIComment {
  comment_id: string;           // 评论ID
  user_id: string;              // 用户ID
  user_name: string;            // 用户名称
  user_level?: number;          // 用户等级
  comment_doc_type?: string;    // 评论文档类型
  comment_ref_id?: string;      // 评论关联ID
  comment_score: number;        // 评论分数
  comment_status?: number;      // 评论状态
  comment_content: string;      // 评论内容
  create_time: string;          // 创建时间
  doctype?: string;             // 文档类型
}

export interface CTIStatistics {
  totalCTICount: number;
  userCTICount: number;
  userUploadCount: number;
  userValue: number;
}

// 基础CTI存储状态
interface CTIState {
  // 详情数据
  currentCti: CTIInfo | null;
  ctiComments: CTIComment[];

  // 激励机制数据
  incentiveEvents: IncentiveEventInfo[];
  incentiveTrendData: IncentiveTrendDataPoint[];
  incentiveTotal: number;
  incentivePage: number;
  incentivePageSize: number;

  // 用户相关数据
  ownCtiList: CTIInfo[];
  onchainCtiList: CTIInfo[];

  // 统计数据
  statistics: CTIStatistics;

  // 状态
  isLoading: boolean;
  error: string | null;

  // 操作
  fetchCtiDetail: (ctiId: string) => Promise<void>;
  fetchCtiComments: (ctiId: string) => Promise<void>;
  fetchIncentiveEvents: (ctiId: string, page?: number, pageSize?: number, sort?: string) => Promise<void>;
  fetchIncentiveTrend: (ctiId: string) => Promise<void>;
  fetchOwnCtiList: () => Promise<void>;
  fetchOnchainCtiList: () => Promise<void>;
  fetchCtiStatistics: () => Promise<void>;
  addComment: (ctiId: string, content: string, score: number, password: string) => Promise<void>;
  reset: () => void;
}

// 创建基础CTI存储
export const useCtiStore = create<CTIState>((set, get) => ({
  // 详情数据
  currentCti: null,
  ctiComments: [],

  // 激励机制数据
  incentiveEvents: [],
  incentiveTrendData: [],
  incentiveTotal: 0,
  incentivePage: 1,
  incentivePageSize: 10,

  // 用户相关数据
  ownCtiList: [],
  onchainCtiList: [],

  // 统计数据
  statistics: {
    totalCTICount: 0,
    userCTICount: 0,
    userUploadCount: 0,
    userValue: 0
  },

  // 状态
  isLoading: false,
  error: null,

  // 操作
  fetchCtiDetail: async (ctiId: string) => {
    set({ isLoading: true, error: null });

    try {
      // 调用API获取CTI详情
      const ctiData = await ctiApi.queryCTIDataById(ctiId);

      // 将API返回的数据转换为本地数据结构
      const ctiInfo: CTIInfo = {
        cti_id: ctiData.cti_id,
        cti_name: ctiData.cti_name,
        cti_type: ctiData.cti_type,
        cti_traffic_type: ctiData.cti_traffic_type || 1, // 使用API返回值或默认值
        creator_user_id: ctiData.creator_user_id,
        creator_user_name: ctiData.creator_user_id,
        tags: ctiData.tags || [],
        description: ctiData.description || '',
        data_size: ctiData.data_size || 0,
        create_time: ctiData.create_time,
        price: ctiData.value || 0, // 使用value字段作为价格
        status: ctiData.open_source === 1 ? 'active' : 'pending', // 使用open_source字段判断状态
        incentive_mechanism: ctiData.incentive_mechanism,
        hash: ctiData.stix_ipfs_hash || ctiData.cti_hash || '',
        ipfs_hash: ctiData.stix_ipfs_hash||'',
        data_source_ipfs_hash: ctiData.data_source_ipfs_hash||'',
      };

      set({ currentCti: ctiInfo, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch CTI detail:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch CTI detail',
        isLoading: false
      });
    }
  },

  fetchCtiComments: async (ctiId: string) => {
    set({ isLoading: true, error: null });

    try {
      // 调用评论API
      const { commentApi } = await import('@/api');
      const response = await commentApi.queryCommentsByRefId(ctiId, 1, 10);

      // 确保response.comment_infos存在
      if (response && response.comment_infos && Array.isArray(response.comment_infos)) {
        // 转换评论数据格式
        const comments: CTIComment[] = response.comment_infos.map(comment => ({
          comment_id: comment.comment_id,
          user_id: comment.user_id,
          user_name: comment.user_name,
          user_level: comment.user_level,
          comment_doc_type: comment.comment_doc_type,
          comment_ref_id: comment.comment_ref_id,
          comment_score: comment.comment_score,
          comment_status: comment.comment_status,
          comment_content: comment.comment_content,
          create_time: comment.create_time,
          doctype: comment.doctype
        }));

        set({ ctiComments: comments, isLoading: false });
      } else {
        // 如果没有评论数据，设置空数组
        console.log('No comments found or invalid response format');
        set({ ctiComments: [], isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching CTI comments:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch CTI comments',
        ctiComments: [], // 设置空数组，确保UI不会崩溃
        isLoading: false
      });
    }
  },

  fetchOwnCtiList: async () => {
    set({ isLoading: true, error: null });

    try {
      // 从localStorage获取用户ID（检查是否在浏览器环境）
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userWalletId') : null;

      if (!userId) {
        throw new Error('请先登录钱包');
      }

      // 调用API获取用户拥有的CTI列表
      const response = await ctiApi.queryUserOwnedCTIData(userId);

      // 检查响应数据是否有效
      if (!response || !response.cti_infos) {
        console.warn('API returned invalid data structure:', response);
        // 设置空数组作为默认值
        set({ ownCtiList: [], isLoading: false });
        return;
      }

      // 将API返回的数据转换为本地数据结构
      const ownCtiList: CTIInfo[] = response.cti_infos.map(item => ({
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

      set({ ownCtiList, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch own CTI list:', error);
      // 设置空数组而不是错误状态，这样UI不会显示错误
      set({
        ownCtiList: [],
        error: null,
        isLoading: false
      });
    }
  },

  fetchOnchainCtiList: async () => {
    set({ isLoading: true, error: null });

    try {
      // 从localStorage获取用户ID（检查是否在浏览器环境）
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userWalletId') : null;

      if (!userId) {
        throw new Error('请先登录钱包');
      }

      // 调用API获取用户创建的CTI列表
      const ctiDataList = await ctiApi.queryCTIDataByUserId(userId);

      // 将API返回的数据转换为本地数据结构
      const onchainCtiList: CTIInfo[] = ctiDataList.map(item => ({
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

      set({ onchainCtiList, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch onchain CTI list:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch onchain CTI list',
        isLoading: false
      });
    }
  },

  fetchCtiStatistics: async () => {
    set({ isLoading: true, error: null });

    try {
      // 从localStorage获取用户ID（检查是否在浏览器环境）
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userWalletId') : null;

      if (!userId) {
        throw new Error('请先登录钱包');
      }

      // 调用API获取用户CTI统计数据
      const statsData = await userApi.getUserCTIStatistics(userId);
      console.log("statsData:", statsData);

      // 将API返回的数据转换为本地数据结构
      // 处理新的数据结构，同时保持向后兼容性
      const statistics: CTIStatistics = {
        // 总情报数量 - 从API返回的totalCTICount获取，如果不存在则使用cti_count或默认值0
        totalCTICount: statsData.totalCTICount || statsData.cti_count || 0,

        // 用户情报数量 - 从API返回的userCTICount获取，如果不存在则使用cti_count或默认值0
        userCTICount: statsData.userCTICount || statsData.cti_count || 0,

        // 用户上传数量 - 从API返回的userCTIUploadCount获取，如果不存在则使用cti_purchase_count或默认值0
        userUploadCount: statsData.userCTIUploadCount || statsData.cti_purchase_count || 0,

        // 用户积分 - 从API返回的value获取，如果不存在则使用cti_contribution_score或默认值0
        userValue: statsData.value || statsData.cti_contribution_score || 0
      };

      set({ statistics, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch CTI statistics:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch CTI statistics',
        isLoading: false
      });
    }
  },

  addComment: async (ctiId: string, content: string, score: number, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // 从localStorage获取钱包ID（检查是否在浏览器环境）
      const walletId = typeof window !== 'undefined' ? localStorage.getItem('userWalletId') : null;

      if (!walletId) {
        throw new Error('请先登录钱包');
      }

      // 调用评论API
      const { commentApi } = await import('@/api');
      console.log('Submitting comment to CTI:', ctiId);

      const response = await commentApi.registerComment(
        walletId,
        password,
        ctiId,
        score,
        content,
        'cti'
      );

      console.log('Comment submission response:', response);

      if (response.code !== 200) {
        throw new Error(response.message || '评论失败');
      }

      // 重新获取评论列表
      await get().fetchCtiComments(ctiId);

      set({ isLoading: false });
    } catch (error) {
      console.error('Error adding comment:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to add comment',
        isLoading: false
      });
      throw error; // 重新抛出错误，让UI层可以捕获并显示
    }
  },

  fetchIncentiveEvents: async (ctiId: string, page = 1, pageSize = 10, sort = 'create_time') => {
    set({ isLoading: true, error: null });

    try {
      // 调用激励事件API
      const response = await incentiveApi.queryIncentiveEventsByRefId(
        ctiId,
        'cti',
        page,
        pageSize,
        sort
      );

      // 确保response.incentive_infos存在
      if (response && response.incentive_infos && Array.isArray(response.incentive_infos)) {
        set({
          incentiveEvents: response.incentive_infos,
          incentiveTotal: response.total,
          incentivePage: response.page,
          incentivePageSize: response.page_size,
          isLoading: false
        });
      } else {
        // 如果没有激励事件数据，设置空数组
        console.log('No incentive events found or invalid response format');
        set({
          incentiveEvents: [],
          incentiveTotal: 0,
          incentivePage: page,
          incentivePageSize: pageSize,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching incentive events:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch incentive events',
        incentiveEvents: [], // 设置空数组，确保UI不会崩溃
        isLoading: false
      });
    }
  },

  fetchIncentiveTrend: async (ctiId: string) => {
    set({ isLoading: true, error: null });

    try {
      // 调用激励事件API获取所有事件
      const response = await incentiveApi.queryAllIncentiveEventsByRefId(ctiId, 'cti');

      // 确保response.incentive_infos存在
      if (response && response.incentive_infos && Array.isArray(response.incentive_infos)) {
        // 处理趋势数据
        const trendData = incentiveApi.processIncentiveTrendData(response.incentive_infos);
        set({ incentiveTrendData: trendData, isLoading: false });
      } else {
        // 如果没有激励事件数据，设置空数组
        console.log('No incentive events found for trend data or invalid response format');
        set({ incentiveTrendData: [], isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching incentive trend data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch incentive trend data',
        incentiveTrendData: [], // 设置空数组，确保UI不会崩溃
        isLoading: false
      });
    }
  },

  reset: () => {
    set({
      currentCti: null,
      ctiComments: [],
      incentiveEvents: [],
      incentiveTrendData: [],
      error: null
    });
  }
}));
