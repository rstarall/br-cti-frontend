import { create } from 'zustand';
import { bcBrowserApi } from '../api/bcBrowser';
import { networkApi } from '../api/network';
import { dataStatsApi } from '../api/dataStats';
import { ChainInfo } from '../api/types/bcBrowser';

// UI显示用的区块信息
interface BlockInfo {
  height: number;
  hash: string;
  timestamp: string;
  transactions: number;
  size: number;
  miner: string;
}

interface Transaction {
  txid: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  status: string;
  type: string;
  // CTI特定字段
  cti_hash?: string;
  cti_type?: number;
  tags?: string[];
}

interface BlockchainStats {
  blockHeight: number;
  totalTransactions: number;
  totalUsers: number;
  totalCTI: number;
  totalModels: number;
}

interface BlockchainState {
  // 区块数据
  latestBlocks: BlockInfo[];
  latestTransactions: Transaction[];

  // 详情数据
  currentBlock: BlockInfo | null;
  currentTransaction: Transaction | null;

  // 统计数据
  stats: BlockchainStats;

  // 状态
  isLoading: boolean;
  error: string | null;

  // 操作
  fetchLatestBlocks: () => Promise<void>;
  fetchLatestTransactions: () => Promise<void>;
  fetchBlockDetail: (height: number) => Promise<void>;
  fetchTransactionDetail: (txid: string) => Promise<void>;
  fetchBlockchainStats: () => Promise<void>;
  searchBlockchain: (query: string) => Promise<any>;
  reset: () => void;
}

