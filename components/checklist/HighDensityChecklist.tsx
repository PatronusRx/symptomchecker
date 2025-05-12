// components/checklist/HighDensityChecklist.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlusCircle,
  MinusCircle,
  HelpCircle,
  Search,
  X,
  Filter,
  Grid3X3,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { ChecklistItem, Category, Section } from '../../types/symptomChecker';

interface HighDensityChecklistProps {
  checklistItems: ChecklistItem[];
  categories: Category[];
  sections: Section[];
  activeCategory: string | null;
  setActiveCategory: (id: string) => void;
  handleResponseChange: (
    itemId: string,
    value: '+' | '-' | 'NA' | null
  ) => void;
  handleNotesChange: (itemId: string, notes: string) => void;
  hasCategoryCompletedItems?: (id: string) => boolean;
  buildNestedItemsHierarchy?: (items: ChecklistItem[]) => ChecklistItem[];
  selectedSection?: string | null;
  setSelectedSection?: (id: string | null) => void;
}

// Define colors for different nesting levels
const indentLevelColors = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
  '#10b981', // emerald-500
];

const HighDensityChecklist: React.FC<HighDensityChecklistProps> = ({
  checklistItems,
  categories,
  sections,
  activeCategory,
  setActiveCategory,
  handleResponseChange,
  handleNotesChange,
  hasCategoryCompletedItems = () => false,
  buildNestedItemsHierarchy,
  selectedSection,
  setSelectedSection,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedSectionIds, setExpandedSectionIds] = useState<
    Record<string, boolean>
  >({});
  const [viewDensity, setViewDensity] = useState<
    'ultra-compact' | 'compact' | 'standard'
  >('compact');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter items by search term
  const filteredItems = checklistItems.filter(
    (item) =>
      !searchTerm ||
      item.item_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group items by section for the active category
  const getItemsBySectionForCategory = useCallback(() => {
    if (!activeCategory) return [];

    const categorySections = sections
      .filter((section) => section.category_id === activeCategory)
      .sort((a, b) => a.display_order - b.display_order);

    return categorySections
      .map((section) => {
        const sectionItems = filteredItems
          .filter((item) => item.section_id === section.id)
          .sort((a, b) => a.display_order - b.display_order);

        return {
          section,
          items: sectionItems,
        };
      })
      .filter((group) => {
        // If there's a selected section, only show that one
        if (selectedSection) {
          return group.section.id === selectedSection && group.items.length > 0;
        }
        // Otherwise show all sections with items
        return group.items.length > 0;
      });
  }, [activeCategory, sections, filteredItems, selectedSection]);

  const sectionGroups = getItemsBySectionForCategory();

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSectionIds((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Initialize all sections as expanded
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    sections.forEach((section) => {
      initialExpanded[section.id] = true;
    });
    setExpandedSectionIds(initialExpanded);
  }, [sections]);

  // Handle horizontal scrolling
  const scrollHorizontally = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Determine the appropriate class for item size based on density
  const getItemSizeClass = () => {
    switch (viewDensity) {
      case 'ultra-compact':
        return 'h-12 w-32 text-xs';
      case 'compact':
        return 'h-16 w-44 text-sm';
      case 'standard':
        return 'h-24 w-64 text-base';
      default:
        return 'h-16 w-44 text-sm';
    }
  };

  // Handle section selection
  const handleSectionSelect = (sectionId: string) => {
    if (setSelectedSection) {
      setSelectedSection(selectedSection === sectionId ? null : sectionId);
    }
  };

  // Get visual nesting elements
  const getNestingIndicator = (indentLevel: number) => {
    if (indentLevel === 0) return null;

    // Different styles based on view density
    if (viewDensity === 'ultra-compact') {
      // Most compact option - just show a colored dot
      return (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 mr-1"
          style={{
            backgroundColor:
              indentLevelColors[indentLevel % indentLevelColors.length],
          }}
        />
      );
    } else {
      // In compact and standard views, show a more visual branch indicator
      return (
        <div className="flex items-center mr-1 flex-shrink-0">
          {Array.from({ length: indentLevel }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mx-0.5"
              style={{
                backgroundColor:
                  indentLevelColors[i % indentLevelColors.length],
              }}
            />
          ))}
          <svg height="12" width="8" className="flex-shrink-0">
            <path
              d="M0,6 H6 V10"
              fill="none"
              strokeWidth="1.5"
              stroke={indentLevelColors[indentLevel % indentLevelColors.length]}
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }
  };

  // Render a single checklist item
  const renderChecklistItem = (item: ChecklistItem) => {
    const responseBtnSize =
      viewDensity === 'ultra-compact' ? 'w-6 h-6' : 'w-7 h-7';
    const iconSize =
      viewDensity === 'ultra-compact'
        ? 14
        : viewDensity === 'compact'
        ? 16
        : 20;

    // Determine if text field is present (indicated by ___)
    const hasBlankField = item.item_text.includes('___');

    // Extract the label part from items with blanks
    const getLabelFromText = () => {
      if (hasBlankField) {
        const parts = item.item_text.split('_____');
        return parts[0].trim();
      }
      return item.item_text;
    };

    // Get unit from text if available
    const getUnitFromText = () => {
      if (hasBlankField) {
        const parts = item.item_text.split('_____');
        if (parts.length > 1 && parts[1].trim()) {
          return parts[1].trim();
        }
      }
      return item.input_unit || '';
    };

    // Get indent level for visual nesting
    const indentLevel = item.indent_level || 0;
    const hasChildren = item.childItems && item.childItems.length > 0;

    return (
      <div
        key={item.id}
        className={`${getItemSizeClass()} border rounded-md m-1 bg-white hover:bg-gray-50 transition-colors flex flex-col relative overflow-hidden ${
          indentLevel > 0 ? `border-l-4` : ''
        } ${
          item.response === '+'
            ? 'border-green-300 bg-green-50'
            : item.response === '-'
            ? 'border-red-300 bg-red-50'
            : item.response === 'NA'
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-200'
        }`}
        style={{
          borderLeftColor:
            indentLevel > 0
              ? indentLevelColors[indentLevel % indentLevelColors.length]
              : undefined,
          boxShadow:
            indentLevel > 0
              ? `inset 0 0 0 1px ${
                  indentLevelColors[indentLevel % indentLevelColors.length]
                }25`
              : undefined,
        }}
      >
        <div className="flex-1 p-1 overflow-hidden">
          <div className="relative group font-medium text-gray-700 flex items-start gap-1 cursor-pointer">
            {getNestingIndicator(indentLevel)}
            <div className="overflow-hidden whitespace-nowrap text-ellipsis">
              {item.item_text}
            </div>
            <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-xs rounded p-1 z-50">
              {item.item_text}
            </div>
          </div>

          {/* Parent indicator if item has children */}
          {hasChildren && (
            <div
              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400"
              title="Has child items"
            ></div>
          )}
        </div>

        <div className="flex justify-between items-center p-1 bg-gray-50 border-t border-gray-100">
          <button
            className={`rounded-full flex items-center justify-center ${responseBtnSize} ${
              item.response === '+'
                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
            }`}
            onClick={() =>
              handleResponseChange(item.id, item.response === '+' ? null : '+')
            }
            title="Present / Yes"
          >
            <PlusCircle size={iconSize} />
          </button>
          <button
            className={`rounded-full flex items-center justify-center ${responseBtnSize} ${
              item.response === '-'
                ? 'bg-red-100 text-red-700 border-2 border-red-500'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
            }`}
            onClick={() =>
              handleResponseChange(item.id, item.response === '-' ? null : '-')
            }
            title="Absent / No"
          >
            <MinusCircle size={iconSize} />
          </button>
          <button
            className={`rounded-full flex items-center justify-center ${responseBtnSize} ${
              item.response === 'NA'
                ? 'bg-gray-200 text-gray-700 border-2 border-gray-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() =>
              handleResponseChange(
                item.id,
                item.response === 'NA' ? null : 'NA'
              )
            }
            title="Not Applicable"
          >
            <HelpCircle size={iconSize} />
          </button>
        </div>

        {/* Notes field that appears for +/- responses */}
        {(item.response === '+' || item.response === '-') && !hasBlankField && (
          <div
            className="absolute inset-0 bg-white border rounded-md z-10 flex flex-col transform transition-transform"
            style={{ animation: 'slideUp 0.2s forwards' }}
          >
            <div className="p-1 bg-gray-50 border-b border-gray-200 text-xs font-medium flex justify-between items-center">
              <span>
                {item.response === '+' ? 'Present' : 'Absent'}:{' '}
                {item.item_text.substring(0, 20)}...
              </span>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => handleResponseChange(item.id, null)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 p-1">
              <textarea
                className="w-full h-full text-xs p-1 border border-gray-300 rounded resize-none"
                placeholder={
                  item.response === '+' ? 'Add details...' : 'Add notes...'
                }
                value={item.notes || ''}
                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Text field for items with blanks (___) */}
        {hasBlankField && item.response && (
          <div
            className="absolute inset-0 bg-white border rounded-md z-10 flex flex-col transform transition-transform"
            style={{ animation: 'slideUp 0.2s forwards' }}
          >
            <div className="p-1 bg-gray-50 border-b border-gray-200 text-xs font-medium flex justify-between items-center">
              <span>{getLabelFromText().substring(0, 20)}...</span>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => handleResponseChange(item.id, null)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 p-1">
              <input
                type="text"
                className="w-full h-full text-xs p-1 border border-gray-300 rounded"
                placeholder="Enter value"
                value={item.notes || ''}
                onChange={(e) => handleNotesChange(item.id, e.target.value)}
              />
              {getUnitFromText() && (
                <span className="text-xs text-gray-500 absolute right-2 bottom-2">
                  {getUnitFromText()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render item with its children
  const renderItemWithChildren = (item: ChecklistItem) => {
    return (
      <React.Fragment key={item.id}>
        {renderChecklistItem(item)}
        {item.childItems && item.childItems.length > 0 && item.isExpanded && (
          <div className="pl-3 ml-1 border-l border-gray-200">
            {item.childItems.map((child) => renderItemWithChildren(child))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls and Search */}
      <div className="bg-white p-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="pl-8 pr-8 py-1 border border-gray-300 rounded-md w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-2"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          <button
            className={`p-1.5 rounded ${
              showFilters
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setShowFilters(!showFilters)}
            title="Show Filters"
          >
            <Filter size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Density:</span>
          <button
            onClick={() => setViewDensity('standard')}
            className={`p-1.5 rounded ${
              viewDensity === 'standard'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Standard View"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewDensity('compact')}
            className={`p-1.5 rounded ${
              viewDensity === 'compact'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Compact View"
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewDensity('ultra-compact')}
            className={`p-1.5 rounded ${
              viewDensity === 'ultra-compact'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Ultra Compact View"
          >
            <List size={16} />
          </button>

          <div className="h-4 border-l border-gray-300 mx-1"></div>

          <button
            onClick={() => scrollHorizontally('left')}
            className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Scroll Left"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => scrollHorizontally('right')}
            className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Scroll Right"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>

      {/* Category & Section Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-2 border-b border-gray-200">
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Categories:</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const hasCompleted = hasCategoryCompletedItems
                  ? hasCategoryCompletedItems(category.id)
                  : false;

                return (
                  <button
                    key={category.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium relative ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.title}
                    {hasCompleted && activeCategory !== category.id && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section filters */}
          {activeCategory && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Sections:</div>
              <div className="flex flex-wrap gap-2">
                {sections
                  .filter((section) => section.category_id === activeCategory)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((section) => (
                    <button
                      key={section.id}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedSection === section.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => handleSectionSelect(section.id)}
                    >
                      {section.title}
                    </button>
                  ))}
                {selectedSection && (
                  <button
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-300 text-gray-800 hover:bg-gray-400"
                    onClick={() =>
                      setSelectedSection && setSelectedSection(null)
                    }
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-2"
      >
        <div className="h-full min-w-full">
          {sectionGroups.map((sectionGroup) => (
            <div key={sectionGroup.section.id} className="mb-4">
              {/* Section Header */}
              <div
                className="flex items-center bg-white border border-blue-200 rounded-md p-2 mb-2 cursor-pointer hover:bg-blue-50"
                onClick={() => toggleSection(sectionGroup.section.id)}
              >
                {expandedSectionIds[sectionGroup.section.id] ? (
                  <ChevronDown className="h-4 w-4 text-blue-500 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                )}
                <h3 className="text-sm font-semibold text-blue-700">
                  {sectionGroup.section.title}
                  <span className="ml-2 text-xs text-gray-500">
                    ({sectionGroup.items.length} items)
                  </span>
                </h3>
              </div>

              {/* Grid of Items */}
              {expandedSectionIds[sectionGroup.section.id] && (
                <div className="flex flex-wrap">
                  {buildNestedItemsHierarchy
                    ? buildNestedItemsHierarchy(sectionGroup.items).map(
                        (item) => renderItemWithChildren(item)
                      )
                    : sectionGroup.items.map((item) =>
                        renderChecklistItem(item)
                      )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info footer */}
      <div className="bg-white p-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <div>
          Showing {filteredItems.length} of {checklistItems.length} items
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </div>

        <div>
          {activeCategory &&
            categories.find((c) => c.id === activeCategory)?.title}{' '}
          -
          {sectionGroups.reduce(
            (total, group) => total + group.items.length,
            0
          )}{' '}
          items in {sectionGroups.length} sections
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HighDensityChecklist;
