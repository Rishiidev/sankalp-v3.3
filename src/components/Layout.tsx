import React from 'react';
import { BottomNav } from './BottomNav';
import { useStore } from '../lib/store';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useStore();

  if (!user?.onboardingCompleted) {
    return <div className="min-h-screen bg-slate-950 text-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-16">
      <main className="max-w-md mx-auto min-h-screen relative">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
