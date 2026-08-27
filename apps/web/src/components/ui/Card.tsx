'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps { children: ReactNode; className?: string; hover?: boolean; onClick?: () => void; }

function Card({ children, className, hover = false, onClick }: CardProps) {
  return <div className={cn('glass-card p-4 rounded-2xl', hover && 'cursor-pointer hover-lift', className)} onClick={onClick}>{children}</div>;
}

function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-white', className)}>{children}</h3>;
}

function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

export { Card, CardHeader, CardTitle, CardContent };
