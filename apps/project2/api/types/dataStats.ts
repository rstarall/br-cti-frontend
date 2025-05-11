// Data Statistics API Types

/**
 * System overview data
 */
export interface SystemOverview {
  block_height: number;
  total_transactions: number;
  cti_value: number;
  cti_count: number;
  cti_transactions: number;
  iocs_count: number;
  account_count: number;
}

/**
 * Response for system overview query
 */
export interface SystemOverviewResponse {
  result: SystemOverview;
}

/**
 * CTI summary information
 */
export interface CTISummaryInfo {
  cti_id: string;
  cti_hash: string;
  cti_type: number;
  tags: string[];
  creator_user_id: string;
  create_time: string;
}

/**
 * Request parameters for CTI summary query
 */
export interface CTISummaryRequest {
  limit: number;
}

/**
 * Response for CTI summary query
 */
export interface CTISummaryResponse {
  result: string; // JSON string containing array of CTISummaryInfo
}

/**
 * Upchain trend data
 */
export interface UpchainTrend {
  cti_upchain: Record<string, number>;
  model_upchain: Record<string, number>;
}

/**
 * Request parameters for upchain trend query
 */
export interface UpchainTrendRequest {
  time_range: string; // e.g., "last_30_days"
}

/**
 * Response for upchain trend query
 */
export interface UpchainTrendResponse {
  result: string; // JSON string containing UpchainTrend
}

/**
 * Attack type ranking item
 */
export interface AttackTypeRankingItem {
  type: string;
  count: number;
}

/**
 * Attack type ranking data
 */
export interface AttackTypeRanking {
  rankings: AttackTypeRankingItem[];
}

/**
 * Response for attack type ranking query
 */
export interface AttackTypeRankingResponse {
  result: string; // JSON string containing AttackTypeRanking
}

/**
 * Data statistics information
 */
export interface DataStatistics {
  total_cti_data_num: number;
  total_cti_data_size: number;
  total_model_data_num: number;
  total_model_data_size: number;
  cti_type_data_num: Record<string, number>;
  model_type_data_num: Record<string, number> | null;
  iocs_data_num: Record<string, number>;
}

/**
 * Response for data statistics query
 */
export interface DataStatisticsResponse {
  result: string; // JSON string containing DataStatistics
}

/**
 * IOCs distribution data
 */
export interface IOCsDistribution {
  total_count_map: Record<string, number>;
  distribution: Record<string, any>;
}

/**
 * Response for IOCs distribution query
 */
export interface IOCsDistributionResponse {
  result: string; // JSON string containing IOCsDistribution
}
