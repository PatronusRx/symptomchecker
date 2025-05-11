import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useSoap } from './contexts/SoapContext';
import systemData from './SymptomSystem.json';

interface ApproachSidebarProps {
  onApproachSelect: (approach: string) => void;
  currentApproach?: string;
}

export default function ApproachSidebar({
  onApproachSelect,
  currentApproach,
}: ApproachSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const { approaches } = useSoap();

  // Initialize sections as expanded
  useEffect(() => {
    const initialExpandState: Record<string, boolean> = {};
    systemData.sections.forEach((section) => {
      initialExpandState[section.section] = true; // Start expanded
    });
    setExpandedSections(initialExpandState);
  }, []);

  // Filter sections and approaches based on search term
  const filteredSections = searchTerm.trim()
    ? systemData.sections
        .map((section) => ({
          ...section,
          approaches: section.approaches.filter((approach) =>
            approach.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter(
          (section) =>
            section.approaches.length > 0 ||
            section.section.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : systemData.sections;

  // Toggle section expansion
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Handle approach click
  const handleApproachClick = (approach: string) => {
    onApproachSelect(approach);
  };

  // Check if an approach is selected
  const isApproachSelected = (approach: string) => {
    return approaches.some((a) => a.title === approach);
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 flex flex-col h-full">
      {/* Search bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search approaches..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={16}
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Sections and approaches */}
      <div className="flex-1 overflow-y-auto">
        {filteredSections.map((section, sectionIndex) => (
          <div
            key={`sidebar-section-${section.section}-${sectionIndex}`}
            className="border-b border-gray-100"
          >
            {/* Section header */}
            <button
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 bg-gray-50"
              onClick={() => toggleSection(section.section)}
            >
              <span className="text-sm font-medium text-gray-700">
                {section.section}
              </span>
              <span className="text-gray-400">
                {expandedSections[section.section] ? (
                  <ChevronLeft size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </span>
            </button>

            {/* Approaches list */}
            {expandedSections[section.section] && (
              <div className="pl-3 pr-2 pb-2">
                {section.approaches.map((approach, approachIndex) => {
                  const isActive = currentApproach === approach;
                  const isSelected = isApproachSelected(approach);

                  return (
                    <button
                      key={`sidebar-approach-${section.section}-${approach}-${approachIndex}`}
                      className={`w-full text-left px-2 py-2 text-sm rounded-md mb-1 flex items-center group transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : isSelected
                          ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                          : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                      onClick={() => handleApproachClick(approach)}
                    >
                      <span className="flex-1">{approach}</span>
                      {isSelected && (
                        <CheckCircle2
                          size={16}
                          className={`ml-2 ${
                            isActive ? 'text-blue-500' : 'text-green-500'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-500">
            No approaches found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>

      {/* Selected approaches summary */}
      {approaches.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs font-medium text-gray-700 mb-1">
            Selected Approaches ({approaches.length})
          </div>
          <div className="space-y-1">
            {approaches.map((approach, index) => (
              <div
                key={`selected-approach-${approach.title}-${index}`}
                className="flex items-center text-xs text-gray-600"
              >
                <CheckCircle2 size={12} className="text-green-500 mr-1.5" />
                <span className="truncate">{approach.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
