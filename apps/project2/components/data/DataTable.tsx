import React from 'react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';
import { useDataTable } from '@/hooks/localData/useDataTable';
import { Pagination } from 'antd';
import { StixRecord } from '@/api/types/localData';
import { useWindowManager } from '@/provider/WindowManager';
import StixContentViewer from './StixContentViewer';

export function DataTable() {
  const {
    data,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    pagination,
    handlePageChange
  } = useDataTable();
  const { openWindow } = useWindowManager();

  // 查看STIX文件详情
  const handleViewStixFile = (sourceHash: string, stixHash: string) => {
    // 使用WindowManager打开一个无边框窗口显示STIX内容
    openWindow(
      `STIX文件内容`,
      <StixContentViewer sourceFileHash={sourceHash} stixFileHash={stixHash} />,
      '800px',
      '600px',
      "view-stix-content",
      false
    );
  };

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <TabButton
            label="全部"
            isActive={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />
          <TabButton
            label="处理中"
            isActive={activeTab === 'processing'}
            onClick={() => setActiveTab('processing')}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">共查询到</span>
            <span className="text-sm font-bold text-blue-600">{pagination.total}</span>
            <span className="text-sm text-gray-500 ml-1">条数据</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* 添加水平滚动条 */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300/50 [&::-webkit-scrollbar-thumb]:rounded">
          <table className="min-w-[800px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STIX文件哈希
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  文件大小
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  上链状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    加载中...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                data.map((item: StixRecord) => (
                  <tr key={item.stix_file_hash} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stix_file_hash.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stix_type_name || getCtiTypeName(item.stix_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(item.stix_file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.create_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.onchain ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.onchain ? '已上链' : '未上链'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleViewStixFile(item.source_file_hash, item.stix_file_hash)}
                      >
                        查看
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页组件 - 现在使用前端分页 */}
        <div className="py-4 px-6 flex justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
          />
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function getCtiTypeName(type: number): string {
  switch (type) {
    case 1:
      return '恶意流量';
    case 2:
      return '蜜罐情报';
    case 3:
      return '僵尸网络';
    case 4:
      return '应用层攻击';
    case 5:
      return '开源情报';
    default:
      return '未知类型';
  }
}

