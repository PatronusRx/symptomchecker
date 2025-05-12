/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  ClipboardEdit,
  FileText,
  X,
  Clipboard,
  RefreshCw,
  User,
  Clock,
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
  ArrowLeft,
  Grid3X3,
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
import HighDensityChecklist from './checklist/HighDensityChecklist';
import { useSoap } from './contexts/SoapContext';
import ApproachSidebar from './ApproachSidebar';

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
const getCategoryIcon = (title: string, size: number = 16) => {
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
    <div className="categoryNavigationBar bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      {/* Progress bar to show overall completion status */}
      <div className="progressBarContainer px-3 pt-2">
        <div className="progressBarTrack bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="progressBarFill bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="progressPercentage text-xs text-center mt-0.5 text-gray-500">
          {completionPercentage}% complete
        </div>
      </div>

      {/* Scrollable categories horizontal navigation */}
      <div className="categoryScrollContainer overflow-x-auto no-scrollbar py-1 px-2">
        <div className="categoryButtonsRow flex space-x-1.5 min-w-max">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const hasCompleted = hasCategoryCompletedItems(category.id);

            return (
              <button
                key={category.id}
                className={`categoryNavButton flex flex-col items-center px-2 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div
                  className={`categoryIconWrapper relative ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {getCategoryIcon(category.title)}
                  {hasCompleted && !isActive && (
                    <span className="completionIndicator absolute -top-1 -right-1 h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <span className="categoryLabel mt-0.5 text-xs font-medium truncate max-w-[80px] text-center">
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

export default function DynamicSymptomChecker({
  chapterSlug,
}: DynamicSymptomCheckerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    'grid' | 'list' | 'compact' | 'high-density'
  >('high-density');
  const [gridColumns, setGridColumns] = useState(2);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [duration, setDuration] = useState('');

  const [selectedApproach, setSelectedApproach] = useState<string | undefined>(
    chapterSlug
  );



  const shouldGenerateSoapNote = useRef(false);

  // Add router for navigation
  const router = useRouter();

  // Add SOAP context
  const {
    approaches,
    patientInfo,
    addOrUpdateApproach,
    clearAllData,
    getCombinedSoapNote,
  } = useSoap();

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

  // Get navigation context from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const system = sessionStorage.getItem('currentSystem');
      // Removed unused symptom variable

      if (system) {
        
      }
    }
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

    setTimeout(() => {

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

  // Generate SOAP note and save to context
  const generateSoapNote = useCallback(() => {
    const noteData = SoapNoteGenerator.generateNote(
      checklistItems,
      categories,
      sections,
      chapter,
      duration
    );

    if (chapter) {
      addOrUpdateApproach({
        title: chapter.title,
        slug: chapterSlug,
        soapNote: noteData,
        timestamp: new Date().toISOString(),
      });
    }


    return noteData;
  }, [
    checklistItems,
    categories,
    sections,
    chapter,
    duration,
    chapterSlug,
    addOrUpdateApproach,
  ]);

  useEffect(() => {
    if (
      !loading &&
      checklistItems.length > 0 &&
      chapter &&
      shouldGenerateSoapNote.current
    ) {
      generateSoapNote();
      shouldGenerateSoapNote.current = false;
    }
  }, [loading, checklistItems, chapter, duration]);

  useEffect(() => {
    if (!loading && checklistItems.length > 0) {
      shouldGenerateSoapNote.current = true;
    }
  }, [checklistItems, duration]);

  // Handle response change (+/-/NA)
  const handleResponseChange = useCallback(
    (itemId: string, value: '+' | '-' | 'NA' | null) => {
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

      if (value === '+') {
        setChecklistItems((items) => updateChildItems(items, itemId, value));
      } else {
        updateChecklistItem(itemId, {
          response: value,
          isCompleted: value !== null,
        });
      }

      shouldGenerateSoapNote.current = true;
    },
    [updateChecklistItem]
  );

  // Handle notes change
  const handleNotesChange = useCallback(
    (itemId: string, notes: string) => {
      updateChecklistItem(itemId, { notes });
      shouldGenerateSoapNote.current = true;
    },
    [updateChecklistItem]
  );

  // Update duration handler to trigger SOAP note generation
  const handleDurationChange = useCallback(
    (value: string) => {
      setDuration(value);
      triggerAutosave();
      shouldGenerateSoapNote.current = true;
    },
    [triggerAutosave]
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

  // Modified copyToClipboard - always uses combined note
  const copyToClipboard = useCallback(() => {
    const combinedNote = getCombinedSoapNote();
    const soapText = SoapNoteGenerator.formatForClipboard(
      combinedNote,
      patientInfo
    );

    navigator.clipboard
      .writeText(soapText)
      .then(() => {
        alert('Combined SOAP note copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }, [patientInfo, getCombinedSoapNote]);

  // Modified clear function - clears all data
  const clearAllResponses = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear all data? This will reset the form for a new patient.'
      )
    ) {
      clearAllData();
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
      setDuration('');
    }
  }, [clearAllData]);

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
        return 'grid grid-cols-1 gap-2';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-2';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-2';
    }
  };

  // Handle changing the section
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
  };

  // Handle approach selection
  const handleApproachSelect = async (approach: string) => {
    setSelectedApproach(approach);
    setLoading(true);

    try {
      // Format approach name for database query
      const formattedApproach = approach
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Fetch chapter by approach name
      const { data: chaptersData, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .ilike('title', `%${formattedApproach}%`);

      if (chapterError) throw chapterError;
      if (!chaptersData || chaptersData.length === 0) {
        throw new Error(
          `Approach "${formattedApproach}" not found in database`
        );
      }

      // Use the first matching chapter
      const chapterData = chaptersData[0];
      setChapter(chapterData);

      // Fetch sections for this chapter
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('chapter_id', chapterData.id)
        .order('display_order');

      if (sectionsError) throw sectionsError;
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

        if (itemsError) throw itemsError;

        // Initialize with isCompleted property
        const initializedItems = (itemsData || []).map((item) => ({
          ...item,
          isCompleted: false,
          response: null,
          notes: '',
          isExpanded: true,
        }));

        setChecklistItems(initializedItems);

        // Set the first category as active
        if (categories.length > 0) {
          setActiveCategory(categories[0].id);
        }
      }

      // Update the SOAP context with the new approach
      addOrUpdateApproach({
        title: approach,
        slug: approach.toLowerCase().replace(/\s+/g, '-'),
        soapNote: generateSoapNote(),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error loading approach:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-3 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
          <h2 className="text-base font-bold">Error</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm px-3 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="mr-2 text-blue-500 hover:text-blue-700"
            onClick={() => router.push('/dashboard')}
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <ClipboardEdit className="text-blue-600 mr-1.5" size={20} />
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
              {chapter?.title || 'Symptom'} Checker
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Patient info display (non-interactive) */}
          <div className="bg-blue-50 text-blue-800 px-2 py-1 rounded-md flex items-center text-xs border border-transparent">
            <User size={12} className="mr-1.5" />
            <span className="font-medium">{patientInfo.name}</span>
          </div>
          {/* Approach count indicator (non-interactive) */}
          {approaches.length > 0 && (
            <div className="bg-green-50 text-green-800 px-2 py-1 rounded-md text-xs border border-transparent">
              {approaches.length} approach{approaches.length !== 1 ? 'es' : ''}
            </div>
          )}
          {/* New Patient button - red to indicate destructive action */}
          <button
            onClick={clearAllResponses}
            className="bg-white text-red-600 flex items-center px-3 py-1.5 rounded-md border border-red-300 hover:bg-red-50 hover:border-red-400 transition-all shadow-sm text-xs font-medium"
          >
            <RefreshCw size={12} className="mr-1.5" />
            New Patient
          </button>
          {/* Copy Note button - green to indicate positive action */}
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 text-white flex items-center px-3 py-1.5 rounded-md border border-blue-700 hover:bg-blue-700 hover:border-blue-800 transition-all shadow-sm text-xs font-medium"
          >
            <Clipboard size={12} className="mr-1.5" />
            Copy Note
          </button>{' '}
          <button
            className="md:hidden text-blue-600"
            onClick={() => setShowMobilePreview(true)}
          >
            <FileText size={18} />
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
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Navigation Sidebar */}
        {showMobileNav && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-3 flex justify-between items-center border-b">
                <h2 className="font-bold text-base">Categories</h2>
                <button onClick={() => setShowMobileNav(false)}>
                  <X size={18} />
                </button>
              </div>

              <nav className="py-1">
                {categories.map((category) => {
                  const isActive = activeCategory === category.id;
                  const hasCompleted = hasCategoryCompletedItems(category.id);

                  return (
                    <button
                      key={category.id}
                      className={`w-full text-left px-3 py-2 flex items-center ${
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
                        {getCategoryIcon(category.title, 16)}
                      </span>
                      <span className="ml-2 flex-1 text-sm">
                        {category.title}
                      </span>

                      {/* Status indicators */}
                      {hasCompleted && !isActive && (
                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Layout - Now a flex row with sidebar + main content + SOAP note */}
        <div className="flex h-full">
          {/* Approach Sidebar */}
          <ApproachSidebar
            onApproachSelect={handleApproachSelect}
            currentApproach={selectedApproach}
          />

          {/* Main Content - Checklist Items Display */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-3">
              {/* Duration Input */}
              <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                <div className="flex items-center">
                  <Clock size={16} className="text-blue-500 mr-1.5" />
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Duration of Symptoms
                    </label>
                    <input
                      type="text"
                      className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., 2 days, 1 week, 3 months"
                      value={duration}
                      onChange={(e) => handleDurationChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* View Mode Controls */}
              <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-blue-800">
                      {categories.find((c) => c.id === activeCategory)?.title ||
                        'Questions'}
                    </h2>
                    <div className="text-xs text-blue-600">
                      {getActiveCategoryStats().completed}/
                      {getActiveCategoryStats().total} completed
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 mt-1.5 sm:mt-0">
                    <span className="text-xs text-gray-500">View:</span>
                    <button
                      onClick={() => setViewMode('high-density')}
                      className={`p-1 rounded ${
                        viewMode === 'high-density'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="High Density View"
                    >
                      <Grid3X3 size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1 rounded ${
                        viewMode === 'grid'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Grid View"
                    >
                      <Grid size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1 rounded ${
                        viewMode === 'compact'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Compact View"
                    >
                      <Layers size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1 rounded ${
                        viewMode === 'list'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="List View"
                    >
                      <List size={14} />
                    </button>

                    {viewMode !== 'high-density' && (
                      <div className="hidden sm:flex items-center ml-1.5 border-l pl-1.5">
                        <span className="text-xs text-gray-500 mr-1">
                          Columns:
                        </span>
                        {[1, 2, 3].map((cols) => (
                          <button
                            key={cols}
                            onClick={() => setGridColumns(cols)}
                            className={`w-5 h-5 flex items-center justify-center rounded ml-1 text-xs ${
                              gridColumns === cols
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {cols}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* High Density View */}
              {viewMode === 'high-density' ? (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-200px)]">
                  <HighDensityChecklist
                    checklistItems={checklistItems}
                    categories={categories}
                    sections={sections}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    handleResponseChange={handleResponseChange}
                    handleNotesChange={handleNotesChange}
                    toggleItemExpansion={toggleItemExpansion}
                    hasCategoryCompletedItems={hasCategoryCompletedItems}
                    buildNestedItemsHierarchy={buildNestedItemsHierarchy}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                  />
                </div>
              ) : (
                <>
                  {/* Tab navigation for sections */}
                  <div className="flex overflow-x-auto no-scrollbar space-x-1 bg-white rounded-t-lg shadow-sm p-1.5 border-b border-gray-200 mb-0.5">
                    {getActiveCategorySections().map((section) => (
                      <button
                        key={section.id}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
                        className="whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
                            className="border-b border-gray-200 mb-2"
                          >
                            {/* Section Title */}
                            <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm rounded-t-md">
                              <h3 className="text-sm font-semibold text-blue-700">
                                {sectionGroup.section.title}
                              </h3>
                            </div>

                            {/* Section Items */}
                            <div className="p-3 bg-white rounded-b-md">
                              {/* Render top-level items with recursive function */}
                              {buildNestedItemsHierarchy(
                                sectionGroup.items
                              ).map((item) => renderChecklistItem(item))}
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
                            className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden h-fit"
                          >
                            {/* Section Title */}
                            <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                              <h3 className="text-sm font-semibold text-blue-700">
                                {sectionGroup.section.title}
                              </h3>
                            </div>

                            {/* Section Items */}
                            <div className="p-2">
                              {/* Render top-level items with recursive function */}
                              {buildNestedItemsHierarchy(
                                sectionGroup.items
                              ).map((item) => renderChecklistItem(item))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>

          {/* Right Sidebar - SOAP Note Preview */}
          <aside className="bg-white shadow-sm hidden md:flex flex-col w-80 border-l border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center">
                <FileText className="text-blue-600 mr-1.5" size={16} />
                Combined SOAP Note
              </h2>
              {approaches.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  Includes: {approaches.map((a) => a.title).join(', ')}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <SoapNoteDisplay
                soapNote={getCombinedSoapNote()}
                patientInfo={patientInfo}
              />
            </div>
          </aside>
        </div>

        {/* Mobile SOAP Note Preview */}
        {showMobilePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute top-0 right-0 h-full w-full bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="font-bold text-base flex items-center">
                  <FileText className="text-blue-600 mr-1.5" size={16} />
                  SOAP Note Preview
                </h2>
                <button onClick={() => setShowMobilePreview(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="p-3">
                <SoapNoteDisplay
                  soapNote={getCombinedSoapNote()}
                  patientInfo={patientInfo}
                  isMobile={true}
                />
              </div>

              {/* Bottom action bar */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2 flex justify-between">
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm"
                >
                  Back to Checklist
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md flex items-center text-sm"
                >
                  <Clipboard size={14} className="mr-1" />
                  Copy SOAP Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
