'use client';

import { cn } from '@/lib/utils';

function MusicWave({ isPlaying, className, barCount = 4 }: { isPlaying: boolean; className?: string; barCount?: number }) {
  return (
    <div className={cn('flex items-end gap-[2px] h-4', className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div key={i} className="music-wave-bar" style={{
          animationPlayState: isPlaying ? 'running' : 'paused',
          animationDelay: `${i * 0.15}s`,
          height: isPlaying ? undefined : '4px',
        }} />
      ))}
    </div>
  );
}

export { MusicWave };
