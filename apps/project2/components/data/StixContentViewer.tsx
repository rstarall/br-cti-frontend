'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Alert, Button } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { localDataApi } from '@/api/localData';
import { useMessage } from '@/provider/MessageProvider';

interface StixContentViewerProps {
  sourceFileHash: string;
  stixFileHash: string;
  windowId?: string;
}

const StixContentViewer: React.FC<StixContentViewerProps> = ({ 
  sourceFileHash, 
  stixFileHash,
  windowId 
}) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { messageApi } = useMessage();

  useEffect(() => {
    const fetchStixContent = async () => {
      try {
        setLoading(true);
        const data = await localDataApi.getStixFileContent(sourceFileHash, stixFileHash);
        setContent(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching STIX content:', err);
        setError(err.message || '获取STIX文件内容失败');
      } finally {
        setLoading(false);
      }
    };

    if (sourceFileHash && stixFileHash) {
      fetchStixContent();
    }
  }, [sourceFileHash, stixFileHash]);

  const handleCopy = () => {
    try {
      const textToCopy = typeof content === 'object' 
        ? JSON.stringify(content, null, 2) 
        : String(content);
      
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      messageApi.success('复制成功');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      messageApi.error('复制失败');
    }
  };

  const formatContent = () => {
    if (!content) return '';
    
    try {
      if (typeof content === 'object') {
        return JSON.stringify(content, null, 2);
      }
      
      // Try to parse if it's a JSON string
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If parsing fails, return as is
      return String(content);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin tip="加载中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="text-sm text-gray-500">
          <span className="font-medium">源文件哈希:</span> {sourceFileHash}
        </div>
        <Button
          type="text"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          className="text-blue-500 hover:text-blue-700"
        >
          {copied ? '已复制' : '复制内容'}
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-2 bg-gray-50">
        <pre className="text-sm whitespace-pre-wrap font-mono">
          {formatContent()}
        </pre>
      </div>
    </div>
  );
};

export default StixContentViewer;
