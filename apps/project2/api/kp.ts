import api from './api';
import {
  IOCGeoDistributionResponse,
  IOCGeoDistribution,
  IOCTypeDistributionResponse,
  IOCTypeDistribution,
  AttackTypeStatisticsResponse,
  AttackTypeStatisticsEntry,
  AttackIOCInfoResponse,
  AttackIOCInfo,
  TrafficTypeRatioResponse,
  TrafficTypeRatio,
  TrafficTimeSeriesResponse,
  TrafficTimeSeriesEntry
} from './types/kp';

/**
 * Knowledge Plane API functions
 */
export const kpApi = {
  /**
   * Query IOC geographical distribution
   * @returns Promise with IOC geographical distribution information
   */
  queryIOCGeoDistribution: async (): Promise<IOCGeoDistribution> => {
    try {
      const response = await api.get<IOCGeoDistributionResponse>('/kp/queryIOCGeoDistribution');

      if (response.data && response.data.result) {
        return response.data.result;
      }

      throw new Error('Failed to get IOC geographical distribution');
    } catch (error) {
      console.error('Error in queryIOCGeoDistribution:', error);
      throw error;
    }
  },

  /**
   * Query IOC type distribution
   * @returns Promise with IOC type distribution information
   */
  queryIOCTypeDistribution: async (): Promise<IOCTypeDistribution> => {
    try {
      const response = await api.get<IOCTypeDistributionResponse>('/kp/queryIOCTypeDistribution');

      if (response.data && response.data.result) {
        return response.data.result;
      }

      throw new Error('Failed to get IOC type distribution');
    } catch (error) {
      console.error('Error in queryIOCTypeDistribution:', error);
      throw error;
    }
  },

  /**
   * Query attack type statistics
   * @returns Promise with attack type statistics information
   */
  queryAttackTypeStatistics: async (): Promise<AttackTypeStatisticsEntry[]> => {
    try {
      const response = await api.get<AttackTypeStatisticsResponse>('/kp/queryAttackTypeStatistics');

      if (response.data && response.data.result) {
        return response.data.result;
      }

      throw new Error('Failed to get attack type statistics');
    } catch (error) {
      console.error('Error in queryAttackTypeStatistics:', error);
      throw error;
    }
  },

  /**
   * Query attack IOC information
   * @returns Promise with attack IOC information
   */
  queryAttackIOCInfo: async (): Promise<AttackIOCInfo[]> => {
    try {
      const response = await api.get<AttackIOCInfoResponse>('/kp/queryAttackIOCInfo');

      if (response.data && response.data.result) {
        return response.data.result;
      }

      throw new Error('Failed to get attack IOC information');
    } catch (error) {
      console.error('Error in queryAttackIOCInfo:', error);
      throw error;
    }
  },

  /**
   * Query traffic type ratio information
   * @returns Promise with traffic type ratio information
   */
  queryTrafficTypeRatio: async (): Promise<TrafficTypeRatio> => {
    try {
      const response = await api.get<TrafficTypeRatioResponse>('/kp/queryTrafficTypeRatio');

      if (response.data && response.data.result) {
        return response.data.result;
      }

      throw new Error('Failed to get traffic type ratio information');
    } catch (error) {
      console.error('Error in queryTrafficTypeRatio:', error);
      throw error;
    }
  },

  /**
   * Query traffic time series information
   * @returns Promise with traffic time series information
   */
  queryTrafficTimeSeries: async (): Promise<TrafficTimeSeriesEntry[]> => {
    try {
      const response = await api.get<TrafficTimeSeriesResponse>('/kp/queryTrafficTimeSeries');

      if (response.data && response.data.result) {
        return response.data.result;
      }

      throw new Error('Failed to get traffic time series information');
    } catch (error) {
      console.error('Error in queryTrafficTimeSeries:', error);
      throw error;
    }
  }
};