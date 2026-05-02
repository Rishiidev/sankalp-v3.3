import React from 'react';
import { Home, Flame, TrendingUp, User, BookText } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'wouter';

export function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/sadhana', icon: Flame, label: 'Sadhana' },
    { id: '/journal', icon: BookText, label: 'Journal' },
    { id: '/progress', icon: TrendingUp, label: 'Progress' },
    { id: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.id || (location === '/' && tab.id === '/');
          return (
            <Link key={tab.id} href={tab.id}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-orange-500" : "text-slate-500 hover:text-slate-400"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
