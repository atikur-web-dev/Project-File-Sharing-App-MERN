// src/components/common/LoadingSkeleton.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'text',
  count = 1,
}) => {
  const baseClass = 'skeleton theme-transition';
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'h-12 w-12 rounded-full', 
    rectangular: 'h-24 w-full rounded',
    card: 'h-48 w-full rounded-xl',
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={cn(baseClass, variants[variant], className)}
        />
      ))}
    </>
  );
};
