import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatFileSize } from '@/lib/utils';
import { TagList } from '@/components/front/common/TagList';
import { useWindowManager } from '@/provider/WindowManager';
import { IPFSContentViewer } from './IPFSContentViewer';

interface CTIItem {
  cti_id: string;
  cti_name: string;
  cti_type: number;
  cti_traffic_type: number;
  creator_user_id: string;
  creator_user_name?: string; // Make this optional to match CTIInfo
  tags: string[];
  description: string;
  data_size: number;
  create_time: string;
  price: number;
  status: string;
  incentive_mechanism: number;
  hash?: string; // CTI hash
  ipfs_hash?: string; // IPFS hash
}

interface CTICardProps {
  cti: CTIItem;
  className?: string;
}

export function CTICard({ cti, className = '' }: CTICardProps) {
  const { openWindow } = useWindowManager();

  // 获取情报类型名称
  const getTypeName = (type: number): string => {
    switch (type) {
      case 1: return '恶意流量';
      case 2: return '蜜罐情报';
      case 3: return '僵尸网络';
      case 4: return '应用层攻击';
      case 5: return '开源情报';
      default: return '未知类型';
    }
  };

  // 获取流量类型名称
  const getTrafficTypeName = (type: number): string => {
    switch (type) {
      case 1: return '5G';
      case 2: return '卫星网络';
      case 3: return 'SDN';
      case 4: return '非流量';
      default: return '未知类型';
    }
  };

  // 获取激励机制名称
  const getIncentiveMechanismName = (type: number): string => {
    switch (type) {
      case 1: return '积分激励';
      case 2: return '三方博弈';
      case 3: return '演化博弈';
      default: return '未知机制';
    }
  };

  // 格式化时间
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
    } catch (error) {
      return timeString;
    }
  };

  // 判断是否为用户拥有的情报
  const isOwnedCTI = () => {
    // 在"我的情报"页面中，所有显示的情报都是用户拥有的
    // 可以通过status字段判断是否为用户拥有的情报
    return typeof window !== 'undefined' && window.location.pathname.includes('/cti-own');
  };

  // 打开情报内容查看窗口
  const handleViewContent = () => {
    // 优先使用ipfs_hash，如果不存在则使用hash
    const ipfsHash = cti.ipfs_hash || cti.hash;

    if (!ipfsHash) {
      console.error('情报哈希为空，无法查看内容');
      return;
    }

    openWindow(
      `查看情报内容: ${cti.cti_name}`,
      <IPFSContentViewer ipfsHash={ipfsHash} />,
      '800px',
      '600px'
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/cti-market/${cti.cti_id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
            {cti.cti_name}
          </Link>
          <div className="text-lg font-bold text-primary-600">
            {cti.price} 积分
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {cti.description}
        </p>

        <div className="flex flex-wrap gap-y-2 text-sm text-gray-500 mb-4">
          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{getTypeName(cti.cti_type)}</span>
          </div>

          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{cti.creator_user_id.substring(0, 6)}</span>
          </div>

          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>{formatFileSize(cti.data_size)}</span>
          </div>

          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{getIncentiveMechanismName(cti.incentive_mechanism)}</span>
          </div>
        </div>

        <TagList tags={cti.tags} size="sm" />

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {formatTime(cti.create_time)}
          </div>

          <div className="flex gap-3">
            {isOwnedCTI() && (cti.ipfs_hash || cti.hash) && (
              <button
                onClick={handleViewContent}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                查看内容
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            <Link
              href={`/cti-market/${cti.cti_id}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              查看详情
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
