// components/SearchBox.tsx
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        className="w-full p-4 pl-12 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:border-transparent outline-none transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-gray-200 dark:ring-gray-700 group-focus-within:ring-blue-500 transition-colors"></div>
    </div>
  );
};

export default SearchBox;
