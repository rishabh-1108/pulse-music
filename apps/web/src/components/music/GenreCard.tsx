'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GenreCardProps {
  genre: { id: string; name: string; slug: string; image?: string; color?: string };
  className?: string;
}

const gradients = [
  'from-rose-500/30 to-purple-500/30',
  'from-blue-500/30 to-cyan-500/30',
  'from-emerald-500/30 to-teal-500/30',
  'from-amber-500/30 to-orange-500/30',
  'from-fuchsia-500/30 to-pink-500/30',
  'from-indigo-500/30 to-violet-500/30',
  'from-lime-500/30 to-green-500/30',
  'from-sky-500/30 to-blue-500/30',
];

export function GenreCard({ genre, className }: GenreCardProps) {
  const gradient = gradients[Math.abs(genre.name.charCodeAt(0)) % gradients.length];

  return (
    <Link href={`/search?genre=${genre.slug}`} className={cn('group', className)}>
      <div className="glass-card rounded-xl overflow-hidden hover-lift">
        <div className={cn('relative h-32 bg-gradient-to-br flex items-end p-3', gradient)} style={genre.color ? { background: `linear-gradient(135deg, ${genre.color}44, ${genre.color}22)` } : undefined}>
          <h3 className="text-base font-semibold text-white drop-shadow-lg">{genre.name}</h3>
          {genre.image && <img src={genre.image} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />}
        </div>
      </div>
    </Link>
  );
}
