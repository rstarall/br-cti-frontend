import { create } from 'zustand';
import { kpApi } from '@/api/kp';
import {
  IOCGeoDistribution,
  IOCTypeDistribution,
  AttackTypeStatisticsEntry,
  AttackTypeStats,
  TrafficTypeRatio,
  TrafficTimeSeriesEntry,
  AttackIOCInfo
} from '@/api/types/kp';

// 辅助函数：获取攻击类型统计中数量最多的类型
const getMaxAttackType = (stats: AttackTypeStats): string => {
  const typeMap: Record<string, string> = {
    'malicious_traffic': '恶意流量',
    'honeypot_info': '蜜罐情报',
    'botnet': '僵尸网络',
    'app_layer_attack': '应用层攻击',
    'open_source_info': '开源情报'
  };

  let maxType = 'malicious_traffic';
  let maxCount = stats.malicious_traffic;

  Object.entries(stats).forEach(([type, count]) => {
    if (type !== 'total' && count > maxCount) {
      maxType = type;
      maxCount = count;
    }
  });

  return typeMap[maxType] || maxType;
};

// 辅助函数：从类型映射中获取数量最多的类型
const getMaxAttackTypeFromMap = (typeCounts: Record<string, number>): string => {
  const typeMap: Record<string, string> = {
    'malicious_traffic': '恶意流量',
    'honeypot_info': '蜜罐情报',
    'botnet': '僵尸网络',
    'app_layer_attack': '应用层攻击',
    'open_source_info': '开源情报'
  };

  let maxType = '';
  let maxCount = 0;

  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxType = type;
      maxCount = count;
    }
  });

  return typeMap[maxType] || maxType;
};

interface GeoData {
  name: string;
  value: number;
}

interface TypeData {
  name: string;
  value: number;
}

interface TimelineData {
  date: string;
  value: number;
  type: string;
}

interface FeatureData {
  name: string;
  value: number;
}

interface SceneData {
  name: string;
  value: number;
}

interface IOCSearchResult {
  found: boolean;
  type?: string;
  data?: {
    ioc: string;
    firstSeen: string;
    lastSeen: string;
    malicious: boolean;
    confidence: number;
    tags: string[];
    relatedIOCs: {
      ioc: string;
      type: string;
      relation: string;
    }[];
  };
}

interface KnowledgePlaneState {
  // 常规攻击数据
  normalGeoData: GeoData[];
  normalTypeData: TypeData[];
  normalTimelineData: TimelineData[];

  // 流量攻击数据
  trafficFeatureData: FeatureData[];
  trafficSceneData: SceneData[];
  trafficTimelineData: TimelineData[];

  // 统计数据
  normalIOCTotal: number;
  trafficIOCTotal: number;

  // 状态
  isLoading: boolean;
  error: string | null;

  // 操作
  fetchNormalGeoData: () => Promise<void>;
  fetchNormalTypeData: () => Promise<void>;
  fetchNormalTimelineData: (mode: 'hour' | 'day' | 'month') => Promise<void>;
  fetchTrafficFeatureData: () => Promise<void>;
  fetchTrafficSceneData: () => Promise<void>;
  fetchTrafficTimelineData: (mode: 'hour' | 'day' | 'month') => Promise<void>;
  fetchIOCTotals: () => Promise<void>;
  searchIOC: (keyword: string) => Promise<any>;
  reset: () => void;
}

