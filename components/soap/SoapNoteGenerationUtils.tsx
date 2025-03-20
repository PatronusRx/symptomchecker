import { ChecklistItem as ChecklistItemType } from '../../types/symptomChecker';
import { SoapNote } from './SoapNoteGenerator';

// Import or define types here (adjust as needed)
type ChecklistItem = {
  id: string;
  section_id: string;
  parent_item_id: string | null;
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

type Chapter = {
  id: string;
  chapter_number: number;
  title: string;
};

type Category = {
  id: string;
  title: string;
  display_order: number;
};

type Section = {
  id: string;
  chapter_id: string;
  category_id: string;
  title: string;
  display_order: number;
};

// Helper function to process item text and replace underscores with notes
export const processItemText = (
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

// Helper methods for SOAP note generation
export const generateSubjectiveSectionWithItems = (
  items: ChecklistItem[],
  categories: Category[],
  sections: Section[],
  chapter: Chapter | null,
  duration: string
): string => {
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
  const categoryItemMap = new Map<string, Set<string>>();

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
    const duplicateItems = new Set<string>();
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

export const generateObjectiveSectionWithItems = (
  items: ChecklistItem[],
  categories: Category[],
  sections: Section[]
): string => {
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

export const generateAssessmentSectionWithItems = (
  items: ChecklistItem[],
  categories: Category[],
  sections: Section[],
  chapter: Chapter | null,
  duration: string
): string => {
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
  const processedItemIds = new Set<string>();

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

export const generatePlanSectionWithItems = (
  items: ChecklistItem[],
  categories: Category[],
  sections: Section[]
): string => {
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

// Main function to generate complete SOAP note
export const generateSoapNoteWithItems = (
  items: ChecklistItem[],
  categories: Category[],
  sections: Section[],
  chapter: Chapter | null,
  duration: string
): SoapNote => {
  // Generate each section of the SOAP note
  const subjective = generateSubjectiveSectionWithItems(
    items,
    categories,
    sections,
    chapter,
    duration
  );

  const objective = generateObjectiveSectionWithItems(
    items,
    categories,
    sections
  );

  const assessment = generateAssessmentSectionWithItems(
    items,
    categories,
    sections,
    chapter,
    duration
  );

  const plan = generatePlanSectionWithItems(items, categories, sections);

  // Return the complete SOAP note
  return {
    subjective,
    objective,
    assessment,
    plan,
  };
};
