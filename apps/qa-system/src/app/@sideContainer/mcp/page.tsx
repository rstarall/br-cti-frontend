'use client';

import React, { useState } from 'react';
import { useMCPStore,MCPItem as _MCPItem } from '@/stores/mcpStore';
import { Input, Button, List, Avatar,Dropdown,Menu,Modal } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { title } from 'process';




const MCPItem: React.FC<{ item: any }> = React.memo(({ item }) => {
  const [expanded, setExpanded] = React.useState(false);
  const {mcpList,editMCP,deleteMCP} = useMCPStore()
  const handleEdit = (mcpItem:_MCPItem) => {
    // Handle edit action here
  }
  const handleDelete = (mcpItem:_MCPItem) => {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除 "${mcpItem.title}" 吗？`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteMCP(mcpItem.id);
        },
      });
  }
  

  return (
    <div className="w-full border border-gray-200 p-4 pt-3
          rounded-md  hover:bg-gray-50 bg-white border-3 border-blue-400 boder-width-3 
          transition-shadow shadow-md cursor-pointer relative">
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-indigo-700">{item.title}</h3>
          <div className='flex items-center justify-end  hover:bg-blue-100 rounded'>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="edit" onClick={()=>handleEdit(item)}>编辑</Menu.Item>
                  <Menu.Item key="delete" onClick={()=>handleDelete(item)}>删除</Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </div>

        </div>
        <div className="flex flex-center items-center">
          <span className="w-auto px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {item.method}
          </span>
          <span className="text-sm text-gray-600 ml-1 overflow-hidden text-ellipsis whitespace-nowrap w-[calc(100vw-200px)]">
            {item.url}
          </span>
        </div>
      </div>
      <p className="text-gray-800 mb-3">{item.description}</p>
      {item.params_require && item.params_require.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm focus:outline-none"
          >
            {expanded ? '隐藏参数' : '展开参数'}
          </button>
          {expanded && (
            <div className="mt-2 bg-white border rounded-md px-3 py-2">
              <ul>
                {item.params_require.map((param: any) => (
                  <li key={param.name} className="w-full flex flex-col" >
                    <span className="w-full font-semibold text-gray-700 my-1 flex items-center">
                      <span>{param.name}</span>
                      <span className="inline-flex h-full items-center justify-center ml-2 px-2 py-1 bg-blue-100 text-gray-800 text-xs font-medium rounded-full leading-none">
                        {param.type}
                      </span>
                    </span>
                    <span className="w-full text-xs text-gray-500 my-1">{param.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
});


const MCPPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { mcpList } = useMCPStore();
  const handleSend = async () => {
    if (inputValue.trim()) {
      setInputValue('');
    }
  };


  
  const renderMCPItem = (item: any) => (
    <List.Item key={item.id}>
      <MCPItem item={item} />
    </List.Item>
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">MCP服务</h1>
      <div className="mb-4">
        <Input 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="输入MCP服务地址..." 
        />
        <Button 
          type="primary" 
          onClick={handleSend} 
          className="mt-2"
         >
          添加
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={mcpList}
        renderItem={renderMCPItem}
        className='h-[calc(100vh-200px)] w-full'
      />
    </div>
  );
};

export default MCPPage;
