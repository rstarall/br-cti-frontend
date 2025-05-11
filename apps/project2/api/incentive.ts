import api from './api';
import { IncentiveEventInfo, IncentiveEventListResponse, IncentiveTrendDataPoint } from './types/incentive';

/**
 * Incentive API functions
 */
export const incentiveApi = {
  /**
   * Query incentive events by reference ID with pagination
   * @param refId Reference ID (CTI ID or Model ID)
   * @param docType Document type (cti or model)
   * @param page Page number
   * @param pageSize Page size
   * @param sort Sort field (default: 'create_time')
   * @returns Promise with paginated incentive event data
   */
  queryIncentiveEventsByRefId: async (
    refId: string,
    docType: 'cti' | 'model' = 'cti',
    page: number = 1,
    pageSize: number = 10,
    sort: string = 'create_time'
  ): Promise<IncentiveEventListResponse> => {
    try {
      const response = await api.post('/incentive/queryDocIncentiveInfoWithPagination', {
        ref_id: refId,
        doc_type: docType,
        page,
        page_size: pageSize,
        sort
      });

      if (response.data && response.data.result) {
        const result = JSON.parse(response.data.result);

        // Handle case where the API returns an array instead of the expected object structure
        if (Array.isArray(result)) {
          return {
            incentive_infos: result,
            total: result.length,
            page,
            page_size: pageSize
          };
        }

        return result;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error in queryIncentiveEventsByRefId:', error);
      // 返回空数据作为备用
      return {
        incentive_infos: [],
        total: 0,
        page,
        page_size: pageSize
      };
    }
  },

  /**
   * Query all incentive events by reference ID
   * @param refId Reference ID (CTI ID or Model ID)
   * @param docType Document type (cti or model)
   * @returns Promise with all incentive event data
   */
  queryAllIncentiveEventsByRefId: async (
    refId: string,
    docType: 'cti' | 'model' = 'cti'
  ): Promise<IncentiveEventListResponse> => {
    return incentiveApi.queryIncentiveEventsByRefId(refId, docType, 1, 1000000);
  },

  /**
   * Process incentive trend data from incentive events
   * @param incentiveEvents Array of incentive events
   * @returns Array of trend data points
   */
  processIncentiveTrendData: (incentiveEvents: IncentiveEventInfo[]): IncentiveTrendDataPoint[] => {
    if (!incentiveEvents || incentiveEvents.length === 0) {
      return [];
    }

    // 按日期排序
    const sortedEvents = [...incentiveEvents].sort((a, b) => {
      return new Date(a.create_time).getTime() - new Date(b.create_time).getTime();
    });

    // 生成趋势数据
    const trendData: IncentiveTrendDataPoint[] = [];

    // 使用实际的历史价值和当前价值
    sortedEvents.forEach(event => {
      trendData.push({
        date: event.create_time,
        value: event.history_value
      });
    });

    return trendData;
  }
};
