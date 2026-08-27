'use client';

import Link from 'next/link';
import { Play, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaylistCardProps {
  playlist: { id: string; name: string; coverImage?: string; isPublic: boolean; user: { displayName: string }; _count?: { songs: number }; songs?: { song: { coverImage?: string } }[] };
  className?: string;
}

export function PlaylistCard({ playlist, className }: PlaylistCardProps) {
  const previewImages = playlist.songs?.slice(0, 4).map((s) => s.song.coverImage).filter(Boolean);

  return (
    <Link href={`/playlist/${playlist.id}`} className={cn('group', className)}>
      <div className="glass-card rounded-2xl p-4 hover-lift">
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
          {playlist.coverImage || (previewImages && previewImages.length > 0) ? (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-dark-700 overflow-hidden">
                  {previewImages?.[i] ? <img src={previewImages[i]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-dark-600"><ListMusic size={20} /></div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center"><ListMusic size={40} className="text-dark-600" /></div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <div className="h-12 w-12 rounded-full bg-pulse-500 flex items-center justify-center shadow-glow transform scale-75 group-hover:scale-100 transition-transform">
              <Play size={22} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-white truncate mb-0.5">{playlist.name}</h3>
        <p className="text-xs text-dark-400 truncate">By {playlist.user.displayName} &middot; {playlist._count?.songs || 0} songs</p>
      </div>
    </Link>
  );
}
