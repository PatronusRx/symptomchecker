import React from 'react';
import { ChecklistItem } from '../../types/symptomChecker';
import {
  PlusCircle,
  MinusCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
} from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItem;
  handleResponseChange: (
    itemId: string,
    value: '+' | '-' | 'NA' | null
  ) => void;
  handleNotesChange: (itemId: string, notes: string) => void;
  toggleItemExpansion: (itemId: string) => void;
  renderChecklistItem: (item: ChecklistItem, depth?: number) => React.ReactNode;
  depth?: number;
}

const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({
  item,
  handleResponseChange,
  handleNotesChange,
  toggleItemExpansion,
  renderChecklistItem,
  depth = 0,
}) => {
  // Determine if this item has a blank field for user input (indicated by ___)
  const hasBlankField = item.item_text.includes('___');

  // Determine border color based on response
  let borderColorClass = 'border-gray-100';
  if (item.response === '+') {
    borderColorClass = 'border-green-200';
  } else if (item.response === '-') {
    borderColorClass = 'border-red-200';
  } else if (item.response === 'NA') {
    borderColorClass = 'border-gray-300';
  }

  // Special styling for header items
  const isHeader = item.is_header;

  // Determine header level style
  let headerClass = 'text-gray-800 font-medium';
  if (item.header_level === 3) {
    headerClass = 'text-gray-800 font-semibold text-lg';
  } else if (item.header_level === 4) {
    headerClass = 'text-gray-700 font-medium';
  }

  // Check if this item has children
  const hasChildren = item.childItems && item.childItems.length > 0;

  // Indentation style based on indent_level from the database or depth
  const indentLevel = item.indent_level || depth;

  // Create a progressive indentation system
  let indentClass = '';
  if (indentLevel > 0) {
    indentClass = `ml-${Math.min(indentLevel * 5, 15)}`; // Increased indentation
  }

  // Enhanced nesting visualization with shadows and background
  const itemDepthClass =
    indentLevel > 0 ? `depth-level-${Math.min(indentLevel, 5)}` : '';

  // Shadow intensity based on nesting level
  const shadowClass = indentLevel > 0 ? `shadow-md` : 'shadow-sm';

  // Enhanced style for nested lists with visual connectors
  const nestedItemClass = hasChildren
    ? item.response === '+'
      ? 'border-l-2 border-green-300 pl-5 ml-3 mt-2'
      : 'border-l-2 border-gray-200 pl-5 ml-3 mt-2'
    : '';

  // Background color subtle variation based on depth
  const bgColorClass =
    indentLevel === 0
      ? 'bg-white'
      : indentLevel === 1
      ? 'bg-gray-50'
      : 'bg-white';

  // Extract the label part from items with blanks (e.g., "Temperature: _____ °F/°C" -> "Temperature:")
  const getLabelFromText = () => {
    if (hasBlankField) {
      const parts = item.item_text.split('_____');
      return parts[0].trim();
    }
    return item.item_text;
  };

  // Get unit from text if available (e.g., "Temperature: _____ °F/°C" -> "°F/°C")
  const getUnitFromText = () => {
    if (hasBlankField) {
      const parts = item.item_text.split('_____');
      if (parts.length > 1 && parts[1].trim()) {
        return parts[1].trim();
      }
    }
    return item.input_unit || '';
  };

  return (
    <div key={item.id} className={indentClass}>
      {isHeader ? (
        // Render header-style item
        <div
          className={`px-4 py-3 bg-blue-50 rounded-md mt-4 mb-3 ${headerClass} ${shadowClass}`}
        >
          {item.item_text}
        </div>
      ) : (
        // Render regular checklist item
        <div
          className={`p-4 hover:bg-gray-50 transition-all duration-150 rounded-md mb-3 
            ${shadowClass} border-l-4 ${borderColorClass} border border-gray-100 
            ${bgColorClass} ${itemDepthClass}`}
          style={{
            // Add subtle border to better visualize the hierarchy
            borderColor: indentLevel > 0 ? 'rgba(209, 213, 219, 0.8)' : '',
          }}
        >
          <div className="flex flex-wrap items-start mb-2">
            <div className="flex-1 mr-2">
              <div className="text-gray-900 font-medium mb-1 flex items-start">
                {indentLevel > 0 && (
                  <CornerDownRight
                    size={16}
                    className="mr-2 mt-1 text-blue-400"
                  />
                )}
                <span
                  style={{
                    opacity: indentLevel > 0 ? 0.9 : 1, // Subtle opacity change for nested items
                  }}
                >
                  {item.item_text}
                </span>
              </div>

              {/* Input field for items with blanks */}
              {hasBlankField && (
                <div className="mt-2 pl-4 border-l-2 border-gray-100 ml-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    {getLabelFromText()}
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                      placeholder="Enter value"
                      value={item.notes || ''}
                      onChange={(e) =>
                        handleNotesChange(item.id, e.target.value)
                      }
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {getUnitFromText()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-1">
              <button
                className={`p-1 rounded-full ${
                  item.response === '+'
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
                onClick={() =>
                  handleResponseChange(
                    item.id,
                    item.response === '+' ? null : '+'
                  )
                }
                title="Present / Yes"
              >
                <PlusCircle size={18} />
              </button>
              <button
                className={`p-1 rounded-full ${
                  item.response === '-'
                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
                onClick={() =>
                  handleResponseChange(
                    item.id,
                    item.response === '-' ? null : '-'
                  )
                }
                title="Absent / No"
              >
                <MinusCircle size={18} />
              </button>
              <button
                className={`p-1 rounded-full ${
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
                <HelpCircle size={18} />
              </button>

              {/* Only show expand/collapse button if item has children */}
              {hasChildren && (
                <button
                  className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    toggleItemExpansion(item.id);
                  }}
                  title={item.isExpanded ? 'Collapse' : 'Expand'}
                >
                  {item.isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Notes input field - shown for '+' and '-' responses - but only if not already has blank field */}
          {(item.response === '+' || item.response === '-') &&
            !hasBlankField && (
              <div className="mt-2 border-l-2 border-gray-100 pl-4">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                  placeholder={
                    item.response === '+'
                      ? 'Add details about this finding...'
                      : 'Add notes about this negative finding...'
                  }
                  value={item.notes || ''}
                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                />
              </div>
            )}
        </div>
      )}

      {/* Render children with enhanced visual connector */}
      {hasChildren && (
        <div
          className={`mb-4 ${nestedItemClass}`}
          style={{
            display: item.isExpanded ? 'block' : 'none',
          }}
        >
          {item.childItems &&
            item.childItems.map((childItem) =>
              renderChecklistItem(childItem, depth + 1)
            )}
        </div>
      )}
    </div>
  );
};

export default ChecklistItemComponent;
