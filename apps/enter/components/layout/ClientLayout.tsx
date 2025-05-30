'use client';

import React from 'react';
import { Navigation } from '@/components/front/layout/Navigation';
import { Footer } from '@/components/front/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
      {/* <Sidebar /> */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
