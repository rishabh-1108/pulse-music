'use client';

import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

function SongSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl">
      <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-10" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="glass-card p-4 rounded-2xl">
      <Skeleton className="aspect-square w-full rounded-xl mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export { Skeleton, SongSkeleton, CardSkeleton };
