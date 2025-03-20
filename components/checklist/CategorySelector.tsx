import React from 'react';
import { Category } from '../../types/symptomChecker';
import { ClipboardEdit } from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  activeCategory: number | null;
  setActiveCategory: (id: number) => void;
  hasCategoryCompletedItems: (id: number) => boolean;
  isSidebarCollapsed: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  hasCategoryCompletedItems,
  isSidebarCollapsed,
}) => {
  return (
    <nav className="flex-1 overflow-y-auto py-2">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const hasCompleted = hasCategoryCompletedItems(category.id);

        return (
          <button
            key={category.id}
            className={`w-full text-left px-3 py-2 flex items-center ${
              isActive
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                : 'border-l-4 border-transparent hover:bg-gray-50'
            } transition-colors`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
              <ClipboardEdit size={18} />
            </span>

            {!isSidebarCollapsed && (
              <>
                <span className="ml-3 flex-1 truncate">{category.title}</span>

                {/* Status indicators */}
                {hasCompleted && !isActive && (
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                )}
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default CategorySelector;
