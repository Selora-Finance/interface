'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/client/utils';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
import { Themes } from '@/constants';

const sliderVariants = cva('relative h-4 rounded-full cursor-pointer', {
  variants: {
    variant: {
      primary: 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500',
      secondary: 'bg-gray-600',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface SliderProps extends VariantProps<typeof sliderVariants> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 25,
  variant = 'primary',
  className,
  disabled = false,
  ...props
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    updateValueFromClientX(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !disabled) {
      e.preventDefault();
      updateValueFromClientX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    // Don't call updateValue here to prevent jumping
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    if (touch) updateValueFromClientX(touch.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && !disabled) {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) updateValueFromClientX(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateValueFromClientX = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    // Calculate the actual value based on min/max range
    const actualValue = min + (percentage / 100) * (max - min);

    // Snap to nearest step
    const snappedValue = Math.round(actualValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, snappedValue));

    onChange(clampedValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Current Value Display */}
      <div className="text-center">
        <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{value}%</span>
      </div>

      {/* Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className={cn(
            'relative h-4 rounded-full cursor-pointer bg-gray-600 select-none',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          onMouseDown={handleMouseDown}
        >
          {/* Gradient Fill - follows thumb track */}
          <div
            className={cn('absolute inset-y-0 left-0 rounded-full', sliderVariants({ variant }))}
            style={{ width: `${percentage}%` }}
          ></div>

          {/* Slider Handle */}
          <div
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg cursor-grab select-none',
              isDragging && 'cursor-grabbing scale-110',
              disabled && 'cursor-not-allowed',
            )}
            style={{ left: `calc(${percentage}% - 12px)` }}
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Triangle pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-white"></div>
          </div>
        </div>

        {/* Percentage Markers */}
        <div className="flex justify-between mt-3">
          {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
            const markerValue = min + i * step;
            return (
              <div key={markerValue} className="flex flex-col items-center">
                <div className={`w-1 h-2 mb-1 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{markerValue}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
