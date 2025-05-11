import { create } from 'zustand';
import { modelApi } from '@/api';
import { ModelInfo as ApiModelInfo } from '@/api/types/model';

// 本地UI使用的模型类型
interface ModelItem {
  model_id: string;                // 模型ID(链上生成)
  model_name: string;              // 模型名称
  model_type: number;              // 模型类型(1:分类模型、2:回归模型、3:聚类模型、4:NLP模型)
  model_algorithm?: string;        // 模型算法
  model_train_framework?: string;  // 模型训练框架(Scikit-learn、Pytorch、TensorFlow)
  model_open_source?: number;      // 是否开源
  model_features?: string[];       // 模型特征
  model_data_type?: number;        // 模型数据类型(1:流量(数据集)、2:情报(文本))
  model_data_size?: number;        // 模型训练数据大小

  creator_user_id?: string;        // 模型创建者ID
  creator_user_name?: string;      // 创建者名称
  description?: string;            // 模型描述
  model_hash?: string;             // 模型hash
  model_size?: number;             // 模型大小
  create_time?: string;            // 模型创建时间
  price?: number;                  // 价格（积分）
  status?: string;                 // 状态

  downloads?: number;              // 下载次数（兼容旧版）
  rating?: number;                 // 评分（兼容旧版）
  incentive_mechanism?: number;    // 激励机制(1:积分激励、2:三方博弈、3:演化博弈)
  value?: number;                  // 模型价值
  need?: number;                   // 模型需求量
  ref_cti_id?: string;             // 关联情报ID
  tags?: string[];                 // 模型标签
}

interface ModelComment {
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

interface ModelMarketState {
  // 列表数据
  modelList: ModelItem[];
  ownModelList: ModelItem[];

  // 详情数据
  currentModel: ModelItem | null;
  modelComments: ModelComment[];

  // 状态
  isLoading: boolean;
  error: string | null;

  // 分页
  currentPage: number;
  pageSize: number;
  totalCount: number;

  // 筛选
  filterType: number;
  filterIncentiveMechanism: number;
  searchKeyword: string;

