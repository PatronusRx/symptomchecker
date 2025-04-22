import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Section {
  section: string;
  approaches: string[];
}

/**
 * SectionBasedDashboard
 * A dashboard organized by medical sections, displaying different approaches within each section
 * Provides search functionality and expandable/collapsible sections
 */
export default function SectionBasedDashboard() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  // Fetch sections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/symptoms');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSections(data);

        // Initialize all sections as collapsed
        const initialExpandState: Record<string, boolean> = {};
        data.forEach((section: Section) => {
          initialExpandState[section.section] = false;
        });
        setExpandedSections(initialExpandState);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching section data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle approach click - navigate to the selected approach page
  const handleApproachClick = (approach: string) => {
    const slugifiedApproach = approach
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
    router.push(`/approach/${slugifiedApproach}`);
  };

  // Toggle section expansion state
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Filter sections and approaches based on search term
  const filteredSections = searchTerm.trim()
    ? sections
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
    : sections;

  return (
    <div className="dashboardContainer min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard header with title and search functionality */}
      <header className="dashboardHeader bg-white dark:bg-gray-800 shadow-sm px-4 py-4">
        <div className="headerContent max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="dashboardTitle text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Emergency Medicine Approaches
          </h1>
          <div className="searchContainer relative">
            <input
              type="text"
              placeholder="Search approaches..."
              className="searchInput w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="searchIcon absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main dashboard content area with sections and approaches */}
      <main className="dashboardContent max-w-6xl mx-auto my-4 px-4">
        {loading ? (
          <div className="loadingIndicator flex justify-center items-center h-64">
            <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="sectionsContainer space-y-4">
            {filteredSections.map((section) => (
              <div
                key={section.section}
                className="sectionCard bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                {/* Section header with toggle button */}
                <button
                  onClick={() => toggleSection(section.section)}
                  className="sectionHeader w-full flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900 text-left"
                >
                  <h2 className="sectionTitle text-lg font-medium text-gray-900 dark:text-white">
                    {section.section}
                  </h2>
                  <div className="toggleIcon text-blue-600 dark:text-blue-300">
                    {expandedSections[section.section] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="collapseIcon h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="expandIcon h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Approaches list - displayed when section is expanded */}
                {expandedSections[section.section] && (
                  <div className="approachesGrid p-4 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {section.approaches.map((approach) => (
                      <button
                        key={approach}
                        className="approachItem text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border-l-4 border-blue-500 transition-colors"
                        onClick={() => handleApproachClick(approach)}
                      >
                        <span className="approachName text-gray-800 dark:text-gray-200">
                          {approach}
                        </span>
                      </button>
                    ))}
                    {section.approaches.length === 0 && (
                      <div className="emptyApproachesMessage col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                        No approaches found in this section
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {filteredSections.length === 0 && (
              <div className="noResultsMessage text-center py-8 text-gray-500 dark:text-gray-400">
                No sections or approaches found matching &quot;{searchTerm}
                &quot;
              </div>
            )}
          </div>
        )}

        {/* Medical disclaimer */}
        <div className="disclaimerContainer mt-8 text-center">
          <div className="disclaimerBox inline-block p-3 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 rounded-lg max-w-2xl mx-auto shadow">
            <p className="disclaimerText text-xs">
              <strong>Disclaimer:</strong> This tool is for informational
              purposes only and does not constitute medical advice. It is not a
              substitute for professional medical evaluation, diagnosis, or
              treatment. Always consult with a qualified healthcare provider for
              any health concerns.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
