// Network API Types

export interface NetworkConfig {
  network_name: string;
  network_id: string;
  network_description: string;
  network_status: string;
  node_count: number;
  block_height: number;
  transaction_count: number;
  peer_count: number;
  endorser?: string;
}

export interface BlockInfo {
  block_height: number;
  block_hash: string;
  previous_hash: string;
  timestamp: string;
  transaction_count: number;
  block_size: number;
  transactions: Transaction[];
  miner?: string;
}

export interface Transaction {
  transaction_id: string;
  transaction_type: string;
  timestamp: string;
  sender: string;
  receiver: string;
  amount: number;
  status: string;
}

export interface BlockchainStats {
  blockHeight: number;
  totalTransactions: number;
  totalUsers: number;
  totalCTI: number;
  totalModels: number;
}

export interface BlockResponse {
  code: number;
  message?: string;
  data: string;
}
