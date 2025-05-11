'use client'
import React, { useState } from 'react';
import { useWindowManager } from '@/provider/WindowManager';
import {
  KubernetesOutlined,
  WalletOutlined,
  DatabaseOutlined,
  CodepenOutlined,
  FundViewOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

// 导入页面组件
import NetworkPage from '@/app/client/network/page';
import WalletPage from '@/app/client/wallet/page';
import LocalDataPage from '@/app/client/local-data/page';
import MLModelPage from '@/app/client/ml-model/page';
import ChatPage from '@/app/client/chat/page';

interface MenuItem {
  action: string;
  title: string;
  icon: React.ReactNode;
  href: string;
  windowType: string;
  height: string|'300px';
  width: string|'450px';
  domContext: React.ReactNode|null;
  windowId?: string;
}

const Sidebar: React.FC = () => {
  const { openWindow, openFramelessWindow } = useWindowManager();
  const { t } = useTranslation('sidebar');
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      action: "network",
      title: t('networkConnection'),
      icon: <KubernetesOutlined />,
      href: "/client/network",
      windowType: "normal",
      width: "800px",
      height: "600px",
      domContext: <NetworkPage />,
      windowId: "network-window"
    },
    {
      action: "wallet",
      title: t('userCenter'),
      icon: <WalletOutlined />,
      href: "/client/wallet",
      windowType: "frameless",
      width: "400px",
      height: "650px",
      domContext: <WalletPage />,
      windowId: "wallet-window"
    },
    {
      action: "local-data",
      title: t('localData'),
      icon: <DatabaseOutlined />,
      href: "/client/local-data",
      windowType: "normal",
      width: "1000px",
      height: "700px",
      domContext: <LocalDataPage />,
      windowId: "local-data-window"
    },
    {
      action: "ml-model",
      title: t('modelManagement'),
      icon: <CodepenOutlined />,
      href: "/client/ml-model",
      windowType: "normal",
      width: "1000px",
      height: "700px",
      domContext: <MLModelPage />,
      windowId: "ml-model-window"
    },
    {
      action: "chat",
      title: t('intelligenceQA'),
      icon: <FundViewOutlined />,
      href: "/client/chat",
      windowType: "normal",
      width: "1000px",
      height: "700px",
      domContext: <ChatPage />,
      windowId: "chat-window"
    },
    {
      action: "dashboard",
      title: t('dataVisualization'),
      icon: <FundViewOutlined />,
      href: "http://localhost:8081/",
      windowType: "external",
      domContext: null,
      width: "800px",
      height: "600px"
    }
  ] as MenuItem[];

  const handleLinkClick = (_action: string, title: string, windowType: string, width: string, height: string, domContext: React.ReactNode, windowId?: string) => {
    if (windowType === "external") return;
    if (windowType === "frameless") {
      openFramelessWindow(title, domContext, width, height, windowId);
    } else {
      openWindow(title, domContext, width, height, windowId);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 侧边栏切换按钮 */}
      <button
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-l-md shadow-md z-[99999] transition-all duration-300"
        style={{ right: isOpen ? '110px' : '0' }}
        onClick={toggleSidebar}
        aria-label={isOpen ? "收起侧边栏" : "展开侧边栏"}
      >
        {isOpen ? <RightOutlined /> : <LeftOutlined />}
      </button>

      {/* 侧边栏主体 */}
      <div
        className={cn(
          "fixed right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 rounded-lg shadow-xl shadow-gray-300 w-auto min-w-[70px] max-w-[110px] z-[99999] transition-all duration-300",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        <div className="flex flex-col p-1">
          {menuItems.map((item, index) => (
            <div key={index} className="w-full">
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.windowType !== "external") {
                    e.preventDefault();
                    handleLinkClick(item.action, item.title, item.windowType, item.width, item.height, item.domContext, item.windowId);
                  }
                }}
                className="flex flex-col items-center p-2 w-full hover:bg-sky-600 hover:text-white rounded cursor-pointer text-center transition-colors duration-200"
                target={item.windowType === "external" ? "_blank" : undefined}
              >
                <div className="mb-1 text-2xl">{item.icon}</div>
                <div className="text-sm leading-tight break-words w-full">{item.title}</div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
