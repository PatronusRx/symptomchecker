'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SymptomCategory {
  title: string;
  route: string;
  description: string;
  color: string;
}

const symptomCategories: SymptomCategory[] = [
  {
    title: 'Chest Pain',
    route: 'chest-pain',
    description: 'Discomfort or pain in the chest area',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Headache',
    route: 'headache',
    description: 'Pain or discomfort in the head or scalp',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Abdominal Pain',
    route: 'abdominal-pain',
    description: 'Pain or discomfort in the stomach or belly region',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Breathing Difficulty',
    route: 'breathing-difficulty',
    description: 'Shortness of breath or trouble breathing',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Dizziness',
    route: 'dizziness',
    description: 'Feeling lightheaded, faint, or unsteady',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Fever',
    route: 'fever',
    description: 'Elevated body temperature often with chills',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  // Handle symptom category click
  const handleCategoryClick = (route: string) => {
    router.push(`/patients/${route}`);
  };

  // Filter categories based on search term
  const filteredCategories = searchTerm.trim()
    ? symptomCategories.filter(
        (category) =>
          category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : symptomCategories;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with title and search */}
      <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Symptom Checker
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search symptoms..."
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
      <main className="max-w-6xl mx-auto my-8 px-4">
        {/* Welcome message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to the Symptom Checker
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please select a symptom category below to help us understand what
            you&apos;re experiencing. This will guide you through a series of
            questions to better assess your condition.
          </p>
        </div>

        {/* Symptom categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <button
              key={category.route}
              onClick={() => handleCategoryClick(category.route)}
              className={`text-left p-6 rounded-lg shadow-sm border-l-4 transition-colors ${category.color}`}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No symptoms found matching &quot;{searchTerm}&quot;
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <div className="inline-block p-4 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 rounded-lg max-w-2xl mx-auto shadow">
            <p className="text-sm">
              <strong>Important:</strong> This symptom checker is for
              informational purposes only and does not replace professional
              medical advice. If you are experiencing a medical emergency,
              please call emergency services immediately.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
