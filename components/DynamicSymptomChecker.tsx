import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PlusCircle,
  MinusCircle,
  HelpCircle,
  ClipboardEdit,
  Save,
  FileText,
  Menu,
  X,
  Check,
  Clipboard,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronDown,
  User,
  ChevronLeft,
  Clock,
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
  isCompleted?: boolean;
  response?: '+' | '-' | 'NA' | null;
  notes?: string;
  selectedOptions?: { [key: string]: string | string[] };
  detailNotes?: { [key: string]: string };
  childItems?: ChecklistItem[];
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
  const [generatedNote, setGeneratedNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState('');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Patient info state
  const [patientInfo, setPatientInfo] = useState({
    name: 'New Patient',
    dob: '',
    mrn: '',
    visitDate: new Date().toISOString().split('T')[0],
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Format slug for database query
        const formattedSlug = chapterSlug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Fetch chapter by slug with more flexible matching
        const { data: chaptersData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .ilike('title', `%${formattedSlug}%`);

        if (chapterError) {
          throw chapterError;
        }

        if (!chaptersData || chaptersData.length === 0) {
          throw new Error(`Chapter "${formattedSlug}" not found in database`);
        }

        // Use the first matching chapter
        const chapterData = chaptersData[0];
        setChapter(chapterData);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');

        if (categoriesError) {
          throw categoriesError;
        }
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
          throw sectionsError;
        }
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
            throw itemsError;
          }

          // Initialize with isCompleted property
          const initializedItems = (itemsData || []).map((item) => ({
            ...item,
            isCompleted: false,
            response: null,
            notes: '',
          }));

          setChecklistItems(initializedItems);
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

  // Group items by section for the active category
  const getItemsBySectionForCategory = (categoryId: number | null) => {
    if (!categoryId) return [];

    // Get sections for this category
    const categorySections = sections
      .filter((section) => section.category_id === categoryId)
      .sort((a, b) => a.display_order - b.display_order);

    // Create an array of sections with their items
    return categorySections
      .map((section) => {
        // Get all items for this section
        const sectionItems = checklistItems
          .filter((item) => item.section_id === section.id)
          .sort((a, b) => a.display_order - b.display_order);

        // Create a hierarchical structure
        // First get all parent items (items with no parent_item_id)
        const parentItems = sectionItems.filter(
          (item) => item.parent_item_id === null
        );

        // For each parent item, find its children
        const itemsWithHierarchy = parentItems.map((parentItem) => {
          // Find children of this parent
          const childItems = sectionItems.filter(
            (item) => item.parent_item_id === parentItem.id
          );

          return {
            ...parentItem,
            childItems: childItems,
          };
        });

        return {
          section,
          items: itemsWithHierarchy,
        };
      })
      .filter((group) => group.items.length > 0); // Only include sections with items
  };

  // Helper function to process item text and replace underscores with notes
  const processItemText = (
    item: ChecklistItem,
    makeLowercase = true
  ): string => {
    let text = makeLowercase ? item.item_text.toLowerCase() : item.item_text;

    // Check if the item text contains underscores
    if (text.includes('___')) {
      if (item.notes && item.notes.trim() !== '') {
        // Replace all underscore sequences with the user's notes
        text = text.replace(/_{2,}/g, item.notes);
      } else {
        // If no notes, remove the underscores
        text = text.replace(/\s*_{2,}\s*/g, ' ').trim();
      }
    } else if (item.notes && item.notes.trim() !== '') {
      // If no underscores but notes exist, append them without parentheses
      text += ` ${item.notes}`;
    }

    return text;
  };

  // Handle response change (+/-/NA)
  const handleResponseChange = (
    itemId: number,
    value: '+' | '-' | 'NA' | null
  ) => {
    // Update the responses state
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        response: value,
      },
    }));

    // Also update the checklistItems to mark as completed
    const updatedItems = [...checklistItems];
    const itemIndex = updatedItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        response: value,
        isCompleted: true,
      };

      // Update state
      setChecklistItems(updatedItems);

      // Immediately regenerate SOAP note with the updated items
      const updatedNote = generateSoapNoteWithItems(updatedItems);
      setGeneratedNote(updatedNote);
    }

    // Trigger autosave
    triggerAutosave();
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

    // Also update in checklistItems
    const updatedItems = [...checklistItems];
    const itemIndex = updatedItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        notes,
      };

      // Update state
      setChecklistItems(updatedItems);

      // Immediately regenerate SOAP note with the updated items
      const updatedNote = generateSoapNoteWithItems(updatedItems);
      setGeneratedNote(updatedNote);
    }

    // Trigger autosave
    triggerAutosave();
  };

  // Handle detail option selection
  const handleDetailOptionChange = (
    itemId: number,
    detailKey: string,
    option: string,
    isSelected: boolean
  ) => {
    setChecklistItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          // Initialize selectedOptions if not existing
          const currentSelectedOptions = item.selectedOptions || {};

          // Get the current options for this detail key
          const currentOptions = currentSelectedOptions[detailKey] || [];

          let updatedOptions;

          if (Array.isArray(currentOptions)) {
            // For multi-select details
            if (isSelected) {
              // Add to array if not already there
              updatedOptions = currentOptions.includes(option)
                ? currentOptions
                : [...currentOptions, option];
            } else {
              // Remove from array if present
              updatedOptions = currentOptions.filter((opt) => opt !== option);
            }
          } else {
            // For single-select details
            updatedOptions = isSelected ? option : '';
          }

          const updatedItem = {
            ...item,
            selectedOptions: {
              ...currentSelectedOptions,
              [detailKey]: updatedOptions,
            },
          };

          return updatedItem;
        }
        return item;
      })
    );

    // Immediately regenerate SOAP note with the updated items
    setTimeout(() => {
      const updatedNote = generateSoapNoteWithItems(checklistItems);
      setGeneratedNote(updatedNote);
    }, 0);
  };

  // Handle detail notes change
  const handleDetailNoteChange = (
    itemId: number,
    detailKey: string,
    option: string,
    note: string
  ) => {
    setChecklistItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          // Initialize detail notes if not existing
          const currentDetailNotes = item.detailNotes || {};

          const updatedItem = {
            ...item,
            detailNotes: {
              ...currentDetailNotes,
              [`${detailKey}-${option}`]: note,
            },
          };

          return updatedItem;
        }
        return item;
      })
    );

    // Immediately regenerate SOAP note with the updated items
    setTimeout(() => {
      const updatedNote = generateSoapNoteWithItems(checklistItems);
      setGeneratedNote(updatedNote);
    }, 0);
  };

  // Trigger autosave animation
  const triggerAutosave = () => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setIsAutoSaving(false);
    }, 1500);
  };

  // Generate SOAP note
  const generateSoapNote = () => {
    // Generate each section of the SOAP note
    const subjective = generateSubjectiveSection();
    const objective = generateObjectiveSection();
    const assessment = generateAssessmentSection();
    const plan = generatePlanSection();

    // Set the complete SOAP note
    setGeneratedNote({
      subjective,
      objective,
      assessment,
      plan,
    });

    // Return the full note text for clipboard copying
    return {
      subjective,
      objective,
      assessment,
      plan,
    };
  };

  // Generate SOAP note with specific items (for immediate updates)
  const generateSoapNoteWithItems = (items: ChecklistItem[]) => {
    // Generate each section of the SOAP note
    const subjective = generateSubjectiveSectionWithItems(items);
    const objective = generateObjectiveSectionWithItems(items);
    const assessment = generateAssessmentSectionWithItems(items);
    const plan = generatePlanSectionWithItems(items);

    // Return the complete SOAP note
    return {
      subjective,
      objective,
      assessment,
      plan,
    };
  };

  // Helper methods for SOAP note generation
  const generateSubjectiveSection = () => {
    return generateSubjectiveSectionWithItems(checklistItems);
  };

  const generateSubjectiveSectionWithItems = (items: ChecklistItem[]) => {
    // Start with patient's chief complaint
    let section = `Patient presents with ${chapter?.title || 'symptoms'} of ${
      duration || 'unspecified'
    } duration.\n\n`;

    // Define subjective categories in the exact order they should appear
    const subjectiveCategories = [
      'history',
      'alarm features',
      'medications',
      'diet',
      'review of systems',
      'collateral history',
      'risk factors',
      'past medical history',
    ];

    // Get all positive and negative findings from all sections
    const relevantItems = items.filter(
      (item) => item.response === '+' || item.response === '-'
    );

    // Store which items belong to which categories for deduplication
    const categoryItemMap = new Map<string, Set<number>>();

    // Preprocess to determine which items belong to which categories
    subjectiveCategories.forEach((categoryTerm) => {
      const matchingCategoryIds = categories
        .filter((category) =>
          category.title.toLowerCase().includes(categoryTerm.toLowerCase())
        )
        .map((category) => category.id);

      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      const categoryItems = relevantItems.filter((item) =>
        categorySections.some((section) => section.id === item.section_id)
      );

      // Store item IDs for this category
      categoryItemMap.set(
        categoryTerm,
        new Set(categoryItems.map((item) => item.id))
      );
    });

    // Deduplication: check for items that appear in multiple categories
    // For 'history' and 'past medical history' overlap:
    if (
      categoryItemMap.has('history') &&
      categoryItemMap.has('past medical history')
    ) {
      const historyItems = categoryItemMap.get('history')!;
      const pastMedicalItems = categoryItemMap.get('past medical history')!;

      // Find duplicate items
      const duplicateItems = new Set<number>();
      historyItems.forEach((itemId) => {
        if (pastMedicalItems.has(itemId)) {
          duplicateItems.add(itemId);
        }
      });

      // Remove duplicates from the general history category
      duplicateItems.forEach((itemId) => {
        historyItems.delete(itemId);
      });

      categoryItemMap.set('history', historyItems);
    }

    // Find all categories that have items after deduplication
    const categoriesWithItems = subjectiveCategories.filter((categoryTerm) => {
      const categoryItems = categoryItemMap.get(categoryTerm);
      return categoryItems && categoryItems.size > 0;
    });

    // Process each category in the defined order
    for (let i = 0; i < subjectiveCategories.length; i++) {
      const categoryTerm = subjectiveCategories[i];

      // Skip if this category has no items after deduplication
      const categoryItemIds = categoryItemMap.get(categoryTerm);
      if (!categoryItemIds || categoryItemIds.size === 0) continue;

      // Find categories that match this term
      const matchingCategoryIds = categories
        .filter((category) =>
          category.title.toLowerCase().includes(categoryTerm.toLowerCase())
        )
        .map((category) => category.id);

      if (matchingCategoryIds.length === 0) continue;

      // Get sections that belong to this category
      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      if (categorySections.length === 0) continue;

      // Get items for these sections that are in our deduplicated set
      const categoryItems = relevantItems.filter(
        (item) =>
          categoryItemIds.has(item.id) &&
          categorySections.some((section) => section.id === item.section_id)
      );

      if (categoryItems.length === 0) continue;

      // Add category header (capitalize first letter)
      const displayCategoryName =
        categoryTerm.charAt(0).toUpperCase() + categoryTerm.slice(1);
      section += `${displayCategoryName}:\n`;

      // Group items by their section
      const sectionGroups = new Map();
      categoryItems.forEach((item: ChecklistItem) => {
        const sectionId = item.section_id;
        if (!sectionGroups.has(sectionId)) {
          const section = categorySections.find((s) => s.id === sectionId);
          sectionGroups.set(sectionId, {
            section,
            positiveItems: [],
            negativeItems: [],
          });
        }

        const group = sectionGroups.get(sectionId);
        if (item.response === '+') {
          group.positiveItems.push(item);
        } else if (item.response === '-') {
          group.negativeItems.push(item);
        }
      });

      // Format each section's findings
      sectionGroups.forEach((group) => {
        if (
          group.section &&
          (group.positiveItems.length > 0 || group.negativeItems.length > 0)
        ) {
          section += `\n${group.section.title}: `;

          // Add positive findings
          if (group.positiveItems.length > 0) {
            section += `Patient reports ${group.positiveItems
              .map((item: ChecklistItem) => {
                const text = processItemText(item);
                return text;
              })
              .join(', ')}.`;
          }

          // Add negative findings
          if (group.negativeItems.length > 0) {
            if (group.positiveItems.length > 0) {
              section += ' ';
            }
            section += `Patient denies ${group.negativeItems
              .map((item: ChecklistItem) => {
                const text = processItemText(item);
                return text;
              })
              .join(', ')}.`;
          }
        }
      });

      // Check if this is the last category with items
      const isLastCategoryWithItems =
        categoriesWithItems.indexOf(categoryTerm) ===
        categoriesWithItems.length - 1;

      // Add spacing between categories - only add a single newline after each category
      // and an extra newline between different categories
      if (!isLastCategoryWithItems) {
        section += '\n\n';
      } else {
        // For the last category, just add a single newline at the end
        section += '\n';
      }
    }

    return section;
  };

  const generateObjectiveSection = () => {
    return generateObjectiveSectionWithItems(checklistItems);
  };

  const generateObjectiveSectionWithItems = (items: ChecklistItem[]) => {
    // Start with a brief introduction
    let section = 'On examination:\n\n';

    // Define objective categories in the exact order they should appear
    const objectiveCategories = [
      'physical exam',
      'examination',
      'lab studies',
      'imaging',
      'special tests',
      'ecg',
    ];

    // Get all positive findings from all sections
    const relevantItems = items.filter((item) => item.response === '+');

    // Find all categories that have items
    const categoriesWithItems = objectiveCategories.filter((categoryTerm) => {
      const matchingCategoryIds = categories
        .filter((category) =>
          category.title.toLowerCase().includes(categoryTerm.toLowerCase())
        )
        .map((category) => category.id);

      if (matchingCategoryIds.length === 0) return false;

      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      if (categorySections.length === 0) return false;

      return relevantItems.some((item) =>
        categorySections.some((section) => section.id === item.section_id)
      );
    });

    if (categoriesWithItems.length === 0) {
      return 'No significant objective findings documented.';
    }

    // Process each category in the defined order
    for (let i = 0; i < objectiveCategories.length; i++) {
      const categoryTerm = objectiveCategories[i];

      // Find categories that match this term
      const matchingCategoryIds = categories
        .filter((category) =>
          category.title.toLowerCase().includes(categoryTerm.toLowerCase())
        )
        .map((category) => category.id);

      if (matchingCategoryIds.length === 0) continue;

      // Get sections that belong to this category
      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      if (categorySections.length === 0) continue;

      // Get items for these sections
      const categoryItems = relevantItems.filter((item) =>
        categorySections.some((section) => section.id === item.section_id)
      );

      if (categoryItems.length === 0) continue;

      // Add category header (capitalize first letter)
      const displayCategoryName =
        categoryTerm.charAt(0).toUpperCase() + categoryTerm.slice(1);
      section += `${displayCategoryName}:\n`;

      // Group items by their section
      const sectionGroups = new Map();
      categoryItems.forEach((item: ChecklistItem) => {
        const sectionId = item.section_id;
        if (!sectionGroups.has(sectionId)) {
          const section = categorySections.find((s) => s.id === sectionId);
          sectionGroups.set(sectionId, {
            section,
            items: [],
          });
        }

        const group = sectionGroups.get(sectionId);
        group.items.push(item);
      });

      // Format each section's findings
      sectionGroups.forEach((group) => {
        if (group.section && group.items.length > 0) {
          section += `\n${group.section.title}: `;

          const itemsList = group.items
            .map((item: ChecklistItem) => {
              return processItemText(item);
            })
            .join(', ');

          section += itemsList + '.';
        }
      });

      // Check if this is the last category with items
      const isLastCategoryWithItems =
        categoriesWithItems.indexOf(categoryTerm) ===
        categoriesWithItems.length - 1;

      // Add spacing between categories - only add a single newline after each category
      // and an extra newline between different categories
      if (!isLastCategoryWithItems) {
        section += '\n\n';
      } else {
        // For the last category, just add a single newline at the end
        section += '\n';
      }
    }

    return section;
  };

  const generateAssessmentSection = () => {
    return generateAssessmentSectionWithItems(checklistItems);
  };

  const generateAssessmentSectionWithItems = (items: ChecklistItem[]) => {
    // Start with patient's chief complaint
    let section = `Patient presents with ${chapter?.title || 'symptoms'} of ${
      duration || 'unspecified'
    } duration.\n\n`;

    // Define assessment categories in the exact order they should appear
    const assessmentCategories = [
      'differential diagnosis',
      'assessment',
      'diagnosis',
    ];

    // Get all positive findings from all sections
    const relevantItems = items.filter((item) => item.response === '+');

    // Track which items have been included already
    const processedItemIds = new Set<number>();

    // Find all categories that have items
    const categoriesWithItems = assessmentCategories.filter((categoryTerm) => {
      const matchingCategoryIds = categories
        .filter((category) => {
          const categoryTitle = category.title.toLowerCase();

          // For "diagnosis", match only if it's exactly "diagnosis", not "differential diagnosis"
          if (categoryTerm === 'diagnosis') {
            return (
              categoryTitle === 'diagnosis' ||
              (categoryTitle.includes('diagnosis') &&
                !categoryTitle.includes('differential'))
            );
          }

          return categoryTitle.includes(categoryTerm.toLowerCase());
        })
        .map((category) => category.id);

      if (matchingCategoryIds.length === 0) return false;

      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      if (categorySections.length === 0) return false;

      return relevantItems.some((item) =>
        categorySections.some((section) => section.id === item.section_id)
      );
    });

    if (categoriesWithItems.length === 0) {
      return `${section}Differential diagnoses pending further evaluation.`;
    }

    // Process each category in the defined order
    for (let i = 0; i < assessmentCategories.length; i++) {
      const categoryTerm = assessmentCategories[i];

      // Find categories that match this term
      const matchingCategoryIds = categories
        .filter((category) => {
          const categoryTitle = category.title.toLowerCase();

          // For "diagnosis", match only if it's exactly "diagnosis", not "differential diagnosis"
          if (categoryTerm === 'diagnosis') {
            return (
              categoryTitle === 'diagnosis' ||
              (categoryTitle.includes('diagnosis') &&
                !categoryTitle.includes('differential'))
            );
          }

          return categoryTitle.includes(categoryTerm.toLowerCase());
        })
        .map((category) => category.id);

      if (matchingCategoryIds.length === 0) continue;

      // Get sections that belong to this category
      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      if (categorySections.length === 0) continue;

      // Get items for these sections that haven't been processed already
      const categoryItems = relevantItems.filter(
        (item) =>
          !processedItemIds.has(item.id) &&
          categorySections.some((section) => section.id === item.section_id)
      );

      if (categoryItems.length === 0) continue;

      // Mark these items as processed
      categoryItems.forEach((item) => processedItemIds.add(item.id));

      // Add category header (capitalize first letter)
      const displayCategoryName =
        categoryTerm.charAt(0).toUpperCase() + categoryTerm.slice(1);
      section += `${displayCategoryName}:`;

      // Group items by their section
      const sectionGroups = new Map();
      categoryItems.forEach((item: ChecklistItem) => {
        const sectionId = item.section_id;
        if (!sectionGroups.has(sectionId)) {
          const section = categorySections.find((s) => s.id === sectionId);
          sectionGroups.set(sectionId, {
            section,
            items: [],
          });
        }

        const group = sectionGroups.get(sectionId);
        group.items.push(item);
      });

      // Format each section's findings
      const sectionGroupsArray = Array.from(sectionGroups.values());
      sectionGroupsArray.forEach((group, sectionIndex) => {
        if (group.section && group.items.length > 0) {
          let sectionText = ` ${group.section.title}: `;

          const itemsList = group.items
            .map((item: ChecklistItem) => {
              return processItemText(item, false);
            })
            .join(', ');

          sectionText += itemsList + '.';
          section += sectionText;

          // Add a newline between sections within the same category
          if (sectionIndex < sectionGroupsArray.length - 1) {
            section += '\n\n';
          }
        }
      });

      // Check if this is the last category with items
      const isLastCategoryWithItems =
        categoriesWithItems.indexOf(categoryTerm) ===
        categoriesWithItems.length - 1;

      // Add spacing between categories
      if (!isLastCategoryWithItems) {
        section += '\n\n';
      } else {
        // For the last category, just add a single newline at the end
        section += '\n';
      }
    }

    return section;
  };

  const generatePlanSection = () => {
    return generatePlanSectionWithItems(checklistItems);
  };

  const generatePlanSectionWithItems = (items: ChecklistItem[]) => {
    // Start with a brief introduction
    let section = 'The management plan includes:\n\n';

    // Define plan categories in the exact order they should appear
    const planCategories = ['plan', 'disposition', 'patient education'];

    // Get all positive findings from all sections
    const relevantItems = items.filter((item) => item.response === '+');

    // Find all categories that have items
    const categoriesWithItems = planCategories.filter((categoryTerm) => {
      const matchingCategoryIds = categories
        .filter((category) =>
          category.title.toLowerCase().includes(categoryTerm.toLowerCase())
        )
        .map((category) => category.id);

      if (matchingCategoryIds.length === 0) return false;

      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      if (categorySections.length === 0) return false;

      return relevantItems.some((item) =>
        categorySections.some((section) => section.id === item.section_id)
      );
    });

    // If no plan items found, add default recommendations
    if (categoriesWithItems.length === 0) {
      section +=
        '• Appropriate diagnostic tests based on clinical presentation\n';
      section += '• Symptomatic management\n';
      section += '• Follow-up evaluation based on symptom progression';
      return section;
    }

    // Process each category in the defined order
    for (let i = 0; i < planCategories.length; i++) {
      const categoryTerm = planCategories[i];

      // Find categories that match this term
      const matchingCategoryIds = categories
        .filter((category) =>
          category.title.toLowerCase().includes(categoryTerm.toLowerCase())
        )
        .map((category) => category.id);

      if (matchingCategoryIds.length === 0) continue;

      // Get sections that belong to this category
      const categorySections = sections.filter((section) =>
        matchingCategoryIds.includes(section.category_id)
      );

      if (categorySections.length === 0) continue;

      // Get items for these sections
      const categoryItems = relevantItems.filter((item) =>
        categorySections.some((section) => section.id === item.section_id)
      );

      if (categoryItems.length === 0) continue;

      // Add category header (capitalize first letter)
      const displayCategoryName =
        categoryTerm.charAt(0).toUpperCase() + categoryTerm.slice(1);
      section += `${displayCategoryName}:\n`;

      // Group items by their section
      const sectionGroups = new Map();
      categoryItems.forEach((item: ChecklistItem) => {
        const sectionId = item.section_id;
        if (!sectionGroups.has(sectionId)) {
          const section = categorySections.find((s) => s.id === sectionId);
          sectionGroups.set(sectionId, {
            section,
            items: [],
          });
        }

        const group = sectionGroups.get(sectionId);
        group.items.push(item);
      });

      // Format each section's findings
      sectionGroups.forEach((group) => {
        if (group.section && group.items.length > 0) {
          section += `\n${group.section.title}: `;

          const itemsList = group.items
            .map((item: ChecklistItem) => {
              return processItemText(item);
            })
            .join(', ');

          section += itemsList + '.';
        }
      });

      // Check if this is the last category with items
      const isLastCategoryWithItems =
        categoriesWithItems.indexOf(categoryTerm) ===
        categoriesWithItems.length - 1;

      // Add spacing between categories
      if (!isLastCategoryWithItems) {
        section += '\n\n';
      } else {
        // For the last category, just add a single newline at the end
        section += '\n';
      }
    }

    return section;
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const completedItems = checklistItems.filter(
      (item) => item.isCompleted
    ).length;
    const totalItems = checklistItems.length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    const soapText = `SOAP NOTE - ${patientInfo.name} (${patientInfo.mrn}) - ${
      patientInfo.visitDate
    }
    
SUBJECTIVE:
${generatedNote.subjective || 'No subjective data recorded.'}

OBJECTIVE:
${generatedNote.objective || 'No objective data recorded.'}

ASSESSMENT:
${generatedNote.assessment || 'No assessment data recorded.'}

PLAN:
${generatedNote.plan || 'No plan data recorded.'}`;

    navigator.clipboard
      .writeText(soapText)
      .then(() => {
        alert('SOAP note copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  // Clear all responses (new patient)
  const clearAllResponses = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all responses? This will reset the form for a new patient.'
      )
    ) {
      setChecklistItems((items) =>
        items.map((item) => ({
          ...item,
          response: null,
          notes: '',
          isCompleted: false,
          selectedOptions: {},
          detailNotes: {},
        }))
      );

      setResponses({});

      setPatientInfo({
        name: 'New Patient',
        dob: '',
        mrn: '',
        visitDate: new Date().toISOString().split('T')[0],
      });

      setDuration('');
    }
  };

  // Check if category has any completed questions
  const hasCategoryCompletedItems = (categoryId: number) => {
    const categoryItems = getItemsByCategory(categoryId);
    return categoryItems.some((item) => item.isCompleted);
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
                Make sure you&apos;ve added sample data to your Supabase
                database
              </li>
              <li>Check that your environment variables are set correctly</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 text-gray-500"
            onClick={() => setShowMobileNav(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <ClipboardEdit className="text-blue-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {chapter?.title || 'Symptom'} Checker
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-green-600 text-sm">
            <span
              className={`transition-opacity duration-300 ${
                isAutoSaving ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <RefreshCw size={14} className="animate-spin mr-1" />
            </span>
            <span
              className={`transition-opacity duration-300 ${
                isAutoSaving ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Autosaving...
            </span>
          </div>

          <div className="hidden md:block">
            <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-md flex items-center text-sm">
              <User size={14} className="mr-2" />
              <span className="font-medium">
                {patientInfo.name || 'New Patient'}
              </span>
            </div>
          </div>

          <button
            onClick={clearAllResponses}
            className="bg-gray-100 text-gray-600 hidden md:flex items-center px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <RefreshCw size={14} className="mr-1" />
            New Patient
          </button>

          <button
            onClick={copyToClipboard}
            className="bg-green-50 text-green-700 flex items-center px-3 py-1.5 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Clipboard size={14} className="mr-1" />
            <span className="hidden md:inline">Copy SOAP Note</span>
            <span className="inline md:hidden">Copy</span>
          </button>

          <button
            className="md:hidden text-blue-600"
            onClick={() => setShowMobilePreview(true)}
          >
            <FileText size={22} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories Navigation */}
        <aside
          className={`bg-white shadow-sm hidden md:flex flex-col ${
            isSidebarCollapsed ? 'w-16' : 'w-56'
          } transition-all duration-300 overflow-hidden`}
        >
          {/* Collapse toggle */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 self-end"
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>

          {/* Progress indicator */}
          <div className={`mx-3 mb-4 ${isSidebarCollapsed ? 'mx-2' : 'mx-3'}`}>
            <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
            {!isSidebarCollapsed && (
              <div className="text-xs text-center mt-1 text-gray-500">
                {calculateCompletion()}% complete
              </div>
            )}
          </div>

          {/* Categories navigation */}
          <nav className="flex-1 overflow-y-auto py-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              const hasCompleted = hasCategoryCompletedItems(category.id);

              return (
                <button
                  key={category.id}
                  className={`w-full text-left px-3 py-2 flex items-center ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'border-l-4 border-transparent hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span
                    className={isActive ? 'text-blue-600' : 'text-gray-400'}
                  >
                    <ClipboardEdit size={18} />
                  </span>

                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3 flex-1 truncate">
                        {category.title}
                      </span>

                      {/* Status indicators */}
                      {hasCompleted && !isActive && (
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Sidebar */}
        {showMobileNav && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-lg">Sections</h2>
                <button onClick={() => setShowMobileNav(false)}>
                  <X size={20} />
                </button>
              </div>

              <nav className="py-2">
                {categories.map((category) => {
                  const isActive = activeCategory === category.id;
                  const hasCompleted = hasCategoryCompletedItems(category.id);

                  return (
                    <button
                      key={category.id}
                      className={`w-full text-left px-4 py-3 flex items-center ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : 'border-l-4 border-transparent'
                      }`}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setShowMobileNav(false);
                      }}
                    >
                      <span
                        className={isActive ? 'text-blue-600' : 'text-gray-400'}
                      >
                        <ClipboardEdit size={18} />
                      </span>
                      <span className="ml-3 flex-1">{category.title}</span>

                      {/* Status indicators */}
                      {hasCompleted && !isActive && (
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content - Checklist Items Display */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 md:p-6">
            {/* Duration Input - Moved to center of layout */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center">
                <Clock size={20} className="text-blue-500 mr-2" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration of Symptoms
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 2 days, 1 week, 3 months"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      triggerAutosave();
                      generateSoapNote();
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-lg font-bold text-blue-800">
                  {categories.find((c) => c.id === activeCategory)?.title ||
                    'Questions'}
                </h2>
                <div className="text-sm text-blue-600">
                  {
                    getItemsByCategory(activeCategory).filter(
                      (item) => item.isCompleted
                    ).length
                  }
                  /{getItemsByCategory(activeCategory).length} completed
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {getItemsBySectionForCategory(activeCategory).map(
                  (sectionGroup) => (
                    <div
                      key={sectionGroup.section.id}
                      className="border-b border-gray-200 mb-3"
                    >
                      {/* Section Title */}
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm rounded-t-md">
                        <h3 className="text-md font-semibold text-blue-700">
                          {sectionGroup.section.title}
                        </h3>
                      </div>

                      {/* Section Items */}
                      <div className="p-3 bg-white rounded-b-md">
                        {sectionGroup.items.map((item) => {
                          // Determine border color based on response
                          let borderColorClass = 'border-gray-100';
                          if (item.response === '+') {
                            borderColorClass = 'border-green-200';
                          } else if (item.response === '-') {
                            borderColorClass = 'border-red-200';
                          } else if (item.response === 'NA') {
                            borderColorClass = 'border-gray-300';
                          }

                          return (
                            <React.Fragment key={item.id}>
                              <div
                                className={`p-4 hover:bg-gray-50 transition-all duration-150 rounded-md mb-3 shadow-sm border-l-4 ${borderColorClass} border border-gray-100`}
                              >
                                <div className="flex flex-wrap items-start mb-2">
                                  <div className="flex-1 mr-2">
                                    <div className="text-gray-900 font-medium mb-1">
                                      {item.item_text}
                                    </div>
                                  </div>

                                  <div className="flex space-x-1">
                                    <button
                                      className={`p-1 rounded-full ${
                                        item.response === '+'
                                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                                      }`}
                                      onClick={() =>
                                        handleResponseChange(
                                          item.id,
                                          item.response === '+' ? null : '+'
                                        )
                                      }
                                      title="Present / Yes"
                                    >
                                      <PlusCircle size={18} />
                                    </button>
                                    <button
                                      className={`p-1 rounded-full ${
                                        item.response === '-'
                                          ? 'bg-red-100 text-red-700 border-2 border-red-500'
                                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                      }`}
                                      onClick={() =>
                                        handleResponseChange(
                                          item.id,
                                          item.response === '-' ? null : '-'
                                        )
                                      }
                                      title="Absent / No"
                                    >
                                      <MinusCircle size={18} />
                                    </button>
                                    <button
                                      className={`p-1 rounded-full ${
                                        item.response === 'NA'
                                          ? 'bg-gray-200 text-gray-700 border-2 border-gray-400'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                      onClick={() =>
                                        handleResponseChange(
                                          item.id,
                                          item.response === 'NA' ? null : 'NA'
                                        )
                                      }
                                      title="Not Applicable"
                                    >
                                      <HelpCircle size={18} />
                                    </button>
                                  </div>
                                </div>

                                {/* Notes input field - shown for '+' and '-' responses */}
                                {(item.response === '+' ||
                                  item.response === '-') && (
                                  <div className="mt-2">
                                    <textarea
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      rows={2}
                                      placeholder={
                                        item.response === '+'
                                          ? 'Add details about this finding...'
                                          : 'Add notes about this negative finding...'
                                      }
                                      value={item.notes || ''}
                                      onChange={(e) =>
                                        handleNotesChange(
                                          item.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Render child items if parent is selected as positive */}
                              {item.response === '+' &&
                                item.childItems &&
                                item.childItems.length > 0 && (
                                  <div className="ml-6 mb-4 border-l-2 border-green-200 pl-4">
                                    {item.childItems.map((childItem) => {
                                      // Determine border color for child item
                                      let childBorderColorClass =
                                        'border-gray-100';
                                      if (childItem.response === '+') {
                                        childBorderColorClass =
                                          'border-green-200';
                                      } else if (childItem.response === '-') {
                                        childBorderColorClass =
                                          'border-red-200';
                                      } else if (childItem.response === 'NA') {
                                        childBorderColorClass =
                                          'border-gray-300';
                                      }

                                      return (
                                        <div
                                          key={childItem.id}
                                          className={`p-3 hover:bg-gray-50 transition-all duration-150 rounded-md mb-2 shadow-sm border-l-4 ${childBorderColorClass} border border-gray-100`}
                                        >
                                          <div className="flex flex-wrap items-start mb-2">
                                            <div className="flex-1 mr-2">
                                              <div className="text-gray-800 mb-1">
                                                {childItem.item_text}
                                              </div>
                                            </div>

                                            <div className="flex space-x-1">
                                              <button
                                                className={`p-1 rounded-full ${
                                                  childItem.response === '+'
                                                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                                                }`}
                                                onClick={() =>
                                                  handleResponseChange(
                                                    childItem.id,
                                                    childItem.response === '+'
                                                      ? null
                                                      : '+'
                                                  )
                                                }
                                                title="Present / Yes"
                                              >
                                                <PlusCircle size={16} />
                                              </button>
                                              <button
                                                className={`p-1 rounded-full ${
                                                  childItem.response === '-'
                                                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                                }`}
                                                onClick={() =>
                                                  handleResponseChange(
                                                    childItem.id,
                                                    childItem.response === '-'
                                                      ? null
                                                      : '-'
                                                  )
                                                }
                                                title="Absent / No"
                                              >
                                                <MinusCircle size={16} />
                                              </button>
                                              <button
                                                className={`p-1 rounded-full ${
                                                  childItem.response === 'NA'
                                                    ? 'bg-gray-200 text-gray-700 border-2 border-gray-400'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                                onClick={() =>
                                                  handleResponseChange(
                                                    childItem.id,
                                                    childItem.response === 'NA'
                                                      ? null
                                                      : 'NA'
                                                  )
                                                }
                                                title="Not Applicable"
                                              >
                                                <HelpCircle size={16} />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Notes input field for child item */}
                                          {(childItem.response === '+' ||
                                            childItem.response === '-') && (
                                            <div className="mt-2">
                                              <textarea
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                rows={2}
                                                placeholder={
                                                  childItem.response === '+'
                                                    ? 'Add details about this finding...'
                                                    : 'Add notes about this negative finding...'
                                                }
                                                value={childItem.notes || ''}
                                                onChange={(e) =>
                                                  handleNotesChange(
                                                    childItem.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - SOAP Note Preview */}
        <aside className="bg-white shadow-sm hidden md:flex flex-col w-96 border-l border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FileText className="text-blue-600 mr-2" size={18} />
              SOAP Note Preview
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Subjective Section */}
            <div className="mb-6">
              <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                SUBJECTIVE
              </h3>
              <div className="whitespace-pre-wrap text-sm">
                {generatedNote.subjective || 'No subjective data recorded yet.'}
              </div>
            </div>

            {/* Objective Section */}
            <div className="mb-6">
              <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                OBJECTIVE
              </h3>
              <div className="whitespace-pre-wrap text-sm">
                {generatedNote.objective || 'No objective data recorded yet.'}
              </div>
            </div>

            {/* Assessment Section */}
            <div className="mb-6">
              <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                ASSESSMENT
              </h3>
              <div className="whitespace-pre-wrap text-sm">
                {generatedNote.assessment || 'No assessment data recorded yet.'}
              </div>
            </div>

            {/* Plan Section */}
            <div className="mb-6">
              <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                PLAN
              </h3>
              <div className="whitespace-pre-wrap text-sm">
                {generatedNote.plan || 'No plan data recorded yet.'}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile SOAP Note Preview */}
        {showMobilePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute top-0 right-0 h-full w-full bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="font-bold text-lg flex items-center">
                  <FileText className="text-blue-600 mr-2" size={18} />
                  SOAP Note Preview
                </h2>
                <button onClick={() => setShowMobilePreview(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                {/* Subjective Section */}
                <div className="mb-6">
                  <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                    SUBJECTIVE
                  </h3>
                  <div className="whitespace-pre-wrap text-sm">
                    {generatedNote.subjective ||
                      'No subjective data recorded yet.'}
                  </div>
                </div>

                {/* Objective Section */}
                <div className="mb-6">
                  <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                    OBJECTIVE
                  </h3>
                  <div className="whitespace-pre-wrap text-sm">
                    {generatedNote.objective ||
                      'No objective data recorded yet.'}
                  </div>
                </div>

                {/* Assessment Section */}
                <div className="mb-6">
                  <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                    ASSESSMENT
                  </h3>
                  <div className="whitespace-pre-wrap text-sm">
                    {generatedNote.assessment ||
                      'No assessment data recorded yet.'}
                  </div>
                </div>

                {/* Plan Section */}
                <div className="mb-6">
                  <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
                    PLAN
                  </h3>
                  <div className="whitespace-pre-wrap text-sm">
                    {generatedNote.plan || 'No plan data recorded yet.'}
                  </div>
                </div>
              </div>

              {/* Bottom action bar */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 flex justify-between">
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                >
                  Back to Checklist
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                >
                  <Clipboard size={16} className="mr-1" />
                  Copy SOAP Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSymptomChecker;
