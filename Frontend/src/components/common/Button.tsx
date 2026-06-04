// src/components/common/Button.tsx
import React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-primary-600 hover:bg-primary-700 text-white",
    "focus:ring-primary-500",
    "dark:bg-primary-600 dark:hover:bg-primary-700",
    "disabled:bg-primary-400 dark:disabled:bg-primary-800",
  ),
  secondary: cn(
    "bg-gray-100 hover:bg-gray-200 text-gray-900",
    "focus:ring-gray-500",
    "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
    "disabled:bg-gray-200 dark:disabled:bg-gray-800",
  ),
  outline: cn(
    "border border-gray-300 bg-transparent text-gray-700",
    "hover:bg-gray-50",
    "focus:ring-gray-500",
    "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
    "disabled:border-gray-200 dark:disabled:border-gray-700",
  ),
  ghost: cn(
    "bg-transparent text-gray-700",
    "hover:bg-gray-100",
    "focus:ring-gray-500",
    "dark:text-gray-300 dark:hover:bg-gray-800",
    "disabled:text-gray-400 dark:disabled:text-gray-600",
  ),
  danger: cn(
    "bg-red-600 hover:bg-red-700 text-white",
    "focus:ring-red-500",
    "dark:bg-red-600 dark:hover:bg-red-700",
    "disabled:bg-red-400 dark:disabled:bg-red-800",
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-md",
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
  xl: "h-14 px-8 text-lg gap-3 rounded-xl",
};

const LoadingSpinner = ({ size }: { size: ButtonSize }) => {
  const sizeClass = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  }[size];

  const borderWidth = {
    xs: "border",
    sm: "border-2",
    md: "border-2",
    lg: "border-2",
    xl: "border-[3px]",
  }[size];

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        borderWidth,
        "border-current border-t-transparent",
        "text-current",
        sizeClass,
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center",
      "font-medium",
      "transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "focus:ring-offset-white dark:focus:ring-offset-gray-900",
      "disabled:opacity-50 disabled:pointer-events-none",
      "active:scale-[0.98]",
      fullWidth && "w-full",
    );

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {leftIcon && (
              <span className="shrink-0 [&>svg]:w-full [&>svg]:h-full">
                {leftIcon}
              </span>
            )}
            {children && <span className="truncate">{children}</span>}
            {rightIcon && (
              <span className="shrink-0 [&>svg]:w-full [&>svg]:h-full">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
