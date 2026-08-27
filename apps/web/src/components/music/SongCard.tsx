'use client';

import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { cn, formatDuration, formatNumber } from '@/lib/utils';
import { MusicWave } from '@/components/ui/MusicWave';
import { usePlayer, Track } from '@/providers/PlayerProvider';

interface SongCardProps {
  song: Track & { album?: any; _count?: { likes: number }; playCount?: number; isExplicit?: boolean };
  index?: number;
  allSongs?: Track[];
  className?: string;
}

export function SongCard({ song, index, allSongs, className }: SongCardProps) {
  const { currentTrack, isPlaying, play, pause, setQueue } = usePlayer();
  const isCurrentTrack = currentTrack?.id === song.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      if (isPlaying) { pause(); } else { play(song); }
    } else if (allSongs && allSongs.length > 0) {
      const idx = index ?? allSongs.findIndex((s) => s.id === song.id);
      setQueue(allSongs, Math.max(idx, 0));
    } else {
      play(song);
    }
  };

  return (
    <div className={cn('glass-card rounded-xl p-3 group cursor-pointer transition-all duration-300', isCurrentTrack && 'ring-1 ring-pulse-500/50 bg-pulse-500/5', className)} onClick={handlePlay}>
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
        <img src={song.coverImage || '/placeholder-album.svg'} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="h-10 w-10 rounded-full bg-pulse-500 flex items-center justify-center shadow-glow transform scale-90 group-hover:scale-100 transition-transform">
            {isCurrentTrack && isPlaying ? <Pause size={18} className="text-white" fill="white" /> : <Play size={18} className="text-white ml-0.5" fill="white" />}
          </div>
        </div>
        {isCurrentTrack && isPlaying && <div className="absolute bottom-2 left-2"><MusicWave isPlaying barCount={4} className="text-white drop-shadow-lg" /></div>}
        {song.isExplicit && <span className="absolute top-2 left-2 text-[10px] font-bold bg-dark-800/80 text-dark-300 px-1.5 py-0.5 rounded">E</span>}
      </div>
      <div className="min-w-0">
        <p className={cn('text-sm font-medium truncate mb-0.5', isCurrentTrack ? 'text-pulse-400' : 'text-white')}>{song.title}</p>
        <p className="text-xs text-dark-400 truncate">{song.artist.name}</p>
      </div>
    </div>
  );
}

interface SongListRowProps {
  song: Track & { album?: any; _count?: { likes: number }; playCount?: number };
  index: number;
  allSongs?: Track[];
  showAlbum?: boolean;
}

export function SongListRow({ song, index, allSongs, showAlbum = true }: SongListRowProps) {
  const { currentTrack, isPlaying, play, pause, setQueue } = usePlayer();
  const isCurrentTrack = currentTrack?.id === song.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      if (isPlaying) { pause(); } else { play(song); }
    } else if (allSongs && allSongs.length > 0) {
      const idx = index ?? allSongs.findIndex((s) => s.id === song.id);
      setQueue(allSongs, Math.max(idx, 0));
    } else {
      play(song);
    }
  };

  return (
    <div className={cn('flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-dark-800/50 transition-all group cursor-pointer', isCurrentTrack && 'bg-pulse-500/10')} onClick={handlePlay}>
      <div className="w-6 text-center">
        {isCurrentTrack && isPlaying ? (
          <MusicWave isPlaying barCount={3} className="text-pulse-400" />
        ) : (
          <>
            <span className="text-sm text-dark-500 group-hover:hidden">{index + 1}</span>
            <button className="hidden group-hover:block text-white"><Play size={14} fill="currentColor" /></button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img src={song.coverImage || '/placeholder-album.svg'} alt="" className="h-10 w-10 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className={cn('text-sm font-medium truncate', isCurrentTrack ? 'text-pulse-400' : 'text-white')}>{song.title}</p>
          <p className="text-xs text-dark-400 truncate">{song.artist.name}</p>
        </div>
      </div>

      {showAlbum && song.album && <span className="text-sm text-dark-400 truncate w-40 hidden md:block">{song.album.title}</span>}

      <span className="text-xs text-dark-500 w-16 text-right hidden sm:block">{formatDuration(song.duration)}</span>

      {song._count && <span className="text-xs text-dark-500 w-16 text-right hidden lg:block">{formatNumber(song._count.likes)} likes</span>}

      <button className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-white transition-all p-1"><MoreHorizontal size={16} /></button>
    </div>
  );
}
