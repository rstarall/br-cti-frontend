'use client'
import { UserInfo } from '@/store/user';

export interface CtiTradeStats {
    provide: number;
    trade: number;
    stake: number;
    reward: number;
}

export const TransactionHeader = ({ userInfo, stats }: { userInfo: UserInfo,stats: CtiTradeStats }) => {

  return (
    <div className="grid grid-cols-4 gap-4 px-1">
      <div className="bg-blue-50 p-2 px-3 rounded-sm shadow-sm">
        <div className="text-gray-800 text-2xl font-bold">{stats.provide}</div>
        <div className="text-gray-600 mt-1">提供</div>
      </div>
      <div className="bg-blue-50 p-2 px-3 rounded-sm shadow-sm">
        <div className="text-gray-800 text-2xl font-bold">{stats.trade}</div>
        <div className="text-gray-600 mt-1">交易</div>
      </div>
      <div className="bg-blue-50 p-2 px-3 rounded-sm shadow-sm">
        <div className="text-gray-800 text-2xl font-bold">{stats.stake}</div>
        <div className="text-gray-600 mt-1">抵押</div>
      </div>
      <div className="bg-blue-50 p-2 px-3 rounded-sm shadow-sm">
        <div className="text-gray-800 text-2xl font-bold">{stats.reward}</div>
        <div className="text-gray-600 mt-1">收益</div>
      </div>
    </div>
  )
}
