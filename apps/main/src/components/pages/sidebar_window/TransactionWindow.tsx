'use client'
import { TransactionHeader } from '@/components/widgets/transaction/TransactionHeader'
import { CtiProvider } from '@/components/widgets/transaction/CtiProvider'
import { useUserStore, UserInfo } from '@/store/user'
import { CtiRequest } from '@/components/widgets/transaction/CtiRequest'
import { useCtiStore } from '@/store/ctiStore';
import { useCtiRequestStore } from '@/store/ctiRequestStore';
import { CtiTradeStats } from '@/components/widgets/transaction/TransactionHeader';
import { useEffect, useState } from 'react';
import { CtiOnchain } from '@/components/widgets/transaction/CtiOnchain';
import { CtiPurchased } from '@/components/widgets/transaction/CtiPurchased';
export const TransactionWindow = () => {
  const { userInfo,initializeUserInfo } = useUserStore();
  const { ctiItems } = useCtiStore();
  const { ctiRequestItems } = useCtiRequestStore();
  const [stats, setStats] = useState<CtiTradeStats>({
    provide: 0,
    trade: 0,
    stake: 0,
    reward: 0,
  });
  useEffect(() => {
    initializeUserInfo();
  }, []);
  
  useEffect(() => {
    const currentUserItems = ctiItems.filter((item) => item.walletId === userInfo?.walletId);
    setStats({
      provide: currentUserItems.length,
      trade: ctiRequestItems.length,
      stake: parseFloat(currentUserItems.reduce((acc, curr) => acc + curr.stake, 0).toFixed(2)),
      reward: parseFloat(currentUserItems.reduce((acc, curr) => acc + curr.reward, 0).toFixed(2)),
    });
  }, [ctiItems, ctiRequestItems, userInfo]);
  
  return (
    <div className="w-full h-full">
      <TransactionHeader userInfo={userInfo as UserInfo} stats={stats} />
      <CtiProvider  />
      <CtiOnchain  />
      <CtiRequest  />
      <CtiPurchased  />
    </div>
  )
}