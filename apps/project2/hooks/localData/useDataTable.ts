import { useState, useEffect, useMemo } from 'react';
import { localDataApi } from '@/api/localData';
import { StixRecord } from '@/api/types/localData';
import { useDataStore } from '@/store/dataStore';

export interface PaginationData {
  current: number;
  pageSize: number;
  total: number;
}

// 设置一个足够大的页面大小，以便一次性获取所有数据
const MAX_PAGE_SIZE = 1000;

export function useDataTable() {
  const [allData, setAllData] = useState<StixRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'processing'>('all');
  const [error, setError] = useState<string | null>(null);
  const { tasks } = useDataStore();
  const [pagination, setPagination] = useState<PaginationData>({
    current: 1,
    pageSize: 10,  // 默认显示10条
    total: 0
  });

  // 一次性获取所有数据
  const fetchAllData = async (fileHash: string) => {
    if (!fileHash || fileHash.trim() === '') {
      console.error('fetchAllData: fileHash 不能为空');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 使用最大页面大小获取数据
      const response = await localDataApi.getLocalStixRecords(fileHash, 1, MAX_PAGE_SIZE);

      if (response.code === 200 && response.data) {
        // 保存所有数据
        setAllData(response.data);

        // 更新总数
        const totalCount = response.data.length;

        // 重置分页到第一页
        setPagination({
          current: 1,
          pageSize: pagination.pageSize,
          total: totalCount
        });
      }
    } catch (err) {
      setError('获取数据失败');
      console.error('获取数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理页码变化 - 仅在前端进行分页
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: newPageSize
    }));
  };

  // 初始加载数据
  useEffect(() => {
    // 获取第一个有效的 fileHash
    const validTask = tasks.find(task => task.file_hash && task.file_hash.trim() !== '');
    if (validTask && validTask.file_hash) {
      fetchAllData(validTask.file_hash);
    }

    // 设置定时刷新 - 每30秒刷新一次所有数据
    const interval = setInterval(() => {
      const currentTask = tasks.find(task => task.file_hash && task.file_hash.trim() !== '');
      if (currentTask && currentTask.file_hash) {
        fetchAllData(currentTask.file_hash);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 监听 tasks 变化，当 tasks 更新时刷新数据
  useEffect(() => {
    const validTask = tasks.find(task => task.file_hash && task.file_hash.trim() !== '');
    if (validTask && validTask.file_hash) {
      fetchAllData(validTask.file_hash);
    }
  }, [tasks]);

  // 根据当前标签过滤数据
  const filteredData = useMemo(() => {
    return activeTab === 'all'
      ? allData
      : allData.filter(item => !item.onchain);
  }, [allData, activeTab]);

  // 根据当前分页设置计算要显示的数据
  const paginatedData = useMemo(() => {
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, pagination]);

  return {
    // 返回分页后的数据
    data: paginatedData,
    // 返回所有数据的总数
    totalData: filteredData,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    pagination: {
      ...pagination,
      total: filteredData.length // 确保总数是过滤后的数据长度
    },
    handlePageChange,
    refreshData: (fileHash: string) => fetchAllData(fileHash)
  };
}
