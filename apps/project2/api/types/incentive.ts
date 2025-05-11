// Incentive API Types

/**
 * Incentive Event Information
 */
export interface IncentiveEventInfo {
  incentive_id: string;           // 激励事件ID
  ref_id: string;                 // 关联ID(情报ID、模型ID)
  incentive_doctype: string;      // 文档类型(cti:情报、model:模型)
  history_value: number;          // 历史价值
  incentive_mechanism: number;    // 激励机制(1:积分激励、2:三方博弈、3:演化博弈)
  incentive_value: number;        // 激励值(积分)
  comment_score?: number;         // 评论分数
  need?: number;                  // 需求量
  total_user_num?: number;        // 总用户数
  create_time: string;            // 创建时间
  doctype: string;                // 文档类型(incentive)
}

/**
 * Incentive Event List Response
 */
export interface IncentiveEventListResponse {
  incentive_infos: IncentiveEventInfo[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Incentive Trend Data Point
 */
export interface IncentiveTrendDataPoint {
  date: string;
  value: number;
}

/**
 * Incentive Mechanism Description
 */
export interface IncentiveMechanismDescription {
  mechanism_id: number;
  mechanism_name: string;
  mechanism_description: string;
}

/**
 * Incentive Mechanism Descriptions
 */
export const INCENTIVE_MECHANISM_DESCRIPTIONS: IncentiveMechanismDescription[] = [
  {
    mechanism_id: 1,
    mechanism_name: '积分激励',
    mechanism_description: '基于区块链智能合约实现积分发放和交易,保证积分流通的公平公正和不可篡改性,为用户提供可信的激励机制。通过区块链技术确保积分交易的透明度和安全性。'
  },
  {
    mechanism_id: 2,
    mechanism_name: '三方博弈',
    mechanism_description: '针对三方:平台方、需求方、CTI提供方,建立三方博弈模型，采用动态定价机制，最优化CTI价格，在保证CTI质量的同时，使得三方都获得良好收益。通过博弈论实现利益均衡。'
  },
  {
    mechanism_id: 3,
    mechanism_name: '演化博弈',
    mechanism_description: '通过演化博弈理论建模用户行为,分析系统长期演化趋势,优化激励机制参数,促进系统向良性方向发展。持续调整激励策略以适应市场变化。'
  }
];
