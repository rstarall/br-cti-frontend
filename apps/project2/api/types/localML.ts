// Local ML API Types

/**
 * Response for uploading a dataset file
 */
export interface UploadDatasetFileResponse {
  code: number;
  msg: string;
  data: {
    file_hash: string;
    file_size: number;
  };
  error?: string;
}

/**
 * Request for creating a model training task
 */
export interface CreateModelTaskRequest {
  file_hash: string;
  label_column: string;
  cti_id?: string;
}

/**
 * Response for creating a model training task
 */
export interface CreateModelTaskResponse {
  code: number;
  msg: string;
  data: {
    current_step: string;
    total_step: number;
    request_id: string;
  };
  error?: string;
}

/**
 * Model training configuration
 */
export interface ModelTrainConfig {
  file_hash: string;
  model_type: number;
  model_name: string;
  model_description: string;
  train_params: {
    epochs: number;
    batch_size: number;
    learning_rate: number;
    [key: string]: any;
  };
}

/**
 * Model training response
 */
export interface ModelTrainResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    model_type: number;
    status: string;
  };
}

/**
 * Model training progress response
 */
export interface ModelTrainProgressResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    request_id?: string;
    progress: number;
    current_epoch?: number;
    total_epochs?: number;
    stage?: string;
    message?: string;
    error?: string;
    metrics: {
      accuracy?: number;
      loss?: number;
      precision?: number;
      recall?: number;
      f1_score?: number;
      [key: string]: any;
    };
    status: string;
    model_hash?: string;
    source_file_hash?: string;
    results?: any;
  };
}

/**
 * Model training record response
 */
export interface ModelTrainRecordResponse {
  code: number;
  message: string;
  data: {
    request_id: string;
    file_hash?: string;
    source_file_hash?: string;
    model_hash: string;
    model_type?: number;
    model_name?: string;
    model_description?: string;
    model_info?: {
      model_hash: string;
      model_name?: string;
      model_type?: number;
      model_algorithm?: string;
      model_framework?: string;
      model_open_source?: number;
      features?: string[];
      model_data_type?: number;
      model_size?: number;
      test_size?: string | number;
      training_time?: string | number;
      feature_count?: number;
      rows_count?: number;
      incentive_mechanism?: number;
      evaluation_results?: {
        accuracy?: number;
        precision?: number;
        recall?: number;
        f1_score?: number;
        visualization_path?: string;
        [key: string]: any;
      };
    };
    train_params?: {
      epochs: number;
      batch_size: number;
      learning_rate: number;
      [key: string]: any;
    };
    metrics?: {
      accuracy?: number;
      loss?: number;
      precision?: number;
      recall?: number;
      f1_score?: number;
      [key: string]: any;
    };
    status: string;
    create_time?: string;
    created_time?: string;
    update_time?: string;
    onchain?: boolean;
  };
}

/**
 * Model training detail response
 */
export interface ModelTrainDetailResponse {
  code: number;
  message: string;
  data: {
    request_id: string;
    progress_history: {
      epoch: number;
      metrics: {
        accuracy?: number;
        loss?: number;
        precision?: number;
        recall?: number;
        f1_score?: number;
        [key: string]: any;
      };
      timestamp: string;
    }[];
  };
}

/**
 * Model evaluation image response
 */
export interface ModelEvaluateImageResponse {
  code: number;
  msg: string;
  data: {
    image_base64: string; // Base64 encoded image
    image_type: string;
  };
}

/**
 * Model upchain information configuration
 */
export interface ModelUpchainInfoConfig {
  model_name: string;
  model_description: string;
  model_type: number;
  incentive_mechanism: number;
  point_price: number;
  ref_cti_id?: string;
}

/**
 * Request for creating model upchain information
 */
export interface CreateModelUpchainInfoRequest {
  file_hash: string;
  model_hash: string;
  model_info_config?: ModelUpchainInfoConfig;
}

/**
 * Response for creating model upchain information
 */
export interface CreateModelUpchainInfoResponse {
  code: number;
  msg: string;
  data: {
    current_step: string;
    total_step: number;
    request_id: string;
  };
  error?: string;
}

/**
 * Model upchain configuration
 */
export interface ModelUpchainConfig {
  task_id: string;
  wallet_id: string;
  password: string;
  model_name: string;
  model_description: string;
  model_type: number;
  incentive_mechanism: number;
  point_price: number;
  ref_cti_id?: string;
}

/**
 * Model upchain response
 */
export interface ModelUpchainResponse {
  code: number;
  message: string;
  data: {
    model_id: string;
    ipfs_hash: string;
    transaction_id: string;
  };
}

/**
 * Model upchain progress response
 */
export interface ModelUpchainProgressResponse {
  code: number;
  msg: string;
  data: {
    progress: number;
    current_step: number;
    total_step: number;
  };
  error?: string;
}

/**
 * Model upchain by source file hash configuration
 */
export interface ModelUpchainBySourceFileHashConfig {
  file_hash: string;
  upchain_account: string;
  upchain_account_password: string;
}

/**
 * Model upchain by model hash configuration
 */
export interface ModelUpchainByModelHashConfig {
  file_hash: string;
  model_hash: string;
  upchain_account: string;
  upchain_account_password: string;
}

/**
 * Dataset download response
 */
export interface DatasetDownloadResponse {
  code: number;
  message: string;
  data: {
    file_path: string;
    file_size: number;
    file_hash: string;
  };
}

/**
 * Error response for ML API
 */
export interface MLErrorResponse {
  code: number;
  error: string;
  data: null;
}

/**
 * Generic API response
 */
export interface ApiResponse {
  code: number;
  msg?: string;
  data?: any;
  error?: string;
}

