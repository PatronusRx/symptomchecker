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
        const sectionItems = checklistItems
          .filter((item) => item.section_id === section.id)
          .sort((a, b) => a.display_order - b.display_order);

        return {
          section,
          items: sectionItems,
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
        // Find the position of underscores
        const underscoreIndex = text.indexOf('___');

        // Find the position of the last space before the end
        const lastSpaceIndex = text.lastIndexOf(' ');

        if (underscoreIndex >= 0 && lastSpaceIndex > underscoreIndex) {
          // There's a word after the underscores
          // Replace just the underscores, preserving the last word
          const beforeUnderscore = text.substring(0, underscoreIndex);
          const afterUnderscore = text.substring(text.indexOf('___') + 3);
          text = beforeUnderscore + item.notes + afterUnderscore;
        } else {
          // The underscores are at the end or there's no word after them
          text = text.replace(/_{2,}/g, item.notes);
        }
      } else {
        // If no notes, completely remove the underscores and any surrounding spaces
        text = text.replace(/\s*_{2,}\s*/g, ' ').trim();
      }
    } else if (item.notes && item.notes.trim() !== '') {
      // If no underscores but notes exist, append them in parentheses
      text += ` (${item.notes})`;
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
    } duration. `;

    // Define subjective categories
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

    // Find categories that should be in the subjective section
    const subjectiveCategoryIds = categories
      .filter((category) =>
        subjectiveCategories.some((term) =>
          category.title.toLowerCase().includes(term.toLowerCase())
        )
      )
      .map((category) => category.id);

    // Get sections that belong to subjective categories
    const subjectiveSections = sections.filter((section) =>
      subjectiveCategoryIds.includes(section.category_id)
    );

    // Get all positive and negative findings from subjective sections
    const historyItems = items.filter(
      (item) =>
        (item.response === '+' || item.response === '-') &&
        subjectiveSections.some((section) => section.id === item.section_id)
    );

    // Group items by their section
    const sectionGroups = new Map();
    historyItems.forEach((item: ChecklistItem) => {
      const sectionId = item.section_id;
      if (!sectionGroups.has(sectionId)) {
        const section = sections.find((s) => s.id === sectionId);
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

    // Format each section's findings as sentences
    sectionGroups.forEach((group) => {
      if (
        group.section &&
        (group.positiveItems.length > 0 || group.negativeItems.length > 0)
      ) {
        section += `\n\nRegarding ${group.section.title}: `;

        // Add positive findings as a sentence
        if (group.positiveItems.length > 0) {
          section += `Patient reports ${group.positiveItems
            .map((item: ChecklistItem) => {
              // Process item text to replace underscores with notes if applicable
              const text = processItemText(item);
              return text;
            })
            .join(', ')}.`;
        }

        // Add negative findings as a sentence
        if (group.negativeItems.length > 0) {
          if (group.positiveItems.length > 0) {
            section += ' ';
          }
          section += `Patient denies ${group.negativeItems
            .map((item: ChecklistItem) => {
              // Process item text to replace underscores with notes if applicable
              const text = processItemText(item);
              return text;
            })
            .join(', ')}.`;
        }
      }
    });

    return section;
  };

  const generateObjectiveSection = () => {
    return generateObjectiveSectionWithItems(checklistItems);
  };

  const generateObjectiveSectionWithItems = (items: ChecklistItem[]) => {
    // Start with a brief introduction
    let section = 'On examination:\n\n';

    // Define objective categories
    const objectiveCategories = [
      'physical exam',
      'examination',
      'lab studies',
      'imaging',
      'special tests',
      'ecg',
    ];

    // Find categories that should be in the objective section
    const objectiveCategoryIds = categories
      .filter((category) =>
        objectiveCategories.some((term) =>
          category.title.toLowerCase().includes(term.toLowerCase())
        )
      )
      .map((category) => category.id);

    if (objectiveCategoryIds.length === 0) {
      return 'No objective findings documented.';
    }

    // Get sections that belong to objective categories
    const objectiveSections = sections.filter((section) =>
      objectiveCategoryIds.includes(section.category_id)
    );

    if (objectiveSections.length === 0) {
      return 'No objective findings documented.';
    }

    // Get all positive findings from objective sections
    const examItems = items.filter(
      (item) =>
        item.response === '+' &&
        objectiveSections.some((section) => section.id === item.section_id)
    );

    if (examItems.length === 0) {
      return 'No significant objective findings documented.';
    }

    // Group items by their section
    const sectionGroups = new Map();
    examItems.forEach((item: ChecklistItem) => {
      const sectionId = item.section_id;
      if (!sectionGroups.has(sectionId)) {
        const section = objectiveSections.find((s) => s.id === sectionId);
        sectionGroups.set(sectionId, {
          section,
          items: [],
          categoryId: section?.category_id || 0,
        });
      }

      sectionGroups.get(sectionId).items.push(item);
    });

    // Sort sections by their category's display order
    const sortedSections = Array.from(sectionGroups.values()).sort((a, b) => {
      const categoryA = categories.find((c) => c.id === a.categoryId);
      const categoryB = categories.find((c) => c.id === b.categoryId);
      return (categoryA?.display_order || 0) - (categoryB?.display_order || 0);
    });

    // Format each section's findings as paragraphs
    sortedSections.forEach((group, index) => {
      if (group.section && group.items.length > 0) {
        let sectionText = `${group.section.title}: `;

        sectionText += group.items
          .map((item: ChecklistItem) => {
            // Process item text to replace underscores with notes if applicable
            return processItemText(item);
          })
          .join(', ');

        section += sectionText + '.';

        // Add a newline between paragraphs
        if (index < sortedSections.length - 1) {
          section += '\n\n';
        }
      }
    });

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

    // Define assessment categories
    const assessmentCategories = [
      'assessment',
      'differential diagnosis',
      'diagnosis',
    ];

    // Find categories that should be in the assessment section
    const assessmentCategoryIds = categories
      .filter((category) =>
        assessmentCategories.some((term) =>
          category.title.toLowerCase().includes(term.toLowerCase())
        )
      )
      .map((category) => category.id);

    // Get sections that belong to assessment categories
    const assessmentSections = sections.filter((section) =>
      assessmentCategoryIds.includes(section.category_id)
    );

    // Get all positive findings from assessment sections
    const assessmentItems = items.filter(
      (item) =>
        item.response === '+' &&
        assessmentSections.some((section) => section.id === item.section_id)
    );

    if (assessmentItems.length === 0) {
      return `${section}Differential diagnoses pending further evaluation.`;
    }

    // Define types for our data structures
    type SectionGroup = {
      section: Section;
      items: ChecklistItem[];
    };

    type CategoryGroup = {
      category: Category;
      sections: Map<number, SectionGroup>;
      displayOrder: number;
    };

    // Group items by their section and category
    const categoryGroups = new Map<string, CategoryGroup>();

    assessmentItems.forEach((item: ChecklistItem) => {
      const sectionId = item.section_id;
      const section = assessmentSections.find((s) => s.id === sectionId);

      if (!section) return;

      const category = categories.find((c) => c.id === section.category_id);
      if (!category) return;

      const categoryKey = category.title.toLowerCase();

      if (!categoryGroups.has(categoryKey)) {
        categoryGroups.set(categoryKey, {
          category,
          sections: new Map<number, SectionGroup>(),
          displayOrder: category.display_order,
        });
      }

      const categoryGroup = categoryGroups.get(categoryKey)!;

      if (!categoryGroup.sections.has(sectionId)) {
        categoryGroup.sections.set(sectionId, {
          section,
          items: [],
        });
      }

      categoryGroup.sections.get(sectionId)!.items.push(item);
    });

    // Sort categories by display order
    const sortedCategories = Array.from(categoryGroups.values()).sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    // Process differential diagnosis first if it exists
    const diffDiagnosisCategory = sortedCategories.find((category) =>
      category.category.title.toLowerCase().includes('differential diagnosis')
    );

    if (diffDiagnosisCategory) {
      section += 'Differential Diagnosis:';

      // Process each section in the differential diagnosis category
      Array.from(diffDiagnosisCategory.sections.values()).forEach(
        (sectionGroup: SectionGroup) => {
          if (sectionGroup.items.length > 0) {
            const diagnosisList: string[] = [];
            sectionGroup.items.forEach((item: ChecklistItem) => {
              const diagnosis = processItemText(item, false);
              diagnosisList.push(diagnosis);
            });

            section += ' ' + diagnosisList.join(', ') + '.';
          }
        }
      );

      section += '\n\n';
    }

    // Process assessment sections
    const assessmentCategory = sortedCategories.find(
      (category) =>
        category.category.title.toLowerCase().includes('assessment') &&
        !category.category.title.toLowerCase().includes('differential')
    );

    if (assessmentCategory) {
      section += 'Assessment:';

      // Process each section in the assessment category
      Array.from(assessmentCategory.sections.values()).forEach(
        (sectionGroup: SectionGroup, index, array) => {
          if (sectionGroup.items.length > 0) {
            let sectionText = ` ${sectionGroup.section.title}: `;

            const assessmentList: string[] = [];
            sectionGroup.items.forEach((item: ChecklistItem) => {
              const assessment = processItemText(item, false);
              assessmentList.push(assessment);
            });

            sectionText += assessmentList.join(', ') + '.';
            section += sectionText;

            // Add a newline between sections
            if (index < array.length - 1) {
              section += '\n\n';
            }
          }
        }
      );

      section += '\n\n';
    }

    // Process any other categories (like diagnosis) that aren't differential diagnosis or assessment
    sortedCategories.forEach((categoryGroup) => {
      const categoryTitle = categoryGroup.category.title.toLowerCase();
      if (
        !categoryTitle.includes('differential diagnosis') &&
        !categoryTitle.includes('assessment')
      ) {
        section += `${categoryGroup.category.title}:`;

        // Process each section in this category
        Array.from(categoryGroup.sections.values()).forEach(
          (sectionGroup: SectionGroup, index, array) => {
            if (sectionGroup.items.length > 0) {
              let sectionText = ` ${sectionGroup.section.title}: `;

              const itemsList: string[] = [];
              sectionGroup.items.forEach((item: ChecklistItem) => {
                const itemText = processItemText(item, false);
                itemsList.push(itemText);
              });

              sectionText += itemsList.join(', ') + '.';
              section += sectionText;

              // Add a newline between sections
              if (index < array.length - 1) {
                section += '\n\n';
              }
            }
          }
        );

        // Only add newlines after the category if it's not the last one
        if (
          sortedCategories.indexOf(categoryGroup) <
          sortedCategories.length - 1
        ) {
          section += '\n\n';
        }
      }
    });

    return section;
  };

  const generatePlanSection = () => {
    return generatePlanSectionWithItems(checklistItems);
  };

  const generatePlanSectionWithItems = (items: ChecklistItem[]) => {
    // Start with a brief introduction
    let section = 'The management plan includes:\n\n';

    // Define plan categories
    const planCategories = ['plan', 'disposition', 'patient education'];

    // Find categories that should be in the plan section
    const planCategoryIds = categories
      .filter((category) =>
        planCategories.some((term) =>
          category.title.toLowerCase().includes(term.toLowerCase())
        )
      )
      .map((category) => category.id);

    // Get sections that belong to plan categories
    const planSections = sections.filter((section) =>
      planCategoryIds.includes(section.category_id)
    );

    // Get all positive findings from plan sections
    const planItems = items.filter(
      (item) =>
        item.response === '+' &&
        planSections.some((section) => section.id === item.section_id)
    );

    // If no plan items found, add default recommendations
    if (planItems.length === 0) {
      section +=
        '• Appropriate diagnostic tests based on clinical presentation\n';
      section += '• Symptomatic management\n';
      section += '• Follow-up evaluation based on symptom progression';
      return section;
    }

    // Group items by their section
    const sectionGroups = new Map();
    planItems.forEach((item: ChecklistItem) => {
      const sectionId = item.section_id;
      if (!sectionGroups.has(sectionId)) {
        const section = planSections.find((s) => s.id === sectionId);
        sectionGroups.set(sectionId, {
          section,
          items: [],
          categoryId: section?.category_id || 0,
        });
      }

      sectionGroups.get(sectionId).items.push(item);
    });

    // Sort sections by their category's display order
    const sortedSections = Array.from(sectionGroups.values()).sort((a, b) => {
      const categoryA = categories.find((c) => c.id === a.categoryId);
      const categoryB = categories.find((c) => c.id === b.categoryId);
      return (categoryA?.display_order || 0) - (categoryB?.display_order || 0);
    });

    // Format each section's findings as paragraphs
    sortedSections.forEach((group, index) => {
      if (group.section && group.items.length > 0) {
        let sectionText = `${group.section.title}: `;

        const planItems: string[] = [];
        group.items.forEach((item: ChecklistItem) => {
          // Process item text to replace underscores with notes if applicable
          const planItem = processItemText(item);
          planItems.push(planItem);
        });

        sectionText += planItems.join(', ') + '.';
        section += sectionText;

        // Add a newline between paragraphs
        if (index < sortedSections.length - 1) {
          section += '\n\n';
        }
      }
    });

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
                Make sure you've added sample data to your Supabase database
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
                            <div
                              key={item.id}
                              className={`p-4 hover:bg-gray-50 transition-all duration-150 rounded-md mb-3 shadow-sm border-l-4 ${borderColorClass} border border-gray-100`}
                            >
                              <div className="flex flex-wrap items-start mb-2">
                                <div className="flex-1 mr-2">
                                  <div className="text-gray-900 font-medium mb-1">
                                    {processItemText(item)}
                                  </div>
                                </div>

                                <div className="flex space-x-1">
                                  <button
                                    className={`p-1.5 rounded-md ${
                                      item.response === '+'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}
                                    onClick={() =>
                                      handleResponseChange(item.id, '+')
                                    }
                                    title="Positive"
                                  >
                                    <PlusCircle size={16} />
                                  </button>

                                  <button
                                    className={`p-1.5 rounded-md ${
                                      item.response === '-'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                    }`}
                                    onClick={() =>
                                      handleResponseChange(item.id, '-')
                                    }
                                    title="Negative"
                                  >
                                    <MinusCircle size={16} />
                                  </button>

                                  <button
                                    className={`p-1.5 rounded-md ${
                                      item.response === 'NA'
                                        ? 'bg-gray-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    onClick={() =>
                                      handleResponseChange(item.id, 'NA')
                                    }
                                    title="Not Applicable"
                                  >
                                    <HelpCircle size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* Always show a text input field for each symptom */}
                              <div className="flex items-start space-x-2">
                                <textarea
                                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm resize-none"
                                  placeholder="Add optional notes for this symptom..."
                                  rows={2}
                                  value={item.notes || ''}
                                  onChange={(e) =>
                                    handleNotesChange(item.id, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}

                {getItemsBySectionForCategory(activeCategory).length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No items in this category
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - SOAP Note Preview */}
        <aside className="hidden md:block bg-white shadow-sm w-80 overflow-y-auto border-l">
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="font-bold text-gray-800">Live SOAP Preview</h2>
            <button
              onClick={copyToClipboard}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Copy to clipboard"
            >
              <Clipboard size={16} />
            </button>
          </div>

          <div className="p-4">
            {/* Patient info */}
            <div className="mb-4 text-sm">
              <div className="font-bold">
                {patientInfo.name || 'New Patient'}
              </div>
              <div className="text-gray-500">
                {patientInfo.dob ? `DOB: ${patientInfo.dob}` : ''}
                {patientInfo.mrn ? ` • MRN: ${patientInfo.mrn}` : ''}
              </div>
              <div className="text-gray-500">
                Visit Date: {patientInfo.visitDate}
              </div>
            </div>

            {/* SOAP sections */}
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs mr-1.5">
                    S
                  </div>
                  <h3 className="font-bold text-blue-800">SUBJECTIVE</h3>
                </div>
                <div className="pl-6 whitespace-pre-line text-gray-800">
                  {generatedNote.subjective ||
                    'No subjective data recorded yet.'}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xs mr-1.5">
                    O
                  </div>
                  <h3 className="font-bold text-green-800">OBJECTIVE</h3>
                </div>
                <div className="pl-6 whitespace-pre-line text-gray-800">
                  {generatedNote.objective || 'No objective data recorded yet.'}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-xs mr-1.5">
                    A
                  </div>
                  <h3 className="font-bold text-purple-800">ASSESSMENT</h3>
                </div>
                <div className="pl-6 whitespace-pre-line text-gray-800">
                  {generatedNote.assessment ||
                    'No assessment data recorded yet.'}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xs mr-1.5">
                    P
                  </div>
                  <h3 className="font-bold text-orange-800">PLAN</h3>
                </div>
                <div className="pl-6 whitespace-pre-line text-gray-800">
                  {generatedNote.plan || 'No plan data recorded yet.'}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile SOAP Preview Modal */}
        {showMobilePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-lg">SOAP Note Preview</h2>
                <button onClick={() => setShowMobilePreview(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                {/* Mobile Duration of Symptoms input */}
                <div className="mb-4 border-b pb-4">
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

                {/* Patient info */}
                <div className="mb-4 text-sm">
                  <div className="font-bold">
                    {patientInfo.name || 'New Patient'}
                  </div>
                  <div className="text-gray-500">
                    {patientInfo.dob ? `DOB: ${patientInfo.dob}` : ''}
                    {patientInfo.mrn ? ` • MRN: ${patientInfo.mrn}` : ''}
                  </div>
                  <div className="text-gray-500">
                    Visit Date: {patientInfo.visitDate}
                  </div>
                </div>

                {/* SOAP sections */}
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs mr-1.5">
                        S
                      </div>
                      <h3 className="font-bold text-blue-800">SUBJECTIVE</h3>
                    </div>
                    <div className="pl-6 whitespace-pre-line">
                      {generatedNote.subjective ||
                        'No subjective data recorded yet.'}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xs mr-1.5">
                        O
                      </div>
                      <h3 className="font-bold text-green-800">OBJECTIVE</h3>
                    </div>
                    <div className="pl-6 whitespace-pre-line">
                      {generatedNote.objective ||
                        'No objective data recorded yet.'}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-xs mr-1.5">
                        A
                      </div>
                      <h3 className="font-bold text-purple-800">ASSESSMENT</h3>
                    </div>
                    <div className="pl-6 whitespace-pre-line">
                      {generatedNote.assessment ||
                        'No assessment data recorded yet.'}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xs mr-1.5">
                        P
                      </div>
                      <h3 className="font-bold text-orange-800">PLAN</h3>
                    </div>
                    <div className="pl-6 whitespace-pre-line">
                      {generatedNote.plan || 'No plan data recorded yet.'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => {
                      copyToClipboard();
                      setShowMobilePreview(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center"
                  >
                    <Clipboard size={16} className="mr-2" />
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSymptomChecker;
