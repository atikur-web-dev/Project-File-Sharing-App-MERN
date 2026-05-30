// src/components/common/Modal.tsx
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
  onBeforeClose?: () => Promise<boolean> | boolean;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'w-full sm:max-w-sm',
  md: 'w-full sm:max-w-md',
  lg: 'w-full sm:max-w-lg md:max-w-xl',
  xl: 'w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
  full: 'w-full h-full sm:h-auto sm:max-h-[90vh]',
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.15,
    },
  },
};

const mobileModalVariants: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      duration: 0.2,
    },
  },
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  footer,
  className,
  onBeforeClose,
}) => {
  const isMobile = !useMediaQuery('(min-width: 640px)');

  const handleClose = useCallback(async () => {
    if (onBeforeClose) {
      const shouldClose = await onBeforeClose();
      if (!shouldClose) return;
    }
    onClose();
  }, [onBeforeClose, onClose]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, handleClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) handleClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleBackdropClick}
          />
          <div
            className={cn(
              'relative z-10 flex items-center justify-center w-full h-full p-0 sm:p-4'
            )}
            onClick={handleBackdropClick}
          >
            <motion.div
              className={cn(
                'bg-white dark:bg-gray-800 shadow-xl',
                isMobile ? 'rounded-t-2xl' : 'rounded-xl sm:rounded-2xl',
                'overflow-hidden flex flex-col max-h-full',
                isMobile ? 'h-auto max-h-[90%] mt-auto' : 'max-h-[90vh]',
                sizeStyles[size],
                className
              )}
              variants={isMobile ? mobileModalVariants : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleModalClick}
            >
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    {title && (
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClose}
                      className="ml-4 -mr-2"
                      aria-label="Close modal"
                    >
                      <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  )}
                </div>
              )}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                {children}
              </div>
              {footer && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-2 sm:gap-3">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const buttonVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading || isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariant}
            onClick={handleConfirm}
            isLoading={isLoading || isConfirming}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
        {message}
      </p>
    </Modal>
  );
};