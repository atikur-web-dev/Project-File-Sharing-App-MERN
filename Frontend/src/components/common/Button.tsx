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
  ),
  secondary: cn(
    // LIGHT MODE FIRST
    "bg-gray-100 hover:bg-gray-200 text-gray-900",
    "focus:ring-gray-500",
    // DARK MODE
    "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
  ),
  outline: cn(
    // LIGHT MODE
    "border border-gray-300 bg-transparent text-gray-700",
    "hover:bg-gray-50",
    "focus:ring-gray-500",
    // DARK MODE
    "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
  ),
  ghost: cn(
    // LIGHT MODE
    "bg-transparent text-gray-700",
    "hover:bg-gray-100",
    "focus:ring-gray-500",
    // DARK MODE
    "dark:text-gray-300 dark:hover:bg-gray-800",
  ),
  danger: cn(
    "bg-red-600 hover:bg-red-700 text-white",
    "focus:ring-red-500",
    "dark:bg-red-600 dark:hover:bg-red-700",
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-md",
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
  xl: "h-14 px-8 text-lg gap-3 rounded-xl",
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
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span className="truncate">{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

// LoadingSpinner component
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const sizeClass = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  }[size];

  return (
    <svg
      className={cn("animate-spin", sizeClass)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