export const useBlockchainStore = create<BlockchainState>((set) => ({
  // 区块数据
  latestBlocks: [],
  latestTransactions: [],

  // 详情数据
  currentBlock: null,
  currentTransaction: null,

  // 统计数据
  stats: {
    blockHeight: 0,
    totalTransactions: 0,
    totalUsers: 0,
    totalCTI: 0,
    totalModels: 0
  },

  // 状态
  isLoading: false,
  error: null,

  // 操作
  fetchLatestBlocks: async () => {
    set({ isLoading: true, error: null });

    try {
      // 首先尝试使用 networkApi.getLatestBlocks 方法获取最新区块
      try {
        console.log('尝试使用 networkApi.getLatestBlocks 获取最新区块...');
        const networkBlocks = await networkApi.getLatestBlocks(10);

        if (networkBlocks && networkBlocks.length > 0) {
          // 将 networkApi 返回的区块格式转换为我们需要的格式
          const blocks: BlockInfo[] = networkBlocks.map(block => ({
            height: block.block_height,
            hash: block.block_hash,
            timestamp: block.timestamp,
            transactions: block.transaction_count || 0,
            size: block.block_size || 0,
            miner: block.miner || 'node1'
          }));

          console.log(`成功通过 networkApi 获取了 ${blocks.length} 个区块`);
          set({ latestBlocks: blocks, isLoading: false });
          return;
        }
      } catch (networkError) {
        console.error('使用 networkApi 获取最新区块失败:', networkError);
        // 继续尝试使用 bcBrowserApi 方法
      }

      // 如果 networkApi 方法失败，尝试使用 bcBrowserApi 方法
      console.log('尝试使用 bcBrowserApi 方法获取最新区块...');

      // 获取链信息以获取最新区块高度
      const chainInfo = await bcBrowserApi.queryChainInfo();

      if (!chainInfo || !chainInfo.BCI || typeof chainInfo.BCI.height !== 'number') {
        throw new Error('获取区块链高度信息失败');
      }

      const startHeight = chainInfo.BCI.height;
      console.log('当前区块链高度:', startHeight);

      // 确保我们不会尝试获取负数区块
      const blockCount = Math.min(10, startHeight);
      const blockIds = Array.from({ length: blockCount }, (_, i) => (startHeight - i).toString());

      // 获取每个区块的详细信息
      const blocks: BlockInfo[] = [];

      for (const blockId of blockIds) {
        try {
          console.log(`正在获取区块 ${blockId} 信息...`);
          const blockData = await bcBrowserApi.queryBlockInfo(blockId);

          // 支持两种可能的数据结构
          // 1. {data: {header: {...}, data: [...]}}
          // 2. {header: {...}, data: {...}, metadata: {...}}

          // 使用类型断言处理不同的数据结构
          const anyBlockData = blockData as any;
          const hasValidStructure = anyBlockData?.data?.header || anyBlockData?.header;

          if (hasValidStructure) {
            console.log(`区块 ${blockId} 数据结构有效，开始解析...`);

            // 确定区块头部和交易数据的位置
            const blockHeader = anyBlockData.data?.header || anyBlockData.header;
            const transactionData = anyBlockData.data?.data || (anyBlockData.data ? [anyBlockData.data] : []);
            const transactions = transactionData?.length || 0;

            console.log(`区块 ${blockId} 包含 ${transactions} 个交易`);

            // 获取时间戳
            let timestamp = new Date().toISOString();

            // 尝试从交易数据中获取时间戳
            if (transactions > 0) {
              // 尝试不同的路径获取时间戳
              const txTimestamp =
                transactionData[0]?.payload?.header?.channel_header?.timestamp ||
                (transactionData[0] as any)?.header?.channel_header?.timestamp ||
                (blockHeader as any)?.channel_header?.timestamp;

              if (txTimestamp) {
                timestamp = txTimestamp;
                console.log(`从区块数据中获取到时间戳: ${timestamp}`);
              } else {
                console.log(`未能从区块数据中获取时间戳，使用当前时间: ${timestamp}`);
              }
            }

            // 计算区块大小
            const blockSize = JSON.stringify(blockData).length;
            console.log(`区块 ${blockId} 大小: ${blockSize} 字节`);

            // 获取矿工信息
            let miner = 'node1';

            // 尝试从交易数据中获取矿工信息
            if (transactions > 0) {
              // 尝试不同的路径获取矿工信息
              const minerInfo =
                transactionData[0]?.payload?.header?.signature_header?.creator?.mspid ||
                (transactionData[0] as any)?.header?.signature_header?.creator?.mspid ||
                (blockHeader as any)?.signature_header?.creator?.mspid;

              if (minerInfo) {
                miner = minerInfo;
                console.log(`从区块数据中获取到矿工信息: ${miner}`);
              } else {
                console.log(`未能从区块数据中获取矿工信息，使用默认值: ${miner}`);
              }
            }

            // 使用类型断言安全地访问属性
            blocks.push({
              height: (blockHeader as any).number ? parseInt((blockHeader as any).number) : parseInt(blockId),
              hash: (blockHeader as any).data_hash || (blockHeader as any).previous_hash || `hash-${blockId}`,
              timestamp,
              transactions,
              size: blockSize,
              miner
            });

            console.log(`成功获取区块 ${blockId} 信息`);
          } else {
            console.warn(`区块 ${blockId} 数据结构不完整:`, blockData);
          }
        } catch (error) {
          console.error(`获取区块 ${blockId} 错误:`, error);
          // 继续处理下一个区块，而不是中断整个过程
        }
      }

      if (blocks.length === 0) {
        throw new Error('未能获取任何区块信息');
      }

      set({ latestBlocks: blocks, isLoading: false });
    } catch (error) {
      console.error('获取最新区块错误:', error);
      set({
        latestBlocks: [], // 确保在错误情况下清空区块列表
        error: error instanceof Error ? error.message : '获取最新区块失败',
        isLoading: false
      });
    }
  },

  fetchLatestTransactions: async () => {
    set({ isLoading: true, error: null });

    try {
      // 使用 dataStatsApi.queryCTISummaryInfo 获取最新的CTI交易
      const ctiSummaryInfo = await dataStatsApi.queryCTISummaryInfo(10);

      if (!ctiSummaryInfo || ctiSummaryInfo.length === 0) {
        throw new Error('未获取到CTI交易数据');
      }

      // 将CTI摘要信息转换为交易格式
      const transactions: Transaction[] = ctiSummaryInfo.map(cti => ({
        txid: cti.cti_id || '',
        from: cti.creator_user_id || 'Unknown',
        to: 'System',
        amount: 0, // CTI交易金额可能需要从其他字段获取
        timestamp: cti.create_time || new Date().toISOString(),
        status: 'confirmed',
        type: 'CTI',
        // 添加额外的CTI特定字段
        cti_hash: cti.cti_hash,
        cti_type: cti.cti_type,
        tags: cti.tags
      }));

      console.log('获取到最新CTI交易数据:', transactions);
      set({ latestTransactions: transactions, isLoading: false });
    } catch (error) {
      console.error('获取最新CTI交易错误:', error);
      set({
        error: error instanceof Error ? error.message : '获取最新CTI交易失败',
        isLoading: false,
        latestTransactions: [] // 确保在错误情况下清空交易列表
      });
    }
  },

  fetchBlockDetail: async (height: number) => {
    set({ isLoading: true, error: null });

    try {
      // 获取区块详情
      const blockData = await bcBrowserApi.queryBlockInfo(height.toString());

      // 使用类型断言处理不同的数据结构
      const anyBlockData = blockData as any;
      const hasValidStructure = anyBlockData?.data?.header || anyBlockData?.header;

      if (!hasValidStructure) {
        throw new Error(`区块数据结构无效: ${height}`);
      }

      // 提取区块信息
      const blockHeader = anyBlockData.data?.header || anyBlockData.header;
      const transactionData = anyBlockData.data?.data || (anyBlockData.data ? [anyBlockData.data] : []);
      const transactions = transactionData?.length || 0;

      // 获取时间戳
      let timestamp = new Date().toISOString();

      // 尝试从交易数据中获取时间戳
      if (transactions > 0) {
        // 尝试不同的路径获取时间戳
        const txTimestamp =
          transactionData[0]?.payload?.header?.channel_header?.timestamp ||
          (transactionData[0] as any)?.header?.channel_header?.timestamp ||
          (blockHeader as any)?.channel_header?.timestamp;

        if (txTimestamp) {
          timestamp = txTimestamp;
          console.log(`从区块数据中获取到时间戳: ${timestamp}`);
        }
      }

      // 计算区块大小
      const blockSize = JSON.stringify(blockData).length;

      // 获取矿工信息
      let miner = 'node1';

      // 尝试从交易数据中获取矿工信息
      if (transactions > 0) {
        // 尝试不同的路径获取矿工信息
        const minerInfo =
          transactionData[0]?.payload?.header?.signature_header?.creator?.mspid ||
          (transactionData[0] as any)?.header?.signature_header?.creator?.mspid ||
          (blockHeader as any)?.signature_header?.creator?.mspid;

        if (minerInfo) {
          miner = minerInfo;
        }
      }

      const blockInfo: BlockInfo = {
        height: (blockHeader as any).number ? parseInt((blockHeader as any).number) : height,
        hash: (blockHeader as any).data_hash || (blockHeader as any).previous_hash || `hash-${height}`,
        timestamp,
        transactions,
        size: blockSize,
        miner
      };

      set({ currentBlock: blockInfo, isLoading: false });
    } catch (error) {
      console.error(`获取区块详情错误 ${height}:`, error);
      set({
        currentBlock: null,
        error: error instanceof Error ? error.message : '获取区块详情失败',
        isLoading: false
      });
    }
  },

  fetchTransactionDetail: async (txid: string) => {
    set({ isLoading: true, error: null });

    try {
      // 获取链信息
      const chainInfo = await bcBrowserApi.queryChainInfo();
      let transactionData: Transaction | null = null;

      // 在最新的20个区块中搜索交易
      for (let i = 0; i < 20; i++) {
        try {
          const blockHeight = chainInfo.BCI.height - i;
          if (blockHeight <= 0) continue;

          const blockData = await bcBrowserApi.queryBlockInfo(blockHeight.toString());

          // 在区块中搜索交易
          if (blockData?.data?.data && blockData.data.data.length > 0) {
            for (const tx of blockData.data.data) {
              if (tx.payload?.header?.channel_header?.tx_id === txid) {
                const channelHeader = tx.payload.header.channel_header;
                const creator = tx.payload.header.signature_header?.creator;
                const txType = channelHeader.channel_id?.includes('cti') ? 'CTI' : 'Model';

                transactionData = {
                  txid: channelHeader.tx_id || '',
                  from: creator?.mspid || 'Unknown',
                  to: 'System',
                  amount: 0,
                  timestamp: channelHeader.timestamp || new Date().toISOString(),
                  status: 'confirmed',
                  type: txType
                };

                break;
              }
            }
          }

          if (transactionData) break;
        } catch (error) {
          console.error(`搜索区块 ${chainInfo.BCI.height - i} 中的交易错误:`, error);
          // 继续下一个区块
        }
      }

      if (transactionData) {
        set({ currentTransaction: transactionData, isLoading: false });
      } else {
        set({
          currentTransaction: null,
          error: `未找到交易ID: ${txid}`,
          isLoading: false
        });
      }
    } catch (error) {
      console.error(`获取交易详情错误 ${txid}:`, error);
      set({
        currentTransaction: null,
        error: error instanceof Error ? error.message : '获取交易详情失败',
        isLoading: false
      });
    }
  },

  fetchBlockchainStats: async () => {
    set({ isLoading: true, error: null });

    try {
      // 获取系统概览数据
      const systemOverview = await dataStatsApi.getSystemOverview();

      // 获取数据统计信息
      const dataStats = await dataStatsApi.getDataStatistics();

      // 使用真实数据
      const stats: BlockchainStats = {
        blockHeight: systemOverview.block_height,
        totalTransactions: systemOverview.total_transactions,
        totalUsers: systemOverview.account_count,
        totalCTI: dataStats.total_cti_data_num,
        totalModels: dataStats.total_model_data_num
      };

      set({ stats, isLoading: false });
    } catch (error) {
      console.error('获取区块链统计信息错误:', error);
      set({
        error: error instanceof Error ? error.message : '获取区块链统计信息失败',
        isLoading: false
      });
    }
  },

  searchBlockchain: async (query: string) => {
    set({ isLoading: true, error: null });

    try {
      let result = null;

      // 如果查询是数字，尝试按高度查找区块
      if (/^\d+$/.test(query)) {
        try {
          const blockData = await bcBrowserApi.queryBlockInfo(query);

          // 使用类型断言处理不同的数据结构
          const anyBlockData = blockData as any;
          const hasValidStructure = anyBlockData?.data?.header || anyBlockData?.header;

          if (hasValidStructure) {
            // 提取区块信息
            const blockHeader = anyBlockData.data?.header || anyBlockData.header;
            const transactionData = anyBlockData.data?.data || (anyBlockData.data ? [anyBlockData.data] : []);
            const transactions = transactionData?.length || 0;

            // 获取时间戳
            let timestamp = new Date().toISOString();

            // 尝试从交易数据中获取时间戳
            if (transactions > 0) {
              // 尝试不同的路径获取时间戳
              const txTimestamp =
                transactionData[0]?.payload?.header?.channel_header?.timestamp ||
                (transactionData[0] as any)?.header?.channel_header?.timestamp ||
                (blockHeader as any)?.channel_header?.timestamp;

              if (txTimestamp) {
                timestamp = txTimestamp;
              }
            }

            // 计算区块大小
            const blockSize = JSON.stringify(blockData).length;

            // 获取矿工信息
            let miner = 'node1';

            // 尝试从交易数据中获取矿工信息
            if (transactions > 0) {
              // 尝试不同的路径获取矿工信息
              const minerInfo =
                transactionData[0]?.payload?.header?.signature_header?.creator?.mspid ||
                (transactionData[0] as any)?.header?.signature_header?.creator?.mspid ||
                (blockHeader as any)?.signature_header?.creator?.mspid;

              if (minerInfo) {
                miner = minerInfo;
              }
            }

            result = {
              type: 'block',
              data: {
                height: (blockHeader as any).number ? parseInt((blockHeader as any).number) : parseInt(query),
                hash: (blockHeader as any).data_hash || (blockHeader as any).previous_hash || `hash-${query}`,
                timestamp,
                transactions,
                size: blockSize,
                miner
              }
            };
          }
        } catch (error) {
          console.error(`按高度 ${query} 查找区块错误:`, error);
          // 继续其他搜索方法
        }
      }

      // 如果结果仍为空且查询是长字符串，尝试查找交易
      if (result === null && query.length > 10) {
        try {
          // 获取链信息
          const chainInfo = await bcBrowserApi.queryChainInfo();

          // 在区块中搜索交易
          for (let i = 0; i < 20 && !result; i++) {
            try {
              const blockHeight = chainInfo.BCI.height - i;
              if (blockHeight <= 0) continue;

              const blockData = await bcBrowserApi.queryBlockInfo(blockHeight.toString());

              // 在区块中搜索交易
              if (blockData?.data?.data && blockData.data.data.length > 0) {
                for (const tx of blockData.data.data) {
                  // 检查是否是我们要找的交易（通过txid）
                  if (tx.payload?.header?.channel_header?.tx_id === query) {
                    const channelHeader = tx.payload.header.channel_header;
                    const creator = tx.payload.header.signature_header?.creator;
                    const txType = channelHeader.channel_id?.includes('cti') ? 'CTI' : 'Model';

                    result = {
                      type: 'transaction',
                      data: {
                        txid: channelHeader.tx_id || '',
                        from: creator?.mspid || 'Unknown',
                        to: 'System',
                        amount: 0,
                        timestamp: channelHeader.timestamp || new Date().toISOString(),
                        status: 'confirmed',
                        type: txType
                      }
                    };
                    break;
                  }
                }
              }

              // 检查此区块的哈希是否与查询匹配
              // 使用类型断言处理不同的数据结构
              const anyBlockData = blockData as any;
              const blockHeader = anyBlockData.data?.header || anyBlockData.header;

              if (!result && blockHeader &&
                  ((blockHeader.data_hash === query) ||
                   (blockHeader.previous_hash === query))) {
                const transactionData = anyBlockData.data?.data || (anyBlockData.data ? [anyBlockData.data] : []);
                const transactions = transactionData?.length || 0;

                // 获取时间戳
                let timestamp = new Date().toISOString();

                // 尝试从交易数据中获取时间戳
                if (transactions > 0) {
                  // 尝试不同的路径获取时间戳
                  const txTimestamp =
                    transactionData[0]?.payload?.header?.channel_header?.timestamp ||
                    (transactionData[0] as any)?.header?.channel_header?.timestamp ||
                    (blockHeader as any)?.channel_header?.timestamp;

                  if (txTimestamp) {
                    timestamp = txTimestamp;
                  }
                }

                // 计算区块大小
                const blockSize = JSON.stringify(blockData).length;

                // 获取矿工信息
                let miner = 'node1';

                // 尝试从交易数据中获取矿工信息
                if (transactions > 0) {
                  // 尝试不同的路径获取矿工信息
                  const minerInfo =
                    transactionData[0]?.payload?.header?.signature_header?.creator?.mspid ||
                    (transactionData[0] as any)?.header?.signature_header?.creator?.mspid ||
                    (blockHeader as any)?.signature_header?.creator?.mspid;

                  if (minerInfo) {
                    miner = minerInfo;
                  }
                }

                result = {
                  type: 'block',
                  data: {
                    height: (blockHeader as any).number ? parseInt((blockHeader as any).number) : blockHeight,
                    hash: (blockHeader as any).data_hash || (blockHeader as any).previous_hash || query,
                    timestamp,
                    transactions,
                    size: blockSize,
                    miner
                  }
                };
              }
            } catch (error) {
              console.error(`搜索区块 ${chainInfo.BCI.height - i} 错误:`, error);
              // 继续下一个区块
            }
          }
        } catch (error) {
          console.error('获取链信息错误:', error);
          // 继续其他搜索方法
        }
      }

      // 如果仍未找到任何内容，返回未知
      if (result === null) {
        result = { type: 'node1', data: null };
      }

      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('区块链搜索错误:', error);
      set({
        error: error instanceof Error ? error.message : '搜索区块链失败',
        isLoading: false
      });
      return { type: 'error', data: null };
    }
  },

  reset: () => {
    set({
      currentBlock: null,
      currentTransaction: null,
      error: null
    });
  }
}));
