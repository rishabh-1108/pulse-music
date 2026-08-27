'use client';

import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart } from 'lucide-react';
import { usePlayer } from '@/providers/PlayerProvider';
import { Slider } from '@/components/ui/Slider';
import { cn, formatDuration } from '@/lib/utils';

export function Player() {
  const {
    currentTrack, isPlaying, isMuted, volume, progress, currentTime, duration,
    shuffle, repeat, isLiked, play, pause, toggleMute, setVolume, seek,
    toggleShuffle, toggleRepeat, playNext, playPrevious, toggleLike,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 glass border-t border-dark-800/50 z-50 flex items-center px-4 gap-4">
      <div className="flex items-center gap-3 w-[280px] min-w-0">
        <img src={currentTrack.coverImage || '/placeholder-album.svg'} alt="" className="h-12 w-12 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
          <p className="text-xs text-dark-400 truncate">{currentTrack.artist.name}</p>
        </div>
        <button onClick={toggleLike} className="flex-shrink-0 p-1">
          <Heart size={16} className={cn('transition-colors', isLiked ? 'text-accent-pink fill-accent-pink' : 'text-dark-400 hover:text-white')} />
        </button>
      </div>

      <div className="flex-1 max-w-2xl flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-4">
          <button onClick={toggleShuffle} className={cn('p-1.5 transition-colors', shuffle ? 'text-pulse-400' : 'text-dark-400 hover:text-white')}><Shuffle size={16} /></button>
          <button onClick={playPrevious} className="p-1.5 text-dark-300 hover:text-white transition-colors"><SkipBack size={18} fill="currentColor" /></button>
          <button onClick={isPlaying ? pause : () => play(currentTrack)} className="h-9 w-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
            {isPlaying ? <Pause size={18} className="text-black" fill="black" /> : <Play size={18} className="text-black ml-0.5" fill="black" />}
          </button>
          <button onClick={playNext} className="p-1.5 text-dark-300 hover:text-white transition-colors"><SkipForward size={18} fill="currentColor" /></button>
          <button onClick={toggleRepeat} className={cn('p-1.5 transition-colors', repeat !== 'off' ? 'text-pulse-400' : 'text-dark-400 hover:text-white')}>{repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}</button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-[11px] text-dark-500 w-10 text-right">{formatDuration(currentTime)}</span>
          <Slider value={[progress]} onValueChange={(v) => seek(v[0])} max={100} className="flex-1" />
          <span className="text-[11px] text-dark-500 w-10">{formatDuration(duration)}</span>
        </div>
      </div>

      <div className="w-[280px] flex items-center justify-end gap-3">
        <div className="flex items-center gap-2 w-32">
          <button onClick={toggleMute} className="text-dark-400 hover:text-white transition-colors">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <Slider value={[isMuted ? 0 : volume]} onValueChange={(v) => setVolume(v[0])} max={100} showThumb={false} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
