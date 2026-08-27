'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Heart, Clock, Music, Mic2, ListMusic, ChevronLeft, ChevronRight, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

const mainNav = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
];

const libraryNav = [
  { href: '/favorites', label: 'Liked Songs', icon: Heart },
  { href: '/favorites?tab=albums', label: 'Liked Albums', icon: Music },
  { href: '/favorites?tab=artists', label: 'Following', icon: Mic2 },
  { href: '/favorites?tab=history', label: 'History', icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { isAuthenticated } = useAuth();

  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => { const res = await api.get('/playlists'); return res.data.data; },
    enabled: isAuthenticated,
  });

  return (
    <aside className={cn('fixed left-0 top-0 h-[calc(100vh-80px)] z-30 flex flex-col transition-all duration-300', sidebarOpen ? 'w-64' : 'w-20')}>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="flex items-center gap-2 mb-6 px-3">
          <div className="w-8 h-8 rounded-lg animated-gradient-bg flex items-center justify-center">
            <Music size={18} className="text-white" />
          </div>
          {sidebarOpen && <span className="text-lg font-bold gradient-text">Pulse Music</span>}
        </div>

        {mainNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200', isActive ? 'bg-pulse-500/15 text-pulse-400' : 'text-dark-400 hover:text-white hover:bg-dark-800')}>
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}

        <div className="pt-4 pb-2">
          {sidebarOpen && (
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Library</h3>
              <button className="text-dark-500 hover:text-white transition-colors"><Plus size={16} /></button>
            </div>
          )}
        </div>

        {sidebarOpen && libraryNav.map((item) => {
          const isActive = pathname === item.href.split('?')[0];
          return (
            <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200', isActive ? 'text-pulse-400 bg-pulse-500/10' : 'text-dark-400 hover:text-white hover:bg-dark-800')}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {sidebarOpen && (
          <div className="pt-4 space-y-2">
            <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-3 mb-2">Playlists</h3>
            {playlists?.map((pl: any) => (
              <Link key={pl.id} href={`/playlist/${pl.id}`} className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm text-dark-400 hover:text-white hover:bg-dark-800 transition-all">
                <ListMusic size={16} />
                <span className="truncate">{pl.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-2 border-t border-dark-800">
        <button onClick={toggleSidebar} className="w-full flex items-center justify-center p-2 rounded-xl text-dark-500 hover:text-white hover:bg-dark-800 transition-all">
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </aside>
  );
}
