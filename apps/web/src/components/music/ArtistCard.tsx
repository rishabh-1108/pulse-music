'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

interface ArtistCardProps {
  artist: { id: string; name: string; slug: string; avatar?: string; verified?: boolean; _count?: { followers: number }; user?: { avatar?: string } };
  className?: string;
}

export function ArtistCard({ artist, className }: ArtistCardProps) {
  const avatar = artist.avatar || artist.user?.avatar;
  return (
    <Link href={`/artist/${artist.slug}`} className={cn('group', className)}>
      <div className="glass-card rounded-2xl p-4 text-center hover-lift">
        <div className="relative mx-auto w-32 h-32 mb-4">
          <img src={avatar || '/placeholder-artist.svg'} alt={artist.name} className="w-full h-full rounded-full object-cover ring-4 ring-dark-800 group-hover:ring-pulse-500/30 transition-all" />
          <div className="absolute inset-0 rounded-full bg-pulse-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <div className="h-10 w-10 rounded-full bg-pulse-500 flex items-center justify-center shadow-glow transform scale-75 group-hover:scale-100 transition-transform">
              <Play size={18} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-white truncate">{artist.name}</h3>
        <p className="text-xs text-dark-400 mt-1">{artist._count?.followers ? `${formatNumber(artist._count.followers)} followers` : 'Artist'}</p>
      </div>
    </Link>
  );
}
