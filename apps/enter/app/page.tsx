'use client';

import React from 'react';
import { Banner } from '@/components/front/home/Banner';
import { PlatformIntro } from '@/components/front/home/PlatformIntro';
import { IncentiveMechanism } from '@/components/front/home/IncentiveMechanism';
import { PlatformFeatures } from '@/components/front/home/PlatformFeatures';
import { Statistics } from '@/components/front/home/Statistics';

export default function HomePage() {
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
