'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DynamicSymptomChecker from '@/components/DynamicSymptomChecker';



export default function ApproachPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterExists, setChapterExists] = useState(false);
  const [approach, setApproach] = useState<string>('');


  // Get the approach parameter from the URL
  const approachParam =
    typeof params.approach === 'string' ? params.approach : null;

  useEffect(() => {
    const loadApproach = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!approachParam) {
          setError('Missing approach parameter');
          setChapterExists(false);
          return;
        }

        // Convert slug back to original title format
        const approachTitle = approachParam
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char, index, text) => {
            // Don't capitalize small words like "to", "of", "and", etc. unless they're the first word
            const smallWords = [
              'to',
              'of',
              'the',
              'and',
              'in',
              'with',
              'for',
              'on',
              'at',
              'by',
            ];
            const word = text
              .slice(
                index,
                text.indexOf(' ', index) > -1
                  ? text.indexOf(' ', index)
                  : text.length
              )
              .toLowerCase();

            // Always capitalize first word and words that aren't in smallWords list
            if (index === 0 || !smallWords.includes(word)) {
              return char.toUpperCase();
            }
            return char.toLowerCase();
          });

        setApproach(approachTitle);

        console.log(`Searching for approach: "${approachTitle}"`);

        // First, let's list all available chapters to debug
        const { data: allChapters, error: listError } = await supabase
          .from('chapters')
          .select('id, title, chapter_number')
          .order('title');

        if (listError) {
          console.error('Error listing chapters:', listError);
        } else {
          console.log(
            `Found ${allChapters.length} total chapters in database:`
          );
          // Log first 5 chapters for debugging
          allChapters.slice(0, 5).forEach((chapter) => {
            console.log(
              `- ${chapter.title} (ID: ${chapter.id}, Number: ${chapter.chapter_number})`
            );
          });

          // Check if our approach is in the list (case-insensitive search)
          const matchingChapter = allChapters.find(
            (chapter) =>
              chapter.title.toLowerCase() === approachTitle.toLowerCase()
          );

          if (matchingChapter) {
            console.log(
              `Found exact match: ${matchingChapter.title} (ID: ${matchingChapter.id})`
            );
          } else {
            console.log(`No exact match found for "${approachTitle}"`);
            // Log similar titles that might be close matches
            const similarTitles = allChapters
              .filter(
                (chapter) =>
                  chapter.title.toLowerCase().includes('approach') ||
                  approachTitle
                    .toLowerCase()
                    .includes(chapter.title.toLowerCase())
              )
              .slice(0, 3);

            if (similarTitles.length > 0) {
              console.log('Similar titles:');
              similarTitles.forEach((chapter) => {
                console.log(`- ${chapter.title}`);
              });
            }
          }
        }

        // First, try to find the chapter with the formatted title
        const { data: exactChapterData } = await supabase
          .from('chapters')
          .select('*')
          .eq('title', approachTitle)
          .limit(1);

        // If not found, try with case-insensitive search
        if (!exactChapterData || exactChapterData.length === 0) {
          console.log(
            `No exact match for "${approachTitle}", trying case-insensitive search...`
          );

          // Also try the original lowercased version of the approach
          const approachTitleLower = `Approach to ${approachParam
            .replace(/-/g, ' ')
            .toLowerCase()
            .substring('approach-to-'.length)}`;
          console.log(`Trying alternative format: "${approachTitleLower}"`);

          const { data: chapterData, error: chapterError } = await supabase
            .from('chapters')
            .select('*')
            .ilike('title', `%${approachParam.replace(/-/g, ' ')}%`)
            .limit(10);

          if (chapterError) {
            console.error('Database error on fallback search:', chapterError);
            setError(`Database error: ${chapterError.message}`);
            setChapterExists(false);
          } else if (!chapterData || chapterData.length === 0) {
            console.log(
              `No chapter found with title containing: "${approachParam.replace(
                /-/g,
                ' '
              )}"`
            );
            setError(`No chapter found for "${approachTitle}"`);
            setChapterExists(false);
          } else {
            // Find the best match from results
            const bestMatch =
              chapterData.find(
                (ch) =>
                  ch.title.toLowerCase() === approachTitle.toLowerCase() ||
                  ch.title.toLowerCase() === approachTitleLower.toLowerCase()
              ) || chapterData[0];

            console.log(
              `Found best match: ${bestMatch.title} (ID: ${bestMatch.id})`
            );

            setChapterExists(true);
          }
        } else {
          // We found an exact match
          console.log(
            `Found exact chapter match: ${exactChapterData[0].title} (ID: ${exactChapterData[0].id})`
          );

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

    if (approachParam) {
      loadApproach();
    }
  }, [approachParam]);

  // Hide footer on all screen sizes for this page
  useEffect(() => {
    // Add class to hide footer
    document.body.classList.add('symptom-page-mobile');

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('symptom-page-mobile');
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex-1 overflow-y-auto">
          <div className="p-1 md:p-2 w-full">
            {!chapterExists || error ? (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-red-600">
                  Approach Not Found
                </h2>
                <p className="mb-4">
                  The approach &quot;{approach}&quot; was not found in the
                  database.
                </p>
                <p className="mb-6">
                  <strong>How to fix this:</strong> You need to add this
                  approach to your database. Go to your Supabase dashboard and
                  run either:
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>
                      INSERT INTO chapters (title) VALUES (&apos;{approach}
                      &apos;);
                    </code>
                  </pre>
                </div>
                <p className="mb-4">
                  Or run the add-approaches.js script in your project to add all
                  approaches automatically.
                </p>
                <Link href="/" className="text-blue-500 hover:underline">
                  Return Home
                </Link>
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg shadow">
                  <DynamicSymptomChecker chapterSlug={approachParam || ''} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
