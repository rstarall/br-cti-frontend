import api from './api';
import { UserCTIStatistics, UserDetailInfo, UserStatisticsResponse } from './types/user';

/**
 * User API functions
 */
export const userApi = {
  /**
   * Get user CTI statistics
   * @param userId User ID
   * @returns Promise with user CTI statistics
   */
  getUserCTIStatistics: async (userId: string): Promise<UserCTIStatistics> => {
    const response = await api.post('/user/getUserCTIStatistics', {
      user_id: userId
    });

    if (response.data.code === 200) {
      return JSON.parse(response.data.data);
    }

    throw new Error(response.data.message || 'Failed to get user CTI statistics');
  },

  /**
   * Get user detail information
   * @param userId User ID
   * @returns Promise with user detail information
   */
  getUserDetailInfo: async (userId: string): Promise<UserDetailInfo> => {
    const response = await api.post('/user/queryUserDetailInfo', {
      user_id: userId
    });
    console.log("response.data:", response.data);
    if (response.data.result) {
      return JSON.parse(response.data.result);
    }

    throw new Error(response.data.error || 'Failed to get user detail information');
  },

  /**
   * Get user statistics
   * @param userId User ID
   * @returns Promise with user statistics
   */
  getUserStatistics: async (userId: string): Promise<UserStatisticsResponse> => {
    const response = await api.post('/user/getUserStatistics', {
      user_id: userId
    });

    if (response.data.code === 200) {
      return response.data;
    }

    throw new Error(response.data.message || 'Failed to get user statistics');
  }
};
