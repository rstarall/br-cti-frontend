import React from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface FileInfoCardProps {
  fileName: string;
  fileHash: string;
  fileSize: string;
  status: string;
  statusColor: string;
  actionText?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  progress?: {
    upload: number;
    stix: number;
    cti: number;
    upchain: number;
    current: number;
  } | number;
  uploading?: boolean;
  uploadError?: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

const FileInfoCard: React.FC<FileInfoCardProps> = ({
  fileName,
  fileHash,
  fileSize,
  status,
  statusColor,
  actionText,
  onAction,
  actionDisabled,
  progress,
  uploading,
  uploadError,
  showDelete,
  onDelete
}) => {
  // 获取当前活动步骤的进度
  const currentProgress = typeof progress === 'number'
    ? progress
    : progress?.current || 0;

  console.log('FileInfoCard 接收到的进度值:', progress, '处理后的进度值:', currentProgress);

  // 根据上传状态和错误确定卡片的样式
  const cardStyle = uploadError
    ? 'border-red-300 bg-red-50'
    : uploading
    ? 'border-blue-300 bg-blue-50'
    : 'border-gray-200 bg-white';

  return (
    <div className={`relative mb-4 rounded-lg border ${cardStyle} transition-all duration-200 overflow-hidden`}>
      {/* 进度条放在卡片顶部边缘 - 始终显示 */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
        {/* 添加一个最小宽度，确保即使进度为0也能看到进度条 */}
        <div
          className={`h-full ${uploadError ? "bg-red-500" : uploading ? "bg-blue-500" : "bg-green-500"}`}
          style={{
            width: `${Math.max(currentProgress, 1)}%`, // 最小宽度为1%
            transition: 'width 0.3s ease-in-out',
            position: 'absolute',
            top: 0,
            left: 0,
            borderTopRightRadius: '2px',
            borderBottomRightRadius: '2px'
          }}
        />
      </div>

      {/* 添加进度文本，便于调试 */}
      <div className="absolute top-2 right-2 text-xs text-gray-500">
        {currentProgress}%
      </div>

      <div className="flex justify-between items-start p-4">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="text-base font-medium text-gray-800 mr-2">{fileName}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
              {status}
            </span>
            {showDelete && (
              <Tooltip title="删除">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={onDelete}
                  className="ml-2 text-red-500 hover:text-red-700"
                  size="small"
                />
              </Tooltip>
            )}
          </div>

          <div className="mt-1 text-xs text-gray-500">
            <div>文件大小: {fileSize}</div>
            {fileHash && <div className="mt-0.5">文件哈希: {fileHash.substring(0, 16)}...</div>}
          </div>

          {uploadError && (
            <div className="mt-2 text-xs text-red-600">
              错误: {uploadError}
            </div>
          )}

          {/* 进度条已移至卡片顶部 */}
        </div>

        {actionText && onAction && (
          <Button
            type="primary"
            onClick={onAction}
            disabled={actionDisabled}
            className="ml-4 h-8"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileInfoCard;
