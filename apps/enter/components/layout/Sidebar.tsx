'use client'
import React, { useState } from 'react';
import { useWindowManager } from '@/provider/WindowManager';
import {
  SafetyCertificateOutlined,
  AlertOutlined,
  ScanOutlined,
  FileSearchOutlined,
  FundViewOutlined,
  FileTextOutlined,
  DashboardOutlined,
  SafetyOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
// import { useTranslation } from 'react-i18next'; // 暂时不使用翻译
import { cn } from '@/lib/utils';

// 导入智能博弈风险发现组件
// import GameTheoryModel from '@/components/discovery/GameTheoryModel';
// import OptimalStrategy from '@/components/discovery/OptimalStrategy';
// import DefenseRulesDiscovery from '@/components/discovery/DefenseRulesDiscovery';

// 导入情报知识共享平面组件
// import IntelligenceSharing from '@/components/share/IntelligenceSharing';
// import IncentiveMechanism from '@/components/share/IncentiveMechanism';
// import ThreatSituation from '@/components/share/ThreatSituation';

// 导入未知风险主动防御组件
// import AttackMonitoring from '@/components/defense/AttackMonitoring';
// import ActiveDefense from '@/components/defense/ActiveDefense';

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
  category?: string;
}

const Sidebar: React.FC = () => {
  const { openWindow, openFramelessWindow } = useWindowManager();
  // const { t } = useTranslation('sidebar'); // 暂时不使用翻译
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    // 智能博弈风险发现 - 采用博弈理论(联盟博弈、超博弈)进行分析
    // {
    //   action: "game-theory-model",
    //   title: "博弈模型",
    //   icon: <SafetyCertificateOutlined />,
    //   href: "/discovery",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <GameTheoryModel />,
    //   windowId: "game-theory-model-window",
    //   category: "discovery"
    // },
    // {
    //   action: "optimal-strategy",
    //   title: "最优策略",
    //   icon: <AlertOutlined />,
    //   href: "/discovery",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <OptimalStrategy />,
    //   windowId: "optimal-strategy-window",
    //   category: "discovery"
    // },
    // {
    //   action: "defense-rules",
    //   title: "防御规则",
    //   icon: <ScanOutlined />,
    //   href: "/discovery",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <DefenseRulesDiscovery />,
    //   windowId: "defense-rules-window",
    //   category: "discovery"
    // },

    // // 情报知识共享平面
    // {
    //   action: "intelligence-sharing",
    //   title: "情报共享",
    //   icon: <FileSearchOutlined />,
    //   href: "/share",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <IntelligenceSharing />,
    //   windowId: "intelligence-sharing-window",
    //   category: "share"
    // },
    // {
    //   action: "incentive-mechanism",
    //   title: "激励机制",
    //   icon: <FundViewOutlined />,
    //   href: "/share",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <IncentiveMechanism />,
    //   windowId: "incentive-mechanism-window",
    //   category: "share"
    // },
    // {
    //   action: "threat-situation",
    //   title: "威胁态势",
    //   icon: <FileTextOutlined />,
    //   href: "/share",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <ThreatSituation />,
    //   windowId: "threat-situation-window",
    //   category: "share"
    // },

    // // 未知风险主动防御 - 采用强化学习进行DDoS监控、蜜罐网络监控和流量重定向
    // {
    //   action: "active-defense",
    //   title: "主动防御",
    //   icon: <SafetyOutlined />,
    //   href: "/defense",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <ActiveDefense />,
    //   windowId: "active-defense-window",
    //   category: "defense"
    // },
    // {
    //   action: "attack-monitoring",
    //   title: "攻击监控",
    //   icon: <DashboardOutlined />,
    //   href: "/defense",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <AttackMonitoring />,
    //   windowId: "attack-monitoring-window",
    //   category: "defense"
    // },
    // { //首页侧边栏卡片
    //   action: "defense-rules",
    //   title: "DDos检测", //原来为“防御规则”
    //   icon: <FileTextOutlined />,
    //   href: "/defense",
    //   windowType: "normal",
    //   width: "800px",
    //   height: "600px",
    //   domContext: <DefenseRules />,
    //   windowId: "defense-rules-window",
    //   category: "defense"
    // }
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

  // 按类别分组菜单项
  const discoveryItems = menuItems.filter(item => item.category === 'discovery');
  const shareItems = menuItems.filter(item => item.category === 'share');
  const defenseItems = menuItems.filter(item => item.category === 'defense');

  return (
    <>
      {/* 侧边栏切换按钮 */}
      {/* <button
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-l-md shadow-md z-[99999] transition-all duration-300"
        style={{ right: isOpen ? '150px' : '0' }}
        onClick={toggleSidebar}
        aria-label={isOpen ? "收起侧边栏" : "展开侧边栏"}
      >
        {isOpen ? <RightOutlined /> : <LeftOutlined />}
      </button> */}

      {/* 侧边栏主体 */}
      <div
        // className={cn(
        //   "fixed right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 rounded-lg shadow-xl shadow-gray-300 w-auto min-w-[120px] max-w-[150px] z-[99999] transition-all duration-300",
        //   isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        // )}
      >
        <div className="flex flex-col p-2">
          {/* 智能博弈风险发现 */}
          {/* <div className="mb-4">
            <div className="text-xs text-center font-medium text-gray-500 mb-2 pb-1 border-b border-gray-200">
              智能博弈风险发现
            </div>
            <div className="space-y-2">
              {discoveryItems.map((item, index) => (
                <div key={`discovery-${index}`} className="w-full">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.action, item.title, item.windowType, item.width, item.height, item.domContext, item.windowId);
                    }}
                    className="flex items-center p-2 w-full hover:bg-sky-600 hover:text-white rounded cursor-pointer transition-colors duration-200"
                  >
                    <div className="mr-2 text-lg">{item.icon}</div>
                    <div className="text-sm">{item.title}</div>
                  </a>
                </div>
              ))}
            </div>
          </div> */}

          {/* 情报知识共享平面 */}
          {/* <div className="mb-4">
            <div className="text-xs text-center font-medium text-gray-500 mb-2 pb-1 border-b border-gray-200">
              情报知识共享平面
            </div>
            <div className="space-y-2">
              {shareItems.map((item, index) => (
                <div key={`share-${index}`} className="w-full">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.action, item.title, item.windowType, item.width, item.height, item.domContext, item.windowId);
                    }}
                    className="flex items-center p-2 w-full hover:bg-sky-600 hover:text-white rounded cursor-pointer transition-colors duration-200"
                  >
                    <div className="mr-2 text-lg">{item.icon}</div>
                    <div className="text-sm">{item.title}</div>
                  </a>
                </div>
              ))}
            </div>
          </div> */}

          {/* 未知风险主动防御 */}
          {/* <div>
            <div className="text-xs text-center font-medium text-gray-500 mb-2 pb-1 border-b border-gray-200">
              未知风险主动防御
            </div>
            <div className="space-y-2">
              {defenseItems.map((item, index) => (
                <div key={`defense-${index}`} className="w-full">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.action, item.title, item.windowType, item.width, item.height, item.domContext, item.windowId);
                    }}
                    className="flex items-center p-2 w-full hover:bg-sky-600 hover:text-white rounded cursor-pointer transition-colors duration-200"
                  >
                    <div className="mr-2 text-lg">{item.icon}</div>
                    <div className="text-sm">{item.title}</div>
                  </a>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
