'use client';

import { Play, Pause, SkipForward, SkipBack, Maximize2 } from 'lucide-react';
import { usePlayer } from '@/providers/PlayerProvider';
import { Slider } from '@/components/ui/Slider';

export function MiniPlayer() {
  const {
    currentTrack, isPlaying, progress, seek,
    play, pause, playNext, playPrevious, enterFullscreen,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 w-72 glass-card rounded-2xl p-3 shadow-glass animate-slide-up">
      <div className="flex items-center gap-3 mb-2">
        <img src={currentTrack.coverImage || '/placeholder-album.svg'} alt="" className="h-10 w-10 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">{currentTrack.title}</p>
          <p className="text-[10px] text-dark-400 truncate">{currentTrack.artist.name}</p>
        </div>
      </div>
      <Slider value={[progress]} onValueChange={(v) => seek(v[0])} max={100} className="w-full mb-2" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={playPrevious} className="p-1 text-dark-400 hover:text-white transition-colors"><SkipBack size={12} fill="currentColor" /></button>
          <button onClick={isPlaying ? pause : () => play(currentTrack)} className="h-7 w-7 rounded-full bg-white flex items-center justify-center">
            {isPlaying ? <Pause size={12} className="text-black" fill="black" /> : <Play size={12} className="text-black ml-0.5" fill="black" />}
          </button>
          <button onClick={playNext} className="p-1 text-dark-400 hover:text-white transition-colors"><SkipForward size={12} fill="currentColor" /></button>
        </div>
        <button onClick={enterFullscreen} className="p-1 text-dark-400 hover:text-white transition-colors"><Maximize2 size={12} /></button>
      </div>
    </div>
  );
}
