'use client';

import React, { use } from 'react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<any>;
}) {
  if (params) use(params);

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
      <SidebarNav />
      <div className="flex flex-col min-w-0 overflow-x-hidden">
        <Header />
        <main className="flex flex-1 flex-col bg-background/95 overflow-x-hidden overflow-y-auto pb-20 md:pb-6 min-w-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
