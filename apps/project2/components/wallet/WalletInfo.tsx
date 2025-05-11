import React from 'react';
import { Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, BarChartOutlined, StarOutlined } from '@ant-design/icons';
import { useWalletStore } from '@/store/walletStore';

export function WalletInfo() {
  const { userInfo, weeklyPoints } = useWalletStore();

  return (
    <div className="w-full bg-white">
      {/* Account Balance */}
      <div className="w-full flex flex-col items-start p-6 pb-4 bg-blue-50">
        <div className="text-sm text-gray-500 mb-1">账户余额</div>
        <div className="text-3xl font-bold mb-3 text-primary-600">
          <span>{userInfo?.value || 0}</span> <span className="text-lg">积分</span>
        </div>
        <div className="flex items-center bg-blue-50 py-1 rounded-full text-sm">
          <span className={`font-medium ${weeklyPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {weeklyPoints >= 0 ? '+' : ''}{weeklyPoints}
          </span>
          <span className="ml-1 text-gray-600">本周积分</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="w-full p-4 border-t border-gray-100">
        <div className="flex justify-between">
          <ToolbarItem icon={<ArrowUpOutlined />} label="转入" />
          <ToolbarItem icon={<ArrowDownOutlined />} label="转出" />
          <ToolbarItem icon={<BarChartOutlined />} label="收益" />
          <ToolbarItem icon={<StarOutlined />} label="CTI资产" />
        </div>
      </div>
    </div>
  );
}

interface ToolbarItemProps {
  icon: React.ReactNode;
  label: string;
}

function ToolbarItem({ icon, label }: ToolbarItemProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={icon}
        className="mb-2 bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
      />
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}
