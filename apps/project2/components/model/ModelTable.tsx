import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, Space, Tooltip } from 'antd';
import { EyeOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useModelTable } from '@/hooks/mlModel/useModelTable';
import { useLocalMLStore } from '@/store/localMLStore';

interface ModelTableProps {
  onUploadClick: () => void;
}

export function ModelTable({ onUploadClick }: ModelTableProps) {
  const { tasks } = useLocalMLStore();
  const {
    modelRecords,
    isLoading,
    totalCount,
    filterType,
    fetchModelRecords,
    switchFilterType,
    showModelDetail
  } = useModelTable();

  // 初始化时获取模型记录
  useEffect(() => {
    // 如果有任务，获取每个任务的模型记录
    if (tasks.length > 0) {
      // 过滤出有效的任务（文件哈希不为空）
      const validTasks = tasks.filter(task => task.file_hash && task.file_hash.trim() !== '');

      // 对每个有效任务获取模型记录
      validTasks.forEach(task => {
        fetchModelRecords(task.file_hash);
      });
    }
  }, [tasks]);

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        if (status === '训练完成') color = 'blue';
        if (status === '完成') color = 'green';
        if (status === '训练失败' || status === '评估失败') color = 'red';

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '模型类型',
      dataIndex: 'model_type',
      key: 'model_type',
      width: 100,
    },
    {
      title: '算法',
      dataIndex: 'model_algorithm',
      key: 'model_algorithm',
      width: 120,
    },
    {
      title: '框架',
      dataIndex: 'model_framework',
      key: 'model_framework',
      width: 120,
    },
    {
      title: '特征数',
      dataIndex: 'feature_count',
      key: 'feature_count',
      width: 80,
    },
    {
      title: '样本数',
      dataIndex: 'rows_count',
      key: 'rows_count',
      width: 80,
    },
    {
      title: '模型大小',
      dataIndex: 'model_size',
      key: 'model_size',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 150,
    },
    {
      title: '上链',
      dataIndex: 'onchain',
      key: 'onchain',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => showModelDetail(record.model_hash, record.source_hash)}
            >
              查看
            </Button>
          </Tooltip>

          {record.onchain !== '是' && (
            <Tooltip title="模型上链">
              <Button
                type="default"
                size="small"
                icon={<CloudUploadOutlined />}
                onClick={() => {
                  // 跳转到上链步骤
                  // 这里可以实现跳转到上链步骤的逻辑
                }}
              >
                上链
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            type={filterType === 'all' ? 'primary' : 'default'}
            onClick={() => switchFilterType('all')}
          >
            全部
          </Button>
          <Button
            type={filterType === 'processing' ? 'primary' : 'default'}
            onClick={() => switchFilterType('processing')}
          >
            处理中
          </Button>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">共查询到</span>
          <span className="text-sm font-bold">{totalCount}</span>
          <span className="text-sm text-gray-500 ml-1">个模型</span>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={modelRecords}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total) => `共 ${total} 条记录`,
          align:"center"
        }}
        className="bg-white rounded-lg shadow-md overflow-x-auto"
      />
    </div>
  );
}
