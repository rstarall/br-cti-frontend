import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RetrievedDocs from '../RetrievedDocs';
import { RetrievedDocument } from '../../api/types';

// Mock Ant Design components
jest.mock('antd', () => ({
  Card: ({ children, className, bodyStyle, ...props }: any) => (
    <div className={className} style={bodyStyle} {...props}>
      {children}
    </div>
  ),
  Tag: ({ children, color, size }: any) => (
    <span className={`tag-${color} tag-${size}`}>{children}</span>
  ),
  Typography: {
    Text: ({ children, strong, className }: any) => (
      <span className={`${strong ? 'font-bold' : ''} ${className || ''}`}>
        {children}
      </span>
    ),
    Paragraph: ({ children, className, ellipsis }: any) => (
      <p className={className} title={ellipsis ? 'ellipsis' : undefined}>
        {children}
      </p>
    ),
  },
}));

// Mock icons
jest.mock('@ant-design/icons', () => ({
  FileTextOutlined: () => <span data-testid="file-icon">📄</span>,
  PartitionOutlined: () => <span data-testid="graph-icon">🔗</span>,
  DownOutlined: () => <span data-testid="down-icon">⬇️</span>,
  UpOutlined: () => <span data-testid="up-icon">⬆️</span>,
}));

describe('RetrievedDocs Component', () => {
  const mockDocuments: RetrievedDocument[] = [
    {
      type: 'document',
      id: 'doc1',
      filename: '测试文档.pdf',
      content: '这是一个测试文档的内容，包含了一些重要的信息...',
    },
    {
      type: 'graph_node',
      id: 'node1',
      name: '测试节点',
      label: '实体',
    },
  ];

  test('renders nothing when no documents provided', () => {
    const { container } = render(<RetrievedDocs documents={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when documents is undefined', () => {
    const { container } = render(<RetrievedDocs documents={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders retrieved documents correctly', () => {
    render(<RetrievedDocs documents={mockDocuments} />);
    
    // Check header
    expect(screen.getByText('📚 召回信息')).toBeInTheDocument();
    expect(screen.getByText('2 项')).toBeInTheDocument();
    
    // Check document section
    expect(screen.getByText('知识库文档')).toBeInTheDocument();
    expect(screen.getByText('测试文档.pdf')).toBeInTheDocument();
    expect(screen.getByText(/这是一个测试文档的内容/)).toBeInTheDocument();
    
    // Check graph node section
    expect(screen.getByText('知识图谱节点')).toBeInTheDocument();
    expect(screen.getByText('测试节点')).toBeInTheDocument();
    expect(screen.getByText('类型: 实体')).toBeInTheDocument();
  });

  test('toggles collapse state when header is clicked', () => {
    render(<RetrievedDocs documents={mockDocuments} />);
    
    const header = screen.getByText('📚 召回信息').closest('div');
    
    // Initially expanded (up arrow should be visible)
    expect(screen.getByTestId('up-icon')).toBeInTheDocument();
    expect(screen.getByText('测试文档.pdf')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(header!);
    
    // Should be collapsed (down arrow should be visible)
    expect(screen.getByTestId('down-icon')).toBeInTheDocument();
    expect(screen.queryByText('测试文档.pdf')).not.toBeInTheDocument();
    
    // Click to expand again
    fireEvent.click(header!);
    
    // Should be expanded again
    expect(screen.getByTestId('up-icon')).toBeInTheDocument();
    expect(screen.getByText('测试文档.pdf')).toBeInTheDocument();
  });

  test('renders only documents when no graph nodes', () => {
    const documentsOnly: RetrievedDocument[] = [
      {
        type: 'document',
        id: 'doc1',
        filename: '文档1.pdf',
        content: '文档内容',
      },
    ];
    
    render(<RetrievedDocs documents={documentsOnly} />);
    
    expect(screen.getByText('知识库文档')).toBeInTheDocument();
    expect(screen.queryByText('知识图谱节点')).not.toBeInTheDocument();
  });

  test('renders only graph nodes when no documents', () => {
    const graphNodesOnly: RetrievedDocument[] = [
      {
        type: 'graph_node',
        id: 'node1',
        name: '节点1',
        label: '实体',
      },
    ];
    
    render(<RetrievedDocs documents={graphNodesOnly} />);
    
    expect(screen.getByText('知识图谱节点')).toBeInTheDocument();
    expect(screen.queryByText('知识库文档')).not.toBeInTheDocument();
  });

  test('handles documents without optional fields', () => {
    const minimalDocuments: RetrievedDocument[] = [
      {
        type: 'document',
        id: 'doc1',
        // No filename or content
      },
      {
        type: 'graph_node',
        id: 'node1',
        // No name or label
      },
    ];
    
    render(<RetrievedDocs documents={minimalDocuments} />);
    
    expect(screen.getByText('未知文档')).toBeInTheDocument();
    expect(screen.getByText('未知节点')).toBeInTheDocument();
  });
});
