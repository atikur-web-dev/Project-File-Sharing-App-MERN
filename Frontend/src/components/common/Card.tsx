// src/components/common/Card.tsx
import React from 'react';
import { cn } from '../../lib/utils';

type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  bordered?: boolean;
}

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  xs: 'p-2 sm:p-3',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5 md:p-6',
  lg: 'p-5 sm:p-6 md:p-8',
  xl: 'p-6 sm:p-8 md:p-10',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  bordered = true,
}) => {
  const isInteractive = hoverable || clickable || onClick;

  return (
    <div
      className={cn(
        // Base styles
        'rounded-xl bg-white dark:bg-gray-800',
        'transition-all duration-200 ease-in-out', // ✅ Added ease-in-out
        
        // Shadow - improved for dark mode
        'shadow-sm dark:shadow-gray-900/30', // ✅ Better dark shadow
        
        // Border
        bordered && 'border border-gray-200 dark:border-gray-700',
        
        // Padding
        paddingStyles[padding],
        
        // Interactive states
        isInteractive && [
          'cursor-pointer touch-manipulation',
          hoverable && [
            'hover:shadow-md',
            'hover:-translate-y-0.5',
            'hover:bg-gray-50 dark:hover:bg-gray-700/50',
          ],
          clickable && 'active:scale-[0.98]', // ✅ Slightly more pronounced click effect
        ],
        
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};

// Card Sub-components with improved types
interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardSectionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div
      className={cn(
        'mb-3 sm:mb-4 pb-3 sm:pb-4',
        'border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardSectionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <h3
      className={cn(
        'text-base sm:text-lg md:text-xl',
        'font-semibold',
        'text-gray-900 dark:text-white',
        'tracking-tight', // ✅ Better typography
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<CardSectionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <p
      className={cn(
        'text-xs sm:text-sm',
        'text-gray-500 dark:text-gray-400',
        'mt-1', // ✅ Added margin-top for better spacing
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardSectionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardSectionProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div
      className={cn(
        'mt-3 sm:mt-4 pt-3 sm:pt-4',
        'border-t border-gray-200 dark:border-gray-700',
        'flex flex-wrap items-center gap-2', // ✅ Better footer layout
        className
      )}
    >
      {children}
    </div>
  );
};