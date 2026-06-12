// src/components/common/Input.tsx
import React from "react";
import { cn } from "../../lib/utils";

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
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

    return (
      <div
        className={cn(
          "flex flex-col",
          fullWidth && "w-full",
          containerClassName,
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "mb-xs text-label-md text-on-surface-variant font-mono",
              disabled && "opacity-50",
            )}
          >
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
              <span className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400">
                {leftIcon}
              </span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={cn(
              "flex h-10 w-full rounded-lg border",
              "bg-surface-bright text-on-surface",
              "px-md py-sm text-body-sm font-mono",
              "placeholder:text-outline",
              "focus:outline-none focus:ring-0 focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              hasError
                ? "border-error focus:border-error"
                : "border-outline-variant",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
              <span className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400">
                {rightIcon}
              </span>
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              "mt-1 sm:mt-1.5 text-xs sm:text-sm",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
