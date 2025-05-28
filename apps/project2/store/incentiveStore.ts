import { create } from 'zustand';
import { incentiveApi } from '@/api/incentive';
import { ctiApi } from '@/api/cti';
import { dataStatsApi } from '@/api/dataStats';
import { IncentiveEventInfo, INCENTIVE_MECHANISM_DESCRIPTIONS } from '@/api/types/incentive';
import { CTIInfo } from '@/api/types/cti';
import { SystemOverview } from '@/api/types/dataStats';

// 排行榜数据类型
export interface RankingData {
  key: string;
  user_id: string;
  user_name: string;
  contribution_score: number;
  cti_count: number;
  rank: number;
}

// 激励机制统计数据
export interface IncentiveMechanismStats {
  mechanism_id: number;
  mechanism_name: string;
  total_value: number;
  total_count: number;
  percentage: number;
}

// 激励趋势数据点
export interface IncentiveTrendPoint {
  date: string;
  point_incentive: number;
  tripartite_game: number;
  evolutionary_game: number;
}

// 激励机制状态接口
interface IncentiveState {
  // 基础数据
  incentiveEvents: IncentiveEventInfo[];
  ctiData: CTIInfo[];
  systemOverview: SystemOverview | null;

  // 统计数据
  mechanismStats: IncentiveMechanismStats[];
  rankingData: RankingData[];
  trendData: IncentiveTrendPoint[];

  // 总计数据
  totalIncentiveValue: number;
  totalCTICount: number;
  totalUserCount: number;

  // 状态
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // 操作
  fetchAllData: () => Promise<void>;
  fetchIncentiveEvents: () => Promise<void>;
  fetchCTIData: () => Promise<void>;
  fetchSystemOverview: () => Promise<void>;
  fetchUserRankings: () => Promise<void>;
  generateStatistics: () => void;
  fetchOptimizedStatistics: () => Promise<void>;
  reset: () => void;
}

