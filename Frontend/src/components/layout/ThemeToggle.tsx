// Frontend/src/components/layout/ThemeToggle.tsx
import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  variant = 'ghost',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      leftIcon={
        isDark ? (
          <SunIcon className={iconSize} />
        ) : (
          <MoonIcon className={iconSize} />
        )
      }
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {showLabel && (isDark ? 'Light Mode' : 'Dark Mode')}
    </Button>
  );
};