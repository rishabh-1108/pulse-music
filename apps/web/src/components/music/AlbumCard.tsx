'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/providers/PlayerProvider';
import { api } from '@/services/api';

interface AlbumCardProps {
  album: { id: string; title: string; coverImage: string; artist: { id: string; name: string; slug: string; verified?: boolean }; _count?: { songs: number } };
  className?: string;
}

export function AlbumCard({ album, className }: AlbumCardProps) {
  const { setQueue } = usePlayer();

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await api.get(`/albums/${album.id}`);
      const songs = res.data.data.songs;
      if (songs.length > 0) {
        setQueue(songs.map((s: any) => ({
          id: s.id, title: s.title, audioUrl: s.audioUrl || '',
          coverImage: s.coverImage || album.coverImage, duration: s.duration,
          artist: s.artist || album.artist,
          album: { id: album.id, title: album.title, coverImage: album.coverImage },
        })));
      }
    } catch {}
  };

  return (
    <Link href={`/album/${album.id}`} className={cn('group', className)}>
      <div className="glass-card rounded-2xl p-4 hover-lift">
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
          <img src={album.coverImage || '/placeholder-album.svg'} alt={album.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={handlePlay} className="h-12 w-12 rounded-full bg-pulse-500 flex items-center justify-center shadow-glow transform scale-75 group-hover:scale-100 transition-transform">
              <Play size={22} className="text-white ml-0.5" fill="white" />
            </button>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-white truncate mb-0.5">{album.title}</h3>
        <p className="text-xs text-dark-400 truncate">{album.artist.name}</p>
        {album._count && <p className="text-[10px] text-dark-500 mt-1">{album._count.songs} songs</p>}
      </div>
    </Link>
  );
}
