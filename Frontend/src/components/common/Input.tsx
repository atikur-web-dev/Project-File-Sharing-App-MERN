// src/components/common/Input.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      helperText,
      fullWidth = true,
      containerClassName,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div
        className={cn(
          'flex flex-col',
          fullWidth && 'w-full',
          containerClassName
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 text-xs sm:text-sm font-medium',
              'text-gray-700 dark:text-gray-300', // Dark in light mode
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
              <span className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={cn(
              // Base styles - LIGHT MODE FIRST
              'flex h-9 sm:h-10 md:h-11 w-full rounded-lg border',
              'bg-white text-gray-900', // WHITE background in light mode
              'px-2 sm:px-3 py-1.5 sm:py-2',
              'text-sm sm:text-base',
              'placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm',
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors duration-200',
              // DARK MODE
              'dark:bg-gray-800 dark:text-white dark:placeholder-gray-500',
              // Dynamic padding for icons
              leftIcon && 'pl-8 sm:pl-10',
              rightIcon && 'pr-8 sm:pr-10',
              // Dynamic border for error state
              hasError
                ? cn(
                    'border-red-500 focus:border-red-500 focus:ring-red-500',
                    'dark:border-red-700'
                  )
                : cn(
                    'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
                    'dark:border-gray-600'
                  ),
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
              <span className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1 sm:mt-1.5 text-xs sm:text-sm',
              error
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';