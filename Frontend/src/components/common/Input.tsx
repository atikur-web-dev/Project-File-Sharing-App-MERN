// src/components/common/Input.tsx
import React from 'react';
import { cn } from '../../lib/utils';

// Extending the default HTML input attributes ensures we can use all standard props
// like placeholder, onChange, value, type, etc. without defining them manually.
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

// Using React.forwardRef is a professional standard. It allows parent components
// to get a direct reference to the underlying input element.
// This is crucial for libraries like react-hook-form which use refs for registration and validation.
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
    // Automatically generate an ID from the label for accessibility (a11y).
    // This links the <label> to the <input>, so clicking the label focuses the input.
    // This is a standard WCAG (Web Content Accessibility Guidelines) best practice.
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Determine if there's an error state to style the input border and show error text.
    const hasError = !!error;

    return (
      <div
        className={cn(
          'flex flex-col', // Standard column layout for label, input, and message
          fullWidth && 'w-full', // Take full width by default, can be overridden
          containerClassName
        )}
      >
        {/* Label Section */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 text-xs sm:text-sm font-medium',
              'text-gray-700 dark:text-gray-300',
              disabled && 'opacity-50' // Visually indicate the field is disabled
            )}
          >
            {label}
            {/* A red asterisk is the universal indicator for a required field */}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input Container (for icon positioning) */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            // "pointer-events-none" ensures clicking the icon focuses the input, not the icon itself.
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 text-gray-400">
              <span className="w-4 h-4 sm:w-5 sm:h-5">{leftIcon}</span>
            </div>
          )}

          {/* Core Input Element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={cn(
              // Base styles: dimensions, background, border, text
              'flex h-9 sm:h-10 md:h-11 w-full rounded-lg border bg-white',
              'px-2 sm:px-3 py-1.5 sm:py-2',
              'text-sm sm:text-base',
              'placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm',
              // Focus states: blue ring for normal, red for error
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors duration-200',
              // Dark mode styles
              'dark:bg-gray-800 dark:text-white dark:placeholder-gray-500',
              // Dynamic padding for icons
              leftIcon && 'pl-8 sm:pl-10',
              rightIcon && 'pr-8 sm:pr-10',
              // Dynamic border for error state
              hasError
                ? cn(
                    'border-red-300 focus:border-red-500 focus:ring-red-500',
                    'dark:border-red-700 dark:focus:border-red-500'
                  )
                : cn(
                    'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
                    'dark:border-gray-600 dark:focus:border-primary-500'
                  ),
              className // Allow external custom classes
            )}
            {...props}
          />

          {/* Right Icon (e.g., eye icon for password visibility) */}
          {/* Note: This div is NOT "pointer-events-none" because the right icon is often a clickable button. */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-gray-400">
            <span className="w-4 h-4 sm:w-5 sm:h-5">{rightIcon}</span>
          </div>
        </div>

        {/* Error or Helper Text Section */}
        {/* The error text takes precedence over helper text. */}
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1 sm:mt-1.5 text-xs sm:text-sm',
              error
                ? 'text-red-600 dark:text-red-400' // Error state color
                : 'text-gray-500 dark:text-gray-400' // Helper text color
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