import React from 'react';
import { Home, Search, Wallet, MessageSquare, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  walletBalance: number;
  unreadSupportCount?: number;
}

export default function BottomNav({ activeTab, onTabChange, walletBalance, unreadSupportCount = 0 }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'wallet', label: 'Wallet', icon: Wallet, badge: `${walletBalance.toLocaleString()} ₨` },
    { id: 'support', label: 'Support', icon: MessageSquare, badge: unreadSupportCount > 0 ? '•' : undefined },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav id="mobile-bottom-navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a0b2e]/95 border-t border-white/10 backdrop-blur-md px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-[#E9D5FF] font-medium scale-105 bg-[#6A0DAD]/25 shadow-[0_0_10px_rgba(106,13,173,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#6A0DAD]/10'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5.5 h-5.5 transition-transform duration-300 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.id === 'wallet' && (
                  <span className="absolute -top-1 -right-4 bg-[#D4AF37] text-[8px] text-[#0f071a] px-1 rounded-full scale-75 border border-[#D4AF37]/50 font-bold">
                    ₨
                  </span>
                )}
                {item.id === 'support' && unreadSupportCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
                )}
                {item.id === 'support' && unreadSupportCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
