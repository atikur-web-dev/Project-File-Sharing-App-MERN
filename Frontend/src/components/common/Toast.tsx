// src/components/common/Toast.tsx
import React from 'react';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  message: string;
  type: ToastType;
}

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const colorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

const CustomToast: React.FC<CustomToastProps> = ({ message, type }) => {
  const Icon = iconMap[type];

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border shadow-lg',
        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        'min-w-75 max-w-md'
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0', colorMap[type])} />
      <p className="text-sm font-medium text-gray-900 dark:text-white flex-1">
        {message}
      </p>
      <button
        onClick={() => toast.dismiss()}
        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export const showToast = {
  success: (message: string) => {
    toast.custom(() => <CustomToast message={message} type="success" />);
  },
  error: (message: string) => {
    toast.custom(() => <CustomToast message={message} type="error" />);
  },
  warning: (message: string) => {
    toast.custom(() => <CustomToast message={message} type="warning" />);
  },
  info: (message: string) => {
    toast.custom(() => <CustomToast message={message} type="info" />);
  },
};