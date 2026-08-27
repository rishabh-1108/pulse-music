'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-dark-300">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">{icon}</div>}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border bg-dark-850 px-4 py-2 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            icon && 'pl-10',
            error ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 hover:border-dark-600',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
export { Input };
