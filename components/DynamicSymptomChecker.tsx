import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ClipboardEdit,
  FileText,
  Menu,
  X,
  Clipboard,
  RefreshCw,
  User,
  ChevronRight,
  ChevronLeft,
  Clock,
} from 'lucide-react';
import {
  Chapter,
  Category,
  Section,
  ChecklistItem,
  ResponseState,
} from '../types/symptomChecker';
import ChecklistItemComponent from './checklist/ChecklistItem';
import SoapNoteDisplay from './soap/SoapNoteDisplay';
import { processItemText } from './soap/SoapNoteGenerationUtils';
import { SoapNoteGenerator } from './soap/SoapNoteGenerator';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

        // Add debug log here after fetching chapters
        console.log('Chapter data:', chaptersData);

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

        // Add debug log here after fetching categories
        console.log('Categories data:', categoriesData);

        setCategories(categoriesData || []);

        // Fetch sections for this chapter
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .eq('chapter_id', chapterData.id)
          .order('display_order');

        if (sectionsError) {
          throw sectionsError;
        }

        // Add debug log here after fetching sections
        console.log('Sections data:', sectionsData);

        setSections(sectionsData || []);

        if (sectionsData && sectionsData.length > 0) {
          // Fetch all checklist items for this chapter
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

          // Add debug log here after fetching checklist items
          console.log('Items data:', itemsData);

          // Count items with parent relationships for debugging
          const itemsWithParents = (itemsData || []).filter(
            (item) => item.parent_item_id !== null
          );
          console.log(
            `Found ${
              itemsWithParents.length
            } items with parent relationships out of ${
              itemsData?.length || 0
            } total items`
          );

          // Initialize with isCompleted property
          const initializedItems = (itemsData || []).map((item) => ({
            ...item,
            isCompleted: false,
            response: null,
            notes: '',
            isExpanded: false, // Default to expanded for better visibility
          }));

          setChecklistItems(initializedItems);

          // Set the first category as active if none is selected
          if (categoriesData && categoriesData.length > 0 && !activeCategory) {
            setActiveCategory(categoriesData[0].id);
          }
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
  }, [chapterSlug, activeCategory]);

  // Add useEffect to initialize expansion state when items are first loaded
  useEffect(() => {
    if (!loading && checklistItems.length > 0) {
      // Set initial expansion state for all items
      setChecklistItems((items) =>
        items.map((item) => ({
          ...item,
          isExpanded: true, // Start expanded for better visibility
        }))
      );

      // Debug logging to check parent-child relationships
      const itemsWithParent = checklistItems.filter(
        (item) => item.parent_item_id !== null
      );
      console.log(
        `Items with parent: ${itemsWithParent.length} out of ${checklistItems.length}`
      );
    }
  }, [loading, checklistItems.length]);

  // Build nested hierarchy of checklist items
  const buildNestedItemsHierarchy = useCallback((items: ChecklistItem[]) => {
    // Map for quick item lookup by ID
    const itemMap = new Map<string, ChecklistItem>();

    // First pass: create all items with empty children arrays
    items.forEach((item) => {
      // Create a clean copy with childItems array and preserve expansion state
      itemMap.set(item.id, {
        ...item,
        childItems: [],
        // Keep existing expansion state or default to expanded
        isExpanded: item.isExpanded !== undefined ? item.isExpanded : true,
      });
    });

    // For debugging: check all parent IDs exist
    const missingParents = items
      .filter((item) => item.parent_item_id !== null)
      .filter((item) => !itemMap.has(item.parent_item_id!));

    if (missingParents.length > 0) {
      console.warn(
        `Warning: Found ${missingParents.length} items with missing parent references`
      );
    }

    // Second pass: build the tree
    const rootItems: ChecklistItem[] = [];

    // Create a Map to store items by indent level for easier hierarchy building
    const itemsByIndentLevel: Map<number, ChecklistItem[]> = new Map();

    // Group items by indent level
    items.forEach((item) => {
      const level = item.indent_level || 0;
      if (!itemsByIndentLevel.has(level)) {
        itemsByIndentLevel.set(level, []);
      }
      itemsByIndentLevel.get(level)?.push(item);
    });

    // Sort each level by display_order
    itemsByIndentLevel.forEach((levelItems) => {
      levelItems.sort((a, b) => a.display_order - b.display_order);
    });

    // Process items from lowest indent level to highest
    const indentLevels = Array.from(itemsByIndentLevel.keys()).sort(
      (a, b) => a - b
    );

    // Add all root items (indent level 0) to the root array
    const rootLevelItems = itemsByIndentLevel.get(0) || [];
    rootLevelItems.forEach((item) => {
      const mappedItem = itemMap.get(item.id);
      if (mappedItem) {
        rootItems.push(mappedItem);
      }
    });

    // Start with level 1 since we already added level 0 items to rootItems
    for (let levelIndex = 1; levelIndex < indentLevels.length; levelIndex++) {
      const currentLevel = indentLevels[levelIndex];
      const currentLevelItems = itemsByIndentLevel.get(currentLevel) || [];
      const previousLevel = indentLevels[levelIndex - 1];

      currentLevelItems.forEach((item) => {
        // Find the closest parent in the previous level
        // A parent is the item that comes before this one in display order and has a lower indent level
        const potentialParents = (itemsByIndentLevel.get(previousLevel) || [])
          .filter(
            (potentialParent) =>
              potentialParent.display_order < item.display_order
          )
          .sort((a, b) => b.display_order - a.display_order); // Sort in reverse to get the closest one first

        if (potentialParents.length > 0) {
          const closestParent = potentialParents[0];
          const mappedItem = itemMap.get(item.id);
          const mappedParent = itemMap.get(closestParent.id);

          if (mappedItem && mappedParent) {
            if (!mappedParent.childItems) {
              mappedParent.childItems = [];
            }
            mappedParent.childItems.push(mappedItem);
          }
        } else if (item.parent_item_id && itemMap.has(item.parent_item_id)) {
          // Try to use explicit parent ID if available
          const mappedItem = itemMap.get(item.id);
          const mappedParent = itemMap.get(item.parent_item_id);

          if (mappedItem && mappedParent) {
            if (!mappedParent.childItems) {
              mappedParent.childItems = [];
            }
            mappedParent.childItems.push(mappedItem);
          }
        } else {
          // Fallback: attach to root if no parent found
          const mappedItem = itemMap.get(item.id);
          if (mappedItem) {
            console.warn(
              `Item ${item.id} (${item.item_text}) has no parent - attaching to root`
            );
            rootItems.push(mappedItem);
          }
        }
      });
    }

    // Final sort of all children arrays by display_order
    const sortChildren = (items: ChecklistItem[]) => {
      items.sort((a, b) => a.display_order - b.display_order);
      items.forEach((item) => {
        if (item.childItems && item.childItems.length > 0) {
          sortChildren(item.childItems);
        }
      });
    };

    sortChildren(rootItems);

    // Log the resulting hierarchy for debugging
    console.log(`Built hierarchy with ${rootItems.length} root items`);

    return rootItems;
  }, []);

  // Get items for the active category
  const getItemsByCategory = useCallback(
    (categoryId: string | null) => {
      if (!categoryId) return [];

      // Get sections for this category
      const categorySections = sections.filter(
        (section) => section.category_id === categoryId
      );

      // Get checklist items for these sections
      return checklistItems.filter((item) =>
        categorySections.some((section) => section.id === item.section_id)
      );
    },
    [checklistItems, sections]
  );

  // Group items by section for the active category
  const getItemsBySectionForCategory = useCallback(
    (categoryId: string | null) => {
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

          // Create an organized hierarchy of items
          const nestedItems = buildNestedItemsHierarchy(sectionItems);

          return {
            section,
            items: nestedItems,
          };
        })
        .filter((group) => group.items.length > 0); // Only include sections with items
    },
    [checklistItems, sections, buildNestedItemsHierarchy]
  );

  // Trigger autosave animation
  const triggerAutosave = useCallback(() => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setIsAutoSaving(false);
    }, 1500);
  }, []);

  // Handle response change (+/-/NA)
  const handleResponseChange = useCallback(
    (itemId: string, value: '+' | '-' | 'NA' | null) => {
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
        const updatedNote = generateSoapNote();
        setGeneratedNote(updatedNote);
      }

      // Trigger autosave
      triggerAutosave();
    },
    [checklistItems, setResponses, triggerAutosave]
  );

  // Handle notes change
  const handleNotesChange = useCallback(
    (itemId: string, notes: string) => {
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
        const updatedNote = generateSoapNote();
        setGeneratedNote(updatedNote);
      }

      // Trigger autosave
      triggerAutosave();
    },
    [checklistItems, setResponses, triggerAutosave]
  );

  // Toggle item expansion state
  const toggleItemExpansion = useCallback(
    (itemId: string) => {
      // First create a deep copy of all items to avoid mutation issues
      const allItems = [...checklistItems];

      // Find and update the specific item
      const updateItem = (items: ChecklistItem[]) => {
        return items.map((item) => {
          if (item.id === itemId) {
            // Found the item, toggle its expansion state
            return { ...item, isExpanded: !item.isExpanded };
          }
          return item;
        });
      };

      // Update the actual checklist items in state
      setChecklistItems(updateItem(allItems));

      // Log for debugging
      console.log(`Toggled expansion for item ${itemId}`);
    },
    [checklistItems]
  );

  // Handle detail option selection
  const handleDetailOptionChange = useCallback(
    (
      itemId: string,
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
        const updatedNote = generateSoapNote();
        setGeneratedNote(updatedNote);
      }, 0);
    },
    [checklistItems]
  );

  // Handle detail notes change
  const handleDetailNoteChange = useCallback(
    (itemId: string, detailKey: string, option: string, note: string) => {
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
        const updatedNote = generateSoapNote();
        setGeneratedNote(updatedNote);
      }, 0);
    },
    [checklistItems]
  );

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    const completedItems = checklistItems.filter(
      (item) => item.isCompleted
    ).length;
    const totalItems = checklistItems.length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [checklistItems]);

  // Handle copy to clipboard
  const copyToClipboard = useCallback(() => {
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
  }, [patientInfo, generatedNote]);

  // Clear all responses (new patient)
  const clearAllResponses = useCallback(() => {
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
          isExpanded: true,
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
  }, []);

  // Check if category has any completed questions
  const hasCategoryCompletedItems = useCallback(
    (categoryId: string) => {
      const categoryItems = getItemsByCategory(categoryId);
      return categoryItems.some((item) => item.isCompleted);
    },
    [getItemsByCategory]
  );

  // Render function for checklist items (updated to use component)
  const renderChecklistItem = useCallback(
    (item: ChecklistItem, depth = 0) => {
      return (
        <ChecklistItemComponent
          key={item.id}
          item={item}
          handleResponseChange={handleResponseChange}
          handleNotesChange={handleNotesChange}
          toggleItemExpansion={toggleItemExpansion}
          renderChecklistItem={renderChecklistItem}
          depth={depth}
        />
      );
    },
    [handleResponseChange, handleNotesChange, toggleItemExpansion]
  );

  // Replace the inline SOAP note generation methods with the imported ones
  const generateSoapNote = () => {
    const noteData = SoapNoteGenerator.generateNote(
      checklistItems,
      categories,
      sections,
      chapter,
      duration
    );
    setGeneratedNote(noteData);
    return noteData;
  };

  // Generate SOAP note with specific items (for immediate updates)
  const generateSoapNoteWithItems = (items: ChecklistItem[]) => {
    return SoapNoteGenerator.generateNote(
      items,
      categories,
      sections,
      chapter,
      duration
    );
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
                        {/* Render top-level items with recursive function */}
                        {sectionGroup.items.map((item) =>
                          renderChecklistItem(item)
                        )}
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
            <SoapNoteDisplay
              soapNote={generatedNote}
              patientInfo={patientInfo}
            />
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
                <SoapNoteDisplay
                  soapNote={generatedNote}
                  patientInfo={patientInfo}
                  isMobile={true}
                />
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
