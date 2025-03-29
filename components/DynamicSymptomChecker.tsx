/* eslint-disable react-hooks/exhaustive-deps */
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
  Filter,
  Grid,
  Layers,
  List,
  AlertCircle,
  Pill,
  Apple,
  Activity,
  Users,
  Shield,
  GitBranch,
  Calendar,
  Stethoscope,
  FlaskConical,
  Image as ImageIcon,
  FileSearch,
  Heart,
  CheckCircle,
  LogOut,
  BookOpen,
} from 'lucide-react';
import {
  Chapter,
  Category,
  Section,
  ChecklistItem,
} from '../types/symptomChecker';
import ChecklistItemComponent from './checklist/ChecklistItem';
import SoapNoteDisplay from './soap/SoapNoteDisplay';
import { SoapNoteGenerator } from './soap/SoapNoteGenerator';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define props for the component
interface DynamicSymptomCheckerProps {
  chapterSlug: string;
}

// Top Category Navigation Component
interface TopCategoryNavProps {
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (id: string) => void;
  hasCategoryCompletedItems: (id: string) => boolean;
  completionPercentage: number;
}

// Function to get the appropriate icon for a category
const getCategoryIcon = (title: string, size: number = 20) => {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes('history') &&
    !lowerTitle.includes('collateral') &&
    !lowerTitle.includes('past')
  ) {
    return <ClipboardEdit size={size} />;
  } else if (lowerTitle.includes('alarm') || lowerTitle.includes('feature')) {
    return <AlertCircle size={size} />;
  } else if (lowerTitle.includes('medication')) {
    return <Pill size={size} />;
  } else if (lowerTitle.includes('diet')) {
    return <Apple size={size} />;
  } else if (lowerTitle.includes('review') || lowerTitle.includes('system')) {
    return <Activity size={size} />;
  } else if (lowerTitle.includes('collateral')) {
    return <Users size={size} />;
  } else if (lowerTitle.includes('risk') || lowerTitle.includes('factor')) {
    return <Shield size={size} />;
  } else if (
    lowerTitle.includes('differential') ||
    lowerTitle.includes('diagnosis')
  ) {
    return <GitBranch size={size} />;
  } else if (lowerTitle.includes('past') && lowerTitle.includes('medical')) {
    return <Calendar size={size} />;
  } else if (lowerTitle.includes('physical') || lowerTitle.includes('exam')) {
    return <Stethoscope size={size} />;
  } else if (lowerTitle.includes('lab')) {
    return <FlaskConical size={size} />;
  } else if (lowerTitle.includes('imaging')) {
    return <ImageIcon size={size} />;
  } else if (lowerTitle.includes('special') || lowerTitle.includes('test')) {
    return <FileSearch size={size} />;
  } else if (lowerTitle.includes('ecg')) {
    return <Heart size={size} />;
  } else if (lowerTitle.includes('assessment')) {
    return <CheckCircle size={size} />;
  } else if (lowerTitle.includes('plan')) {
    return <List size={size} />;
  } else if (lowerTitle.includes('disposition')) {
    return <LogOut size={size} />;
  } else if (
    lowerTitle.includes('patient') &&
    lowerTitle.includes('education')
  ) {
    return <BookOpen size={size} />;
  } else {
    // Default icon
    return <ClipboardEdit size={size} />;
  }
};

