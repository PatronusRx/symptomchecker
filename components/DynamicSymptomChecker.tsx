'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Chapter,
  Category,
  Section,
  ChecklistItem,
  ResponseState,
} from '@/types/symptom-types';

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

        // Fetch chapter by slug
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .eq('title', chapterSlug.replace(/-/g, ' '))
          .single();

        if (chapterError) throw chapterError;
        if (!chapterData) throw new Error('Chapter not found');

        setChapter(chapterData);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');

        if (categoriesError) throw categoriesError;
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

        if (sectionsError) throw sectionsError;
        setSections(sectionsData || []);

        // Fetch checklist items for this chapter
        const { data: itemsData, error: itemsError } = await supabase
          .from('checklist_items')
          .select('*')
          .in(
            'section_id',
            (sectionsData || []).map((s) => s.id)
          )
          .order('display_order');

        if (itemsError) throw itemsError;
        setChecklistItems(itemsData || []);

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

  // Generate SOAP note
  const generateSoapNote = () => {
    // In a real app, this would generate the SOAP note based on the responses
    // Similar to the ChestPain.tsx component's generateNote function

    const template = {
      intro: `Patient presents with ${chapter?.title || 'symptoms'} of ${
        duration || 'unspecified'
      } duration.`,
      assessment: `${chapter?.title || 'Symptoms'}, ${
        duration || 'unspecified'
      } duration, with features {consistentWith/inconsistentWith} for specific etiology.`,
      plan: 'Recommend {recommendations} for further evaluation and management.',
    };

    let note = '';

    // Add intro
    note += template.intro + '\n\n';

    // Add symptoms section
    note += 'SYMPTOMS:\n';

    // Add positive findings
    const positiveItems = Object.entries(responses)
      .filter(([, responseData]) => responseData.response === '+')
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
      .filter(([, responseData]) => responseData.response === '-')
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
    const consistency = 'inconsistentWith';
    // Logic to determine if findings are consistent with a specific diagnosis
    // This would depend on your specific clinical logic

    // Add assessment
    note += '\nASSESSMENT:\n';
    note += template.assessment.replace(
      '{consistentWith/inconsistentWith}',
      consistency
    );

    // Add plan
    note += '\n\nPLAN:\n';
    const recommendations = [
      'observe',
      'consider appropriate diagnostic tests',
    ];
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
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
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

      {/* Category tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`mr-2 py-2 px-4 font-medium text-sm border-b-2 ${
                activeCategory === category.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Checklist items for selected category */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Symptom Checklist:</h2>

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
                    className="mr-1"
                  />
                  Positive
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`item-${item.id}`}
                    value="negative"
                    checked={responses[item.id]?.response === '-'}
                    onChange={() => handleResponseChange(item.id, '-')}
                    className="mr-1"
                  />
                  Negative
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`item-${item.id}`}
                    value="not_applicable"
                    checked={responses[item.id]?.response === 'NA'}
                    onChange={() => handleResponseChange(item.id, 'NA')}
                    className="mr-1"
                  />
                  Not Applicable
                </label>
              </div>

              {/* Notes field */}
              {item.has_text_input && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder={item.input_placeholder || 'Add notes...'}
                    value={responses[item.id]?.notes || ''}
                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
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
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={generateSoapNote}
        >
          Generate SOAP Note
        </button>
      </div>

      {generatedNote && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Generated Note:</h2>
          <div className="p-4 border rounded bg-white">
            <pre className="whitespace-pre-wrap font-sans">{generatedNote}</pre>
          </div>
          <button
            className="mt-2 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicSymptomChecker;
