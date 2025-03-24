// app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import SymptomCard from '@/components/SymptomCard';
import MobileWarningModal from '@/components/MobileWarningModal';
import { supabase } from '@/lib/supabase';
import { Chapter } from '@/types/symptom-types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const router = useRouter();

  // Define a mapping of symptom titles to Lucide icon names
  const symptomIcons: Record<string, string> = {
    'Chest Pain': 'heart',
    Headache: 'brain',
    Cough: 'wind',
    'Abdominal Pain': 'stethoscope',
    Fever: 'thermometer',
    Dizziness: 'sparkles',
    'Shortness of Breath': 'wind',
    Fatigue: 'moon',
    Nausea: 'pill',
    Vomiting: 'droplets',
    // Default icon for any other symptoms
    default: 'activity',
  };

  // Define keywords for each symptom for better searching
  const symptomKeywords: Record<string, string[]> = {
    'Chest Pain': [
      'heart',
      'cardiac',
      'angina',
      'pressure',
      'tightness',
      'discomfort',
    ],
    Headache: ['migraine', 'tension', 'cluster', 'sinus', 'head pain'],
    Cough: [
      'bronchitis',
      'pneumonia',
      'respiratory',
      'throat',
      'phlegm',
      'mucus',
    ],
    'Abdominal Pain': [
      'stomach',
      'gut',
      'digestive',
      'belly',
      'nausea',
      'cramps',
    ],
    Fever: ['temperature', 'hot', 'chills', 'sweats', 'infection'],
    Dizziness: ['vertigo', 'lightheaded', 'faint', 'balance', 'spinning'],
    'Shortness of Breath': [
      'dyspnea',
      'breathing',
      'respiratory',
      'asthma',
      'copd',
    ],
    Fatigue: ['tired', 'exhaustion', 'weakness', 'lethargy', 'energy'],
    Nausea: ['sick', 'queasy', 'upset stomach', 'motion sickness'],
    Vomiting: ['throw up', 'emesis', 'regurgitation', 'retching'],
  };

  useEffect(() => {
    // Check if the device is mobile and if the warning was dismissed before
    const checkIfMobile = () => {
      // Simple check based on screen width
      const isMobile = window.innerWidth < 768;

      // Check if user has dismissed the warning before
      const warningDismissed = localStorage.getItem('mobileWarningDismissed');

      // Only show warning if mobile and not dismissed before
      setShowMobileWarning(isMobile && !warningDismissed);
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('chapters')
          .select('*')
          .order('chapter_number');

        if (error) {
          throw error;
        }

        if (data) {
          setChapters(data);
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError('Failed to load symptoms');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  // Filter chapters based on search query
  const filteredChapters = chapters.filter((chapter) => {
    const title = chapter.title.toLowerCase();
    const query = searchQuery.toLowerCase();

    // Direct title match
    if (title.includes(query)) {
      return true;
    }

    // Check against keywords
    const keywords = symptomKeywords[chapter.title] || [];
    return keywords.some((keyword) => keyword.toLowerCase().includes(query));
  });

  // Handle card click - navigate to the symptom page
  const handleCardClick = (title: string) => {
    // Convert title to slug format (remove any special characters)
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, '') // Remove non-word chars except hyphens
      .replace(/\-\-+/g, '-'); // Replace multiple hyphens with single hyphen

    console.log(`Navigating to symptom: ${title} with slug: ${slug}`);
    router.push(`/symptoms/${slug}`);
  };

  // Handle closing the mobile warning modal
  const handleCloseMobileWarning = () => {
    // Modal component handles the localStorage setting now
    setShowMobileWarning(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading symptoms...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {showMobileWarning && (
        <MobileWarningModal onClose={handleCloseMobileWarning} />
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Medical Symptom Checker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Identify potential causes for your symptoms and get guidance on what
            to do next.
          </p>

          <div className="max-w-xl mx-auto mb-12">
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search symptoms (e.g., chest pain, headache, cough...)"
            />
          </div>
        </div>

        {searchQuery && filteredChapters.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-6 rounded-xl max-w-xl mx-auto">
            <p className="text-center">
              No symptoms found matching &ldquo;
              <span className="font-semibold">{searchQuery}</span>&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredChapters.map((chapter) => {
              // Create a descriptive string based on the chapter title
              const description = `Evaluate ${chapter.title.toLowerCase()}, identifying potential causes and severity.`;

              // Get icon for this symptom
              const iconName =
                symptomIcons[chapter.title] || symptomIcons.default;

              return (
                <SymptomCard
                  key={chapter.id}
                  title={chapter.title}
                  description={description}
                  iconName={iconName}
                  onClick={() => handleCardClick(chapter.title)}
                />
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm">
              <strong>Disclaimer:</strong> This tool is for informational
              purposes only and is not a substitute for professional medical
              advice. Always consult with a qualified healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