// Top Category Navigation Component
const TopCategoryNav: React.FC<TopCategoryNavProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  hasCategoryCompletedItems,
  completionPercentage,
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-center mt-1 text-gray-500">
          {completionPercentage}% complete
        </div>
      </div>

      {/* Scrollable categories */}
      <div className="overflow-x-auto no-scrollbar py-2 px-2">
        <div className="flex space-x-2 min-w-max">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const hasCompleted = hasCategoryCompletedItems(category.id);

            return (
              <button
                key={category.id}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div
                  className={`relative ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {getCategoryIcon(category.title)}
                  {hasCompleted && !isActive && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <span className="mt-1 text-xs font-medium truncate max-w-[80px] text-center">
                  {category.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DynamicSymptomChecker: React.FC<DynamicSymptomCheckerProps> = ({
  chapterSlug,
}) => {
  // State for data from Supabase
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // State for the active category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // State for section display settings
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  const [gridColumns, setGridColumns] = useState(2);

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

  // Function to update SOAP note - separate from state updates for better performance
  const updateSoapNote = useCallback(() => {
    const noteData = SoapNoteGenerator.generateNote(
      checklistItems,
      categories,
      sections,
      chapter,
      duration
    );
    setGeneratedNote(noteData);
  }, [checklistItems, categories, sections, chapter, duration]);

  // Get sections for the active category
  const getActiveCategorySections = useCallback(() => {
    if (!activeCategory) return [];
    return sections
      .filter((section) => section.category_id === activeCategory)
      .sort((a, b) => a.display_order - b.display_order);
  }, [sections, activeCategory]);

  // Get items for the active category grouped by section
  const getItemsBySectionForCategory = useCallback(() => {
    const categorySections = getActiveCategorySections();
    if (categorySections.length === 0) return [];

    // Create an array of sections with their items
    return categorySections
      .map((section) => {
        // Get all items for this section
        const sectionItems = checklistItems
          .filter((item) => item.section_id === section.id)
          .sort((a, b) => a.display_order - b.display_order);

        return {
          section,
          items: sectionItems,
        };
      })
      .filter((group) => group.items.length > 0); // Only include sections with items
  }, [checklistItems, getActiveCategorySections]);

  // Build nested hierarchy of checklist items
  const buildNestedItemsHierarchy = useCallback((items: ChecklistItem[]) => {
    // Map for quick item lookup by ID
    const itemMap = new Map<string, ChecklistItem>();

    // First pass: create all items with empty children arrays
    items.forEach((item) => {
      itemMap.set(item.id, {
        ...item,
        childItems: [],
        isExpanded: item.isExpanded !== undefined ? item.isExpanded : true,
      });
    });

    // Second pass: build the tree
    const rootItems: ChecklistItem[] = [];

    // Create a Map to store items by indent level
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

    return rootItems;
  }, []);

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

          // Initialize with isCompleted property
          const initializedItems = (itemsData || []).map((item) => ({
            ...item,
            isCompleted: false,
            response: null,
            notes: '',
            isExpanded: true, // Default to expanded for better visibility
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
  }, [chapterSlug]);

  // Separate effect to handle active category changes without refetching
  useEffect(() => {
    // Set the first category as active if none is selected
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories]);

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
    }
  }, [loading, checklistItems.length]);

  // Update SOAP note whenever relevant state changes
  useEffect(() => {
    if (!loading && checklistItems.length > 0) {
      updateSoapNote();
    }
  }, [checklistItems, loading, updateSoapNote]);

  // Automatically adjust grid columns based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setGridColumns(1);
      } else if (width < 1200) {
        setGridColumns(2);
      } else {
        setGridColumns(3);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trigger autosave animation
  const triggerAutosave = useCallback(() => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setIsAutoSaving(false);
    }, 1500);
  }, []);

  // Generic function to update checklist items with optimized state handling
  const updateChecklistItem = useCallback(
    (itemId: string, updates: Partial<ChecklistItem>) => {
      setChecklistItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        );

        // Return new array
        return updatedItems;
      });

      // Trigger autosave
      triggerAutosave();
    },
    [triggerAutosave]
  );

  // Handle response change (+/-/NA)
  const handleResponseChange = useCallback(
    (itemId: string, value: '+' | '-' | 'NA' | null) => {
      // Function to recursively update child items
      const updateChildItems = (
        items: ChecklistItem[],
        parentId: string,
        value: '+' | '-' | 'NA' | null
      ): ChecklistItem[] => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              response: value,
              isCompleted: value !== null,
              childItems: item.childItems
                ? updateChildItems(item.childItems, parentId, value)
                : undefined,
            };
          }
          if (item.childItems) {
            return {
              ...item,
              childItems: updateChildItems(item.childItems, parentId, value),
            };
          }
          return item;
        });
      };

      // If the value is positive (+), update all child items as well
      if (value === '+') {
        setChecklistItems((items) => updateChildItems(items, itemId, value));
      } else {
        // For negative (-) or NA, only update the selected item
        updateChecklistItem(itemId, {
          response: value,
          isCompleted: value !== null,
        });
      }
    },
    [updateChecklistItem]
  );

  // Handle notes change
  const handleNotesChange = useCallback(
    (itemId: string, notes: string) => {
      // Update the item with new notes
      updateChecklistItem(itemId, { notes });
    },
    [updateChecklistItem]
  );

  // Toggle item expansion state
  const toggleItemExpansion = useCallback((itemId: string) => {
    setChecklistItems((items) => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        return item;
      });
    });
  }, []);

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    const completedItems = checklistItems.filter(
      (item) => item.isCompleted
    ).length;
    const totalItems = checklistItems.length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [checklistItems]);

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
          compact={viewMode === 'compact'}
        />
      );
    },
    [handleResponseChange, handleNotesChange, toggleItemExpansion, viewMode]
  );

  // Generate SOAP note
  const generateSoapNote = useCallback(() => {
    const noteData = SoapNoteGenerator.generateNote(
      checklistItems,
      categories,
      sections,
      chapter,
      duration
    );
    setGeneratedNote(noteData);
    return noteData;
  }, [checklistItems, categories, sections, chapter, duration]);

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
      const categoryItems = checklistItems.filter((item) => {
        const section = sections.find((s) => s.id === item.section_id);
        return section && section.category_id === categoryId;
      });
      return categoryItems.some((item) => item.isCompleted);
    },
    [checklistItems, sections]
  );

  // Get the count of completed items for the active category
  const getActiveCategoryStats = useCallback(() => {
    if (!activeCategory) return { completed: 0, total: 0 };

    const categoryItems = checklistItems.filter((item) => {
      const section = sections.find((s) => s.id === item.section_id);
      return section && section.category_id === activeCategory;
    });

    const completed = categoryItems.filter((item) => item.isCompleted).length;
    const total = categoryItems.length;

    return { completed, total };
  }, [checklistItems, sections, activeCategory]);

  // Generate class for grid layout based on view mode and column count
  const getGridClass = () => {
    if (viewMode === 'list') return '';

    // For grid or compact view, determine column count
    switch (gridColumns) {
      case 1:
        return 'grid grid-cols-1 gap-4';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    }
  };

  // Handle changing the section
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
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

      {/* Top Category Navigation */}
      <TopCategoryNav
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        hasCategoryCompletedItems={hasCategoryCompletedItems}
        completionPercentage={calculateCompletion()}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Navigation Sidebar */}
        {showMobileNav && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-lg">Categories</h2>
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
                        {getCategoryIcon(category.title, 18)}
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

        {/* Main Content Layout - Now a flex row with main + right sidebar */}
        <div className="flex h-full">
          {/* Main Content - Checklist Items Display */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4">
              {/* Duration Input */}
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

              {/* View Mode Controls */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-blue-800">
                      {categories.find((c) => c.id === activeCategory)?.title ||
                        'Questions'}
                    </h2>
                    <div className="text-sm text-blue-600">
                      {getActiveCategoryStats().completed}/
                      {getActiveCategoryStats().total} completed
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="text-sm text-gray-500">View:</span>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${
                        viewMode === 'grid'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Grid View"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1.5 rounded ${
                        viewMode === 'compact'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Compact View"
                    >
                      <Layers size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded ${
                        viewMode === 'list'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="List View"
                    >
                      <List size={18} />
                    </button>

                    <div className="hidden sm:flex items-center ml-2 border-l pl-2">
                      <span className="text-sm text-gray-500 mr-1">
                        Columns:
                      </span>
                      {[1, 2, 3].map((cols) => (
                        <button
                          key={cols}
                          onClick={() => setGridColumns(cols)}
                          className={`w-6 h-6 flex items-center justify-center rounded ml-1 ${
                            gridColumns === cols
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {cols}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab navigation for sections */}
              <div className="flex overflow-x-auto no-scrollbar space-x-1 bg-white rounded-t-lg shadow-sm p-2 border-b border-gray-200 mb-0.5">
                {getActiveCategorySections().map((section) => (
                  <button
                    key={section.id}
                    className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedSection === section.id ||
                      (!selectedSection && viewMode === 'list')
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSectionSelect(section.id)}
                  >
                    {section.title}
                  </button>
                ))}
                {selectedSection && (
                  <button
                    className="whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={() => setSelectedSection(null)}
                  >
                    Show All
                  </button>
                )}
              </div>

              {/* Checklist items in grid or list view */}
              {viewMode === 'list' ? (
                // List view (like original view)
                <div className="divide-y divide-gray-100 bg-white rounded-b-lg shadow-sm">
                  {getItemsBySectionForCategory()
                    .filter(
                      (sectionGroup) =>
                        !selectedSection ||
                        sectionGroup.section.id === selectedSection
                    )
                    .map((sectionGroup) => (
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
                        <div className="p-4 bg-white rounded-b-md">
                          {/* Render top-level items with recursive function */}
                          {buildNestedItemsHierarchy(sectionGroup.items).map(
                            (item) => renderChecklistItem(item)
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                // Grid view
                <div className={getGridClass()}>
                  {getItemsBySectionForCategory()
                    .filter(
                      (sectionGroup) =>
                        !selectedSection ||
                        sectionGroup.section.id === selectedSection
                    )
                    .map((sectionGroup) => (
                      <div
                        key={sectionGroup.section.id}
                        className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden h-fit"
                      >
                        {/* Section Title */}
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                          <h3 className="text-md font-semibold text-blue-700">
                            {sectionGroup.section.title}
                          </h3>
                        </div>

                        {/* Section Items */}
                        <div className="p-3">
                          {/* Render top-level items with recursive function */}
                          {buildNestedItemsHierarchy(sectionGroup.items).map(
                            (item) => renderChecklistItem(item)
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
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
        </div>

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
