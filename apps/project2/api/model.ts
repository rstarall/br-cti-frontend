import api from './api';
import { ModelInfo, ModelListResponse, ModelQueryParams, ModelPurchaseResponse } from './types/model';

/**
 * Model API functions
 */
export const modelApi = {
  /**
   * Query model data by ID
   * @param modelId Model ID
   * @returns Promise with model information
   */
  queryModelDataById: async (modelId: string): Promise<ModelInfo> => {
    try {
      const response = await api.post('/model/queryModelInfo', {
        model_id: modelId
      });
      if (response.data.result) {
        return JSON.parse(response.data.result);
      }
      throw new Error('Failed to get model detail data');
    } catch (error) {
      console.error('Error in queryModelDataById:', error);
      throw error;
    }
  },

  /**
   * Query all models with pagination
   * @param page Page number
   * @param pageSize Page size
   * @returns Promise with paginated model data
   */
  queryModelDataByAll: async (page: number = 1, pageSize: number = 15): Promise<ModelListResponse> => {
    try {
      const response = await api.post('/model/queryModelInfoWithPagination', {
        page,
        page_size: pageSize
      });
      if (response.data.result) {
        return JSON.parse(response.data.result);
      }
      throw new Error('Failed to get model data');
    } catch (error) {
      console.error('Error in queryModelDataByAll:', error);
      throw error;
    }
  },

  /**
   * Query models by type with pagination
   * @param type Model type
   * @param page Page number
   * @param pageSize Page size
   * @returns Promise with paginated model data
   */
  queryModelDataByType: async (type: number, page: number = 1, pageSize: number = 15): Promise<ModelListResponse> => {
    try {
      const response = await api.post('/model/queryModelsByTypeWithPagination', {
        model_type: type,
        page,
        page_size: pageSize
      });
      if (response.data.result) {
        return JSON.parse(response.data.result);
      }
      throw new Error('Failed to get model data by type');
    } catch (error) {
      console.error('Error in queryModelDataByType:', error);
      throw error;
    }
  },

  /**
   * Query models by incentive mechanism with pagination
   * @param incentiveMechanism Incentive mechanism type
   * @param page Page number
   * @param pageSize Page size
   * @returns Promise with paginated model data
   */
  queryModelDataByIncentive: async (incentiveMechanism: number, page: number = 1, pageSize: number = 15): Promise<ModelListResponse> => {
    try {
      const response = await api.post('/model/queryModelsByIncentiveMechanismWithPagination', {
        incentive_mechanism: incentiveMechanism,
        page,
        page_size: pageSize
      });
      if (response.data.result) {
        return JSON.parse(response.data.result);
      }
      throw new Error('Failed to get model data by incentive mechanism');
    } catch (error) {
      console.error('Error in queryModelDataByIncentive:', error);
      throw error;
    }
  },

  /**
   * Query models with various filters
   * @param params Query parameters
   * @returns Promise with paginated model data
   */
  queryModelData: async (params: ModelQueryParams): Promise<ModelListResponse> => {
    const { page = 1, page_size = 15, model_type, incentive_mechanism, keyword } = params;

    try {
      let response: ModelListResponse;

      if (incentive_mechanism !== undefined) {
        response = await modelApi.queryModelDataByIncentive(incentive_mechanism, page, page_size);
      } else if (model_type !== undefined) {
        response = await modelApi.queryModelDataByType(model_type, page, page_size);
      } else {
        response = await modelApi.queryModelDataByAll(page, page_size);
      }

      // Apply client-side filtering for keyword if provided
      // Note: Ideally this should be done server-side
      if (keyword && response.model_infos) {
        response.model_infos = response.model_infos.filter(item =>
          item.model_name.includes(keyword) ||
          (item.model_description && item.model_description.includes(keyword)) ||
          (item.model_tags && item.model_tags.some((tag: string) => tag.includes(keyword)))
        );
        response.total = response.model_infos.length;
      }

      return response;
    } catch (error) {
      console.error('Error querying model data:', error);
      throw error;
    }
  },

  /**
   * Query models by referenced CTI ID
   * @param ctiId CTI ID
   * @returns Promise with model information
   */
  queryModelsByRefCTIId: async (ctiId: string): Promise<ModelInfo[]> => {
    const response = await api.post('/model/queryModelsByRefCTIId', {
      cti_id: ctiId
    });
    if (response.data.result) {
      return JSON.parse(response.data.result);
    }
    throw new Error('Failed to get models by CTI ID');
  },

  /**
   * Query models by creator user ID
   * @param userId User ID
   * @returns Promise with model information
   */
  queryModelsByCreatorId: async (userId: string): Promise<ModelInfo[]> => {
    try {
      const response = await api.post('/model/queryModelInfoByCreatorUserID', {
        user_id: userId
      });
      if (response.data.result) {
        return JSON.parse(response.data.result);
      }
      throw new Error('Failed to get models by creator');
    } catch (error) {
      console.error('Error in queryModelsByCreatorId:', error);
      throw error;
    }
  },

  /**
   * Query models owned by user
   * @param userId User ID
   * @returns Promise with model information
   */
  queryUserOwnedModelData: async (userId: string): Promise<ModelListResponse> => {
    try {
      const response = await api.post('/model/queryUserOwnedModelData', {
        user_id: userId
      });
      if (response.data.result) {
        return JSON.parse(response.data.result);
      }
      // 如果没有数据，返回空数组
      return {
        model_infos: [],
        total: 0,
        page: 1,
        page_size: 10
      };
    } catch (error) {
      console.error('Error in queryUserOwnedModelData:', error);
      // 如果出错，返回空数组
      return {
        model_infos: [],
        total: 0,
        page: 1,
        page_size: 10
      };
    }
  },

  /**
   * Purchase a model
   * @param walletId Wallet ID
   * @param password Wallet password
   * @param modelId Model ID
   * @returns Promise with purchase information
   */
  purchaseModel: async (walletId: string, password: string, modelId: string): Promise<ModelPurchaseResponse> => {
    try {
      const response = await api.post('/user/purchaseModelFromBlockchain', {
        wallet_id: walletId,
        password,
        model_id: modelId
      });

      if (response.data.code === 200) {
        return response.data;
      }

      throw new Error(response.data.message || 'Failed to purchase model');
    } catch (error) {
      console.error('Error in purchaseModel:', error);
      throw error;
    }
  }
};
