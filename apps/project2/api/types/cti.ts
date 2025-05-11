// CTI API Types

/**
 * CTI Information based on blockchain data structure
 */
export interface CTIInfo {
  cti_id: string;           // 情报ID(链上生成)
  cti_hash: string;         // 情报HASH(sha256链下生成)
  cti_name: string;         // 情报名称(可为空)
  cti_type: number;         // 情报类型（1:恶意流量、2:蜜罐情报、3:僵尸网络、4:应用层攻击、5:开源情报）
  cti_traffic_type: number; // 流量情报类型（0:非流量、1:5G、2:卫星网络、3:SDN）
  open_source: number;      // 是否开源（0不开源，1开源）
  creator_user_id: string;  // 创建者ID(公钥sha256)
  tags: string[];           // 情报标签数组
  iocs: string[];           // 包含的沦陷指标（IP, Port, Payload,URL, Hash）
  stix_data: string;        // STIX数据（JSON）可以有多条
  stix_ipfs_hash: string;   // STIX数据,IPFS地址
  statistic_info: string;   // 统计信息(JSON) 或者IPFS HASH
  description: string;      // 情报描述
  data_size: number;        // 数据大小（B）
  data_source_hash: string; // 数据源HASH（sha256）
  data_source_ipfs_hash: string; // 数据源IPFS地址
  need: number;             // 情报需求量(销售数量)
  incentive_mechanism: number; // 激励机制(1:积分激励、2:三方博弈、3:演化博弈)
  value: number;            // 情报价值（积分）
  compre_value: number;     // 综合价值（积分激励算法定价）
  create_time: string;      // 情报创建时间（由合约生成）
  doctype: string;          // 文档类型
}

export interface CTIListResponse {
  cti_infos: CTIInfo[];
  total: number;
  page: number;
  page_size: number;
  incentive_mechanism?: number;
}

export interface CTIQueryParams {
  page: number;
  page_size: number;
  cti_type?: number;
  incentive_mechanism?: number;
  keyword?: string;
  cti_traffic_type?: number;
}

export interface CTIPurchaseResponse {
  code: number;
  message: string;
  data: {
    transaction_id: string;
    cti_id: string;
    user_id: string;
    point_amount: number;
    transaction_time: string;
  };
}

export interface UserOwnedCTIResponse {
  total: number;
  cti_infos: CTIInfo[];
  upload_cti_infos: CTIInfo[];
  purchase_cti_infos: CTIInfo[];
}

/**
 * CTI Summary Information
 */
export interface CTISummaryInfo {
  cti_id: string;         // 情报ID（链上生成）
  cti_hash: string;       // 情报HASH(sha256链下生成)
  cti_type: number;       // 情报类型
  tags: string[];         // 情报标签数组
  creator_user_id: string; // 创建者ID
  create_time: string;    // 创建时间
}

/**
 * User Point Information
 */
export interface UserPointInfo {
  value: number;                // 用户积分
  user_cti_map: Record<string, string[]>; // 用户拥有的情报map
  cti_buy_map: Record<string, number>;    // 用户购买的情报map
  cti_sale_map: Record<string, number>;   // 用户销售的情报map
}

/**
 * Data Statistics Information
 */
export interface DataStatisticsInfo {
  total_cti_data_num: number;        // 情报数据总数
  total_cti_data_size: number;       // 情报数据总大小
  total_model_data_num: number;      // 模型数据总数
  total_model_data_size: number;     // 模型数据总大小
  cti_type_data_num: Record<string, number>; // 情报分类型数据数量
  iocs_data_num: Record<string, number>;     // IOCs分类型数据数量
}

/**
 * Traffic Trend Information
 */
export interface TrafficTrendInfo {
  cti_traffic: Record<string, number>;    // CTI交易趋势
  model_traffic: Record<string, number>;  // 模型交易趋势
}

/**
 * Rank Item
 */
export interface RankItem {
  type: string;
  count: number;
}

/**
 * Attack Rank Information
 */
export interface AttackRankInfo {
  rankings: RankItem[];
}

/**
 * IOCs Distribution Information
 */
export interface IOCsDistributionInfo {
  distribution: Record<string, number>;
}

/**
 * Global IOCs Information
 */
export interface GlobalIOCsInfo {
  regions: Record<string, number>;
}

/**
 * System Overview Information
 */
export interface SystemOverviewInfo {
  block_height: number;
  total_transactions: number;
  cti_value: number;
  cti_count: number;
  cti_transactions: number;
  iocs_count: number;
  account_count: number;
}
