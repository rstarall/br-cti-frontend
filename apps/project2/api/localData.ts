import api from './api';
import {
  FileUploadResponse,
  ProcessCTIConfig,
  ProcessCTIResponse,
  ProcessCTIProgressResponse,
  StixDataResponse,
  CTIUpchainConfig,
  CTIUpchainResponse,
  CTIUpchainProgressResponse,
  TrafficFeaturesResponse,
  IPFSAddressResponse,
  WalletPasswordResponse,
  DefaultPointsResponse,
  ApiResponse,
  StixRecordsRequest,
  StixRecordsResponse
  // 移除未使用的导入
} from './types/localData';

export interface StixProcessConfig {
  process_id: string;
  file_hash: string;
  stix_type: number;
  stix_traffic_features: string;
  stix_iocs: string[];
  stix_label: string[];
  stix_compress: number;
}

export interface StixProcessProgress {
  progress: number;
  current_step: number;
  total_step: number;
}

export interface StixProcessResponse extends ApiResponse {
  data: {
    current_step: number;
    total_step: number;
  };
}

export interface StixProcessProgressResponse extends ApiResponse {
  data: {
    current_step: number;
    current_task_id: number;
    errors: string[];
    progress: number;
    result: {
      use_time: number;
    };
    total_step: number;
    total_task_list: number[];
  };
  msg: string;
}

/**
 * Local Data API functions for processing CTI and model data
 */
export const localDataApi = {
  /**
   * Upload a file to the server
   * @param formData FormData containing the file and optional task_id
   * @returns Promise with file upload information including file_hash, file_size, and task_record
   */
  uploadFile: async (formData: FormData): Promise<FileUploadResponse> => {
    const response = await api.post('/data/upload_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Query local STIX data by file hash with pagination
   * @param fileHash File hash
   * @param page Page number (optional)
   * @param pageSize Number of records per page (optional)
   * @returns Promise with STIX data
   * @deprecated Use getLocalStixRecords instead for better pagination support
   */
  queryLocalStixData: async (fileHash: string, page?: number, pageSize?: number): Promise<StixDataResponse> => {
    const request: Partial<StixRecordsRequest> = {
      file_hash: fileHash
    };

    if (page !== undefined) request.page = page;
    if (pageSize !== undefined) request.page_size = pageSize;

    const response = await api.post('/data/get_local_stix_records', request);
    return response.data;
  },

  /**
   * Get STIX processing progress
   * @param fileHash File hash
   * @returns Promise with detailed STIX processing progress
   */
  getStixProcessProgress: async (fileHash: string): Promise<StixProcessProgressResponse> => {
    const response = await api.post('/data/get_stix_process_progress', {
      file_hash: fileHash
    });
    return response.data;
  },
  /**
   * Process STIX data to CTI format
   * @param config Process CTI configuration
   * @returns Promise with process information
   */
  processStixToCTI: async (config: ProcessCTIConfig): Promise<ProcessCTIResponse> => {
    const response = await api.post('/data/process_stix_to_cti', config);
    return response.data;
  },

  /**
   * Get CTI processing progress
   * @param fileHash File hash
   * @returns Promise with processing progress
   */
  getCTIProcessProgress: async (fileHash: string): Promise<ProcessCTIProgressResponse> => {
    const response = await api.post('/data/get_cti_process_progress', {
      file_hash: fileHash
    });
    return response.data;
  },

  /**
   * Upload CTI data to blockchain
   * @param config CTI upchain configuration
   * @returns Promise with upchain information
   */
  uploadCTIToBlockchain: async (config: CTIUpchainConfig): Promise<CTIUpchainResponse> => {
    const response = await api.post('/blockchain/upload_cti', config);
    return response.data;
  },



  /**
   * Get CTI upchain progress
   * @param fileHash Source file hash
   * @returns Promise with upchain progress
   */
  getCTIUpchainProgress: async (fileHash: string): Promise<CTIUpchainProgressResponse> => {
    const response = await api.post('/blockchain/get_upload_cti_progress', {
      file_hash: fileHash
    });
    return response.data;
  },

  /**
   * Get traffic feature fields
   * @param fileHash File hash
   * @returns Promise with traffic feature fields (semicolon-separated string)
   */
  getTrafficFeatures: async (fileHash: string): Promise<TrafficFeaturesResponse> => {
    const response = await api.post('/data/get_traffic_data_features', {
      file_hash: fileHash
    });
    return response.data;
  },

  /**
   * Query local STIX records
   * @param fileHash Source file hash
   * @param _page Page number (not used, kept for API compatibility)
   * @param pageSize Number of records per page (set to maximum to get all records)
   * @returns Promise with all STIX records
   */
  getLocalStixRecords: async (fileHash: string, _page?: number, pageSize: number = 1000): Promise<StixRecordsResponse> => {
    const request: StixRecordsRequest = {
      file_hash: fileHash,
      page: 1, // 始终请求第一页
      page_size: pageSize // 使用传入的页面大小，默认为1000
    };
    const response = await api.post('/data/get_local_stix_records', request);

    // 简化返回数据处理
    if (response.data && response.data.code === 200 && !response.data.data) {
      response.data.data = []; // 确保data字段始终是数组
    }

    return response.data;
  },

  /**
   * Get IPFS address
   * @returns Promise with IPFS address
   */
  getIPFSAddress: async (): Promise<IPFSAddressResponse> => {
    const response = await api.post('/upchain/getIPFSAddress');
    return response.data;
  },

  /**
   * Check wallet password
   * @param walletId Wallet ID
   * @param password Wallet password
   * @returns Promise with password check result
   */
  checkWalletPassword: async (walletId: string, password: string): Promise<WalletPasswordResponse> => {
    const response = await api.post('/user/checkWalletPassword', {
      wallet_id: walletId,
      password: password
    });
    return response.data;
  },

  /**
   * Get default points
   * @param config Configuration for points calculation
   * @returns Promise with default points
   */
  getDefaultPoints: async (config: {
    cti_type: number;
    incentive_mechanism: number;
  }): Promise<DefaultPointsResponse> => {
    const response = await api.post('/data/get_default_points', config);
    return response.data;
  },



  /**
   * Process data to STIX format
   * @param config STIX process configuration
   * @returns Promise with STIX processing result
   */
  processDataToStix: async (config: StixProcessConfig): Promise<StixProcessResponse> => {
    const response = await api.post('/data/process_data_to_stix', config);
    return response.data;
  },





  /**
   * Get STIX file content by source file hash and STIX file hash
   * @param sourceFileHash Source file hash
   * @param stixFileHash STIX file hash
   * @returns Promise with STIX file content
   */
  getStixFileContent: async (sourceFileHash: string, stixFileHash: string): Promise<any> => {
    try {
      const response = await api.get(`/data/get_stix_file_content/${sourceFileHash}/${stixFileHash}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching STIX file content:', error);
      throw error;
    }
  }
};


