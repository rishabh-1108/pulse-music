'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  showThumb?: boolean;
}

function Slider({ value, onValueChange, max = 100, min = 0, step = 1, className, showThumb = true }: SliderProps) {
  return (
    <SliderPrimitive.Root className={cn('relative flex w-full touch-none select-none items-center group', className)} value={value} onValueChange={onValueChange} max={max} min={min} step={step}>
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-dark-700">
        <SliderPrimitive.Range className="absolute h-full bg-pulse-500 rounded-full" />
      </SliderPrimitive.Track>
      {showThumb && <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-500 cursor-grab active:cursor-grabbing" />}
    </SliderPrimitive.Root>
  );
}

export { Slider };
