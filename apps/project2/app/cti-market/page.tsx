'use client';

import React, { useEffect } from 'react';
import { CTIFilter } from '@/components/front/cti-market/CTIFilter';
import { CTICard } from '@/components/front/cti-market/CTICard';
import { Pagination } from '@/components/front/common/Pagination';
import { StatCard } from '@/components/front/common/StatCard';
import { useCtiStore } from '@/store/ctiStore';
import { useCtiMarketStore } from '@/store/ctiMarketStore';

export default function CTIMarketPage() {
  // 从ctiStore获取统计数据
  const {
    statistics,
    fetchCtiStatistics,
    isLoading: statsLoading,
    error: statsError
  } = useCtiStore();

  // 从ctiMarketStore获取市场数据
  const {
    ctiList,
    currentPage,
    pageSize,
    totalCount,
    isLoading: marketLoading,
    error: marketError,
    fetchCtiList,
    setFilter
  } = useCtiMarketStore();

  // 合并加载状态和错误状态
  const isLoading = statsLoading || marketLoading;
  const error = marketError || statsError;

  useEffect(() => {
    // 获取情报列表和统计数据
    fetchCtiList();
    fetchCtiStatistics();
  }, [fetchCtiList, fetchCtiStatistics]);

  // 处理筛选
  const handleFilter = (type: number, trafficType: number, incentiveMechanism: number, keyword: string) => {
    setFilter(type, trafficType, incentiveMechanism, keyword);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    fetchCtiList(page);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">情报市场</h1>
          <p className="mt-2 text-lg text-gray-600">
            探索和购买高质量的威胁情报，提升您的安全防御能力
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="情报总数"
            value={statistics.totalCTICount.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          <StatCard
            title="我的情报"
            value={statistics.userCTICount.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            }
          />

          <StatCard
            title="我的上传"
            value={statistics.userUploadCount.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
          />

          <StatCard
            title="我的积分"
            value={statistics.userValue.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CTIFilter onFilter={handleFilter} />
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
                  onClick={() => fetchCtiList()}
                >
                  重试
                </button>
              </div>
            ) : ctiList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">暂无数据</h3>
                <p className="text-gray-600">没有找到符合条件的情报</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {ctiList.map((cti) => (
                    <CTICard key={cti.cti_id} cti={cti} />
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
