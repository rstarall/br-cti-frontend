# 激励机制Store实现文档

## 概述

本文档描述了为激励机制页面创建的专用store，该store整合了多个API接口的数据，提供全面的统计信息和状态管理。

## 功能特性

### 1. 数据整合
- **激励事件数据**: 通过`incentiveApi`获取所有CTI的激励事件
- **情报市场数据**: 通过`ctiApi`获取情报数据，支持遍历所有情报
- **系统统计数据**: 通过`dataStatsApi`获取系统概览信息
- **用户数据**: 通过`userApi`获取用户相关统计

### 2. 统计信息生成
- **激励机制分布**: 统计三种激励机制（积分激励、三方博弈、演化博弈）的分布情况
- **用户贡献排名**: 基于用户创建的CTI数量和价值计算贡献分数
- **激励趋势分析**: 生成月度激励趋势数据
- **总体统计**: 提供总激励价值、CTI数量、用户数量等统计

### 3. 状态管理
- **加载状态**: 提供统一的加载状态管理
- **错误处理**: 完善的错误处理和用户反馈
- **数据缓存**: 避免重复请求，提高性能

## 技术实现

### Store结构

```typescript
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
  // ... 其他操作
}
```

### 核心功能

#### 1. 数据获取 (`fetchAllData`)
```typescript
fetchAllData: async () => {
  // 并行获取所有数据
  await Promise.all([
    fetchIncentiveEvents(),
    fetchCTIData(),
    fetchSystemOverview(),
    fetchUserRankings()
  ]);
  
  // 生成统计数据
  generateStatistics();
}
```

#### 2. 激励事件获取 (`fetchIncentiveEvents`)
- 遍历所有CTI数据
- 为每个CTI获取对应的激励事件
- 处理API调用失败的情况

#### 3. 用户排名生成 (`fetchUserRankings`)
- 统计每个用户的CTI贡献
- 计算贡献分数（基于CTI价值）
- 生成排序后的排行榜数据

#### 4. 统计数据生成 (`generateStatistics`)
- 分析激励机制分布
- 生成趋势数据
- 计算百分比和总计

## API接口使用

### 1. 激励机制API
```typescript
// 获取CTI的激励事件
incentiveApi.queryAllIncentiveEventsByRefId(cti.cti_id, 'cti')
```

### 2. CTI API
```typescript
// 获取所有CTI数据
ctiApi.queryCTIDataByAll(1, 1000)
```

### 3. 数据统计API
```typescript
// 获取系统概览
dataStatsApi.getSystemOverview()
```

## 页面集成

### 使用方式
```typescript
const {
  mechanismStats,
  rankingData,
  trendData,
  isLoading,
  error,
  fetchAllData
} = useIncentiveStore();

useEffect(() => {
  fetchAllData();
}, [fetchAllData]);
```

### 数据展示
1. **激励机制卡片**: 显示三种机制的统计信息
2. **趋势图表**: 使用ECharts展示月度趋势
3. **分布图表**: 饼图显示机制分布
4. **排行榜**: 表格显示用户贡献排名

## 错误处理

### 1. API调用失败
- 单个CTI激励事件获取失败不影响整体流程
- 提供详细的错误信息给用户
- 支持重试机制

### 2. 数据验证
- 检查API返回数据的完整性
- 处理空数据情况
- 提供默认值

## 性能优化

### 1. 并行请求
- 使用`Promise.all`并行获取数据
- 减少总体加载时间

### 2. 数据缓存
- 避免重复API调用
- 提供`lastUpdated`时间戳

### 3. 错误恢复
- 部分数据获取失败不影响其他数据
- 提供优雅降级

## 扩展性

### 1. 新增统计维度
- 可以轻松添加新的统计指标
- 支持自定义时间范围

### 2. 新增数据源
- 模块化设计便于集成新的API
- 统一的错误处理机制

### 3. 实时更新
- 支持定时刷新数据
- 可以集成WebSocket实时更新

## 测试

创建了完整的测试用例覆盖：
- 初始状态验证
- 数据获取功能
- 统计生成逻辑
- 错误处理机制
- 状态重置功能

## 总结

该激励机制store提供了：
1. **全面的数据整合**: 从多个API获取并整合数据
2. **丰富的统计信息**: 生成多维度的统计分析
3. **良好的用户体验**: 完善的加载状态和错误处理
4. **高性能**: 并行请求和数据缓存
5. **易于维护**: 模块化设计和完整测试

这个实现确保了激励机制页面能够获取到全面、准确的统计信息，为用户提供有价值的数据洞察。
