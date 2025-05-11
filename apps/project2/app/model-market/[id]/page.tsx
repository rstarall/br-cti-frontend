'use client';

import React from 'react';
import Link from 'next/link';
import { ModelDetail } from '@/components/front/model-market/ModelDetail';

interface ModelDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  // 使用 React.use() 解包 params Promise
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/model-market"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回模型市场
          </Link>
        </div>

        <ModelDetail modelId={id} />
      </div>
    </div>
  );
}
