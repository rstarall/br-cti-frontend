// Wallet API Types

export interface WalletListResponse {
  wallet_ids: string[];
}

export interface WalletStatusResponse {
  code: number;
  message: string;
  data: {
    onchain_wallet_id: string;
    onchain: boolean;
  };
}

export interface UserInfo {
  user_id: string;
  user_name: string;
  public_key: string;
  public_key_type: string;
  value: number;
  create_time: string;
}

export interface TransactionRecord {
  transaction_id: string;
  transaction_type: string; // 交易类型：in/out
  points: number;           // 积分数量
  other_party: string;      // 对方账户
  info_id: string;          // 相关情报ID
  timestamp: string;        // 交易时间
  status: string;           // 交易状态(success/fail)
  doctype: string;          // 交易类型
}

export interface CreateWalletResponse {
  code: number;
  message: string;
  data: {
    wallet_id: string;
  };
}

export interface RegisterAccountResponse {
  code: number;
  message: string;
  data: {
    user_id: string;
    wallet_id: string;
    user_name: string;
  };
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
