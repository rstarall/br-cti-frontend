import React from 'react';
import { useWindowManager } from '@/context/WindowManager';
import { KubernetesOutlined, WalletOutlined, DatabaseOutlined, CodepenOutlined, FundViewOutlined, TransactionOutlined } from '@ant-design/icons';
import { TransactionWindow } from '@/components/pages/sidebar_window/TransactionWindow';
import { WalletWindow } from '@/components/pages/sidebar_window/WalletWindow';
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

  const menuItems = [
    {
      action: "network",
      title: "网络连接",
      icon: <KubernetesOutlined />,
      href: "/client/network",
      windowType: "normal",
      width: "350px",
      height: "500px",
      domContext: <div>网络连接组件</div>
    },
    {
      action: "wallet",
      title: "账户钱包",
      icon: <WalletOutlined />,
      href: "/client/wallet",
      windowType: "frameless",
      width: "340px",
      height: "550px",
      domContext: <WalletWindow />,
      windowId: "wallet-window"
    },
    {
        action: "incentive",
        title: "情报交易",
        icon: <TransactionOutlined />,
        href: "/client/incentive",
        windowType: "normal",
        width: "850px",
        height: "600px",
        domContext: <TransactionWindow />
    },
    {
      action: "local-data",
      title: "本地数据",
      icon: <DatabaseOutlined />,
      href: "/client/local-data",
      windowType: "normal",
      width: "800px",
      height: "500px",
      domContext: <div>本地数据组件</div>
    },
    {
      action: "ml-model",
      title: "模型管理",
      icon: <CodepenOutlined />,
      href: "/client/ml-model",
      windowType: "normal",
      width: "800px",
      height: "500px",
      domContext: <div>模型管理组件</div>
    },
    {
      action: "dashboard",
      title: "大屏展示",
      icon: <FundViewOutlined />,
      href: "http://localhost:8081/",
      windowType: "external",
      domContext: null
    }
  ] as MenuItem[];

  const handleLinkClick = (action: string, title: string, windowType: string, width: string, height: string, domContext: React.ReactNode, windowId?: string) => {
    if (windowType === "external") return;
    if (windowType === "frameless") {
      openFramelessWindow(title, domContext, width, height, windowId);
    } else {
      openWindow(title, domContext, width, height, windowId);
    }
  };

  return (
    <div className="fixed right-[5px] top-1/2 transform -translate-y-1/2 w-20 bg-white text-gray-800 rounded-lg shadow-xl shadow-gray-300">
      <div className="flex flex-col p-1">
        {menuItems.map((item, index) => (
          <div key={index} >
            <a
              href={item.href}
              onClick={(e) => {
                if (item.windowType !== "external") {
                  e.preventDefault();
                  handleLinkClick(item.action, item.title, item.windowType, item.width, item.height, item.domContext, item.windowId);
                }
              }}
              className="flex flex-col items-center p-2 w-full hover:bg-sky-800 hover:text-white rounded cursor-pointer text-center"
              target={item.windowType === "external" ? "_blank" : undefined}
            >
              <div className="mb-1 text-2xl">{item.icon}</div>
              <div className="text-sm leading-tight">{item.title}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
