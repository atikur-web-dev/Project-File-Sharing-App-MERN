// src/components/common/Button.tsx
import React from 'react';
import { cn } from '../../lib/utils';

// variant: বাটনের ধরণ (primary, danger, outline, ghost)
// size: বাটনের সাইজ (xs, sm, md, lg, xl)
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Props: সব HTML বাটনের props + আমাদের এক্সট্রা জিনিস
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// variant অনুযায়ী ডিজাইনের ক্লাস
const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-primary-600 text-white', // primary-600: TailwindCSS থিম থেকে নেওয়া কাস্টম কালার
    'hover:bg-primary-700',
    'focus:ring-primary-500',
    'dark:bg-primary-600 dark:hover:bg-primary-700'
  ),
  secondary: cn(
    'bg-gray-100 text-gray-900',
    'hover:bg-gray-200',
    'focus:ring-gray-500',
    'dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
  ),
  outline: cn(
    'border border-gray-300 bg-transparent text-gray-700',
    'hover:bg-gray-50',
    'focus:ring-gray-500',
    'dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800'
  ),
  ghost: cn(
    'bg-transparent text-gray-700',
    'hover:bg-gray-100',
    'focus:ring-gray-500',
    'dark:text-gray-300 dark:hover:bg-gray-800'
  ),
  danger: cn(
    'bg-red-600 text-white',
    'hover:bg-red-700',
    'focus:ring-red-500',
    'dark:bg-red-600 dark:hover:bg-red-700'
  ),
};

// size অনুযায়ী ডিজাইনের ক্লাস
const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1 rounded-md',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
  xl: 'h-14 px-8 text-lg gap-3 rounded-xl',
};

// লোডিং স্পিনার
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const sizeClass = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  }[size];

  return (
    <svg
      className={cn('animate-spin', sizeClass)}
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

// ============================================================
// Button Component (forwardRef ব্যবহার করেছি যাতে ref পাঠানো যায়)
// ============================================================
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // বেস স্টাইল (সব বাটনে থাকবে)
    const baseStyles = cn(
      'inline-flex items-center justify-center', // ফ্লেক্স + সেন্টার
      'font-medium', // মাঝারি মোটা লেখা
      'transition-all duration-200', // মসৃণ অ্যানিমেশন
      'focus:outline-none focus:ring-2 focus:ring-offset-2', // ফোকাস রিং
      'disabled:opacity-50 disabled:pointer-events-none', // ডিজেবল স্টেট
      'active:scale-[0.98]', // ক্লিক করলে সামান্য ছোট হবে
      fullWidth && 'w-full' // fullWidth true হলে পুরো চওড়া
    );

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className // বাইরে থেকে দেওয়া এক্সট্রা ক্লাস
        )}
        disabled={disabled || isLoading} // isLoading-এর সময় বাটন ডিজেবল
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
  }
);

Button.displayName = 'Button';