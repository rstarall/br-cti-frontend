import api from './api';
import {
  SystemOverviewResponse,
  SystemOverview,
  CTISummaryRequest,
  CTISummaryResponse,
  CTISummaryInfo,
  UpchainTrendRequest,
  UpchainTrendResponse,
  UpchainTrend,
  AttackTypeRankingResponse,
  AttackTypeRanking,
  DataStatisticsResponse,
  DataStatistics,
  IOCsDistributionResponse,
  IOCsDistribution
} from './types/dataStats';

/**
 * Data Statistics API functions
 */
export const dataStatsApi = {
  /**
   * Get system overview data
   * @returns Promise with system overview information
   */
  getSystemOverview: async (): Promise<SystemOverview> => {
    try {
      const response = await api.post<SystemOverviewResponse>('/dataStat/getSystemOverview');
      
      if (response.data && response.data.result) {
        return response.data.result;
      }
      
      throw new Error('Failed to get system overview data');
    } catch (error) {
      console.error('Error in getSystemOverview:', error);
      throw error;
    }
  },

  /**
   * Query CTI summary information
   * @param limit Maximum number of CTI records to return
   * @returns Promise with CTI summary information
   */
  queryCTISummaryInfo: async (limit: number = 10): Promise<CTISummaryInfo[]> => {
    try {
      const request: CTISummaryRequest = { limit };
      const response = await api.post<CTISummaryResponse>('/dataStat/queryCTISummaryInfo', request);
      
      if (response.data && response.data.result) {
        // Parse the JSON string in the result field
        return JSON.parse(response.data.result);
      }
      
      throw new Error('Failed to get CTI summary information');
    } catch (error) {
      console.error('Error in queryCTISummaryInfo:', error);
      throw error;
    }
  },

  /**
   * Get upchain trend data
   * @param timeRange Time range for the trend data (e.g., "last_30_days")
   * @returns Promise with upchain trend information
   */
  getUpchainTrend: async (timeRange: string = "last_30_days"): Promise<UpchainTrend> => {
    try {
      const request: UpchainTrendRequest = { time_range: timeRange };
      const response = await api.post<UpchainTrendResponse>('/dataStat/getUpchainTrend', request);
      
      if (response.data && response.data.result) {
        // Parse the JSON string in the result field
        return JSON.parse(response.data.result);
      }
      
      throw new Error('Failed to get upchain trend data');
    } catch (error) {
      console.error('Error in getUpchainTrend:', error);
      throw error;
    }
  },

  /**
   * Get attack type ranking
   * @returns Promise with attack type ranking information
   */
  getAttackTypeRanking: async (): Promise<AttackTypeRanking> => {
    try {
      const response = await api.post<AttackTypeRankingResponse>('/dataStat/getAttackTypeRanking', {});
      
      if (response.data && response.data.result) {
        // Parse the JSON string in the result field
        return JSON.parse(response.data.result);
      }
      
      throw new Error('Failed to get attack type ranking');
    } catch (error) {
      console.error('Error in getAttackTypeRanking:', error);
      throw error;
    }
  },

  /**
   * Get data statistics information
   * @returns Promise with data statistics information
   */
  getDataStatistics: async (): Promise<DataStatistics> => {
    try {
      const response = await api.post<DataStatisticsResponse>('/dataStat/getDataStatistics');
      
      if (response.data && response.data.result) {
        // Parse the JSON string in the result field
        return JSON.parse(response.data.result);
      }
      
      throw new Error('Failed to get data statistics information');
    } catch (error) {
      console.error('Error in getDataStatistics:', error);
      throw error;
    }
  },

  /**
   * Get IOCs distribution information
   * @returns Promise with IOCs distribution information
   */
  getIOCsDistribution: async (): Promise<IOCsDistribution> => {
    try {
      const response = await api.post<IOCsDistributionResponse>('/dataStat/getIOCsDistribution');
      
      if (response.data && response.data.result) {
        // Parse the JSON string in the result field
        return JSON.parse(response.data.result);
      }
      
      throw new Error('Failed to get IOCs distribution information');
    } catch (error) {
      console.error('Error in getIOCsDistribution:', error);
      throw error;
    }
  }
};
