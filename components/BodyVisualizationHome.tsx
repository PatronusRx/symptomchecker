import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function BodyVisualizationHome() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [approaches, setApproaches] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Fetch approaches data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/symptoms');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApproaches(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approach data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter approaches based on search term
  const filteredApproaches = useMemo(() => {
    if (!searchTerm.trim()) return approaches;
    return approaches.filter((approach) =>
      approach.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [approaches, searchTerm]);

  // Handle approach click
  const handleApproachClick = (approach: string) => {
    const slugifiedApproach = approach
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
    router.push(`/approach/${slugifiedApproach}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with title and search */}
      <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Emergency Medicine Approaches
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search approaches..."
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
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

      {/* Main content */}
      <main className="max-w-6xl mx-auto my-4 px-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Developer tools - can be removed once things are working */}
            <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <h2 className="text-lg font-medium text-yellow-800 mb-2">
                Developer Tools
              </h2>
              <p className="text-sm text-yellow-700 mb-3">
                Check the JavaScript console for diagnostic information when
                clicking on approaches
              </p>
              <div className="flex flex-wrap gap-2">
                {approaches.map((approach) => {
                  const slug = approach
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-');
                  return (
                    <a
                      key={approach}
                      href={`/approach/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                    >
                      {approach}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredApproaches.map((approach) => (
                <button
                  key={approach}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow hover:shadow-md transition-shadow text-left border-l-4 border-blue-500"
                  onClick={() => handleApproachClick(approach)}
                >
                  <h2 className="text-base font-medium text-gray-800 dark:text-white">
                    {approach}
                  </h2>
                </button>
              ))}
              {filteredApproaches.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No approaches found matching &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <div className="inline-block p-3 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 rounded-lg max-w-2xl mx-auto shadow">
            <p className="text-xs">
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
