'use client';
import { useState,useEffect } from 'react';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import {
    MessageOutlined,
    FolderOutlined,
    ControlOutlined,
    MergeOutlined,
    BulbOutlined,
    DeploymentUnitOutlined,
    SettingOutlined,
    RedditOutlined,
    ApiOutlined,
  } from '@ant-design/icons';
import { useFixedSiderWidth } from './Index';
const items: MenuProps['items'] = [
  {
    key: '/chat',
    label: '实时聊天',
    icon: <MessageOutlined />,
  },
  {
    key: '/data',
    label: '知识库',
    icon: <BulbOutlined />,
  },
  {
    key: '/kg',
    label: '知识图谱',
    icon: <DeploymentUnitOutlined />,
  },
  {
    key: '/agent',
    label: '智能体',
    icon: <RedditOutlined />,
  },
  {
    key: '/mcp',
    label: 'MCP',
    icon: <ApiOutlined />,
  }, 
];

const sideContainerWidthList:Record<string,number> = {
  '/chat': 340,
  '/data': 340,
  '/kg': 340,
  '/agent': 340,
  '/mcp': 340,
  '/setting': 640,
};


export default function Sidebar() {
  const router = useRouter();
  const [current, setCurrent] = useState("/chat");
  const [isHovered, setIsHovered] = useState(false);
  const { setWidth } = useFixedSiderWidth();
  const handleResize = (width: number) => {
    setWidth(width);
  };
  //获取当前路由
  useEffect(() => {
    // 获取当前URL路径
    const currentPath = window.location.pathname;
    if(currentPath)
      setCurrent(currentPath);
  }, [])
  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    const newWidth = sideContainerWidthList[e.key] || 340;
    handleResize(newWidth);
    router.push(e.key);
  };


  return (
    <div className="h-full pt-[10px]" 
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}
    >
      <Menu
        mode='inline'
        inlineCollapsed={!isHovered}
        selectedKeys={[current]}
        items={items}
        onClick={onClick}
        className=' h-full flex flex-col items-start justify-start'
      />
      <div className="absolute bottom-0 h-[20px] w-[90%] mb-4 text-xl px-2 py-5 mx-2 flex items-center 
                  justify-start text-gray-500 
                  cursor-pointer hover:text-gray-700
                  hover:bg-blue-100 rounded-md transition-all duration-300    
                  "
        onClick={() => {
          router.push('/setting')
          setCurrent('/setting');
          handleResize(sideContainerWidthList['/setting']|| 640);
        }}
        >
        <SettingOutlined />
        <span className='text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis ml-2'
              style={{ display: isHovered ? 'block' : 'none' }}
         >
          设置
        </span>
      </div>
    </div>
  );
}