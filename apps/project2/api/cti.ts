import api from './api';
import { CTIInfo, CTIListResponse, CTIQueryParams, CTIPurchaseResponse, UserOwnedCTIResponse } from './types/cti';

/**
 * CTI (Cyber Threat Intelligence) API functions
 */
export const ctiApi = {
  /**
   * Query CTI data by ID
   * @param ctiId CTI ID
   * @returns Promise with CTI information
   */
  queryCTIDataById: async (ctiId: string): Promise<CTIInfo> => {
    const response = await api.post('/cti/queryCtiInfo', {
      cti_id: ctiId
    });
    if (response.data.result) {
      return JSON.parse(response.data.result);
    }
    throw new Error('Failed to get CTI data');
  },

  /**
   * Query CTI data by creator user ID
   * @param userId User ID
   * @returns Promise with CTI information
   */
  queryCTIDataByUserId: async (userId: string): Promise<CTIInfo[]> => {
    const response = await api.post('/cti/queryCtiInfoByCreatorUserID', {
      user_id: userId
    });
    if (response.data.result) {
      return JSON.parse(response.data.result);
    }
    throw new Error('Failed to get CTI data by user ID');
  },

  /**
   * Query CTI data owned by a user
   * @param userId User ID
   * @returns Promise with owned CTI information
   */
  queryUserOwnedCTIData: async (userId: string): Promise<UserOwnedCTIResponse> => {
    try {
      const response = await api.post('/user/queryUserOwnCTIInfos', {
        user_id: userId
      });
      console.log("response.data:", response.data);

      if (response.data && response.data.result) {
        const result = JSON.parse(response.data.result);
        // 确保返回的对象具有预期的结构
        return {
          cti_infos: result.upload_cti_infos.concat(result.purchase_cti_infos) || [],
          upload_cti_infos: result.upload_cti_infos || [],
          purchase_cti_infos: result.purchase_cti_infos || [],
          total: typeof result.total === 'number' ? result.total : 0
        };
      }
      return {
        cti_infos: [],
        upload_cti_infos: [],
        purchase_cti_infos: [],
        total: 0
      };
    } catch (error) {
      // Log the error for debugging
      console.error('Error in queryUserOwnedCTIData:', error);
      throw error;
    }
  },

  /**
   * Query all CTI data with pagination
   * @param page Page number
   * @param pageSize Page size
   * @returns Promise with paginated CTI data
   */
  queryCTIDataByAll: async (page: number = 1, pageSize: number = 15): Promise<CTIListResponse> => {
    const response = await api.post('/cti/queryAllCtiInfoWithPagination', {
      page,
      page_size: pageSize
    });
    if (response.data.result) {
      return JSON.parse(response.data.result);
    }
    throw new Error('Failed to get CTI data');
  },

  /**
   * Query CTI data by incentive mechanism with pagination
   * @param page Page number
   * @param pageSize Page size
   * @param incentive Incentive mechanism type
   * @returns Promise with paginated CTI data
   */
  queryCTIDataByIncentive: async (page: number = 1, pageSize: number = 15, incentive: number): Promise<CTIListResponse> => {
    const response = await api.post('/cti/queryCtiInfoByIncentiveMechanismWithPagination', {
      page,
      page_size: pageSize,
      incentive_mechanism: incentive
    });
    if (response.data.result) {
      return JSON.parse(response.data.result);
    }
    throw new Error('Failed to get CTI data by incentive');
  },

  /**
   * Query CTI data by type with pagination
   * @param type CTI type
   * @param page Page number
   * @param pageSize Page size
   * @returns Promise with paginated CTI data
   */
  queryCTIDataByType: async (type: number, page: number = 1, pageSize: number = 15): Promise<CTIListResponse> => {
    const response = await api.post('/cti/queryCtiInfoByTypeWithPagination', {
      cti_type: type,
      page,
      page_size: pageSize
    });
    if (response.data.result) {
      return JSON.parse(response.data.result);
    }
    throw new Error('Failed to get CTI data by type');
  },

  /**
   * Query CTI data with various filters
   * @param params Query parameters
   * @returns Promise with paginated CTI data
   */
  queryCTIData: async (params: CTIQueryParams): Promise<CTIListResponse> => {
    const { page = 1, page_size = 15, cti_type, incentive_mechanism, keyword } = params;

    try {
      let response: CTIListResponse;

      if (incentive_mechanism !== undefined) {
        response = await ctiApi.queryCTIDataByIncentive(page, page_size, incentive_mechanism);
      } else if (cti_type !== undefined) {
        response = await ctiApi.queryCTIDataByType(cti_type, page, page_size);
      } else {
        response = await ctiApi.queryCTIDataByAll(page, page_size);
      }

      // If keyword is provided, filter results client-side
      // Note: Ideally this should be done server-side
      if (keyword && response.cti_infos) {
        response.cti_infos = response.cti_infos.filter(item =>
          item.cti_name.includes(keyword) ||
          item.description.includes(keyword) ||
          (item.tags && item.tags.some((tag: string) => tag.includes(keyword)))
        );
        response.total = response.cti_infos.length;
      }

      return response;
    } catch (error) {
      console.error('Error querying CTI data:', error);
      throw error;
    }
  },

  /**
   * Purchase CTI data
   * @param walletId Wallet ID
   * @param password Wallet password
   * @param ctiId CTI ID
   * @returns Promise with purchase information
   */
  purchaseCTI: async (walletId: string, password: string, ctiId: string): Promise<CTIPurchaseResponse> => {
    try {
      const response = await api.post('/user/purchaseCTIFromBlockchain', {
        wallet_id: walletId,
        password,
        cti_id: ctiId
      });

      if (response.data.code === 200) {
        return response.data;
      }

      // 如果API返回了错误信息，抛出具体的错误
      throw new Error(response.data.message || 'Failed to purchase CTI');
    } catch (error) {
      console.error('Error purchasing CTI:', error);

      // 重新抛出错误，让调用者处理
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Network error while purchasing CTI');
      }
    }
  }
};
