'use client';

import React, { useEffect, useState } from 'react';
import { ModelFilter } from '@/components/front/model-market/ModelFilter';
import { ModelCard } from '@/components/front/model-market/ModelCard';
import { Pagination } from '@/components/front/common/Pagination';
import { StatCard } from '@/components/front/common/StatCard';
import { useModelMarketStore } from '@/store/modelMarketStore';

export default function ModelMarketPage() {
  const {
    modelList,
    totalCount,
    currentPage: storePage,
    pageSize: storePageSize,
    isLoading,
    error,
    fetchModelList,
    setFilter
  } = useModelMarketStore();

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterType, setFilterType] = useState(-1);
  const [filterIncentiveMechanism, setFilterIncentiveMechanism] = useState(-1);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // 获取模型列表
    fetchModelList(currentPage, pageSize, filterType, filterIncentiveMechanism, searchKeyword);
  }, []);

  // 处理筛选
  const handleFilter = (type: number, incentiveMechanism: number, keyword: string) => {
    setFilterType(type);
    setFilterIncentiveMechanism(incentiveMechanism);
    setSearchKeyword(keyword);
    setCurrentPage(1); // 重置到第一页

    // 使用 store 的 setFilter 方法
    setFilter(type, incentiveMechanism, keyword);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchModelList(page, pageSize, filterType, filterIncentiveMechanism, searchKeyword);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">模型市场</h1>
          <p className="mt-2 text-lg text-gray-600">
            探索和购买高质量的入侵检测和防御模型，提升您的安全防御能力
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="模型总数"
            value={totalCount.toString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            }
          />

          <StatCard
            title="我的模型"
            value="0"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            }
          />

          <StatCard
            title="我的上传"
            value="0"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
          />

          <StatCard
            title="本地模型"
            value="0"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ModelFilter onFilter={handleFilter} />
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">加载失败</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  onClick={() => fetchModelList(currentPage, pageSize, filterType, filterIncentiveMechanism, searchKeyword)}
                >
                  重试
                </button>
              </div>
            ) : modelList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">暂无数据</h3>
                <p className="text-gray-600">没有找到符合条件的模型</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {modelList.map((model) => (
                    <ModelCard key={model.model_id} model={model} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalCount / pageSize)}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
