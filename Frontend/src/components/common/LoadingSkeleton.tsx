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
  const baseClass = 'animate-pulse bg-white/10 rounded';

  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'h-24 w-full',
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