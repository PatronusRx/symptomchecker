// components/TopCategoryNav.tsx
import React from 'react';
import {
  ClipboardEdit,
  AlertCircle,
  Pill,
  Apple,
  Activity,
  Users,
  Shield,
  GitBranch,
  Calendar,
  Stethoscope,
  FlaskConical,
  Image,
  FileSearch,
  Heart,
  CheckCircle,
  List,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { Category } from '../types/symptomChecker';

interface TopCategoryNavProps {
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (id: string) => void;
  hasCategoryCompletedItems: (id: string) => boolean;
  completionPercentage: number;
}

// Map of category titles to icon components
const getCategoryIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes('history') &&
    !lowerTitle.includes('collateral') &&
    !lowerTitle.includes('past')
  ) {
    return <ClipboardEdit size={20} />;
  } else if (lowerTitle.includes('alarm') || lowerTitle.includes('feature')) {
    return <AlertCircle size={20} />;
  } else if (lowerTitle.includes('medication')) {
    return <Pill size={20} />;
  } else if (lowerTitle.includes('diet')) {
    return <Apple size={20} />;
  } else if (lowerTitle.includes('review') || lowerTitle.includes('system')) {
    return <Activity size={20} />;
  } else if (lowerTitle.includes('collateral')) {
    return <Users size={20} />;
  } else if (lowerTitle.includes('risk') || lowerTitle.includes('factor')) {
    return <Shield size={20} />;
  } else if (
    lowerTitle.includes('differential') ||
    lowerTitle.includes('diagnosis')
  ) {
    return <GitBranch size={20} />;
  } else if (lowerTitle.includes('past') && lowerTitle.includes('medical')) {
    return <Calendar size={20} />;
  } else if (lowerTitle.includes('physical') || lowerTitle.includes('exam')) {
    return <Stethoscope size={20} />;
  } else if (lowerTitle.includes('lab')) {
    return <FlaskConical size={20} />;
  } else if (lowerTitle.includes('imaging')) {
    return <Image size={20} aria-label="Imaging category icon" />;
  } else if (lowerTitle.includes('special') || lowerTitle.includes('test')) {
    return <FileSearch size={20} />;
  } else if (lowerTitle.includes('ecg')) {
    return <Heart size={20} />;
  } else if (lowerTitle.includes('assessment')) {
    return <CheckCircle size={20} />;
  } else if (lowerTitle.includes('plan')) {
    return <List size={20} />;
  } else if (lowerTitle.includes('disposition')) {
    return <LogOut size={20} />;
  } else if (
    lowerTitle.includes('patient') &&
    lowerTitle.includes('education')
  ) {
    return <BookOpen size={20} />;
  } else {
    // Default icon
    return <ClipboardEdit size={20} />;
  }
};

const TopCategoryNav: React.FC<TopCategoryNavProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  hasCategoryCompletedItems,
  completionPercentage,
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-center mt-1 text-gray-500">
          {completionPercentage}% complete
        </div>
      </div>

      {/* Scrollable categories */}
      <div className="overflow-x-auto no-scrollbar py-2 px-2">
        <div className="flex space-x-2 min-w-max">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const hasCompleted = hasCategoryCompletedItems(category.id);

            return (
              <button
                key={category.id}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div
                  className={`relative ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {getCategoryIcon(category.title)}
                  {hasCompleted && !isActive && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <span className="mt-1 text-xs font-medium truncate max-w-[80px] text-center">
                  {category.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopCategoryNav;
