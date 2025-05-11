import React, { useState, useRef } from 'react';
import { Button, Progress, Card, Typography, Upload, message } from 'antd';
import { UploadOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { useModelUpload } from '@/hooks/mlModel/useModelUpload';
import { useLocalMLStore } from '@/store/localMLStore';

const { Title, Text } = Typography;
const { Dragger } = Upload;

export function UploadStep() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { isUploading, uploadFile } = useModelUpload();
  const { tasks } = useLocalMLStore();

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    // 检查文件类型
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'txt'].includes(fileExt || '')) {
      message.error('只支持上传 CSV、XLSX 和 TXT 格式的文件');
      return;
    }

    // 上传文件
    await uploadFile(file);
  };

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // 处理文件拖放
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // 处理文件删除
  const handleDeleteFile = (fileHash: string) => {
    // 在实际应用中，这里应该调用API删除文件
    message.success('文件已删除');
  };

  // 上传组件属性
  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file: File) => {
      handleFileUpload(file);
      return false;
    },
    accept: '.csv,.xlsx,.txt'
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Title level={4}>数据集上传</Title>
        <Text type="secondary">上传数据集文件用于模型训练，支持 CSV、XLSX 和 TXT 格式</Text>
      </div>

      <Dragger 
        {...uploadProps}
        className="mb-6 bg-white"
        disabled={isUploading}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个文件上传，请选择 CSV、XLSX 或 TXT 格式的数据集文件
        </p>
      </Dragger>

      <div className="mt-6">
        <Title level={5} className="mb-4">已上传文件</Title>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <Text type="secondary">暂无上传文件，请先上传文件</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card 
                key={task.file_hash} 
                className="shadow-sm"
                size="small"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-medium">{task.file_name}</div>
                    <div className="text-xs text-gray-500">
                      文件哈希: {task.file_hash}
                    </div>
                    <div className="text-xs text-gray-500">
                      文件大小: {(task.file_size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    size="small"
                    onClick={() => handleDeleteFile(task.file_hash)}
                    disabled={task.status.upload}
                  >
                    删除
                  </Button>
                </div>
                
                <Progress 
                  percent={task.progress.upload} 
                  status={task.status.upload ? "success" : "active"}
                  size="small"
                />
                
                <div className="mt-2 text-right">
                  <Text type={task.status.upload ? "success" : "secondary"}>
                    {task.status.upload ? "上传完成" : `上传中 ${task.progress.upload}%`}
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
