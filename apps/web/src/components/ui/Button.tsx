'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-pulse-500 text-white hover:bg-pulse-600 shadow-lg shadow-pulse-500/25 hover:shadow-pulse-500/40': variant === 'primary',
          'bg-dark-700 text-white hover:bg-dark-600 border border-dark-600': variant === 'secondary',
          'text-dark-300 hover:text-white hover:bg-dark-800': variant === 'ghost',
          'border border-dark-600 text-white hover:bg-dark-800 hover:border-dark-500': variant === 'outline',
          'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20': variant === 'destructive',
          'h-8 px-3 text-xs gap-1.5': size === 'sm',
          'h-10 px-5 text-sm gap-2': size === 'md',
          'h-12 px-8 text-base gap-2.5': size === 'lg',
          'h-10 w-10 p-0': size === 'icon',
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button';
export { Button };
