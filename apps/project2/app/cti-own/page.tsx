'use client';

import React, { useEffect } from 'react';
import { CTICard } from '@/components/front/cti-market/CTICard';
import { Button } from '@/components/ui/button';
import { useCtiStore } from '@/store/ctiStore';

export default function OwnCTIPage() {
  const { 
    ownCtiList, 
    isLoading, 
    error, 
    fetchOwnCtiList 
  } = useCtiStore();
  
  useEffect(() => {
    // 获取我的情报列表
    fetchOwnCtiList();
  }, []);
  
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">我的情报</h1>
            <p className="mt-2 text-lg text-gray-600">
              管理您上传和购买的情报
            </p>
          </div>
          
          <Button variant="primary">
            上传情报
          </Button>
        </div>
        
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
            <Button 
              variant="primary"
              onClick={() => fetchOwnCtiList()}
            >
              重试
            </Button>
          </div>
        ) : ownCtiList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">暂无数据</h3>
            <p className="text-gray-600 mb-4">您还没有上传或购买任何情报</p>
            <Button 
              variant="primary"
              onClick={() => window.location.href = '/cti-market'}
            >
              浏览情报市场
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownCtiList.map((cti) => (
              <CTICard key={cti.cti_id} cti={cti} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
