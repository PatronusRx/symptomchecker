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
  compact?: boolean; // New prop for compact view in grid layout
}

/**
 * ChecklistItemComponent renders an individual symptom or finding that can be marked as present, absent, or not applicable
 * It handles different views (compact/full), hierarchical nesting, and user notes input
 */
const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({
  item,
  handleResponseChange,
  handleNotesChange,
  toggleItemExpansion,
  renderChecklistItem,
  depth = 0,
  compact = false,
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

  // Create a progressive indentation system - reduced for compact view
  let indentClass = '';
  if (indentLevel > 0 && !compact) {
    indentClass = `ml-${Math.min(indentLevel * 4, 12)}`; // Reduced indentation
  } else if (indentLevel > 0 && compact) {
    indentClass = `ml-${Math.min(indentLevel * 2, 6)}`; // Minimal indentation for compact view
  }

  // Enhanced nesting visualization with shadows and background - adjusted for grid
  const itemDepthClass =
    indentLevel > 0 ? `depth-level-${Math.min(indentLevel, 3)}` : '';

  // Shadow intensity based on nesting level - reduced for grid
  const shadowClass = compact ? '' : indentLevel > 0 ? 'shadow-sm' : '';

  // Background color subtle variation based on depth
  const bgColorClass =
    indentLevel === 0
      ? 'bg-white'
      : indentLevel === 1
      ? 'bg-gray-50'
      : 'bg-white';

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

  // Compact styling adjustments
  const containerPadding = compact ? 'p-2' : 'p-4';
  const containerMargin = compact ? 'mb-2' : 'mb-3';
  const textSize = compact ? 'text-sm' : '';
  const buttonSize = compact ? 'w-6 h-6' : 'w-7 h-7';
  const iconSize = compact ? 16 : 22;
  const childrenContainer = compact
    ? 'pl-3 ml-2 mt-1 border-l border-gray-200'
    : 'border-l-2 border-gray-200 pl-5 ml-3 mt-2';

  return (
    <div key={item.id} className={indentClass}>
      {isHeader ? (
        // Render header-style item - simplified for grid
        <div
          className={`checklistHeader px-3 py-2 bg-blue-50 rounded-md ${containerMargin} ${headerClass} ${shadowClass}`}
        >
          {item.item_text}
        </div>
      ) : (
        // Render regular checklist item - optimized for grid
        <div
          className={`checklistItem ${containerPadding} hover:bg-gray-50 transition-all duration-150 rounded-md ${containerMargin} 
            ${shadowClass} border-l-4 ${borderColorClass} border border-gray-100 
            ${bgColorClass} ${itemDepthClass} ${textSize}`}
          style={{
            borderColor: indentLevel > 0 ? 'rgba(209, 213, 219, 0.8)' : '',
          }}
        >
          <div className="checklistItemContent flex flex-wrap items-start gap-2">
            <div className="checklistItemText flex-1 mr-1">
              <div className="itemTitle text-gray-900 font-medium mb-1 flex items-start">
                {indentLevel > 0 && !compact && (
                  <CornerDownRight
                    size={16}
                    className="indentMarker mr-1 mt-1 text-blue-400 flex-shrink-0"
                  />
                )}
                <span>{item.item_text}</span>
              </div>

              {/* Input field for items with blanks - more compact in grid */}
              {hasBlankField && (
                <div className="itemInputField mt-1 pl-3 border-l border-gray-100 ml-1">
                  <label className="inputLabel block text-xs text-gray-600 mb-1">
                    {getLabelFromText()}
                  </label>
                  <div className="inputWrapper flex items-center">
                    <input
                      type="text"
                      className="valueInput w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      placeholder="Enter value"
                      value={item.notes || ''}
                      onChange={(e) =>
                        handleNotesChange(item.id, e.target.value)
                      }
                    />
                    <span className="unitLabel ml-1 text-xs text-gray-500">
                      {getUnitFromText()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="responseButtonsGroup flex space-x-1 flex-shrink-0">
              <button
                className={`yesButton p-1 rounded-full ${buttonSize} flex items-center justify-center ${
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
                <PlusCircle size={iconSize} />
              </button>
              <button
                className={`noButton p-1 rounded-full ${buttonSize} flex items-center justify-center ${
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
                <MinusCircle size={iconSize} />
              </button>
              <button
                className={`naButton p-1 rounded-full ${buttonSize} flex items-center justify-center ${
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

              {/* Only show expand/collapse button if item has children */}
              {hasChildren && (
                <button
                  className={`toggleChildrenButton p-1 rounded-full ${buttonSize} flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItemExpansion(item.id);
                  }}
                  title={item.isExpanded ? 'Collapse' : 'Expand'}
                >
                  {item.isExpanded ? (
                    <ChevronDown size={iconSize - 4} />
                  ) : (
                    <ChevronRight size={iconSize - 4} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Notes input field - shown for '+' and '-' responses - but only if not already has blank field */}
          {(item.response === '+' || item.response === '-') &&
            !hasBlankField && (
              <div className="notesFieldWrapper mt-2 border-l border-gray-100 pl-3">
                <textarea
                  className="notesTextarea w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={compact ? 1 : 2}
                  placeholder={
                    item.response === '+' ? 'Add details...' : 'Add notes...'
                  }
                  value={item.notes || ''}
                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                ></textarea>
              </div>
            )}

          {/* Child items - only render when parent is expanded */}
          {hasChildren && item.isExpanded && (
            <div className={`childItemsContainer ${childrenContainer}`}>
              {item.childItems?.map((childItem) =>
                renderChecklistItem(childItem, depth + 1)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChecklistItemComponent;
