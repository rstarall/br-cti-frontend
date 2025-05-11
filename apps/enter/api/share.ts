// 定义CTI相关接口
interface CTIInfo {
  cti_id: string;
  cti_hash: string;
  cti_name: string;
  cti_type: number;
  cti_traffic_type: number;
  open_source: number;
  creator_user_id: string;
  tags: string[];
  iocs: string[];
  stix_data: string;
  stix_ipfs_hash: string;
  statistic_info: string;
  description: string;
  data_size: number;
  data_source_hash: string;
  data_source_ipfs_hash: string;
  need: number;
  incentive_mechanism: number;
  value: number;
  compre_value: number;
  create_time: string;
  doctype: string;
}

interface CTIListResponse {
  cti_infos: CTIInfo[];
  total: number;
  page: number;
  page_size: number;
}

// 删除未使用的CTIQueryParams接口

// 定义激励机制相关接口
interface IncentiveEventInfo {
  incentive_id: string;
  ref_id: string;
  incentive_doctype: string;
  history_value: number;
  incentive_mechanism: number;
  incentive_value: number;
  comment_score?: number;
  need?: number;
  total_user_num?: number;
  create_time: string;
  doctype: string;
}

interface IncentiveEventListResponse {
  incentive_infos: IncentiveEventInfo[];
  total: number;
  page: number;
  page_size: number;
}

// 定义威胁信息接口
interface ThreatInfo {
  threat_id: string;       // 威胁ID
  threat_name: string;     // 威胁名称
  threat_type: string;     // 威胁类型
  source_ip: string;       // 源IP
  target_ip: string;       // 目标IP
  severity: 'high' | 'medium' | 'low';  // 严重程度
  time: string;            // 时间
  status: 'active' | 'mitigated' | 'resolved';  // 状态
  description: string;     // 描述
}

// 定义威胁列表响应接口
interface ThreatListResponse {
  threat_infos: ThreatInfo[];
  total: number;
  page: number;
  page_size: number;
}

// 删除未使用的ThreatQueryParams接口

/**
 * Share API functions for intelligence sharing, incentive mechanism, and threat situation
 */
export const shareApi = {
  /**
   * Query CTI data with pagination
   * @param page Page number
   * @param pageSize Page size
   * @param params Additional query parameters
   * @returns Promise with paginated CTI data
   */
  queryCTIData: async (
    page: number = 1,
    pageSize: number = 10
    // 移除未使用的params参数
  ): Promise<CTIListResponse> => {
    try {
      // This is a proxy to the project2 API
      // In a real implementation, this would call the actual backend API
      // For now, we'll return mock data

      // Mock response
      const mockResponse: CTIListResponse = {
        cti_infos: [
          {
            cti_id: 'CTI-001',
            cti_hash: 'hash1',
            cti_name: 'APT41组织攻击活动情报',
            cti_type: 1,
            cti_traffic_type: 0,
            open_source: 1,
            creator_user_id: 'user123',
            tags: ['APT41', '金融行业', '恶意软件'],
            iocs: ['192.168.1.1', 'malware.exe'],
            stix_data: '{}',
            stix_ipfs_hash: 'ipfs1',
            statistic_info: '{}',
            description: 'APT41组织针对金融行业的攻击活动分析',
            data_size: 1024,
            data_source_hash: 'source_hash1',
            data_source_ipfs_hash: 'ipfs_source1',
            need: 10,
            incentive_mechanism: 1,
            value: 120,
            compre_value: 150,
            create_time: '2023-11-15',
            doctype: 'cti'
          },
          {
            cti_id: 'CTI-002',
            cti_hash: 'hash2',
            cti_name: 'BlackCat勒索软件分析',
            cti_type: 2,
            cti_traffic_type: 0,
            open_source: 1,
            creator_user_id: 'user456',
            tags: ['勒索软件', 'BlackCat', '加密'],
            iocs: ['192.168.1.2', 'blackcat.exe'],
            stix_data: '{}',
            stix_ipfs_hash: 'ipfs2',
            statistic_info: '{}',
            description: 'BlackCat勒索软件的技术分析和防御建议',
            data_size: 2048,
            data_source_hash: 'source_hash2',
            data_source_ipfs_hash: 'ipfs_source2',
            need: 15,
            incentive_mechanism: 2,
            value: 150,
            compre_value: 180,
            create_time: '2023-11-10',
            doctype: 'cti'
          }
        ],
        total: 2,
        page: page,
        page_size: pageSize
      };

      return mockResponse;
    } catch (error) {
      console.error('Error in queryCTIData:', error);
      throw error;
    }
  },

  /**
   * Query incentive events with pagination
   * @param page Page number
   * @param pageSize Page size
   * @returns Promise with paginated incentive event data
   */
  queryIncentiveEvents: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<IncentiveEventListResponse> => {
    try {
      // Mock response
      const mockResponse: IncentiveEventListResponse = {
        incentive_infos: [
          {
            incentive_id: 'INC-001',
            ref_id: 'CTI-001',
            incentive_doctype: 'cti',
            history_value: 120,
            incentive_mechanism: 1,
            incentive_value: 50,
            comment_score: 4.5,
            need: 10,
            total_user_num: 100,
            create_time: '2023-11-15',
            doctype: 'incentive'
          },
          {
            incentive_id: 'INC-002',
            ref_id: 'CTI-002',
            incentive_doctype: 'cti',
            history_value: 150,
            incentive_mechanism: 2,
            incentive_value: 75,
            comment_score: 4.8,
            need: 15,
            total_user_num: 120,
            create_time: '2023-11-10',
            doctype: 'incentive'
          }
        ],
        total: 2,
        page: page,
        page_size: pageSize
      };

      return mockResponse;
    } catch (error) {
      console.error('Error in queryIncentiveEvents:', error);
      throw error;
    }
  },

  /**
   * Query threat data with pagination
   * @param page Page number
   * @param pageSize Page size
   * @param params Additional query parameters
   * @returns Promise with paginated threat data
   */
  queryThreatData: async (
    page: number = 1,
    pageSize: number = 10
    // 移除未使用的params参数
  ): Promise<ThreatListResponse> => {
    try {
      // Mock response
      const mockResponse: ThreatListResponse = {
        threat_infos: [
          {
            threat_id: 'T-001',
            threat_name: 'DDoS攻击',
            threat_type: 'DDoS',
            source_ip: '192.168.1.1',
            target_ip: '10.0.0.1',
            severity: 'high',
            time: '2023-11-15 08:30:25',
            status: 'active',
            description: '大规模DDoS攻击，目标为金融机构服务器'
          },
          {
            threat_id: 'T-002',
            threat_name: 'SQL注入尝试',
            threat_type: '注入攻击',
            source_ip: '192.168.1.2',
            target_ip: '10.0.0.2',
            severity: 'medium',
            time: '2023-11-15 09:15:10',
            status: 'mitigated',
            description: '针对Web应用的SQL注入攻击尝试'
          }
        ],
        total: 2,
        page: page,
        page_size: pageSize
      };

      return mockResponse;
    } catch (error) {
      console.error('Error in queryThreatData:', error);
      throw error;
    }
  }
};
