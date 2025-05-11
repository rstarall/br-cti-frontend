'use client';

import React, { useEffect } from 'react';
import { Banner } from '@/components/front/home/Banner';
import { PlatformIntro } from '@/components/front/home/PlatformIntro';
import { IncentiveMechanism } from '@/components/front/home/IncentiveMechanism';
import { PlatformFeatures } from '@/components/front/home/PlatformFeatures';
import { Statistics } from '@/components/front/home/Statistics';
import { useBlockchainStore } from '@/store/blockchainStore';

export default function HomePage() {
  const { fetchLatestBlocks, fetchLatestTransactions } = useBlockchainStore();

  useEffect(() => {
    // 获取最新区块和交易数据
    fetchLatestBlocks();
    fetchLatestTransactions();
  }, []);

  return (
    <div className="relative">
      <Banner />
      <div className="relative z-0">
        <PlatformIntro />
        <Statistics />
        <IncentiveMechanism />
        <PlatformFeatures />
      </div>
    </div>
  );
}
