// app/symptoms/[symptom]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DynamicSymptomChecker from '@/components/DynamicSymptomChecker';

export default function SymptomPage() {
  const { symptom } = useParams();
  const symptomSlug = Array.isArray(symptom) ? symptom[0] : (symptom as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterExists, setChapterExists] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');

  useEffect(() => {
    const checkChapterExists = async () => {
      try {
        setLoading(true);

        // Format the slug for database query (replace hyphens with spaces and capitalize)
        const formattedSlug = symptomSlug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Query to check if chapter exists
        const { data, error } = await supabase
          .from('chapters')
          .select('id, title')
          .ilike('title', formattedSlug)
          .single();

        if (error) {
          console.error('Error fetching chapter:', error);
          setError('Chapter not found or database error');
          setChapterExists(false);
        } else if (data) {
          setChapterExists(true);
          setChapterTitle(data.title);
        } else {
          setChapterExists(false);
          setError('Chapter not found');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
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
            The symptom &ldquo;{symptomSlug}&rdquo; does not exist or is not yet
            supported.
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
