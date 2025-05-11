import React, { useState } from 'react';
import { Button, Progress, Tooltip, Tag } from 'antd';
import { FileOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatFileSize } from '@/utils/format';

interface TaskCardProps {
  fileName: string;
  fileHash: string;
  fileSize: string;
  status: {
    upload: boolean;
    stix: boolean;
    cti: boolean;
    upchain: boolean;
  };
  progress: {
    upload: number;
    stix: number;
    cti: number;
    upchain: number;
    current: number;
  };
  activeStep: 'upload' | 'stix' | 'cti' | 'upchain';
  uploadError?: string;
  onDelete?: () => void;
  showDelete?: boolean;
  children?: React.ReactNode;
}

export function TaskCard({
  fileName,
  fileHash,
  fileSize,
  status,
  progress,
  activeStep,
  uploadError,
  onDelete,
  showDelete,
  children
}: TaskCardProps) {
  // 获取当前步骤的状态文本
  const getStepStatusText = (step: 'upload' | 'stix' | 'cti' | 'upchain') => {
    if (step === 'upload') return status.upload ? '已上传' : '上传中';
    if (step === 'stix') return status.stix ? '已转换' : '配置中';
    if (step === 'cti') return status.cti ? '已转换' : '配置中';
    if (step === 'upchain') return status.upchain ? '已上链' : '配置中';
    return '';
  };

  // 获取当前步骤的状态颜色
  const getTagColor = (step: 'upload' | 'stix' | 'cti' | 'upchain') => {
    const stepStatus = getStepStatusText(step);
    let tagColor = 'blue';
    if (stepStatus.includes('已上传') || stepStatus.includes('已转换') || stepStatus.includes('已上链')) tagColor = 'success';
    if (uploadError) tagColor = 'error';
    return tagColor;
  };

  // 获取当前步骤的进度
  const getCurrentStepProgress = () => {
    return progress[activeStep];
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200">
      {/* 文件信息头部 */}
      <div className="w-full h-14 flex items-center px-3 py-2 relative overflow-hidden cursor-default border-b border-gray-200 bg-gray-50">
        {/* 顶部绝对定位进度条 */}
        {typeof getCurrentStepProgress() === 'number' && (
          <div className="absolute top-0 left-0 w-full z-10 m-0 p-0">
            <Progress
              percent={getCurrentStepProgress()}
              size="small"
              status={uploadError ? 'exception' : (getCurrentStepProgress() === 100 ? 'success' : 'active')}
              showInfo={false}
              className="rounded-t-xs m-0 p-0 flex items-center justify-center h-[2px]"
            />
          </div>
        )}
        <div className="flex items-center w-full h-full">
          <span className="flex items-center justify-center w-8 h-8 text-xl text-blue-500 bg-blue-50 rounded mr-3"><FileOutlined /></span>
          <div className="truncate max-w-[30%] min-w-[20%] text-xs font-medium mr-3">{fileName}</div>
          <Tooltip title={fileHash}>
            <div className="truncate w-[35%] text-xs text-gray-400 mr-3">
              {fileHash}
            </div>
          </Tooltip>
          <div className="w-[15%] text-xs text-gray-500 text-center mr-3">{formatFileSize(fileSize)}</div>
          <Tag color={getTagColor(activeStep)} className="w-[10%] text-center mr-2 text-xs px-3 py-0.5 ">{getStepStatusText(activeStep)}</Tag>
          {uploadError && <span className="text-red-500 ml-2 text-xs">{uploadError}</span>}
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {showDelete && (
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={onDelete}
              className="h-7 px-2 text-lx"
            />
          )}
        </div>
      </div>

      {/* 子组件（步骤内容） */}
      <div className="p-2">
        {children}
      </div>
    </div>
  );
}
