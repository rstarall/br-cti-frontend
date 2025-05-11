// Local Data API Types

export interface FileUploadResponse {
  code: number;
  data: {
    file_hash: string;
    file_size: number;
    task_record: {
      source_file_hash: string;
      step_status: Array<{
        status: string;
        step: number;
        total_num: number;
      }>;
      task_id: string;
      timestamp: number;
    };
  };
  msg: string;
  error?: string;
}

export interface ProcessCTIConfig {
  process_id: string;
  file_hash: string;
  cti_type: number;
  open_source: string;
  cti_name: string;
  cti_description: string;
  incentive_mechanism: number;
  default_value: number;
}

export interface ProcessCTIResponse {
  code: number;
  message: string;
  data: {
    current_step: number;
    total_step: number;
  };
}

export interface ProcessCTIProgressResponse {
  code: number;
  message: string;
  data: {
    progress: number;
    current_step: number;
    total_step: number;
  };
}

export interface StixDataResponse {
  code: number;
  message: string;
  data: {
    file_hash: string;
    features: string;
    data_count: number;
    data_sample: any[];
  };
}

export interface CTIUpchainConfig {
  file_hash: string;
  ipfs_address: string;
  upchain_account: string;
  upchain_account_password: string;
}

export interface CTIUpchainResponse {
  code: number;
  message?: string;
  msg?: string;
  error?: string;
  data: {
    cti_id?: string;
    ipfs_hash?: string;
    transaction_id?: string;
    current_step?: number;
    total_step?: number;
  };
}



export interface TrafficFeaturesResponse {
  code: number;
  data: string; // Semicolon-separated feature names
  msg: string;
  error?: string;
}

export interface IPFSAddressResponse {
  code: number;
  data: {
    ipfs_address: string;
  };
  error?: string;
}

export interface WalletPasswordResponse {
  code: number;
  data: boolean;
  error?: string;
}

export interface DefaultPointsResponse {
  code: number;
  data: {
    points: number;
  };
  error?: string;
}

export interface StixRecord {
  create_time: string;
  ioc_ips_map: Record<string, any>;
  onchain: boolean;
  source_file_hash: string;
  stix_file_hash: string;
  stix_file_path: string;
  stix_file_size: number;
  stix_iocs: string[];
  stix_tags: string[];
  stix_type: number;
  stix_type_name: string;
}

export interface StixRecordsRequest {
  file_hash: string;
  page: string | number;
  page_size: string | number;
}

export interface StixRecordsResponse {
  code: number;
  data: StixRecord[];
  msg?: string;
  error?: string;
  total_count?: number;
  page?: number;
  page_size?: number;
}

export interface CTIUpchainProgressResponse {
  code: number;
  msg: string;
  data: {
    progress: number;
    current_step: number;
    total_step: number;
  };
  error?: string;
}



export interface ApiResponse {
  code: number;
  data: any;
  msg?: string;
  error?: string;
}
