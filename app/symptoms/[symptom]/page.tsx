// app/symptoms/[symptom]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DynamicSymptomChecker from '@/components/DynamicSymptomChecker';
import { Chapter } from '@/types/symptom-types';

export default function SymptomPage() {
  const { symptom } = useParams();
  const symptomSlug = Array.isArray(symptom) ? symptom[0] : symptom;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterExists, setChapterExists] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');

  useEffect(() => {
    const checkChapterExists = async () => {
      try {
        setLoading(true);

        console.log('Checking for chapter with slug:', symptomSlug);

        // Format the slug for database query (replace hyphens with spaces and capitalize)
        const formattedSlug = symptomSlug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        console.log('Formatted slug for query:', formattedSlug);

        // Query to check if chapter exists - use less strict matching
        const { data, error } = await supabase
          .from('chapters')
          .select('id, title')
          .ilike('title', `%${formattedSlug}%`);

        console.log('Query results:', data, 'Error:', error);

        if (error) {
          console.error('Error fetching chapter:', error);
          setError(`Database error: ${error.message}`);
          setChapterExists(false);
        } else if (data && data.length > 0) {
          // Use the first matching result
          setChapterExists(true);
          setChapterTitle(data[0].title);
          console.log('Found chapter:', data[0]);
        } else {
          setChapterExists(false);
          setError(`Chapter "${formattedSlug}" not found in database`);
          console.log('No matching chapters found');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(
          `An unexpected error occurred: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setChapterExists(false);
      } finally {
        setLoading(false);
      }
    };

    if (symptomSlug) {
      checkChapterExists();
    }
  }, [symptomSlug]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!chapterExists || error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Symptom Not Found</h1>
          <p className="mb-4">
            The symptom "{symptomSlug}" does not exist or is not yet supported.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Symptoms
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        {chapterTitle} Symptom Checker
      </h1>

      <DynamicSymptomChecker chapterSlug={symptomSlug} />
    </div>
  );
}
