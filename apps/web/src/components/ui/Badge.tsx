'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps { children: ReactNode; variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'admin' | 'artist'; className?: string; }

function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
      'bg-dark-700 text-dark-300': variant === 'default',
      'bg-pulse-500/20 text-pulse-400': variant === 'primary',
      'bg-accent-green/20 text-accent-green': variant === 'success',
      'bg-accent-orange/20 text-accent-orange': variant === 'warning',
      'bg-red-500/20 text-red-400': variant === 'destructive',
      'bg-blue-500/20 text-blue-400': variant === 'admin',
      'bg-purple-500/20 text-purple-400': variant === 'artist',
    }, className)}>
      {children}
    </span>
  );
}

export { Badge };
