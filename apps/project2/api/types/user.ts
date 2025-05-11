// User API Types

export interface UserCTIStatistics {
  // 原有字段
  cti_count: number;
  cti_purchase_count: number;
  cti_rating_score: number;
  cti_contribution_score: number;

  // 新增字段 - 新版API返回的字段
  totalCTICount?: number;
  totalModelCount?: number;
  userCTICount?: number;
  userCTIUploadCount?: number;
  userModelCount?: number;
  userModelUploadCount?: number;
  value?: number; // Changed from userValue to match backend
}

export interface UserModelStatistics {
  model_count: number;
  model_purchase_count: number;
  model_rating_score: number;
  model_contribution_score: number;
}

export interface UserDetailInfo {
  user_id: string;
  user_name: string;
  public_key: string;
  public_key_type: string;
  user_value: number;
  create_time: string;
  // Optional fields that might be returned by some API endpoints
  wallet_id?: string;
  user_role?: string;
  user_status?: number;
  user_avatar?: string;
  user_description?: string;
  cti_count?: number;
  model_count?: number;
  contribution_score?: number;
}

export interface UserStatisticsResponse {
  code: number;
  message: string;
  data: {
    cti_count: number;
    model_count: number;
    value: number; // Changed from point_balance to match backend
    contribution_score: number;
  };
}
