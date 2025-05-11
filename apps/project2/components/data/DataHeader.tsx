import React from 'react';
import { useCtiStore } from '@/store/ctiStore';
import {
  DatabaseOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';

export function DataHeader() {
  const {
    statistics
  } = useCtiStore();

  return (
    <div className="w-full">
      <div className="grid grid-cols-9 gap-4">
        {/* 左侧蓝色卡片 - 包含三个数据项 */}
        <div className="col-span-3 bg-primary-600 rounded-lg shadow-lg py-4 px-4 flex justify-between">
          <div className="flex flex-col items-center justify-center text-white">
            <div className="text-2xl font-bold">{statistics.totalCTICount}</div>
            <div className="text-sm">链上情报</div>
          </div>
          <div className="flex flex-col items-center justify-center text-white">
            <div className="text-2xl font-bold">{statistics.userCTICount}</div>
            <div className="text-sm">我的情报</div>
          </div>
          <div className="flex flex-col items-center justify-center text-white">
            <div className="text-2xl font-bold">{statistics.userUploadCount}</div>
            <div className="text-sm">我的上链</div>
          </div>
        </div>

        {/* 右侧三个白色卡片 */}
        <StatCard
          title="全部数据"
          value={statistics.userUploadCount}
          icon={<DatabaseOutlined style={{ fontSize: '28px' }} />}
        />
        <StatCard
          title="处理完成"
          value={0}
          icon={<CheckCircleOutlined style={{ fontSize: '28px' }} />}
        />
        <StatCard
          title="处理中"
          value={0}
          icon={<SyncOutlined style={{ fontSize: '28px' }} />}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="col-span-2 bg-white p-4 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow">
      {icon && (
        <div className="mr-4 text-primary-600">
          {icon}
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-primary-600">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
}
