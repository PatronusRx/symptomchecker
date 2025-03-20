import React from 'react';
import { ChecklistItem } from '../../types/symptomChecker';
import {
  PlusCircle,
  MinusCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItem;
  handleResponseChange: (
    itemId: number,
    value: '+' | '-' | 'NA' | null
  ) => void;
  handleNotesChange: (itemId: number, notes: string) => void;
  toggleItemExpansion: (itemId: number) => void;
  renderChecklistItem: (item: ChecklistItem, depth?: number) => React.ReactNode;
  processItemText: (item: ChecklistItem, makeLowercase?: boolean) => string;
  depth?: number;
}

const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({
  item,
  handleResponseChange,
  handleNotesChange,
  toggleItemExpansion,
  renderChecklistItem,
  processItemText,
  depth = 0,
}) => {
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

  // Indentation style based on depth
  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : ''; // max indent of ml-12

  // Check if this item has children
  const hasChildren = item.childItems && item.childItems.length > 0;

  return (
    <div key={item.id} className={indentClass}>
      {isHeader ? (
        // Render header-style item
        <div className="px-3 py-2 bg-gray-100 rounded-md mt-4 mb-2 text-gray-800 font-medium">
          {item.item_text}
        </div>
      ) : (
        // Render regular checklist item
        <div
          className={`p-4 hover:bg-gray-50 transition-all duration-150 rounded-md mb-3 shadow-sm border-l-4 ${borderColorClass} border border-gray-100`}
        >
          <div className="flex flex-wrap items-start mb-2">
            <div className="flex-1 mr-2">
              <div className="text-gray-900 font-medium mb-1">
                {item.item_text}
              </div>
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

          {/* Notes input field - shown for '+' and '-' responses */}
          {(item.response === '+' || item.response === '-') && (
            <div className="mt-2">
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

      {/* Render children conditionally based on expansion state */}
      {hasChildren && (
        <div
          className={`mb-4 ${
            item.response === '+'
              ? 'border-l-2 border-green-200 pl-4'
              : 'border-l-2 border-gray-100 pl-4'
          }`}
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
