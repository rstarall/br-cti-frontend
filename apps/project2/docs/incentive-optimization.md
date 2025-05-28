# 激励机制页面性能优化方案

## 问题分析

### 原有实现的性能问题
1. **一次性获取大量数据**: `ctiApi.queryCTIDataByAll(1, 1000)` 获取1000条CTI数据
2. **大量串行API调用**: 为每个CTI调用 `incentiveApi.queryAllIncentiveEventsByRefId()`
3. **阻塞式数据处理**: 如果有1000个CTI，需要1000次额外的API调用
4. **内存占用过大**: 同时加载所有CTI和激励事件数据

### 性能影响
- 页面加载时间过长（可能超过30秒）
- 网络请求过多，容易超时
- 浏览器内存占用过高
- 用户体验差

## 优化方案

### 1. 分页统计策略
```typescript
// 使用分页API进行统计，每页50条数据
const pageSize = 50;
let currentPage = 1;
let hasMoreData = true;

while (hasMoreData) {
  const response = await ctiApi.queryCTIDataByAll(currentPage, pageSize);
  // 处理当前页数据...
  currentPage++;
}
```

### 2. 边获取边统计
- 不存储完整的CTI数据，只保留统计结果
- 在获取数据的同时进行统计计算
- 减少内存占用和处理时间

### 3. 移除激励事件遍历
- 不再为每个CTI单独获取激励事件
- 直接使用CTI数据中的激励机制和价值信息
- 大幅减少API调用次数

### 4. 优化用户排行统计
- 基于CTI创建者统计用户贡献
- 使用Map数据结构提高统计效率
- 只保留前10名用户数据

## 实现细节

### 新增方法: `fetchOptimizedStatistics`
```typescript
fetchOptimizedStatistics: async () => {
  // 1. 分页获取CTI数据
  // 2. 边获取边统计激励机制分布
  // 3. 统计用户贡献排行
  // 4. 生成趋势数据
  // 5. 更新状态
}
```

### 数据流程优化
1. **系统概览**: 并行获取系统基础信息
2. **分页统计**: 分页获取CTI数据并实时统计
3. **内存优化**: 不保存完整CTI列表，只保存统计结果
4. **用户体验**: 显著减少加载时间

## 性能提升

### 预期改进
- **API调用次数**: 从1000+次减少到约20次（假设1000条数据，每页50条）
- **加载时间**: 从30+秒减少到3-5秒
- **内存占用**: 减少约80%的内存使用
- **网络流量**: 减少大量不必要的激励事件数据传输

### 兼容性
- 保持原有的数据结构和接口
- 页面组件无需修改
- 向后兼容现有功能

## 使用方式

页面组件使用方式保持不变：
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
  fetchAllData(); // 内部使用优化后的方法
}, [fetchAllData]);
```

## 注意事项

1. **数据准确性**: 基于CTI数据统计，不依赖激励事件详情
2. **实时性**: 数据反映当前CTI市场状态
3. **扩展性**: 可根据需要调整分页大小和统计策略
4. **错误处理**: 单页失败不影响整体统计结果
