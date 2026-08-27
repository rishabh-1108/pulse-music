'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Player } from '@/components/player/Player';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { FullscreenPlayer } from '@/components/player/FullscreenPlayer';
import { usePlayer } from '@/providers/PlayerProvider';
import { useUIStore } from '@/stores';
import { cn } from '@/lib/utils';

export function MainLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUIStore();
  const { currentTrack, isFullscreen } = usePlayer();

  if (isFullscreen) return <FullscreenPlayer />;

  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      <Header />
      <main className={cn('transition-all duration-300 pt-16 min-h-screen', sidebarOpen ? 'ml-64' : 'ml-20')}>
        <div className={cn('pb-24', currentTrack && 'pb-36')}>{children}</div>
      </main>
      {currentTrack && <Player />}
      {currentTrack && <MiniPlayer />}
    </div>
  );
}
