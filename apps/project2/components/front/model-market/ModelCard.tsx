import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatFileSize } from '@/lib/utils';
import { TagList } from '@/components/front/common/TagList';

// 与后端 ModelInfo 结构对齐的前端模型数据结构
interface ModelItem {
  model_id: string;                // 模型ID(链上生成)
  model_name: string;              // 模型名称
  model_type: number;              // 模型类型(1:分类模型、2:回归模型、3:聚类模型、4:NLP模型)
  model_algorithm?: string;        // 模型算法
  model_train_framework?: string;  // 模型训练框架(Scikit-learn、Pytorch、TensorFlow)
  model_open_source?: number;      // 是否开源
  model_features?: string[];       // 模型特征
  model_data_type?: number;        // 模型数据类型(1:流量(数据集)、2:情报(文本))
  model_data_size?: number;        // 模型训练数据大小
  model_data_ipfs_hash?: string;   // 模型训练数据IPFS地址
  model_ipfs_hash?: string;        // 模型IPFS地址

  creator_user_id?: string;        // 模型创建者ID
  creator_user_name?: string;      // 创建者名称
  description?: string;            // 模型描述
  model_hash?: string;             // 模型hash
  model_size?: number;             // 模型大小
  create_time?: string;            // 模型创建时间
  price?: number;                  // 价格（积分）
  status?: string;                 // 状态
  ref_cti_id?: string;             // 关联情报ID
  tags?: string[];                 // 模型标签
  incentive_mechanism?: number;    // 激励机制(1:积分激励、2:三方博弈、3:演化博弈)
  value?: number;                  // 模型价值
  need?: number;                   // 模型需求量
  purchase_count?: number;         // 下载/购买次数
  rating_score?: number;           // 评分
}

interface ModelCardProps {
  model: ModelItem;
  className?: string;
}

export function ModelCard({ model, className = '' }: ModelCardProps) {
  // 获取模型类型名称
  const getTypeName = (type: number): string => {
    switch (type) {
      case 1: return '分类模型';
      case 2: return '回归模型';
      case 3: return '聚类模型';
      case 4: return 'NLP模型';
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

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/model-market/${model.model_id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
            {model.model_name}
          </Link>
          <div className="text-lg font-bold text-primary-600">
            {model.price} 积分
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {model.description}
        </p>

        <div className="flex flex-wrap gap-y-2 text-sm text-gray-500 mb-4">
          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span>{getTypeName(model.model_type)}</span>
          </div>

          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{model.creator_user_name || (model.creator_user_id ? model.creator_user_id.substring(0, 6) : '未知')}</span>
          </div>

          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>{formatFileSize(model.model_size || 0)}</span>
          </div>

          <div className="w-1/2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{getIncentiveMechanismName(model.incentive_mechanism || 0)}</span>
          </div>

          {/* 显示模型算法（如果有） */}
          {model.model_algorithm && (
            <div className="w-1/2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{model.model_algorithm}</span>
            </div>
          )}

          {/* 显示模型训练框架（如果有） */}
          {model.model_train_framework && (
            <div className="w-1/2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>{model.model_train_framework}</span>
            </div>
          )}

          {/* 显示下载/购买次数（如果有） */}
          {model.purchase_count !== undefined && (
            <div className="w-1/2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>下载: {model.purchase_count}</span>
            </div>
          )}

          {/* 显示评分（如果有） */}
          {model.rating_score !== undefined && (
            <div className="w-1/2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>评分: {model.rating_score.toFixed(1)}</span>
            </div>
          )}

          {/* 显示关联情报（如果有） */}
          {model.ref_cti_id && (
            <div className="w-1/2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <Link href={`/cti-market/${model.ref_cti_id}`} className="text-primary-600 hover:underline">
                关联情报
              </Link>
            </div>
          )}
        </div>

        {model.tags && <TagList tags={model.tags} size="sm" />}

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {model.create_time ? formatTime(model.create_time) : '未知时间'}
          </div>

          <Link
            href={`/model-market/${model.model_id}`}
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
  );
}