  // 操作
  fetchModelList: (page?: number, pageSize?: number, type?: number, incentiveMechanism?: number, keyword?: string) => Promise<void>;
  fetchOwnModelList: () => Promise<void>;
  fetchModelDetail: (modelId: string) => Promise<void>;
  fetchModelComments: (modelId: string) => Promise<void>;
  addComment: (modelId: string, content: string, score: number, password: string) => Promise<void>;
  purchaseModel: (modelId: string, password: string) => Promise<any>;
  setFilter: (type: number, incentiveMechanism: number, keyword: string) => void;
  reset: () => void;
}

export const useModelMarketStore = create<ModelMarketState>((set, get) => ({
  // 列表数据
  modelList: [],
  ownModelList: [],

  // 详情数据
  currentModel: null,
  modelComments: [],

  // 状态
  isLoading: false,
  error: null,

  // 分页
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,

  // 筛选
  filterType: -1,
  filterIncentiveMechanism: -1,
  searchKeyword: '',

  // 操作
  fetchModelList: async (page = 1, pageSize = 10, type = -1, incentiveMechanism = -1, keyword = '') => {
    set({ isLoading: true, error: null, currentPage: page, pageSize: pageSize });

    try {
      // 构建查询参数
      const queryParams: any = {
        page: page,
        page_size: pageSize,
        keyword: keyword
      };

      // 添加类型筛选
      if (type !== -1) {
        queryParams.model_type = type;
      }

      // 添加激励机制筛选
      if (incentiveMechanism !== -1) {
        queryParams.incentive_mechanism = incentiveMechanism;
      }

      // 调用API获取数据
      const response = await modelApi.queryModelData(queryParams);

      // 将API返回的数据转换为本地数据结构
      const modelList: ModelItem[] = response.model_infos.map(item => ({
        model_id: item.model_id,
        model_name: item.model_name,
        model_type: item.model_type,
        creator_user_id: item.model_creator_user_id || item.creator_user_id,
        creator_user_name: item.creator_user_name,
        description: item.model_description,
        model_hash: item.model_hash || item.ipfs_hash,
        model_size: item.model_data_size || 0,
        create_time: item.model_create_time || item.create_time,
        price: item.point_price || 0,
        status: item.model_open_source === 1 ? 'active' : 'pending',
        downloads: item.purchase_count || 0,
        rating: item.rating_score || 0,
        incentive_mechanism: item.incentive_mechanism || 0,
        // 新增字段
        model_algorithm: item.model_algorithm,
        model_train_framework: item.model_train_framework,
        model_features: item.model_features,
        model_data_type: item.model_data_type,
        value: item.value,
        need: item.need,
        ref_cti_id: item.ref_cti_id,
        tags: item.model_tags
      }));

      // 如果有关键词搜索，在客户端进行过滤
      // 注意：理想情况下，关键词搜索应该在服务器端完成
      let filteredList = modelList;
      if (keyword) {
        filteredList = modelList.filter(item =>
          (item.model_name?.includes(keyword) || false) ||
          (item.description?.includes(keyword) || false)
        );
      }

      // 如果有激励机制筛选，在客户端进行过滤
      // 注意：理想情况下，激励机制筛选应该在服务器端完成
      if (incentiveMechanism !== -1) {
        filteredList = filteredList.filter(item => item.incentive_mechanism === incentiveMechanism);
      }

      set({
        modelList: filteredList,
        totalCount: response.total,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch model list:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch model list',
        isLoading: false
      });
    }
  },

  fetchOwnModelList: async () => {
    set({ isLoading: true, error: null });

    try {
      // 从localStorage获取用户ID
      const userId = localStorage.getItem('userWalletId');

      if (!userId) {
        throw new Error('请先登录钱包');
      }

      // 调用API获取用户拥有的模型列表
      const response = await modelApi.queryUserOwnedModelData(userId);

      // 将API返回的数据转换为本地数据结构
      const ownModelList: ModelItem[] = response.model_infos.map(item => ({
        model_id: item.model_id,
        model_name: item.model_name,
        model_type: item.model_type,
        creator_user_id: item.model_creator_user_id || item.creator_user_id,
        creator_user_name: item.creator_user_name || '',
        description: item.model_description || '',
        model_hash: item.model_hash || item.ipfs_hash || '',
        model_size: item.model_data_size || 0,
        create_time: item.model_create_time || item.create_time || '',
        price: item.point_price || 0,
        status: item.model_open_source === 1 ? 'active' : 'pending',
        downloads: item.purchase_count || 0,
        rating: item.rating_score || 0,
        incentive_mechanism: item.incentive_mechanism || 0,
        // 新增字段
        model_algorithm: item.model_algorithm,
        model_train_framework: item.model_train_framework,
        model_features: item.model_features,
        model_data_type: item.model_data_type,
        value: item.value,
        need: item.need,
        ref_cti_id: item.ref_cti_id,
        tags: item.model_tags || []
      }));

      set({ ownModelList, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch own model list:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch own model list',
        isLoading: false
      });
    }
  },

  fetchModelDetail: async (modelId: string) => {
    set({ isLoading: true, error: null });

    try {
      // 调用API获取模型详情
      const modelData = await modelApi.queryModelDataById(modelId);

      // 将API返回的数据转换为本地数据结构
      const modelInfo: ModelItem = {
        model_id: modelData.model_id,
        model_name: modelData.model_name,
        model_type: modelData.model_type,
        creator_user_id: modelData.model_creator_user_id || modelData.creator_user_id,
        creator_user_name: modelData.creator_user_name || '',
        description: modelData.model_description || '',
        model_hash: modelData.model_hash || modelData.ipfs_hash || '',
        model_size: modelData.model_data_size || 0,
        create_time: modelData.model_create_time || modelData.create_time || '',
        price: modelData.point_price || 0,
        status: modelData.model_open_source === 1 ? 'active' : 'pending',
        downloads: modelData.purchase_count || 0,
        rating: modelData.rating_score || 0,
        incentive_mechanism: modelData.incentive_mechanism || 0,
        // 新增字段
        model_algorithm: modelData.model_algorithm,
        model_train_framework: modelData.model_train_framework,
        model_features: modelData.model_features,
        model_data_type: modelData.model_data_type,
        model_open_source: modelData.model_open_source,
        value: modelData.value,
        need: modelData.need,
        ref_cti_id: modelData.ref_cti_id,
        tags: modelData.model_tags || []
      };

      set({ currentModel: modelInfo, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch model detail:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch model detail',
        isLoading: false
      });
    }
  },

  fetchModelComments: async (modelId: string) => {
    set({ isLoading: true, error: null });

    try {
      // 调用评论API
      const { commentApi } = await import('@/api');
      const response = await commentApi.queryCommentsByRefId(modelId, 1, 10);

      // 确保response.comment_infos存在
      if (response && response.comment_infos && Array.isArray(response.comment_infos)) {
        // 转换评论数据格式
        const comments: ModelComment[] = response.comment_infos.map(comment => ({
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

        set({ modelComments: comments, isLoading: false });
      } else {
        // 如果没有评论数据，设置空数组
        console.log('No comments found or invalid response format');
        set({ modelComments: [], isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching model comments:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch model comments',
        modelComments: [], // 设置空数组，确保UI不会崩溃
        isLoading: false
      });
    }
  },

  addComment: async (modelId: string, content: string, score: number, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // 从localStorage获取钱包ID
      const walletId = localStorage.getItem('userWalletId');

      if (!walletId) {
        throw new Error('请先登录钱包');
      }

      // 调用评论API
      const { commentApi } = await import('@/api');
      console.log('Submitting comment to model:', modelId);

      const response = await commentApi.registerComment(
        walletId,
        password,
        modelId,
        score,
        content,
        'model'
      );

      console.log('Comment submission response:', response);

      if (response.code !== 200) {
        throw new Error(response.message || '评论失败');
      }

      // 重新获取评论列表
      await get().fetchModelComments(modelId);

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

  purchaseModel: async (modelId: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // 从localStorage获取钱包ID
      const walletId = localStorage.getItem('userWalletId');

      if (!walletId) {
        throw new Error('请先登录钱包');
      }

      // 调用API购买模型
      const response = await modelApi.purchaseModel(walletId, password, modelId);

      // 购买成功后重新获取模型详情
      await get().fetchModelDetail(modelId);

      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error('Error purchasing model:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to purchase model',
        isLoading: false
      });
      throw error; // 重新抛出错误，让UI层可以捕获并显示
    }
  },

  setFilter: (type: number, incentiveMechanism: number, keyword: string) => {
    set({
      filterType: type,
      filterIncentiveMechanism: incentiveMechanism,
      searchKeyword: keyword
    });

    // 重新获取数据
    get().fetchModelList(1, get().pageSize, type, incentiveMechanism, keyword);
  },

  reset: () => {
    set({
      currentModel: null,
      modelComments: [],
      error: null,
      filterType: -1,
      filterIncentiveMechanism: -1,
      searchKeyword: ''
    });
  }
}));