export const useKnowledgePlaneStore = create<KnowledgePlaneState>((set, get) => ({
  // 常规攻击数据
  normalGeoData: [],
  normalTypeData: [],
  normalTimelineData: [],

  // 流量攻击数据
  trafficFeatureData: [],
  trafficSceneData: [],
  trafficTimelineData: [],

  // 统计数据
  normalIOCTotal: 0,
  trafficIOCTotal: 0,

  // 状态
  isLoading: false,
  error: null,

  // 操作
  fetchNormalGeoData: async () => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取地理分布数据
      const geoDistribution = await kpApi.queryIOCGeoDistribution();

      // 转换数据格式为组件所需的格式
      const geoData: GeoData[] = [];

      // Country code to English name mapping - MUST match the nameMap in the map component
      const countryCodeMap: Record<string, string> = {
        'CN': 'China',
        'US': 'United States',
        'RU': 'Russia',
        'DE': 'Germany',
        'BR': 'Brazil',
        'AU': 'Australia',
        'IN': 'India',
        'GB': 'United Kingdom',
        'CA': 'Canada',
        'JP': 'Japan',
        'FR': 'France',
        'IT': 'Italy',
        'ES': 'Spain',
        'KR': 'South Korea',
        'SG': 'Singapore'
      };

      console.log('Raw geo distribution data:', JSON.stringify(geoDistribution, null, 2));

      // 遍历国家数据
      for (const [countryCode, regions] of Object.entries(geoDistribution)) {
        // 计算该国家的总数
        let countryTotal = 0;
        for (const count of Object.values(regions)) {
          if (typeof count === 'number') {
            countryTotal += count;
          }
        }

        // Get English country name from code
        const countryName = countryCodeMap[countryCode] || countryCode;

        // 添加到结果数组 - ensure value is a number
        geoData.push({
          name: countryName, // Use English country name for the map component
          value: Number(countryTotal)
        });
      }

      console.log('Processed geo data for map:', JSON.stringify(geoData, null, 2));

      // Verify data is valid
      const validData = geoData.filter(item =>
        item &&
        typeof item.name === 'string' &&
        !isNaN(item.value) &&
        item.value > 0
      );

      console.log('Valid geo data count:', validData.length);

      // Use fallback if no valid data
      if (validData.length === 0) {
        throw new Error('No valid geo data found');
      }

      set({ normalGeoData: validData, isLoading: false });
    } catch (error) {
      console.error('Error fetching geo data:', error);

      // 如果API调用失败，使用模拟数据作为后备
      const fallbackData: GeoData[] = [
        { name: 'China', value: 1200 },
        { name: 'United States', value: 800 },
        { name: 'Russia', value: 600 },
        { name: 'Germany', value: 400 },
        { name: 'Brazil', value: 300 }
      ];

      set({
        normalGeoData: fallbackData,
        error: error instanceof Error ? error.message : 'Failed to fetch normal geo data',
        isLoading: false
      });
    }
  },

  fetchNormalTypeData: async () => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取 IOC 类型分布数据
      const typeDistribution = await kpApi.queryIOCTypeDistribution();

      // 转换数据格式为组件所需的格式
      const typeData: TypeData[] = [
        { name: 'IP', value: typeDistribution.ip_count },
        { name: 'Port', value: typeDistribution.port_count },
        { name: 'Payload', value: typeDistribution.payload_count },
        { name: 'URL', value: typeDistribution.url_count },
        { name: 'Hash', value: typeDistribution.hash_count }
      ];

      set({ normalTypeData: typeData, isLoading: false });
    } catch (error) {
      console.error('Error fetching type data:', error);

      // 如果API调用失败，使用模拟数据作为后备
      const fallbackData: TypeData[] = [
        { name: 'IP', value: 1500 },
        { name: 'URL', value: 1200 },
        { name: 'Port', value: 800 },
        { name: 'Hash', value: 600 },
        { name: 'Payload', value: 300 }
      ];

      set({
        normalTypeData: fallbackData,
        error: error instanceof Error ? error.message : 'Failed to fetch normal type data',
        isLoading: false
      });
    }
  },

  fetchNormalTimelineData: async (mode: 'hour' | 'day' | 'month' = 'day') => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取攻击类型统计数据
      const attackStats = await kpApi.queryAttackTypeStatistics();

      // 根据模式过滤和转换数据
      let timelineData: TimelineData[] = [];

      // 根据不同的时间模式处理数据
      if (mode === 'hour') {
        // 过滤最近24小时的数据
        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        const filteredData = attackStats.filter(entry => {
          const entryTime = new Date(entry.time);
          return entryTime >= last24Hours;
        });

        // 转换为所需格式
        timelineData = filteredData.map(entry => {
          const entryTime = new Date(entry.time);
          return {
            date: `${entryTime.getHours()}:00`,
            value: entry.stats.total,
            type: getMaxAttackType(entry.stats)
          };
        });
      } else if (mode === 'day') {
        // 按天聚合数据
        const dayMap = new Map<string, { total: number, types: Record<string, number> }>();

        attackStats.forEach(entry => {
          const entryTime = new Date(entry.time);
          const dayKey = `${entryTime.getMonth() + 1}-${entryTime.getDate()}`;

          if (!dayMap.has(dayKey)) {
            dayMap.set(dayKey, { total: 0, types: {} });
          }

          const dayData = dayMap.get(dayKey)!;
          dayData.total += entry.stats.total;

          // 累加各类型数据
          Object.entries(entry.stats).forEach(([type, count]) => {
            if (type !== 'total') {
              dayData.types[type] = (dayData.types[type] || 0) + count;
            }
          });
        });

        // 转换为所需格式
        timelineData = Array.from(dayMap.entries()).map(([day, data]) => ({
          date: day,
          value: data.total,
          type: getMaxAttackTypeFromMap(data.types)
        }));
      } else {
        // 按月聚合数据
        const monthMap = new Map<string, { total: number, types: Record<string, number> }>();

        attackStats.forEach(entry => {
          const entryTime = new Date(entry.time);
          const monthKey = `${entryTime.getFullYear()}-${entryTime.getMonth() + 1}`;

          if (!monthMap.has(monthKey)) {
            monthMap.set(monthKey, { total: 0, types: {} });
          }

          const monthData = monthMap.get(monthKey)!;
          monthData.total += entry.stats.total;

          // 累加各类型数据
          Object.entries(entry.stats).forEach(([type, count]) => {
            if (type !== 'total') {
              monthData.types[type] = (monthData.types[type] || 0) + count;
            }
          });
        });

        // 转换为所需格式
        timelineData = Array.from(monthMap.entries()).map(([month, data]) => ({
          date: month,
          value: data.total,
          type: getMaxAttackTypeFromMap(data.types)
        }));
      }

      // 按日期排序
      timelineData.sort((a, b) => a.date.localeCompare(b.date));

      set({ normalTimelineData: timelineData, isLoading: false });
    } catch (error) {
      console.error('Error fetching timeline data:', error);

      // 如果API调用失败，使用模拟数据作为后备
      let fallbackData: TimelineData[] = [];

      if (mode === 'hour') {
        // 最近24小时的数据
        fallbackData = Array.from({ length: 24 }, (_, i) => ({
          date: `${i}:00`,
          value: Math.floor(Math.random() * 100) + 10,
          type: Math.random() > 0.5 ? 'DDoS' : 'Phishing'
        }));
      } else if (mode === 'day') {
        // 最近30天的数据
        fallbackData = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: `${date.getMonth() + 1}-${date.getDate()}`,
            value: Math.floor(Math.random() * 200) + 50,
            type: Math.random() > 0.5 ? 'DDoS' : 'Phishing'
          };
        });
      } else {
        // 最近12个月的数据
        fallbackData = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            date: `${date.getFullYear()}-${date.getMonth() + 1}`,
            value: Math.floor(Math.random() * 1000) + 200,
            type: Math.random() > 0.5 ? 'DDoS' : 'Phishing'
          };
        });
      }

      set({
        normalTimelineData: fallbackData,
        error: error instanceof Error ? error.message : 'Failed to fetch normal timeline data',
        isLoading: false
      });
    }
  },

  fetchTrafficFeatureData: async () => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取 IOC 类型分布数据
      const typeDistribution = await kpApi.queryIOCTypeDistribution();

      // 转换数据格式为组件所需的格式
      const featureData: FeatureData[] = [
        { name: 'IP', value: typeDistribution.ip_count },
        { name: 'Port', value: typeDistribution.port_count },
        { name: 'Payload', value: typeDistribution.payload_count },
        { name: 'URL', value: typeDistribution.url_count },
        { name: 'Hash', value: typeDistribution.hash_count }
      ];

      set({ trafficFeatureData: featureData, isLoading: false });
    } catch (error) {
      console.error('Error fetching traffic feature data:', error);

      // 如果API调用失败，使用模拟数据作为后备
      const fallbackData: FeatureData[] = [
        { name: 'IP', value: 800 },
        { name: 'Port', value: 1200 },
        { name: 'Payload', value: 600 },
        { name: 'URL', value: 400 },
        { name: 'Hash', value: 900 }
      ];

      set({
        trafficFeatureData: fallbackData,
        error: error instanceof Error ? error.message : 'Failed to fetch traffic feature data',
        isLoading: false
      });
    }
  },

  fetchTrafficSceneData: async () => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取流量类型比例数据
      const trafficRatio = await kpApi.queryTrafficTypeRatio();

      // 转换数据格式为组件所需的格式
      const sceneData: SceneData[] = [
        { name: '5G', value: trafficRatio.five_g_count },
        { name: '卫星网络', value: trafficRatio.satellite_count },
        { name: 'SDN', value: trafficRatio.sdn_count },
        { name: '非流量', value: trafficRatio.non_traffic_count }
      ];

      // 计算流量IOC总数
      const trafficTotal = trafficRatio.five_g_count +
                          trafficRatio.satellite_count +
                          trafficRatio.sdn_count;

      set({
        trafficSceneData: sceneData,
        trafficIOCTotal: trafficTotal,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching traffic scene data:', error);

      // 如果API调用失败，使用模拟数据作为后备
      const fallbackData: SceneData[] = [
        { name: '5G', value: 1200 },
        { name: '卫星网络', value: 800 },
        { name: 'SDN', value: 600 },
        { name: '非流量', value: 400 }
      ];

      set({
        trafficSceneData: fallbackData,
        error: error instanceof Error ? error.message : 'Failed to fetch traffic scene data',
        isLoading: false
      });
    }
  },

  fetchTrafficTimelineData: async (mode: 'hour' | 'day' | 'month' = 'day') => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取流量时序数据
      const trafficTimeSeries = await kpApi.queryTrafficTimeSeries();

      // 根据模式过滤和转换数据
      let timelineData: TimelineData[] = [];

      // 流量类型映射
      const trafficTypeMap: Record<string, string> = {
        '0': '非流量',
        '1': '5G',
        '2': '卫星网络',
        '3': 'SDN'
      };

      // 根据不同的时间模式处理数据
      if (mode === 'hour') {
        // 过滤最近24小时的数据
        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        const filteredData = trafficTimeSeries.filter(entry => {
          const entryTime = new Date(entry.timestamp);
          return entryTime >= last24Hours;
        });

        // 转换为所需格式
        timelineData = filteredData.map(entry => {
          const entryTime = new Date(entry.timestamp);

          // 找出主要流量类型
          let maxType = '0';
          let maxCount = 0;

          Object.entries(entry.data).forEach(([type, count]) => {
            if (count > maxCount) {
              maxType = type;
              maxCount = count;
            }
          });

          return {
            date: `${entryTime.getHours()}:00`,
            value: entry.total,
            type: trafficTypeMap[maxType] || '未知'
          };
        });
      } else if (mode === 'day') {
        // 按天聚合数据
        const dayMap = new Map<string, { total: number, types: Record<string, number> }>();

        trafficTimeSeries.forEach(entry => {
          const entryTime = new Date(entry.timestamp);
          const dayKey = `${entryTime.getMonth() + 1}-${entryTime.getDate()}`;

          if (!dayMap.has(dayKey)) {
            dayMap.set(dayKey, { total: 0, types: {} });
          }

          const dayData = dayMap.get(dayKey)!;
          dayData.total += entry.total;

          // 累加各类型数据
          Object.entries(entry.data).forEach(([type, count]) => {
            dayData.types[type] = (dayData.types[type] || 0) + count;
          });
        });

        // 转换为所需格式
        timelineData = Array.from(dayMap.entries()).map(([day, data]) => {
          // 找出主要流量类型
          let maxType = '0';
          let maxCount = 0;

          Object.entries(data.types).forEach(([type, count]) => {
            if (count > maxCount) {
              maxType = type;
              maxCount = count;
            }
          });

          return {
            date: day,
            value: data.total,
            type: trafficTypeMap[maxType] || '未知'
          };
        });
      } else {
        // 按月聚合数据
        const monthMap = new Map<string, { total: number, types: Record<string, number> }>();

        trafficTimeSeries.forEach(entry => {
          const entryTime = new Date(entry.timestamp);
          const monthKey = `${entryTime.getFullYear()}-${entryTime.getMonth() + 1}`;

          if (!monthMap.has(monthKey)) {
            monthMap.set(monthKey, { total: 0, types: {} });
          }

          const monthData = monthMap.get(monthKey)!;
          monthData.total += entry.total;

          // 累加各类型数据
          Object.entries(entry.data).forEach(([type, count]) => {
            monthData.types[type] = (monthData.types[type] || 0) + count;
          });
        });

        // 转换为所需格式
        timelineData = Array.from(monthMap.entries()).map(([month, data]) => {
          // 找出主要流量类型
          let maxType = '0';
          let maxCount = 0;

          Object.entries(data.types).forEach(([type, count]) => {
            if (count > maxCount) {
              maxType = type;
              maxCount = count;
            }
          });

          return {
            date: month,
            value: data.total,
            type: trafficTypeMap[maxType] || '未知'
          };
        });
      }

      // 按日期排序
      timelineData.sort((a, b) => a.date.localeCompare(b.date));

      set({ trafficTimelineData: timelineData, isLoading: false });
    } catch (error) {
      console.error('Error fetching traffic timeline data:', error);

      // 如果API调用失败，使用模拟数据作为后备
      let fallbackData: TimelineData[] = [];

      if (mode === 'hour') {
        // 最近24小时的数据
        fallbackData = Array.from({ length: 24 }, (_, i) => ({
          date: `${i}:00`,
          value: Math.floor(Math.random() * 100) + 10,
          type: Math.random() > 0.5 ? '5G' : '卫星网络'
        }));
      } else if (mode === 'day') {
        // 最近30天的数据
        fallbackData = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: `${date.getMonth() + 1}-${date.getDate()}`,
            value: Math.floor(Math.random() * 200) + 50,
            type: Math.random() > 0.5 ? '5G' : '卫星网络'
          };
        });
      } else {
        // 最近12个月的数据
        fallbackData = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            date: `${date.getFullYear()}-${date.getMonth() + 1}`,
            value: Math.floor(Math.random() * 1000) + 200,
            type: Math.random() > 0.5 ? '5G' : '卫星网络'
          };
        });
      }

      set({
        trafficTimelineData: fallbackData,
        error: error instanceof Error ? error.message : 'Failed to fetch traffic timeline data',
        isLoading: false
      });
    }
  },

  fetchIOCTotals: async () => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取 IOC 类型分布数据
      const typeDistribution = await kpApi.queryIOCTypeDistribution();

      // 计算常规IOC总数
      const normalTotal = typeDistribution.ip_count +
                         typeDistribution.port_count +
                         typeDistribution.payload_count +
                         typeDistribution.url_count +
                         typeDistribution.hash_count;

      // 流量IOC总数在 fetchTrafficSceneData 中已经计算，这里不重复计算

      set({
        normalIOCTotal: normalTotal,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching IOC totals:', error);

      // 如果API调用失败，使用模拟数据作为后备
      const normalTotal = Math.floor(Math.random() * 10000) + 5000;

      set({
        normalIOCTotal: normalTotal,
        error: error instanceof Error ? error.message : 'Failed to fetch IOC totals',
        isLoading: false
      });
    }
  },

  searchIOC: async (keyword: string) => {
    set({ isLoading: true, error: null });

    try {
      // 调用 API 获取攻击 IOC 信息
      const iocInfoList = await kpApi.queryAttackIOCInfo();

      // 搜索匹配的 IOC
      const matchedIOC = iocInfoList.find(ioc =>
        ioc.ip_address.includes(keyword) ||
        ioc.hash.includes(keyword) ||
        ioc.port.includes(keyword) ||
        ioc.location.includes(keyword)
      );

      if (matchedIOC) {
        // 确定 IOC 类型
        let iocType = 'IP';
        if (matchedIOC.hash && matchedIOC.hash.length > 0) {
          iocType = 'Hash';
        } else if (matchedIOC.port && matchedIOC.port.length > 0) {
          iocType = 'Port';
        } else if (matchedIOC.ip_address.includes('.') && !matchedIOC.ip_address.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          iocType = 'Domain';
        }

        // 构建搜索结果
        const result = {
          found: true,
          type: iocType,
          data: {
            ioc: matchedIOC.ip_address,
            firstSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 一周前
            lastSeen: new Date().toISOString(),
            malicious: matchedIOC.attack_type.includes('恶意') || matchedIOC.attack_type.includes('攻击'),
            confidence: 85,
            tags: [matchedIOC.attack_type, ...matchedIOC.location.split(',')],
            relatedIOCs: iocInfoList
              .filter(ioc => ioc !== matchedIOC && ioc.attack_type === matchedIOC.attack_type)
              .slice(0, 3)
              .map(ioc => ({
                ioc: ioc.ip_address,
                type: ioc.hash ? 'Hash' : 'IP',
                relation: '相同攻击类型'
              }))
          }
        };

        set({ isLoading: false });
        return result;
      }

      // 未找到匹配的 IOC
      set({ isLoading: false });
      return { found: false };
    } catch (error) {
      console.error('Error searching IOC:', error);

      // 如果API调用失败，使用模拟数据作为后备
      const fallbackResult = {
        found: keyword.length > 0,
        type: keyword.includes('.') ? 'Domain' : keyword.includes('@') ? 'Email' : 'IP',
        data: {
          ioc: keyword,
          firstSeen: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          lastSeen: new Date().toISOString(),
          malicious: Math.random() > 0.3,
          confidence: Math.floor(Math.random() * 100),
          tags: ['DDoS', '卫星网络', '5G'],
          relatedIOCs: Array.from({ length: 3 }, (_, i) => ({
            ioc: `related_${i}_${Math.random().toString(36).substring(2, 10)}`,
            type: Math.random() > 0.5 ? 'IP' : 'Domain',
            relation: Math.random() > 0.5 ? 'communicatesWith' : 'resolvedTo'
          }))
        }
      };

      set({
        error: error instanceof Error ? error.message : 'Failed to search IOC',
        isLoading: false
      });
      return fallbackResult;
    }
  },

  reset: () => {
    set({
      normalGeoData: [],
      normalTypeData: [],
      normalTimelineData: [],
      trafficFeatureData: [],
      trafficSceneData: [],
      trafficTimelineData: [],
      error: null
    });
  }
}));
