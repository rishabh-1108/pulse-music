'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ChevronLeft, ChevronRight, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar } from '@/components/ui';
import { useUIStore } from '@/stores';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { sidebarOpen } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 z-40 h-16 flex items-center justify-between px-6 glass border-b border-dark-800/50" style={{ left: sidebarOpen ? '256px' : '80px', transition: 'left 0.3s ease' }}>
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors">
          <ChevronLeft size={18} className="text-dark-300" />
        </button>
        <button onClick={() => router.forward()} className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors">
          <ChevronRight size={18} className="text-dark-300" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <button className="relative p-2 rounded-full hover:bg-dark-800 transition-colors">
              <Bell size={20} className="text-dark-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-pink rounded-full" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-dark-800 transition-colors">
                <Avatar src={user?.avatar} fallback={user?.displayName} size="sm" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl p-1.5 animate-slide-down z-50">
                  <div className="px-3 py-2 border-b border-dark-700 mb-1">
                    <p className="text-sm font-medium text-white">{user?.displayName}</p>
                    <p className="text-xs text-dark-400">@{user?.username}</p>
                  </div>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-all">
                    <User size={16} /> Profile
                  </Link>
                  <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-all">
                    <Settings size={16} /> Settings
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-all">
                      <Settings size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-dark-700 mt-1 pt-1">
                    <button onClick={() => { logout(); setDropdownOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors">Sign In</Link>
            <Link href="/auth/register" className="px-4 py-2 text-sm font-medium bg-pulse-500 text-white rounded-xl hover:bg-pulse-600 transition-colors">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
