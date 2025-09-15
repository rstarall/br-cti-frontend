import React, { useState } from 'react';
import { Card, Collapse, Tag, Typography, Space, Divider } from 'antd';
import { FileTextOutlined, PartitionOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { RetrievedDocument } from '../api/types';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface RetrievedDocsProps {
  documents: RetrievedDocument[];
}

const RetrievedDocs: React.FC<RetrievedDocsProps> = ({ documents }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!documents || documents.length === 0) {
    return null;
  }

  // 分类文档
  const docsByType = documents.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = [];
    }
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, RetrievedDocument[]>);

  const documentDocs = docsByType.document || [];
  const graphNodes = docsByType.graph_node || [];

  const renderDocument = (doc: RetrievedDocument, index: number) => (
    <Card
      key={`${doc.type}-${doc.id}-${index}`}
      size="small"
      className="mb-2 border-l-4 border-l-blue-400"
      bodyStyle={{ padding: '8px 12px' }}
    >
      <div className="flex items-start gap-2">
        <FileTextOutlined className="text-blue-500 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Text strong className="text-sm truncate">
              {doc.filename || '未知文档'}
            </Text>
            <Tag size="small" color="blue">文档</Tag>
          </div>
          {doc.content && (
            <Paragraph
              className="text-xs text-gray-600 mb-0"
              ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
            >
              {doc.content}
            </Paragraph>
          )}
        </div>
      </div>
    </Card>
  );

  const renderGraphNode = (node: RetrievedDocument, index: number) => (
    <Card
      key={`${node.type}-${node.id}-${index}`}
      size="small"
      className="mb-2 border-l-4 border-l-green-400"
      bodyStyle={{ padding: '8px 12px' }}
    >
      <div className="flex items-start gap-2">
        <PartitionOutlined className="text-green-500 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Text strong className="text-sm truncate">
              {node.name || '未知节点'}
            </Text>
            <Tag size="small" color="green">图谱</Tag>
          </div>
          {node.label && (
            <Text className="text-xs text-gray-500">
              类型: {node.label}
            </Text>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="mb-3">
      <div 
        className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 rounded-t-lg border"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <Text strong className="text-sm text-gray-700">
            📚 召回信息
          </Text>
          <Tag size="small" color="orange">
            {documents.length} 项
          </Tag>
        </div>
        {collapsed ? <DownOutlined className="text-gray-400" /> : <UpOutlined className="text-gray-400" />}
      </div>
      
      {!collapsed && (
        <div className="border border-t-0 rounded-b-lg p-3 bg-white">
          {documentDocs.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <FileTextOutlined className="text-blue-500" />
                <Text strong className="text-sm">知识库文档</Text>
                <Tag size="small" color="blue">{documentDocs.length}</Tag>
              </div>
              <div className="space-y-2">
                {documentDocs.map(renderDocument)}
              </div>
            </div>
          )}

          {graphNodes.length > 0 && (
            <div>
              {documentDocs.length > 0 && <Divider className="my-3" />}
              <div className="flex items-center gap-2 mb-2">
                <PartitionOutlined className="text-green-500" />
                <Text strong className="text-sm">知识图谱节点</Text>
                <Tag size="small" color="green">{graphNodes.length}</Tag>
              </div>
              <div className="space-y-2">
                {graphNodes.map(renderGraphNode)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RetrievedDocs;
