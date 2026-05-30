// src/components/dashboard/SortDropdown.tsx
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '../../lib/utils';

export type SortField = 'createdAt' | 'size' | 'fileName';
export type SortOrder = 'asc' | 'desc';

interface SortOption {
  field: SortField;
  order: SortOrder;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { field: 'createdAt', order: 'desc', label: 'Newest first' },
  { field: 'createdAt', order: 'asc', label: 'Oldest first' },
  { field: 'size', order: 'desc', label: 'Largest first' },
  { field: 'size', order: 'asc', label: 'Smallest first' },
  { field: 'fileName', order: 'asc', label: 'Name (A-Z)' },
  { field: 'fileName', order: 'desc', label: 'Name (Z-A)' },
];

interface SortDropdownProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const SortDropdown = ({
  sortBy,
  sortOrder,
  onSortChange,
}: SortDropdownProps) => {
  const currentOption = SORT_OPTIONS.find(
    (opt) => opt.field === sortBy && opt.order === sortOrder
  );

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <span>{currentOption?.label || 'Sort by'}</span>
        <ChevronUpDownIcon className="w-4 h-4 text-gray-500" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => {
              const isActive =
                sortBy === option.field && sortOrder === option.order;

              return (
                <Menu.Item key={`${option.field}-${option.order}`}>
                  {({ active }: { active: boolean }) => (
                    <button
                      onClick={() => onSortChange(option.field, option.order)}
                      className={cn(
                        'flex w-full items-center justify-between px-4 py-2 text-sm',
                        active && 'bg-gray-100 dark:bg-gray-700',
                        isActive && 'text-primary-600 dark:text-primary-400 font-medium'
                      )}
                    >
                      <span>{option.label}</span>
                      {isActive && <CheckIcon className="w-4 h-4" />}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};