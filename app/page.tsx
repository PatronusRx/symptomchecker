// app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import SymptomCard from '@/components/SymptomCard';
import { supabase } from '@/lib/supabase';
import { Chapter } from '@/types/symptom-types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Define a set of icons for different symptoms
  const symptomIcons: Record<string, string> = {
    'Chest Pain': '❤️',
    Headache: '🧠',
    Cough: '🫁',
    'Abdominal Pain': '🩻',
    Fever: '🌡️',
    Dizziness: '💫',
    'Shortness of Breath': '💨',
    Fatigue: '😴',
    Nausea: '🤢',
    Vomiting: '🤮',
    // Default icon for any other symptoms
    default: '🩺',
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

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Medical Symptom Checker
        </h1>
        <div className="text-center">Loading symptoms...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Medical Symptom Checker
        </h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p>{error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Medical Symptom Checker
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search symptoms (e.g., chest pain, headache, cough...)"
        />
      </div>

      {searchQuery && filteredChapters.length === 0 ? (
        <p className="text-center text-gray-600">
          No symptoms found matching "{searchQuery}"
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => {
            // Create a descriptive string based on the chapter title
            let description = `Evaluate ${chapter.title.toLowerCase()}, identifying potential causes and severity.`;

            // Get icon for this symptom
            const icon = symptomIcons[chapter.title] || symptomIcons.default;

            // Get keywords for this symptom
            const keywords = symptomKeywords[chapter.title] || [];

            return (
              <SymptomCard
                key={chapter.id}
                title={chapter.title}
                description={description}
                icon={icon}
                onClick={() => handleCardClick(chapter.title)}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
