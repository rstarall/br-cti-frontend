// 区块链浏览器API类型

/**
 * 区块链链信息查询响应
 */
export interface ChainInfoResponse {
  code: number;
  data: string; // 包含BCI、Endorser和Status的JSON字符串
  message?: string;
  error?: string;
}

/**
 * 从响应中解析的链信息
 */
export interface ChainInfo {
  BCI: {
    height: number;
    currentBlockHash: string;
    previousBlockHash: string;
  };
  Endorser: string;
  Status: number;
}

/**
 * 区块链区块信息查询响应
 */
export interface BlockInfoResponse {
  code: number;
  data: string; // 包含区块数据的JSON字符串
  message?: string;
  error?: string;
}

/**
 * 从响应中解析的区块信息
 * 注意：这个结构可能会根据实际返回的数据有所不同
 */
export interface BlockInfo {
  data: {
    data: Array<{
      payload?: {
        data?: {
          actions?: Array<any>;
        };
        header?: {
          channel_header?: {
            channel_id?: string;
            timestamp?: string;
            tx_id?: string;
            type?: number;
            version?: number;
          };
          signature_header?: {
            creator?: {
              id_bytes?: string;
              mspid?: string;
            };
            nonce?: string;
          };
        };
      };
      signature?: string;
    }>;
    header: {
      data_hash: string;
      number: string;
      previous_hash: string;
    };
    metadata?: {
      metadata?: string[];
    };
  };
}
