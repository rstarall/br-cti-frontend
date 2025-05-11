import { useState, useEffect } from 'react';
import { message } from 'antd';

interface ModelRecord {
  id: number;
  status: string;
  request_id: string;
  create_time: string;
  model_type: string;
  model_algorithm: string;
  model_framework: string;
  model_name: string;
  test_size: string;
  training_time: string;
  model_hash: string;
  source_hash: string;
  feature_count: string;
  rows_count: string;
  model_size: string;
  onchain: string;
}

export function useModelTable() {
  const [modelRecords, setModelRecords] = useState<ModelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'processing'>('all');

  // 获取模型记录列表
  const fetchModelRecords = async (fileHash: string) => {
    // 验证文件哈希是否有效
    if (!fileHash || fileHash.trim() === '') {
      console.log('跳过获取模型记录：文件哈希为空');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/ml/get_model_record_list_by_hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_hash: fileHash })
      });

      const data = await response.json();

      if (data.code === 200 && Array.isArray(data.data)) {
        // 处理数据
        const records = processModelRecords(data.data);
        setModelRecords(records);
        setTotalCount(records.length);
      } else {
        console.error('Failed to fetch model records:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching model records:', error);
      message.error('获取模型记录失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理模型记录数据
  const processModelRecords = (data: any[]): ModelRecord[] => {
    // 模型类型映射
    const modelTypeMap: Record<number, string> = {
      0: '未知',
      1: '分类模型',
      2: '回归模型',
      3: '聚类模型',
      4: 'NLP模型'
    };

    // 状态颜色映射
    const statusMap: Record<string, string> = {
      'train_failed': '训练失败',
      'train_success': '训练完成',
      'evaluate_failed': '评估失败',
      'completed': '完成'
    };

    // 格式化文件大小
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return data.map((item, index) => ({
      id: index + 1,
      status: statusMap[item.status] || '未知',
      request_id: item.request_id || '无',
      model_type: modelTypeMap[item.model_info.model_type] || '无',
      model_algorithm: item.model_info.model_algorithm || '无',
      model_framework: item.model_info.model_framework || '无',
      model_name: item.model_info.model_name || '无',
      test_size: item.model_info.test_size || '无',
      training_time: item.model_info.training_time || '无',
      model_hash: item.model_info.model_hash || '无',
      source_hash: item.source_file_hash || '无',
      create_time: item.created_time || '无',
      onchain: item.onchain ? '是' : '否',
      feature_count: item.model_info.feature_count || '无',
      rows_count: item.model_info.rows_count || '无',
      model_size: formatSize(item.model_info.model_size) || '无'
    }));
  };

  // 过滤模型记录
  const filterModelRecords = (records: ModelRecord[], type: 'all' | 'processing'): ModelRecord[] => {
    if (type === 'all') {
      return records;
    } else {
      return records.filter(record => record.status === '训练中' || record.status === '处理中');
    }
  };

  // 切换过滤类型
  const switchFilterType = (type: 'all' | 'processing') => {
    setFilterType(type);
  };

  // 获取模型详情
  const showModelDetail = (modelHash: string, sourceHash: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/ml/get_model_file_content/${sourceHash}/${modelHash}`;
    window.open(url, '_blank');
  };

  // 过滤后的记录
  const filteredRecords = filterModelRecords(modelRecords, filterType);

  return {
    modelRecords: filteredRecords,
    isLoading,
    totalCount,
    filterType,
    fetchModelRecords,
    switchFilterType,
    showModelDetail
  };
}
