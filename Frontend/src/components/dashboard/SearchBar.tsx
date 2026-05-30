// src/components/dashboard/SearchBar.tsx
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Input } from '../common/Input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search files...',
}: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="focus:outline-none"
              tabIndex={-1}
            >
              <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          ) : undefined
        }
        className="pr-10"
      />
    </div>
  );
};