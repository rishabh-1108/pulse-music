'use client';

import { Minimize2, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, Heart, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '@/providers/PlayerProvider';
import { Slider } from '@/components/ui/Slider';
import { cn, formatDuration } from '@/lib/utils';
import { MusicWave } from '@/components/ui/MusicWave';

export function FullscreenPlayer() {
  const {
    currentTrack, isPlaying, isMuted, volume, progress, currentTime, duration,
    shuffle, repeat, isLiked, play, pause, toggleMute, setVolume, seek,
    toggleShuffle, toggleRepeat, playNext, playPrevious, toggleLike, exitFullscreen,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-dark-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={currentTrack.coverImage || '/placeholder-album.svg'} alt="" className="w-full h-full object-cover blur-[100px] opacity-30 scale-110" />
        <div className="absolute inset-0 bg-dark-950/60" />
      </div>

      <div className="absolute top-6 right-6 z-10">
        <button onClick={exitFullscreen} className="p-3 rounded-full glass hover:bg-dark-700/50 transition-colors">
          <Minimize2 size={20} className="text-white" />
        </button>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-10 flex flex-col items-center">
        <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl mb-10 relative group">
          <img src={currentTrack.coverImage || '/placeholder-album.svg'} alt="" className="w-full h-full object-cover" />
          {isPlaying && (
            <div className="absolute bottom-4 right-4"><MusicWave isPlaying barCount={5} className="text-white/60" /></div>
          )}
        </div>

        <div className="w-full max-w-md text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">{currentTrack.title}</h2>
          <p className="text-dark-400 text-lg">{currentTrack.artist.name}</p>
        </div>

        <div className="w-full max-w-md flex flex-col items-center gap-3">
          <Slider value={[progress]} onValueChange={(v) => seek(v[0])} max={100} showThumb className="w-full" />

          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-dark-500 w-12 text-left">{formatDuration(currentTime)}</span>
            <div className="flex items-center gap-5">
              <button onClick={toggleShuffle} className={cn('transition-colors', shuffle ? 'text-pulse-400' : 'text-dark-400 hover:text-white')}><Shuffle size={18} /></button>
              <button onClick={playPrevious} className="text-white hover:text-pulse-400 transition-colors"><SkipBack size={24} fill="currentColor" /></button>
              <button onClick={isPlaying ? pause : () => play(currentTrack)} className="h-14 w-14 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
                {isPlaying ? <Pause size={24} className="text-black" fill="black" /> : <Play size={24} className="text-black ml-1" fill="black" />}
              </button>
              <button onClick={playNext} className="text-white hover:text-pulse-400 transition-colors"><SkipForward size={24} fill="currentColor" /></button>
              <button onClick={toggleRepeat} className={cn('transition-colors', repeat !== 'off' ? 'text-pulse-400' : 'text-dark-400 hover:text-white')}>{repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}</button>
            </div>
            <span className="text-xs text-dark-500 w-12 text-right">{formatDuration(duration)}</span>
          </div>

          <div className="w-full flex items-center gap-3 mt-2">
            <button onClick={toggleLike}>
              <Heart size={18} className={cn('transition-colors', isLiked ? 'text-accent-pink fill-accent-pink' : 'text-dark-400 hover:text-white')} />
            </button>
            <div className="flex-1" />
            <button onClick={toggleMute} className="text-dark-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <Slider value={[isMuted ? 0 : volume]} onValueChange={(v) => setVolume(v[0])} max={100} showThumb={false} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
