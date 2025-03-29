'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DynamicSymptomChecker from '@/components/DynamicSymptomChecker';
import { ClipboardEdit, ArrowLeft } from 'lucide-react';

// Store currentSystem, currentSymptom in sessionStorage to maintain navigation context
const getStoredNavContext = () => {
  if (typeof window !== 'undefined') {
    return {
      system: sessionStorage.getItem('currentSystem') || null,
      symptom: sessionStorage.getItem('currentSymptom') || null,
    };
  }
  return { system: null, symptom: null };
};

export default function SymptomPage() {
  const { symptom } = useParams();
  const router = useRouter();
  const symptomSlug = Array.isArray(symptom) ? symptom[0] : (symptom as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterExists, setChapterExists] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapters, setChapters] = useState([]);

  // Navigation context
  const [navContext, setNavContext] = useState(getStoredNavContext());

  useEffect(() => {
    const checkChapterExists = async () => {
      try {
        setLoading(true);

        // Format the slug for database query (replace hyphens with spaces and capitalize)
        const formattedSlug = symptomSlug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Query to check if chapter exists - use less strict matching
        const { data, error } = await supabase
          .from('chapters')
          .select('id, title')
          .ilike('title', `%${formattedSlug}%`);

        if (error) {
          setError(`Database error: ${error.message}`);
          setChapterExists(false);
        } else if (data && data.length > 0) {
          // Use the first matching result
          setChapterExists(true);
          setChapterTitle(data[0].title);

          // Store the symptom title in sessionStorage for context
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('currentSymptom', data[0].title);
          }
        } else {
          setChapterExists(false);
          setError(`Chapter "${formattedSlug}" not found in database`);
        }

        // Fetch all chapters for the sidebar
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('id, title, chapter_number')
          .order('chapter_number');

        if (chaptersError) {
          console.error('Error fetching chapters:', chaptersError);
        } else if (chaptersData) {
          setChapters(chaptersData);
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

  // Go back to the system view (if system context exists) or home
  const handleBackClick = () => {
    if (navContext.system) {
      router.push(`/?system=${encodeURIComponent(navContext.system)}`);
    } else {
      router.push('/');
    }
  };

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
            The symptom &quot;{symptomSlug}&quot; does not exist or is not yet
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
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="mr-3 text-blue-500 hover:text-blue-700"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center">
            <ClipboardEdit className="text-blue-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800">
              {chapterTitle} Symptom Checker
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with all chapters */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">All Symptoms</h2>
          </div>
          <nav className="p-2">
            {chapters.map((chapter: any) => (
              <Link
                key={chapter.id}
                href={`/symptoms/${chapter.title
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
                className={`block px-4 py-2 rounded-md mb-1 ${
                  chapter.title === chapterTitle
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {chapter.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content with DynamicSymptomChecker */}
        <div className="flex-1 overflow-hidden">
          <DynamicSymptomChecker chapterSlug={symptomSlug} />
        </div>
      </div>
    </div>
  );
}
