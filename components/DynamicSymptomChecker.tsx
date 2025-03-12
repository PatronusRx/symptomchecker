'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Plus,
  Minus,
  Ban,
  FileEdit,
  Copy,
  ListTodo,
  Clipboard,
  ChevronRight,
} from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Types based on the database schema
type Chapter = {
  id: number;
  chapter_number: number;
  title: string;
};

type Category = {
  id: number;
  category_number: number;
  title: string;
  display_order: number;
};

type Section = {
  id: number;
  chapter_id: number;
  category_id: number;
  title: string;
  display_order: number;
};

type ChecklistItem = {
  id: number;
  section_id: number;
  parent_item_id: number | null;
  display_order: number;
  item_text: string;
  has_text_input: boolean;
  input_label: string | null;
  input_placeholder: string | null;
  input_unit: string | null;
};

// State type for tracking responses
type ResponseState = {
  [key: number]: {
    response: '+' | '-' | 'NA' | null;
    notes: string;
    selected_options?: { [key: string]: string | string[] };
  };
};

// Define props for the component
interface DynamicSymptomCheckerProps {
  chapterSlug: string;
}

const DynamicSymptomChecker: React.FC<DynamicSymptomCheckerProps> = ({
  chapterSlug,
}) => {
  // State for data from Supabase
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // State for user responses
  const [responses, setResponses] = useState<ResponseState>({});

  // State for the active category
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // State for SOAP note
  const [generatedNote, setGeneratedNote] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState('');

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Starting data fetch for chapter slug:', chapterSlug);

        // Format slug for database query
        const formattedSlug = chapterSlug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        console.log('Formatted chapter slug for query:', formattedSlug);

        // Fetch chapter by slug with more flexible matching
        const { data: chaptersData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .ilike('title', `%${formattedSlug}%`);

        console.log('Chapter query results:', chaptersData);

        if (chapterError) {
          console.error('Chapter query error:', chapterError);
          throw chapterError;
        }

        if (!chaptersData || chaptersData.length === 0) {
          console.error('No chapters found for slug:', formattedSlug);
          throw new Error(`Chapter "${formattedSlug}" not found in database`);
        }

        // Use the first matching chapter
        const chapterData = chaptersData[0];
        console.log('Using chapter data:', chapterData);
        setChapter(chapterData);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');

        if (categoriesError) {
          console.error('Categories query error:', categoriesError);
          throw categoriesError;
        }

        console.log('Categories query results:', categoriesData);
        setCategories(categoriesData || []);

        // Set initial active category to the first one
        if (categoriesData && categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }

        // Fetch sections for this chapter
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .eq('chapter_id', chapterData.id)
          .order('display_order');

        if (sectionsError) {
          console.error('Sections query error:', sectionsError);
          throw sectionsError;
        }

        console.log('Sections query results:', sectionsData);
        setSections(sectionsData || []);

        if (sectionsData && sectionsData.length > 0) {
          // Fetch checklist items for this chapter
          const { data: itemsData, error: itemsError } = await supabase
            .from('checklist_items')
            .select('*')
            .in(
              'section_id',
              sectionsData.map((s) => s.id)
            )
            .order('display_order');

          if (itemsError) {
            console.error('Checklist items query error:', itemsError);
            throw itemsError;
          }

          console.log('Checklist items query results:', itemsData);
          setChecklistItems(itemsData || []);
        } else {
          console.log('No sections found, skipping checklist items fetch');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    if (chapterSlug) {
      fetchData();
    }
  }, [chapterSlug]);

  // Get items for the active category
  const getItemsByCategory = (categoryId: number | null) => {
    if (!categoryId) return [];

    // Get sections for this category
    const categorySections = sections.filter(
      (section) => section.category_id === categoryId
    );

    // Get checklist items for these sections
    return checklistItems.filter((item) =>
      categorySections.some((section) => section.id === item.section_id)
    );
  };

  // Handle response change (+/-/NA)
  const handleResponseChange = (
    itemId: number,
    value: '+' | '-' | 'NA' | null
  ) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        response: value,
      },
    }));
  };

  // Handle notes change
  const handleNotesChange = (itemId: number, notes: string) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes,
      },
    }));
  };

  // Handle detail option selection
  const handleDetailOptionChange = (
    itemId: number,
    detailKey: string,
    option: string,
    isMultiSelect: boolean
  ) => {
    setResponses((prev) => {
      const currentItem = prev[itemId] || { response: null, notes: '' };
      const currentOptions = currentItem.selected_options || {};

      let newValue;

      if (isMultiSelect) {
        // For multi-select, maintain an array of selected options
        const currentSelections = Array.isArray(currentOptions[detailKey])
          ? (currentOptions[detailKey] as string[])
          : [];

        if (currentSelections.includes(option)) {
          // Remove if already selected
          newValue = currentSelections.filter((item) => item !== option);
        } else {
          // Add if not selected
          newValue = [...currentSelections, option];
        }
      } else {
        // For single-select, just use the value
        newValue = option;
      }

      return {
        ...prev,
        [itemId]: {
          ...currentItem,
          selected_options: {
            ...currentOptions,
            [detailKey]: newValue,
          },
        },
      };
    });
  };

  // Generate SOAP note
  const generateSoapNote = () => {
    // In a real app, this would generate the SOAP note based on the responses
    // Similar to the ChestPain.tsx component's generateNote function

    const template = {
      intro: `Patient presents with ${chapter?.title || 'symptoms'} of ${
        duration || 'unspecified'
      } duration.`,
      assessment: `${
        chapter?.title || 'Symptoms'
      }, {duration} duration, with features {consistentWith/inconsistentWith} for specific etiology.`,
      plan: 'Recommend {recommendations} for further evaluation and management.',
    };

    let note = '';

    // Add intro
    note +=
      template.intro.replace('{duration}', duration || 'unspecified') + '\n\n';

    // Add symptoms section
    note += 'SYMPTOMS:\n';

    // Add positive findings
    const positiveItems = Object.entries(responses)
      .filter(([_, value]) => value.response === '+')
      .map(([id]) => checklistItems.find((item) => item.id === parseInt(id)))
      .filter(Boolean);

    if (positiveItems.length > 0) {
      positiveItems.forEach((item) => {
        if (!item) return;
        const responseData = responses[item.id];
        note += `- ${item.item_text}${
          responseData.notes ? ': ' + responseData.notes : ''
        }\n`;

        // Add any detail options if present
        if (responseData.selected_options) {
          Object.entries(responseData.selected_options).forEach(
            ([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                note += `  - ${key}: ${value.join(', ')}\n`;
              } else if (typeof value === 'string' && value) {
                note += `  - ${key}: ${value}\n`;
              }
            }
          );
        }
      });
    }

    // Add negative findings
    const negativeItems = Object.entries(responses)
      .filter(([_, value]) => value.response === '-')
      .map(([id]) => checklistItems.find((item) => item.id === parseInt(id)))
      .filter(Boolean);

    if (negativeItems.length > 0) {
      note += '\nPatient denies:\n';
      negativeItems.forEach((item) => {
        if (!item) return;
        const responseData = responses[item.id];
        note += `- ${item.item_text}${
          responseData.notes ? ' ' + responseData.notes : ''
        }\n`;
      });
    }

    // Add assessment
    let consistency = 'inconsistentWith';
    // Logic to determine if findings are consistent with a specific diagnosis
    // This would depend on your specific clinical logic

    // Add assessment
    note += '\nASSESSMENT:\n';
    note += template.assessment
      .replace('{duration}', duration || 'unspecified')
      .replace('{consistentWith/inconsistentWith}', consistency);

    // Add plan
    note += '\n\nPLAN:\n';
    let recommendations = ['observe', 'consider appropriate diagnostic tests'];
    note += template.plan.replace(
      '{recommendations}',
      recommendations.join(', ')
    );

    setGeneratedNote(note);
    return note;
  };

  // Copy note to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNote);
    alert('Note copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{error}</p>
          <div className="mt-4">
            <h3 className="font-semibold">Debugging Information</h3>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>
                Chapter slug:{' '}
                <code className="bg-red-100 px-1 rounded">{chapterSlug}</code>
              </li>
              <li>
                Make sure you've added sample data to your Supabase database
              </li>
              <li>Check that your environment variables are set correctly</li>
              <li>
                Verify that the chapter title in the database matches the URL
                slug format
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <p>Try the following:</p>
            <ol className="list-decimal pl-5 mt-2 text-sm">
              <li>
                Check your browser console for more detailed error messages
              </li>
              <li>
                Verify that your Supabase tables have been created correctly
              </li>
              <li>Ensure you've added the sample data to your database</li>
              <li>
                Confirm your Supabase URL and key in the environment variables
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <ListTodo className="mr-2" size={20} />
          Categories
        </h2>
        <nav>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded flex items-center ${
                    activeCategory === category.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <ChevronRight
                    size={16}
                    className={`mr-2 transition-transform ${
                      activeCategory === category.id
                        ? 'transform rotate-90'
                        : ''
                    }`}
                  />
                  {category.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <FileEdit className="mr-2" size={24} />
          {chapter?.title || 'Symptom'} SOAP Note Generator
        </h1>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Duration of Symptoms:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 2 hours, 3 days"
          />
        </div>

        {/* Checklist items for selected category */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clipboard className="mr-2" size={20} />
            Symptom Checklist:
          </h2>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {getItemsByCategory(activeCategory).map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-100 p-4 last:border-b-0"
              >
                <div className="font-semibold mb-2">{item.item_text}</div>

                <div className="flex space-x-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`item-${item.id}`}
                      value="positive"
                      checked={responses[item.id]?.response === '+'}
                      onChange={() => handleResponseChange(item.id, '+')}
                      className="mr-1 text-green-500 focus:ring-green-500"
                    />
                    <span className="flex items-center text-green-600">
                      <Plus className="mr-1" size={16} />
                      Positive
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`item-${item.id}`}
                      value="negative"
                      checked={responses[item.id]?.response === '-'}
                      onChange={() => handleResponseChange(item.id, '-')}
                      className="mr-1 text-red-500 focus:ring-red-500"
                    />
                    <span className="flex items-center text-red-600">
                      <Minus className="mr-1" size={16} />
                      Negative
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`item-${item.id}`}
                      value="not_applicable"
                      checked={responses[item.id]?.response === 'NA'}
                      onChange={() => handleResponseChange(item.id, 'NA')}
                      className="mr-1 text-gray-500 focus:ring-gray-500"
                    />
                    <span className="flex items-center text-gray-600">
                      <Ban className="mr-1" size={16} />
                      Not Applicable
                    </span>
                  </label>
                </div>

                {/* Notes field */}
                {item.has_text_input && (
                  <div className="mt-2">
                    <textarea
                      className="w-full p-2 border rounded"
                      placeholder={item.input_placeholder || 'Add notes...'}
                      value={responses[item.id]?.notes || ''}
                      onChange={(e) =>
                        handleNotesChange(item.id, e.target.value)
                      }
                      rows={2}
                    />
                    {item.input_unit && (
                      <span className="text-sm text-gray-500 ml-2">
                        {item.input_unit}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {getItemsByCategory(activeCategory).length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No items in this category
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
            onClick={generateSoapNote}
          >
            <FileEdit className="mr-2" size={16} />
            Generate SOAP Note
          </button>
        </div>

        {generatedNote && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <FileEdit className="mr-2" size={20} />
              Generated Note:
            </h2>
            <div className="p-4 border rounded bg-white">
              <pre className="whitespace-pre-wrap font-sans">
                {generatedNote}
              </pre>
            </div>
            <button
              className="mt-2 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 flex items-center"
              onClick={copyToClipboard}
            >
              <Copy className="mr-2" size={14} />
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSymptomChecker;
