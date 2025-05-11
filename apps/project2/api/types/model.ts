// Model API Types

/**
 * Model Information based on blockchain data structure
 */
export interface ModelInfo {
  // 核心字段 - 与后端 ModelInfo 结构对齐
  model_id: string;                // 模型ID(链上生成)
  model_hash: string;              // 模型hash
  model_name: string;              // 模型名称
  model_type: number;              // 模型类型(1:分类模型、2:回归模型、3:聚类模型、4:NLP模型)
  model_algorithm?: string;        // 模型算法
  model_train_framework?: string;  // 模型训练框架(Scikit-learn、Pytorch、TensorFlow)
  model_open_source?: number;      // 是否开源
  model_features?: string[];       // 模型特征
  model_data_type?: number;        // 模型数据类型(1:流量(数据集)、2:情报(文本))
  model_data_size?: number;        // 模型训练数据大小
  model_data_ipfs_hash?: string;   // 模型训练数据IPFS地址
  model_ipfs_hash?: string;        // 模型IPFS地址
  model_description?: string;      // 模型描述
  model_create_time?: string;      // 模型创建时间（由合约生成）
  model_tags?: string[];           // 模型标签

  // 创建者信息
  model_creator_user_id?: string;  // 创建者ID(公钥sha256)
  creator_user_id?: string;        // 创建者ID(兼容旧版)
  creator_user_name?: string;      // 创建者名称

  // 激励机制相关
  incentive_mechanism: number;     // 激励机制(1:积分激励、2:三方博弈、3:演化博弈)
  value?: number;                  // 模型价值
  need?: number;                   // 模型需求量
  point_price?: number;            // 价格（积分）

  // 关联信息
  ref_cti_id?: string;             // 关联情报ID

  // 兼容性字段
  create_time?: string;            // 创建时间(兼容旧版)
  update_time?: string;            // 更新时间
  ipfs_hash?: string;              // IPFS地址(兼容旧版)
  model_status?: number;           // 模型状态
  model_source?: string;           // 模型来源
  model_traffic_type?: number;     // 流量情报类型（0：非流量、1：卫星网络、2：5G、3：SDN）
  model_data_hash?: string;        // 模型数据HASH（sha256）

  // 统计字段
  purchase_count?: number;         // 下载/购买次数
  rating_score?: number;           // 评分
}

export interface ModelListResponse {
  model_infos: ModelInfo[];
  total: number;
  page: number;
  page_size: number;
}

export interface ModelQueryParams {
  page: number;
  page_size: number;
  model_type?: number;
  incentive_mechanism?: number;
  keyword?: string;
}

export interface ModelPurchaseResponse {
  code: number;
  message: string;
  data: {
    transaction_id: string;
    model_id: string;
    user_id: string;
    point_amount: number;
    transaction_time: string;
  };
}