// 创建激励机制store
export const useIncentiveStore = create<IncentiveState>((set, get) => ({
  // 基础数据
  incentiveEvents: [],
  ctiData: [],
  systemOverview: null,

  // 统计数据
  mechanismStats: [],
  rankingData: [],
  trendData: [],

  // 总计数据
  totalIncentiveValue: 0,
  totalCTICount: 0,
  totalUserCount: 0,

  // 状态
  isLoading: false,
  error: null,
  lastUpdated: null,

  // 获取所有数据 - 优化版本，使用分页API
  fetchAllData: async () => {
    set({ isLoading: true, error: null });

    try {
      // 并行获取基础数据和统计数据
      await Promise.all([
        get().fetchSystemOverview(),
        get().fetchOptimizedStatistics()
      ]);

      set({
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('获取激励机制数据失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取数据失败',
        isLoading: false
      });
    }
  },

  // 获取激励事件数据
  fetchIncentiveEvents: async () => {
    try {
      // 获取所有CTI的激励事件
      const { ctiData } = get();
      const allIncentiveEvents: IncentiveEventInfo[] = [];

      // 如果还没有CTI数据，先获取
      if (ctiData.length === 0) {
        const ctiResponse = await ctiApi.queryCTIDataByAll(1, 1000);
        set({ ctiData: ctiResponse.cti_infos });

        // 为每个CTI获取激励事件
        for (const cti of ctiResponse.cti_infos) {
          try {
            const incentiveResponse = await incentiveApi.queryAllIncentiveEventsByRefId(cti.cti_id, 'cti');
            allIncentiveEvents.push(...incentiveResponse.incentive_infos);
          } catch (error) {
            console.warn(`获取CTI ${cti.cti_id} 的激励事件失败:`, error);
          }
        }
      } else {
        // 使用现有的CTI数据
        for (const cti of ctiData) {
          try {
            const incentiveResponse = await incentiveApi.queryAllIncentiveEventsByRefId(cti.cti_id, 'cti');
            allIncentiveEvents.push(...incentiveResponse.incentive_infos);
          } catch (error) {
            console.warn(`获取CTI ${cti.cti_id} 的激励事件失败:`, error);
          }
        }
      }

      set({ incentiveEvents: allIncentiveEvents });
    } catch (error) {
      console.error('获取激励事件数据失败:', error);
      throw error;
    }
  },

  // 获取CTI数据
  fetchCTIData: async () => {
    try {
      const response = await ctiApi.queryCTIDataByAll(1, 1000);
      set({
        ctiData: response.cti_infos,
        totalCTICount: response.total
      });
    } catch (error) {
      console.error('获取CTI数据失败:', error);
      throw error;
    }
  },

  // 获取系统概览数据
  fetchSystemOverview: async () => {
    try {
      const overview = await dataStatsApi.getSystemOverview();
      set({
        systemOverview: overview,
        totalUserCount: overview.account_count
      });
    } catch (error) {
      console.error('获取系统概览数据失败:', error);
      throw error;
    }
  },

  // 获取用户排名数据
  fetchUserRankings: async () => {
    try {
      const { ctiData } = get();

      // 统计每个用户的贡献
      const userContributions = new Map<string, {
        user_id: string;
        cti_count: number;
        total_value: number;
      }>();

      ctiData.forEach(cti => {
        const userId = cti.creator_user_id;
        if (!userContributions.has(userId)) {
          userContributions.set(userId, {
            user_id: userId,
            cti_count: 0,
            total_value: 0
          });
        }

        const contribution = userContributions.get(userId)!;
        contribution.cti_count += 1;
        contribution.total_value += cti.value || 0;
      });

      // 转换为排行榜数据并排序
      const rankings: RankingData[] = Array.from(userContributions.values())
        .map((contribution, index) => ({
          key: (index + 1).toString(),
          user_id: contribution.user_id,
          user_name: `用户${contribution.user_id.slice(-4)}`, // 使用用户ID后4位作为显示名
          contribution_score: contribution.total_value,
          cti_count: contribution.cti_count,
          rank: 0 // 将在排序后设置
        }))
        .sort((a, b) => b.contribution_score - a.contribution_score)
        .map((item, index) => ({
          ...item,
          rank: index + 1
        }))
        .slice(0, 10); // 只取前10名

      set({ rankingData: rankings });
    } catch (error) {
      console.error('获取用户排名数据失败:', error);
      throw error;
    }
  },

  // 生成统计数据
  generateStatistics: () => {
    const { incentiveEvents, ctiData } = get();

    // 生成激励机制统计
    const mechanismCounts = new Map<number, { count: number; value: number }>();

    // 统计激励事件
    incentiveEvents.forEach(event => {
      const mechanism = event.incentive_mechanism;
      if (!mechanismCounts.has(mechanism)) {
        mechanismCounts.set(mechanism, { count: 0, value: 0 });
      }
      const stats = mechanismCounts.get(mechanism)!;
      stats.count += 1;
      stats.value += event.incentive_value || 0;
    });

    // 统计CTI数据中的激励机制
    ctiData.forEach(cti => {
      const mechanism = cti.incentive_mechanism;
      if (!mechanismCounts.has(mechanism)) {
        mechanismCounts.set(mechanism, { count: 0, value: 0 });
      }
      const stats = mechanismCounts.get(mechanism)!;
      stats.value += cti.value || 0;
    });

    const totalValue = Array.from(mechanismCounts.values()).reduce((sum, stats) => sum + stats.value, 0);

    // 生成机制统计数据
    const mechanismStats: IncentiveMechanismStats[] = INCENTIVE_MECHANISM_DESCRIPTIONS.map(desc => {
      const stats = mechanismCounts.get(desc.mechanism_id) || { count: 0, value: 0 };
      return {
        mechanism_id: desc.mechanism_id,
        mechanism_name: desc.mechanism_name,
        total_value: stats.value,
        total_count: stats.count,
        percentage: totalValue > 0 ? (stats.value / totalValue) * 100 : 0
      };
    });

    // 生成趋势数据（模拟月度数据）
    const trendData: IncentiveTrendPoint[] = [];
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    months.forEach(month => {
      const pointIncentive = mechanismStats[0]?.total_value || 0;
      const tripartiteGame = mechanismStats[1]?.total_value || 0;
      const evolutionaryGame = mechanismStats[2]?.total_value || 0;

      trendData.push({
        date: month,
        point_incentive: Math.floor(pointIncentive * (0.8 + Math.random() * 0.4) / 12),
        tripartite_game: Math.floor(tripartiteGame * (0.8 + Math.random() * 0.4) / 12),
        evolutionary_game: Math.floor(evolutionaryGame * (0.8 + Math.random() * 0.4) / 12)
      });
    });

    set({
      mechanismStats,
      trendData,
      totalIncentiveValue: totalValue
    });
  },

  // 优化的统计数据获取方法 - 使用分页API
  fetchOptimizedStatistics: async () => {
    try {
      // 1. 使用分页API获取CTI数据进行统计
      const pageSize = 50; // 每页50条，减少单次请求量
      let currentPage = 1;
      let hasMoreData = true;

      // 用于统计的数据结构
      const mechanismCounts = new Map<number, { count: number; value: number }>();
      const userContributions = new Map<string, {
        user_id: string;
        cti_count: number;
        total_value: number;
      }>();

      let totalCTICount = 0;
      let totalIncentiveValue = 0;

      // 分页获取CTI数据并进行统计
      while (hasMoreData) {
        try {
          const response = await ctiApi.queryCTIDataByAll(currentPage, pageSize);

          if (!response.cti_infos || response.cti_infos.length === 0) {
            hasMoreData = false;
            break;
          }

          // 更新总数
          totalCTICount = response.total;

          // 统计当前页的数据
          response.cti_infos.forEach(cti => {
            // 统计激励机制
            const mechanism = cti.incentive_mechanism;
            if (!mechanismCounts.has(mechanism)) {
              mechanismCounts.set(mechanism, { count: 0, value: 0 });
            }
            const mechanismStats = mechanismCounts.get(mechanism)!;
            mechanismStats.count += 1;
            mechanismStats.value += cti.value || 0;

            // 统计用户贡献
            const userId = cti.creator_user_id;
            if (!userContributions.has(userId)) {
              userContributions.set(userId, {
                user_id: userId,
                cti_count: 0,
                total_value: 0
              });
            }
            const userStats = userContributions.get(userId)!;
            userStats.cti_count += 1;
            userStats.total_value += cti.value || 0;

            totalIncentiveValue += cti.value || 0;
          });

          // 检查是否还有更多数据
          if (response.cti_infos.length < pageSize || currentPage * pageSize >= response.total) {
            hasMoreData = false;
          } else {
            currentPage++;
          }

        } catch (error) {
          console.warn(`获取第${currentPage}页CTI数据失败:`, error);
          hasMoreData = false;
        }
      }

      // 2. 生成激励机制统计数据
      const mechanismStats: IncentiveMechanismStats[] = INCENTIVE_MECHANISM_DESCRIPTIONS.map(desc => {
        const stats = mechanismCounts.get(desc.mechanism_id) || { count: 0, value: 0 };
        return {
          mechanism_id: desc.mechanism_id,
          mechanism_name: desc.mechanism_name,
          total_value: stats.value,
          total_count: stats.count,
          percentage: totalIncentiveValue > 0 ? (stats.value / totalIncentiveValue) * 100 : 0
        };
      });

      // 3. 生成用户排行榜数据
      const rankingData: RankingData[] = Array.from(userContributions.values())
        .map((contribution, index) => ({
          key: (index + 1).toString(),
          user_id: contribution.user_id,
          user_name: `${contribution.user_id}`, // 使用用户ID后4位作为显示名
          contribution_score: contribution.total_value,
          cti_count: contribution.cti_count,
          rank: 0 // 将在排序后设置
        }))
        .sort((a, b) => b.contribution_score - a.contribution_score)
        .map((item, index) => ({
          ...item,
          rank: index + 1
        }))
        .slice(0, 10); // 只取前10名

      // 4. 生成趋势数据（基于统计数据模拟）
      const trendData: IncentiveTrendPoint[] = [];
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

      months.forEach(month => {
        const pointIncentive = mechanismStats[0]?.total_value || 0;
        const tripartiteGame = mechanismStats[1]?.total_value || 0;
        const evolutionaryGame = mechanismStats[2]?.total_value || 0;

        trendData.push({
          date: month,
          point_incentive: Math.floor(pointIncentive * (0.8 + Math.random() * 0.4) / 12),
          tripartite_game: Math.floor(tripartiteGame * (0.8 + Math.random() * 0.4) / 12),
          evolutionary_game: Math.floor(evolutionaryGame * (0.8 + Math.random() * 0.4) / 12)
        });
      });

      // 5. 更新状态
      set({
        mechanismStats,
        rankingData,
        trendData,
        totalIncentiveValue,
        totalCTICount
      });

    } catch (error) {
      console.error('获取优化统计数据失败:', error);
      throw error;
    }
  },

  // 重置状态
  reset: () => {
    set({
      incentiveEvents: [],
      ctiData: [],
      systemOverview: null,
      mechanismStats: [],
      rankingData: [],
      trendData: [],
      totalIncentiveValue: 0,
      totalCTICount: 0,
      totalUserCount: 0,
      isLoading: false,
      error: null,
      lastUpdated: null
    });
  }
}));
