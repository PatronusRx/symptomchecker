'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DynamicSymptomChecker from '@/components/DynamicSymptomChecker';
import { ClipboardEdit, ArrowLeft, BookOpen, X } from 'lucide-react';

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

interface Chapter {
  id: string;
  title: string;
  chapter_number: number;
  content: string;
}

interface SymptomData {
  [system: string]: {
    [symptom: string]: string[];
  };
}

interface DatabaseError {
  message: string;
  details: string;
  hint: string;
}

export default function SymptomPage() {
  const params = useParams();
  const symptom = typeof params.symptom === 'string' ? params.symptom : null;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterExists, setChapterExists] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [view, setView] = useState<'chapters' | 'checklist'>('chapters');
  const navContext = getStoredNavContext();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkChapterExists = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the system and symptom from sessionStorage
        const { system, symptom } = getStoredNavContext();

        if (!system || !symptom) {
          setError('Missing system or symptom context');
          setChapterExists(false);
          return;
        }

        // Fetch the symptom data to get the chapters
        const response = await fetch('/api/symptoms');
        const symptomData = (await response.json()) as SymptomData;

        // Check if the symptom exists in the system
        if (!symptomData[system] || !symptomData[system][symptom]) {
          setError('Symptom not found in the specified system');
          setChapterExists(false);
          return;
        }

        // Get the chapters for this symptom
        const symptomChapters = symptomData[system][symptom];

        // Fetch the chapter details from the database
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .in('title', symptomChapters);

        if (chaptersError) {
          const dbError = chaptersError as DatabaseError;
          console.error('Error fetching chapters:', dbError);
          setError(`Database error: ${dbError.message}`);
          setChapterExists(false);
        } else if (chaptersData) {
          setChapters(chaptersData as Chapter[]);
          setChapterExists(true);
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

    if (symptom) {
      checkChapterExists();
    }
  }, [symptom]);

  // Hide footer on mobile for this page
  useEffect(() => {
    // Add class to hide footer on mobile
    document.body.classList.add('symptom-page-mobile');

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('symptom-page-mobile');
    };
  }, []);

  // Close mobile sidebar when switching to checklist view
  useEffect(() => {
    if (view === 'checklist') {
      setMobileSidebarOpen(false);
    }
  }, [view]);

  // Go back to the system view (if system context exists) or home
  const handleBackClick = () => {
    if (view === 'checklist') {
      setView('chapters');
      setSelectedChapter(null);
    } else if (navContext.system) {
      router.push(`/?system=${encodeURIComponent(navContext.system)}`);
    } else {
      router.push('/');
    }
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setView('checklist');
    setMobileSidebarOpen(false); // Close sidebar after selection on mobile
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
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
            The symptom &quot;{symptom || 'unknown'}&quot; does not exist or is
            not yet supported.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm px-3 md:px-4 py-2 md:py-3 flex justify-between items-center">
        <div className="flex items-center">
          {/* Back button to return to system view */}
          <button
            className="mr-2 md:mr-3 text-blue-500 hover:text-blue-700"
            onClick={handleBackClick}
            aria-label="Back to system view"
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <div className="flex items-center">
            <ClipboardEdit className="text-blue-600 mr-2 w-5 h-5 md:w-6 md:h-6" />
            <h1 className="text-responsive-lg font-bold text-gray-800">
              {view === 'chapters'
                ? 'Select a Chapter'
                : selectedChapter?.title || 'Symptom'}{' '}
              Checker
            </h1>
          </div>
        </div>

        {/* Mobile toggle button for chapters - only in checklist view */}
        {view === 'checklist' && (
          <button
            className="md:hidden text-blue-500 hover:text-blue-700"
            onClick={toggleMobileSidebar}
            aria-label="Show chapters"
          >
            <BookOpen size={20} />
          </button>
        )}
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-3 flex justify-between items-center border-b">
              <h2 className="font-bold text-lg">Related Chapters</h2>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-3">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`w-full text-left px-3 py-2 rounded-md mb-1 text-responsive-sm ${
                    chapter.id === selectedChapter?.id
                      ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar with chapter list - hidden on mobile */}
        <div className="hidden md:block md:w-56 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-3">
            <h2 className="text-responsive font-semibold mb-3">
              Related Chapters
            </h2>
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterSelect(chapter)}
                className={`w-full text-left px-3 py-1.5 rounded-md mb-1 text-responsive-sm ${
                  chapter.id === selectedChapter?.id
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main content - full width on mobile */}
        <div className="flex-1 overflow-y-auto">
          {view === 'chapters' ? (
            <div className="p-1 md:p-2">
              <h2 className="text-responsive-xl font-semibold mb-3">
                Select a Chapter
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter)}
                    className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                  >
                    <h3 className="text-sm font-medium text-gray-800 mb-1">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Chapter {chapter.chapter_number}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-1 md:p-2">
              <DynamicSymptomChecker
                chapterSlug={
                  selectedChapter?.title.toLowerCase().replace(/\s+/g, '-') ||
                  ''
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
