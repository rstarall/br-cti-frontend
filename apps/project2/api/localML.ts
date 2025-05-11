import api from './api';
import {
  ApiResponse,
  UploadDatasetFileResponse,
  CreateModelTaskRequest,
  CreateModelTaskResponse,
  CreateModelUpchainInfoRequest,
  CreateModelUpchainInfoResponse,
  ModelTrainConfig,
  ModelTrainResponse,
  ModelTrainProgressResponse,
  ModelTrainRecordResponse,
  ModelTrainDetailResponse,
  ModelEvaluateImageResponse,
  ModelUpchainConfig,
  ModelUpchainResponse,
  ModelUpchainProgressResponse,
  DatasetDownloadResponse,
  ModelUpchainByModelHashConfig
} from './types/localML';

/**
 * Local ML API functions for machine learning operations
 */
export const localMLApi = {
  /**
   * Get feature list from a file
   * @param fileHash File hash
   * @returns Promise with feature list
   */
  getFeatureList: async (fileHash: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/ml/get_feature_list', {
        file_hash: fileHash
      });
      return response.data;
    } catch (error) {
      console.error('Error in getFeatureList:', error);
      throw error;
    }
  },

  /**
   * Get model record list by hash
   * @param fileHash File hash
   * @returns Promise with model record list
   */
  getModelRecordListByHash: async (fileHash: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/ml/get_model_record_list_by_hash', {
        file_hash: fileHash
      });
      return response.data;
    } catch (error) {
      console.error('Error in getModelRecordListByHash:', error);
      throw error;
    }
  },

  /**
   * Get IPFS address
   * @returns Promise with IPFS address
   */
  getIPFSAddress: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/upchain/getIPFSAddress');
      return response.data;
    } catch (error) {
      console.error('Error in getIPFSAddress:', error);
      throw error;
    }
  },

  /**
   * Check wallet password
   * @param walletId Wallet ID
   * @param password Wallet password
   * @returns Promise with check result
   */
  checkWalletPassword: async (walletId: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/upchain/checkWalletPassword', {
        wallet_id: walletId,
        password: password
      });
      return response.data;
    } catch (error) {
      console.error('Error in checkWalletPassword:', error);
      throw error;
    }
  },
  /**
   * Upload a dataset file for ML processing
   * @param formData FormData containing the file
   * @returns Promise with file upload information
   */
  uploadDatasetFile: async (formData: FormData): Promise<UploadDatasetFileResponse> => {
    try {
      const response = await api.post('/ml/upload_dataset_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in uploadDatasetFile:', error);
      throw error;
    }
  },

  /**
   * Create a model training task
   * @param fileHash File hash of the uploaded dataset
   * @param labelColumn Label column name in the dataset
   * @param ctiId Optional CTI ID reference
   * @returns Promise with task creation information
   */
  createModelTask: async (
    fileHash: string,
    labelColumn: string,
    ctiId?: string
  ): Promise<CreateModelTaskResponse> => {
    try {
      const request: CreateModelTaskRequest = {
        file_hash: fileHash,
        label_column: labelColumn
      };

      if (ctiId) {
        request.cti_id = ctiId;
      }

      const response = await api.post('/ml/create_model_task', request);
      return response.data;
    } catch (error) {
      console.error('Error in createModelTask:', error);
      throw error;
    }
  },

  /**
   * Train a model using local data
   * @param config Model training configuration
   * @returns Promise with training task information
   */
  trainModel: async (config: ModelTrainConfig): Promise<ModelTrainResponse> => {
    try {
      const response = await api.post('/data/train_model', config);
      return response.data;
    } catch (error) {
      console.error('Error in trainModel:', error);
      throw error;
    }
  },

  /**
   * Get model training progress
   * @param taskId Training task ID
   * @returns Promise with training progress
   */
  getModelTrainProgress: async (taskId: string): Promise<ModelTrainProgressResponse> => {
    try {
      const response = await api.post('/data/get_model_train_progress', {
        task_id: taskId
      });
      return response.data;
    } catch (error) {
      console.error('Error in getModelTrainProgress:', error);
      throw error;
    }
  },

  /**
   * Get model progress
   * @param requestId Request ID
   * @returns Promise with training progress
   */
  getModelProgress: async (requestId: string): Promise<ModelTrainProgressResponse> => {
    try {
      const response = await api.post('/ml/get_model_progress', {
        request_id: requestId
      });
      return response.data;
    } catch (error) {
      console.error('Error in getModelProgress:', error);
      throw error;
    }
  },

  /**
   * Get model training record by request ID
   * @param requestId Request ID
   * @returns Promise with training record
   */
  getModelTrainRecordByRequestId: async (requestId: string): Promise<ModelTrainRecordResponse> => {
    try {
      const response = await api.post('/ml/get_model_record_by_request_id', {
        request_id: requestId
      });
      return response.data;
    } catch (error) {
      console.error('Error in getModelTrainRecordByRequestId:', error);
      throw error;
    }
  },

  /**
   * Get training process detail
   * @param requestId Request ID
   * @returns Promise with training process detail
   */
  getTrainProgressDetail: async (requestId: string): Promise<ModelTrainDetailResponse> => {
    try {
      const response = await api.post('/ml/get_train_progress_detail_by_id', {
        request_id: requestId
      });
      return response.data;
    } catch (error) {
      console.error('Error in getTrainProgressDetail:', error);
      throw error;
    }
  },

  /**
   * Get model evaluation images
   * @param requestId Request ID
   * @returns Promise with evaluation images
   */
  getModelEvaluateImage: async (requestId: string): Promise<ModelEvaluateImageResponse> => {
    try {
      const response = await api.post('/ml/get_model_evaluate_image', {
        request_id: requestId
      });
      return response.data;
    } catch (error) {
      console.error('Error in getModelEvaluateImage:', error);
      throw error;
    }
  },

  /**
   * Create model upchain information
   * @param fileHash File hash
   * @param modelHash Model hash
   * @param modelInfoConfig Optional model information configuration
   * @returns Promise with upchain information
   */
  createModelUpchainInfo: async (
    fileHash: string,
    modelHash: string,
    modelInfoConfig?: {
      model_name: string;
      model_description: string;
      model_type: number;
      incentive_mechanism: number;
      point_price: number;
      ref_cti_id?: string;
    }
  ): Promise<CreateModelUpchainInfoResponse> => {
    try {
      const request: CreateModelUpchainInfoRequest = {
        file_hash: fileHash,
        model_hash: modelHash
      };

      if (modelInfoConfig) {
        request.model_info_config = modelInfoConfig;
      }

      const response = await api.post('/ml/create_model_upchain_info', request);
      return response.data;
    } catch (error) {
      console.error('Error in createModelUpchainInfo:', error);
      throw error;
    }
  },

  /**
   * Upload model to blockchain
   * @param config Model upchain configuration
   * @returns Promise with upchain information
   */
  uploadModelToBlockchain: async (config: ModelUpchainConfig): Promise<ModelUpchainResponse> => {
    try {
      const response = await api.post('/data/upload_model_to_blockchain', config);
      return response.data;
    } catch (error) {
      console.error('Error in uploadModelToBlockchain:', error);
      throw error;
    }
  },

  /**
   * Upload model to blockchain by model hash
   * @param config Model upchain configuration
   * @returns Promise with upchain information
   */
  uploadModelToBlockchainByModelHash: async (config: ModelUpchainConfig): Promise<ModelUpchainResponse> => {
    try {
      const response = await api.post('/blockchain/upload_model_to_bc_by_model_hash', config);
      return response.data;
    } catch (error) {
      console.error('Error in uploadModelToBlockchainByModelHash:', error);
      throw error;
    }
  },

  /**
   * Upload model to blockchain by source file hash
   * @param fileHash Source file hash
   * @param upchainAccount Blockchain account
   * @param upchainAccountPassword Blockchain account password
   * @returns Promise with upchain information
   */
  uploadModelToBlockchainBySourceFileHash: async (
    fileHash: string,
    upchainAccount: string,
    upchainAccountPassword: string
  ): Promise<ModelUpchainResponse> => {
    try {
      const response = await api.post('/blockchain/upload_model_to_bc_by_source_file_hash', {
        file_hash: fileHash,
        upchain_account: upchainAccount,
        upchain_account_password: upchainAccountPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error in uploadModelToBlockchainBySourceFileHash:', error);
      throw error;
    }
  },

  /**
   * Upload model to blockchain by model hash with direct parameters
   * @param fileHash Source file hash
   * @param modelHash Model hash
   * @param upchainAccount Blockchain account
   * @param upchainAccountPassword Blockchain account password
   * @returns Promise with upchain information
   */
  uploadModelToBlockchainByModelHashDirect: async (
    fileHash: string,
    modelHash: string,
    upchainAccount: string,
    upchainAccountPassword: string
  ): Promise<ModelUpchainResponse> => {
    try {
      const response = await api.post('/blockchain/upload_model_to_bc_by_model_hash', {
        file_hash: fileHash,
        model_hash: modelHash,
        upchain_account: upchainAccount,
        upchain_account_password: upchainAccountPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error in uploadModelToBlockchainByModelHashDirect:', error);
      throw error;
    }
  },

  /**
   * Get model upchain progress
   * @param fileHash Source file hash
   * @returns Promise with upchain progress
   */
  getModelUpchainProgress: async (fileHash: string): Promise<ModelUpchainProgressResponse> => {
    try {
      const response = await api.post('/blockchain/get_model_upchain_progress', {
        file_hash: fileHash
      });
      return response.data;
    } catch (error) {
      console.error('Error in getModelUpchainProgress:', error);
      throw error;
    }
  },

  /**
   * Download dataset from IPFS
   * @param dataSourceHash Data source hash
   * @param ipfsHash IPFS hash
   * @returns Promise with download information
   */
  downloadDatasetFromIPFS: async (dataSourceHash: string, ipfsHash: string): Promise<DatasetDownloadResponse> => {
    try {
      const response = await api.post('/ml/download_dataset_from_ipfs', {
        data_source_hash: dataSourceHash,
        ipfs_hash: ipfsHash
      });
      return response.data;
    } catch (error) {
      console.error('Error in downloadDatasetFromIPFS:', error);
      throw error;
    }
  }
};
