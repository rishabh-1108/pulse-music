'use client';

import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-24 w-24 text-2xl' };

  if (src) {
    return <img src={src} alt={alt || ''} className={cn('rounded-full object-cover ring-2 ring-dark-800', sizes[size], className)} />;
  }

  return (
    <div className={cn('rounded-full bg-gradient-to-br from-pulse-500 to-accent-pink flex items-center justify-center font-bold text-white ring-2 ring-dark-800', sizes[size], className)}>
      {getInitials(fallback || 'U')}
    </div>
  );
}

export { Avatar };
