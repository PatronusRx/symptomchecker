// tools/db-migration/migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import config from './config.mjs';
import { processItemText, splitMultipleInputs } from './parser.mjs';

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Setup logging
const startTime = new Date();
const logFileName = `migration-${startTime
  .toISOString()
  .replace(/:/g, '-')}.log`;
const logFilePath = path.join(config.logsDir, logFileName);

// Create logs directory if it doesn't exist
fs.mkdirSync(config.logsDir, { recursive: true });

// Log function that writes to console and log file
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;

  console.log(formattedMessage);
  fs.appendFileSync(logFilePath, formattedMessage + '\n');
}

// Log errors
function logError(message, error) {
  log(`${message}: ${error.message}`, 'error');
  if (config.verbose && error.stack) {
    log(error.stack, 'error');
  }
}

/**
 * Insert categories into the database
 */
async function insertCategories() {
  log('Inserting categories...');

  try {
    // Check which categories already exist
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('id, title');

    if (fetchError) throw fetchError;

    const existingTitles = existingCategories?.map((c) => c.title) || [];
    const categoryMap = {};
    if (existingCategories) {
      existingCategories.forEach((c) => {
        categoryMap[c.title] = c.id;
      });
    }

    // Prepare categories that don't already exist
    const categoriesToInsert = Object.entries(config.categories)
      .map(([, { name, order }]) => ({
        title: name,
        display_order: order,
      }))
      .filter((c) => !existingTitles.includes(c.title));

    if (categoriesToInsert.length > 0) {
      // Insert categories
      const { data, error } = await supabase
        .from('categories')
        .insert(categoriesToInsert)
        .select();

      if (error) throw error;

      // Add new categories to the map
      data.forEach((c) => {
        categoryMap[c.title] = c.id;
      });

      log(`Inserted ${data.length} categories`);
    } else {
      log('All categories already exist, skipping insertion');
    }

    return categoryMap;
  } catch (error) {
    logError('Error inserting categories', error);
    throw error;
  }
}

/**
 * Generate a path string for an item based on its position in the hierarchy
 */
function generatePath(parentPath, itemPosition) {
  return parentPath ? `${parentPath}.${itemPosition}` : `${itemPosition}`;
}

/**
 * Pre-process a markdown file to extract the hierarchical structure
 * and generate materialized paths for all items
 */
function preprocessMarkdownFile(filePath) {
  const fileName = path.basename(filePath);
  log(`Preprocessing file: ${fileName}`);

  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const items = [];
    let currentSection = null;
    let itemCounter = 0;

    // Track the hierarchy using a stack-like structure
    let hierarchyStack = [];

    // Process the file line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) continue;

      // Extract title from first line (# 1. History)
      if (i === 0 && trimmedLine.startsWith('# ')) {
        // Store an initial section name from the main title if needed
        const titleMatch = trimmedLine.match(/^# \d+\.\s+(.+)$/);
        if (titleMatch && !currentSection) {
          currentSection = 'Main';
          log(
            `Using title as initial section: "${currentSection}" at line ${i}`
          );
        }
        continue;
      }

      // Process section headers - CRITICAL FIX HERE
      const headerMatch = trimmedLine.match(/^(#{2,4})\s+(.+)$/);
      if (headerMatch) {
        const headerMarkers = headerMatch[1];
        const headerLevel = headerMarkers.length; // 2, 3, or 4
        const headerTitle = headerMatch[2].trim();

        // For ## (level 2), create a new section
        if (headerLevel === 2) {
          // Store the exact heading text as the section name
          currentSection = headerTitle;
          log(`Found section: "${currentSection}" at line ${i}`);
          hierarchyStack = []; // Reset hierarchy for new section
          itemCounter = 0;
        } else {
          // For ### and #### levels, treat them as nested items with proper hierarchy
          if (!currentSection) {
            log(
              `Warning: Found header without a parent section at line ${i}, using default section`,
              'warn'
            );
            currentSection = 'Default Section';
          }

          // Convert header level to equivalent markdown list indentation level
          // ### (level 3) = indent level 0
          // #### (level 4) = indent level 1
          const indentLevel = headerLevel - 3; // Convert to indent levels

          // IMPROVED HIERARCHY MANAGEMENT: First clear existing items at this level and deeper
          if (indentLevel === 0) {
            // For level 0 headers, clear all hierarchy
            hierarchyStack = [];
          } else {
            // For deeper headers, only keep parents
            hierarchyStack = hierarchyStack.slice(0, indentLevel);
          }

          // Add to hierarchy
          itemCounter++;
          const position = itemCounter;

          // Calculate path
          const parentPath =
            hierarchyStack.length > 0 ? hierarchyStack.join('.') : '';
          const path = generatePath(parentPath, position);

          log(
            `Header "${headerTitle}" with path ${path}, level: ${indentLevel}, parent: ${parentPath}`
          );

          hierarchyStack.push(position);

          items.push({
            lineNumber: i,
            section: currentSection,
            type: 'header',
            headerLevel,
            title: headerTitle,
            itemText: headerTitle,
            indentLevel,
            path,
          });
        }

        continue;
      }

      // Process checklist items
      const checklistMatch = line.match(/^(\s*)- \[ \] (.+)$/);
      if (checklistMatch) {
        if (!currentSection) {
          log(
            `Warning: Found checklist item without a section at line ${i}, using default section`,
            'warn'
          );
          currentSection = 'Default Section';
        }

        const indentStr = checklistMatch[1];
        // Calculate indent level based on spaces (usually 2 spaces per level)
        const indentLevel = Math.floor(indentStr.length / 2);
        const itemText = checklistMatch[2].trim();

        // DEBUGGING FOR ORIENTATION ASSESSMENT
        if (
          itemText.includes('Orientation assessment') ||
          itemText.includes('Person:') ||
          itemText.includes('Place:') ||
          itemText.includes('Time:') ||
          itemText.includes('Situation:')
        ) {
          log(`ORIENTATION DEBUG: Processing "${itemText}"`);
          log(
            `  - Line ${i}, Indent level: ${indentLevel}, Spaces: ${
              indentStr.length
            }, Raw spaces: "${indentStr.replace(/ /g, '·')}"`
          );
          log(
            `  - Current hierarchy stack before adjustment: [${hierarchyStack.join(
              ', '
            )}]`
          );

          // Record the item being processed for deeper analysis
          if (itemText.includes('Orientation assessment')) {
            log(
              `  - PARENT ITEM DETECTED: Will become a parent for the Person/Place/Time/Situation items`
            );
          } else {
            // Find which child item this is
            const childType = itemText.includes('Person:')
              ? 'Person'
              : itemText.includes('Place:')
              ? 'Place'
              : itemText.includes('Time:')
              ? 'Time'
              : itemText.includes('Situation:')
              ? 'Situation'
              : 'Unknown';
            log(
              `  - CHILD ITEM DETECTED: ${childType} child should have Orientation assessment as parent`
            );
          }
        }

        // IMPROVED HIERARCHY MANAGEMENT: More consistent handling that better preserves nesting
        if (indentLevel === 0) {
          // Top-level items reset hierarchy
          hierarchyStack = [];
          if (itemText.includes('Orientation assessment')) {
            log(
              `  - Resetting hierarchy stack for top-level Orientation assessment item`
            );
          }
        } else {
          // For nested items, maintain proper parent hierarchy
          // The key fix: only keep the stack elements that represent valid parents
          // If current indent is 2, keep only the first 2 levels of the hierarchy
          const oldStack = [...hierarchyStack];
          hierarchyStack = hierarchyStack.slice(0, indentLevel);

          if (
            itemText.includes('Person:') ||
            itemText.includes('Place:') ||
            itemText.includes('Time:') ||
            itemText.includes('Situation:')
          ) {
            log(`  - Child item hierarchy adjustment:`);
            log(`    - Old stack: [${oldStack.join(', ')}]`);
            log(
              `    - New stack after slice(0, ${indentLevel}): [${hierarchyStack.join(
                ', '
              )}]`
            );

            // Check if the expected parent is in the hierarchy
            const lastItemWasOrientationAssessment =
              items.length > 0 &&
              items[items.length - 1].itemText.includes(
                'Orientation assessment'
              );
            log(
              `    - Is previous item Orientation assessment? ${lastItemWasOrientationAssessment}`
            );

            if (
              lastItemWasOrientationAssessment &&
              hierarchyStack.length === 0
            ) {
              log(
                `    - WARNING: Parent reference lost! Child has empty hierarchy stack`
              );
            }
          }
        }

        // Add to hierarchy
        itemCounter++;
        const position = itemCounter;

        // Calculate path
        const parentPath =
          hierarchyStack.length > 0 ? hierarchyStack.join('.') : '';
        const path = generatePath(parentPath, position);

        // Add additional debugging for Orientation assessment paths
        if (
          itemText.includes('Orientation assessment') ||
          itemText.includes('Person:') ||
          itemText.includes('Place:') ||
          itemText.includes('Time:') ||
          itemText.includes('Situation:')
        ) {
          log(
            `  - ORIENTATION PATH: Item "${itemText}" with path ${path}, parent: ${parentPath}, stack: [${hierarchyStack.join(
              ', '
            )}]`
          );

          // Special fix for orientation assessment children
          // If this is a child item (Person/Place/Time/Situation) AND we lost parent reference
          const isChild =
            !itemText.includes('Orientation assessment') &&
            (itemText.includes('Person:') ||
              itemText.includes('Place:') ||
              itemText.includes('Time:') ||
              itemText.includes('Situation:'));

          const isParentMissing =
            hierarchyStack.length === 0 && indentLevel > 0;

          if (isChild && isParentMissing) {
            log(`  - SPECIAL FIX NEEDED: Child item lost parent reference!`);

            // Find the last Orientation assessment item
            let orientationItem = null;
            for (let j = items.length - 1; j >= 0; j--) {
              if (items[j].itemText.includes('Orientation assessment')) {
                orientationItem = items[j];
                break;
              }
            }

            if (orientationItem) {
              log(
                `  - Found parent: "${orientationItem.itemText}" with path ${orientationItem.path}`
              );
              // Create a special fix note for this situation
              log(
                `  - Manual fix would be needed to connect this item to path ${orientationItem.path}`
              );
            } else {
              log(`  - Could not find a parent Orientation assessment item!`);
            }
          }
        }

        // Add debugging for key items
        if (
          itemText.includes('Orientation') ||
          itemText.includes('Person:') ||
          itemText.includes('Place:') ||
          itemText.includes('Time:') ||
          itemText.includes('Situation:')
        ) {
          log(
            `Building item "${itemText}" with path ${path}, parent: ${parentPath}, level: ${indentLevel}`
          );
        }

        // Add this item's position to the hierarchy stack
        hierarchyStack.push(position);

        // Process the item text to extract components
        const processedItem = processItemText(itemText);

        items.push({
          lineNumber: i,
          section: currentSection,
          type: 'item',
          itemText: processedItem.itemText,
          indentLevel,
          hasTextInput: processedItem.hasTextInput,
          inputLabel: processedItem.inputLabel,
          inputPlaceholder: processedItem.inputPlaceholder,
          inputUnit: processedItem.inputUnit,
          icd10Code: processedItem.icd10Code,
          path,
        });

        // Handle multiple inputs (if comma-separated with multiple blanks)
        if (
          itemText.includes(',') &&
          (itemText.match(/_+/g) || []).length > 1
        ) {
          const multiItems = splitMultipleInputs(itemText);

          // Skip first one as it's already added
          for (let j = 1; j < multiItems.length; j++) {
            const subItem = multiItems[j];
            itemCounter++;
            const subPath = generatePath(path, j);

            items.push({
              lineNumber: i,
              section: currentSection,
              type: 'subitem',
              parentPath: path,
              itemText: subItem.itemText,
              indentLevel: indentLevel + 1,
              hasTextInput: subItem.hasTextInput,
              inputLabel: subItem.inputLabel,
              inputPlaceholder: subItem.inputPlaceholder,
              inputUnit: subItem.inputUnit,
              icd10Code: subItem.icd10Code,
              path: subPath,
            });
          }
        }
      }
    }

    // Get unique sections and log them
    const sections = [...new Set(items.map((item) => item.section))];
    log(`Found ${sections.length} sections in file: ${sections.join(', ')}`);

    // Check for items without sections
    const itemsWithoutSection = items.filter(
      (item) => !item.section || item.section.trim() === ''
    );
    if (itemsWithoutSection.length > 0) {
      log(
        `Warning: Found ${itemsWithoutSection.length} items without a section`,
        'warn'
      );
    }

    return { items, sections };
  } catch (error) {
    logError(`Error preprocessing file ${filePath}`, error);
    return { items: [], sections: [] };
  }
}

/**
 * Special post-processing to fix known hierarchy issues
 */
function postProcessItems(items) {
  log('Post-processing items to fix known hierarchy issues...');

  // STEP 1: Analyze the items to identify potential parent-child patterns
  // Common parent-child patterns in medical checklists
  const parentChildPatterns = [
    // Pattern 1: Parent ends with ":" and children follow with specific pattern
    {
      parentPattern: /:$/, // Parent items often end with colon
      childrenPatterns: [
        /^[A-Z][a-z]+:/, // Children start with a capitalized word followed by colon (e.g., "Person:", "Place:")
      ],
      description: 'Parent with colon followed by labeled children',
    },
    // Pattern 2: Assessment patterns (specific to orientation assessment but could exist elsewhere)
    {
      parentPattern: /assessment/i,
      childrenPatterns: [
        /^[A-Z][a-z]+:/, // Children are labeled like "Person:", "Place:", etc.
      ],
      description: 'Assessment parent with labeled children',
    },
    // Pattern 3: General pattern for lists (e.g., "First-line agents:" followed by medication names)
    {
      parentPattern: /agents:|medications:|symptoms:|findings:/i,
      childrenPatterns: [
        /^[A-Za-z]+:/, // Children are medication/symptom names with colon
      ],
      description: 'List of items with labeled subitems',
    },
  ];

  // Find all potential parent items
  const potentialParents = items.filter((item) => {
    for (const pattern of parentChildPatterns) {
      if (pattern.parentPattern.test(item.itemText)) {
        return true;
      }
    }
    return false;
  });

  log(`Found ${potentialParents.length} potential parent items to analyze`);

  // For each potential parent, find and fix its children
  for (const parent of potentialParents) {
    const parentIndex = items.indexOf(parent);
    const parentIndent = parent.indentLevel;

    // Find children that appear after the parent and have higher indent level
    const children = items.filter((item, index) => {
      // Only consider items after the parent
      if (index <= parentIndex) return false;

      // Must have higher indent level than parent
      if (item.indentLevel <= parentIndent) return false;

      // Check if this matches any child pattern for this parent
      for (const pattern of parentChildPatterns) {
        if (pattern.parentPattern.test(parent.itemText)) {
          for (const childPattern of pattern.childrenPatterns) {
            if (childPattern.test(item.itemText)) {
              return true;
            }
          }
        }
      }

      // Also allow children that are within 5 items of the parent and have indent level exactly parent+1
      // This captures common nesting patterns even if they don't match specific text patterns
      const isCloseToParent = index < parentIndex + 6; // Within 5 items
      const isDirectChild = item.indentLevel === parentIndent + 1;
      return isCloseToParent && isDirectChild;
    });

    if (children.length > 0) {
      log(
        `Found parent item: "${parent.itemText}" with ${children.length} potential children`
      );

      // Check if children paths already correctly reference parent path
      let needsFix = false;
      children.forEach((child) => {
        if (!child.path.startsWith(parent.path + '.')) {
          needsFix = true;
          log(
            `Child "${child.itemText}" needs path fix (${child.path} should start with ${parent.path}.)`
          );
        }
      });

      // Fix children paths if needed
      if (needsFix) {
        log(
          `Fixing paths for ${children.length} children of "${parent.itemText}"`
        );

        children.forEach((child, i) => {
          const oldPath = child.path;
          const childPosition = i + 1; // Use 1-based index for child positions
          const newPath = `${parent.path}.${childPosition}`;

          log(`Fixing path for "${child.itemText}": ${oldPath} -> ${newPath}`);
          child.path = newPath;
        });
      }
    }
  }

  // The original specific Orientation assessment fix as a fallback
  let orientationAssessmentItem = null;
  let orientationChildren = [];

  // First, identify all orientation-related items
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.itemText.includes('Orientation assessment')) {
      orientationAssessmentItem = item;
      log(`Found Orientation assessment item with path ${item.path}`);
    } else if (
      item.itemText.includes('Person:') ||
      item.itemText.includes('Place:') ||
      item.itemText.includes('Time:') ||
      item.itemText.includes('Situation:')
    ) {
      orientationChildren.push(item);
      log(`Found child item "${item.itemText}" with path ${item.path}`);
    }
  }

  // Then fix the paths of children if needed
  if (orientationAssessmentItem && orientationChildren.length > 0) {
    log(`Fixing paths for ${orientationChildren.length} orientation children`);

    for (let i = 0; i < orientationChildren.length; i++) {
      const child = orientationChildren[i];

      // Check if the child already has the parent as its prefix
      // If not, we need to fix it
      if (!child.path.startsWith(orientationAssessmentItem.path + '.')) {
        const oldPath = child.path;
        const childPosition = i + 1; // Just use index + 1 for simplicity
        const newPath = `${orientationAssessmentItem.path}.${childPosition}`;

        log(`Fixing path for "${child.itemText}": ${oldPath} -> ${newPath}`);
        child.path = newPath;
      }
    }
  }

  return items;
}

/**
 * Batch insert items into the database
 */
async function batchInsertItems(items, sectionIdMap) {
  const BATCH_SIZE = 100;
  let insertedCount = 0;

  // Map to track inserted items by path
  const itemIdByPath = {};

  // Log section map for debugging
  log(`Section ID map: ${JSON.stringify(sectionIdMap)}`);

  // Prepare all items for insertion - filter out items with missing section IDs
  const itemsToInsert = items
    .map((item) => {
      const sectionId = sectionIdMap[item.section];

      if (!sectionId) {
        log(
          `Warning: No section ID found for item in section "${item.section}" - item will be skipped`,
          'warn'
        );
        return null;
      }

      return {
        section_id: sectionId,
        display_order: item.lineNumber * 10,
        item_text: item.itemText,
        indent_level: item.indentLevel,
        is_header: item.type === 'header',
        header_level: item.type === 'header' ? item.headerLevel : null,
        has_text_input: item.hasTextInput || false,
        input_label: item.inputLabel,
        input_placeholder: item.inputPlaceholder,
        input_unit: item.inputUnit,
        icd10_code: item.icd10Code,
        path: item.path,
      };
    })
    .filter(Boolean); // Remove null items

  log(
    `Prepared ${itemsToInsert.length} items for insertion (filtered from ${items.length} total items)`
  );

  if (itemsToInsert.length === 0) {
    log(`No valid items to insert after filtering`, 'warn');
    return { insertedCount: 0, itemIdByPath: {} };
  }

  // Insert items in batches
  for (let i = 0; i < itemsToInsert.length; i += BATCH_SIZE) {
    const batch = itemsToInsert.slice(i, i + BATCH_SIZE);

    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .insert(batch)
        .select('id, path');

      if (error) throw error;

      // Map each item's path to its ID
      data.forEach((item) => {
        itemIdByPath[item.path] = item.id;
      });

      insertedCount += data.length;
      log(
        `Inserted batch of ${data.length} items (total: ${insertedCount}/${itemsToInsert.length})`
      );
    } catch (error) {
      logError(`Error inserting batch of items`, error);
      throw error;
    }
  }

  return { insertedCount, itemIdByPath };
}

/**
 * Update parent-child relationships using the path information
 */
async function updateParentChildRelationships(itemIdByPath) {
  log('Updating parent-child relationships...');

  if (Object.keys(itemIdByPath).length === 0) {
    log('No items to update parent-child relationships for', 'warn');
    return;
  }

  // For each item, find its parent using its path
  let successCount = 0;
  let errorCount = 0;
  let specialFixCount = 0;

  // Log the path structure for debugging
  log(
    `Path structure (first 10 paths): ${Object.keys(itemIdByPath)
      .slice(0, 10)
      .join(', ')}`
  );

  // Sort paths to help visualize the hierarchy
  const sortedPaths = Object.keys(itemIdByPath).sort();
  log(`Hierarchical structure (first 20 sorted paths):`);
  sortedPaths.slice(0, 20).forEach((path) => {
    const depth = path.split('.').length - 1;
    const indent = '  '.repeat(depth);
    log(`${indent}${path} -> ${itemIdByPath[path]}`);
  });

  // GENERALIZED FIX: First identify all parent-child relationships with common patterns
  // This will find all potential parent items and their children based on text patterns
  const patternFixMap = new Map(); // Maps child IDs to their correct parent IDs

  // Define patterns to look for (more general than just orientation assessment)
  const hierarchyPatterns = [
    {
      parentPattern: /assessment/i,
      childPatterns: [/^(Person|Place|Time|Situation):/i],
      description: 'Assessment pattern (like Orientation assessment)',
    },
    {
      parentPattern: /agents:/i,
      childPatterns: [/^[A-Za-z]+:/],
      description: 'Medication agents pattern',
    },
    {
      parentPattern: /symptoms:/i,
      childPatterns: [/^[A-Za-z]+:/],
      description: 'Symptoms list pattern',
    },
    {
      parentPattern: /:$/, // Any item ending with a colon
      childPatterns: [/^[A-Za-z]+:/], // Any item starting with a word followed by colon
      description: 'Generic parent-child pattern with labeled items',
    },
  ];

  // Build a map of item IDs to their text for pattern matching
  const itemTextMap = new Map(); // Maps item IDs to their text

  // First, fetch the text for all items
  try {
    const { data: allItems, error: fetchError } = await supabase
      .from('checklist_items')
      .select('id, item_text, path, indent_level')
      .order('path');

    if (!fetchError && allItems && allItems.length > 0) {
      log(`Loaded ${allItems.length} items for pattern analysis`);

      // Create item text map and analyze patterns
      allItems.forEach((item) => {
        itemTextMap.set(item.id, {
          text: item.text,
          path: item.path,
          indentLevel: item.indent_level,
        });
      });

      // Group items by their paths to identify parent-child relationships
      const itemsByPath = new Map();
      allItems.forEach((item) => {
        itemsByPath.set(item.path, item);
      });

      // Find parent-child pairs that match our patterns
      for (const item of allItems) {
        // Skip items that don't match any parent pattern
        const matchingPatterns = hierarchyPatterns.filter((pattern) =>
          pattern.parentPattern.test(item.item_text)
        );

        if (matchingPatterns.length === 0) continue;

        // This item looks like a parent, search for potential children
        log(
          `Found potential parent item: "${item.item_text}" (ID: ${item.id})`
        );

        // Look for children with higher indent level and matching patterns
        const potentialChildren = allItems.filter(
          (childItem) =>
            childItem.id !== item.id &&
            childItem.indent_level > item.indent_level &&
            matchingPatterns.some((pattern) =>
              pattern.childPatterns.some((childPattern) =>
                childPattern.test(childItem.item_text)
              )
            )
        );

        if (potentialChildren.length > 0) {
          log(
            `Found ${potentialChildren.length} potential children for "${item.item_text}"`
          );

          // Add these to our fix map
          potentialChildren.forEach((child) => {
            patternFixMap.set(child.id, item.id);
          });
        }
      }
    }
  } catch (error) {
    log(`Error performing pattern analysis: ${error.message}`, 'warn');
  }

  // Orientation assessment specific lookup (as a fallback)
  let orientationAssessmentId = null;
  let personPlaceTimeIds = [];

  try {
    // Direct lookup by text to find the correct orientation assessment item
    const { data: orientationItems, error: orientationError } = await supabase
      .from('checklist_items')
      .select('id, item_text, path')
      .ilike('item_text', 'Orientation assessment%');

    if (!orientationError && orientationItems && orientationItems.length > 0) {
      orientationAssessmentId = orientationItems[0].id;
      log(
        `DIRECT LOOKUP: Found Orientation assessment: ID ${orientationAssessmentId}, Text: "${orientationItems[0].item_text}"`
      );

      // Find the Person/Place/Time/Situation items directly by text
      const { data: childItems, error: childError } = await supabase
        .from('checklist_items')
        .select('id, item_text')
        .or(
          'item_text.ilike.Person:%,item_text.ilike.Place:%,item_text.ilike.Time:%,item_text.ilike.Situation:%'
        );

      if (!childError && childItems && childItems.length > 0) {
        personPlaceTimeIds = childItems.map((item) => item.id);

        log(
          `DIRECT LOOKUP: Found ${childItems.length} orientation child items:`
        );
        childItems.forEach((item) => {
          log(`  - ID: ${item.id}, Text: "${item.item_text}"`);
        });

        // Add these to our pattern fix map
        personPlaceTimeIds.forEach((childId) => {
          patternFixMap.set(childId, orientationAssessmentId);
        });
      }
    }
  } catch (error) {
    log(
      `Error performing direct lookup for orientation items: ${error.message}`,
      'warn'
    );
  }

  // First pass: collect information about orientation assessment-related items
  let orientationAssessmentPath = null;
  let orientationChildrenPaths = [];

  for (const [path, id] of Object.entries(itemIdByPath)) {
    // Check if this path contains item text
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('item_text')
        .eq('id', id)
        .single();

      if (!error && data) {
        if (data.item_text.includes('Orientation assessment')) {
          orientationAssessmentPath = path;
          if (!orientationAssessmentId) {
            orientationAssessmentId = id; // Use this as fallback if direct lookup failed
          }
          log(`Found Orientation assessment path: ${path} -> ID: ${id}`);
        } else if (
          data.item_text.includes('Person:') ||
          data.item_text.includes('Place:') ||
          data.item_text.includes('Time:') ||
          data.item_text.includes('Situation:')
        ) {
          orientationChildrenPaths.push(path);
          log(
            `Found orientation child path: ${path} -> ID: ${id} (${data.item_text})`
          );
        }
      }
    } catch (error) {
      log(`Error checking item text: ${error.message}`, 'warn');
    }
  }

  // Now process all parent-child relationships
  for (const [path, id] of Object.entries(itemIdByPath)) {
    // Skip root items
    if (!path.includes('.')) continue;

    let parentId = null;
    let specialFix = false;
    let fixSource = '';

    // GENERAL PATTERN FIX: Check if this item is in our pattern fix map
    if (patternFixMap.has(id)) {
      parentId = patternFixMap.get(id);
      specialFix = true;
      fixSource = 'pattern';
      log(
        `PATTERN FIX: Using detected pattern to set item ${id} parent to ${parentId}`
      );
    }
    // DIRECT FIX: If this is one of our Person/Place/Time/Situation items from direct lookup
    else if (orientationAssessmentId && personPlaceTimeIds.includes(id)) {
      // Apply the direct fix - use the orientation assessment as parent regardless of path
      parentId = orientationAssessmentId;
      specialFix = true;
      fixSource = 'direct';
      log(
        `DIRECT FIX: Forcing orientation child item ${id} to have parent ${orientationAssessmentId} (bypassing path logic)`
      );
    }
    // Check if this is an orientation child that needs special handling
    else if (
      orientationAssessmentId &&
      orientationChildrenPaths.includes(path) &&
      !path.startsWith(orientationAssessmentPath + '.')
    ) {
      // Apply special fix - use the orientation assessment as parent
      parentId = orientationAssessmentId;
      specialFix = true;
      fixSource = 'path';
      log(
        `PATH FIX: Setting orientation child ${path} parent to ${orientationAssessmentPath}`
      );
    } else {
      // Normal case - extract parent path
      const lastDotIndex = path.lastIndexOf('.');
      const parentPath = path.substring(0, lastDotIndex);

      // Find parent ID
      parentId = itemIdByPath[parentPath];

      if (!parentId) {
        log(`Warning: No parent found for path ${path}`, 'warn');
        continue;
      }
    }

    // Use update instead of upsert to preserve all other fields
    try {
      const { error } = await supabase
        .from('checklist_items')
        .update({ parent_item_id: parentId })
        .eq('id', id);

      if (error) {
        errorCount++;
        logError(
          `Error updating parent-child relationship for item ${id}`,
          error
        );
      } else {
        successCount++;
        if (specialFix) {
          specialFixCount++;
          log(`Successfully applied ${fixSource} fix for item ${id}`);
        }
      }
    } catch (error) {
      errorCount++;
      logError(
        `Error updating parent-child relationship for item ${id}`,
        error
      );
    }
  }

  log(
    `Completed parent-child relationship updates: ${successCount} successful (including ${specialFixCount} special fixes), ${errorCount} failed`
  );

  // Final verification for pattern-based hierarchies
  const patternVerifications = [
    {
      parentPattern: 'assessment',
      childPatterns: ['Person:', 'Place:', 'Time:', 'Situation:'],
      description: 'Orientation assessment pattern',
    },
    {
      parentPattern: 'agents:',
      childPatterns: ['Benzodiazepines:'],
      description: 'Medication agents pattern',
    },
  ];

  // Verify a few key patterns to ensure they're working properly
  for (const verification of patternVerifications) {
    try {
      // Find parent items matching this pattern
      const { data: parentItems, error: parentError } = await supabase
        .from('checklist_items')
        .select('id, item_text')
        .ilike('item_text', `%${verification.parentPattern}%`)
        .limit(5);

      if (!parentError && parentItems && parentItems.length > 0) {
        log(
          `VERIFICATION: Checking ${verification.description} parent-child relationships...`
        );

        for (const parentItem of parentItems) {
          // Get children for this parent
          const { data: children, error: childError } = await supabase
            .from('checklist_items')
            .select('id, item_text')
            .eq('parent_item_id', parentItem.id);

          if (!childError) {
            log(
              `Parent "${parentItem.item_text}" (ID: ${parentItem.id}) has ${
                children?.length || 0
              } children`
            );

            if (children && children.length > 0) {
              // Check if expected child patterns are present
              const foundPatterns = verification.childPatterns.filter(
                (pattern) =>
                  children.some((child) => child.item_text.includes(pattern))
              );

              log(
                `Found ${foundPatterns.length}/${verification.childPatterns.length} expected child patterns`
              );

              if (foundPatterns.length === verification.childPatterns.length) {
                log(`✓ SUCCESS: All expected children found for this pattern`);
              } else if (foundPatterns.length > 0) {
                log(
                  `⚠️ PARTIAL SUCCESS: Some expected children found for this pattern`
                );
              } else {
                log(
                  `✗ FAILURE: No expected children found for this pattern`,
                  'warn'
                );
              }
            }
          }
        }
      }
    } catch (error) {
      log(
        `Error during verification of ${verification.description}: ${error.message}`,
        'warn'
      );
    }
  }
}

/**
 * Process a single markdown file and insert into database
 */
async function processMarkdownFile(filePath, chapterId, categoryId) {
  const fileName = path.basename(filePath);
  log(`Processing file: ${fileName}`);

  // Special case for physical-exam.md which has the Orientation assessment issue
  const isPhysicalExamFile = fileName === 'physical-exam.md';
  if (isPhysicalExamFile) {
    log(
      `SPECIAL HANDLING: Detected physical-exam.md file with Orientation assessment section`
    );
  }

  try {
    // Preprocess file to extract structure and generate paths
    const { items, sections } = preprocessMarkdownFile(filePath);

    if (items.length === 0) {
      log(`No items found in ${fileName}`, 'warn');
      return false;
    }

    // Post-process items to fix known hierarchy issues
    const processedItems = postProcessItems(items);

    // Extra special handling for physical-exam.md
    if (isPhysicalExamFile) {
      log(`Applying additional fixes for physical-exam.md...`);

      // Find the Orientation assessment item
      let orientationItem = null;
      let orientationIndex = -1;

      for (let i = 0; i < processedItems.length; i++) {
        const item = processedItems[i];
        if (item.itemText.includes('Orientation assessment')) {
          orientationItem = item;
          orientationIndex = i;
          log(
            `Found Orientation assessment at index ${i} with path ${item.path}`
          );
          break;
        }
      }

      if (orientationItem) {
        // Find all the child items
        const childItems = [];

        for (let i = 0; i < processedItems.length; i++) {
          const item = processedItems[i];
          if (
            (item.itemText.includes('Person:') ||
              item.itemText.includes('Place:') ||
              item.itemText.includes('Time:') ||
              item.itemText.includes('Situation:')) &&
            i > orientationIndex &&
            item.indentLevel > orientationItem.indentLevel
          ) {
            childItems.push({ item, index: i });
            log(`Found child item "${item.itemText}" at index ${i}`);
          }
        }

        // Manually fix the paths
        log(`Fixing paths for ${childItems.length} orientation children`);

        for (let i = 0; i < childItems.length; i++) {
          const { item } = childItems[i];
          const oldPath = item.path;
          const childPosition = i + 1;
          const newPath = `${orientationItem.path}.${childPosition}`;

          log(`Manual fix: "${item.itemText}" path ${oldPath} -> ${newPath}`);
          item.path = newPath;
        }
      }
    }

    // Debug log all detected sections
    log(`Detected sections: ${JSON.stringify(sections)}`);

    // Create section mapping
    const sectionIdMap = {};

    for (let i = 0; i < sections.length; i++) {
      const sectionTitle = sections[i];

      // Skip empty or null section titles
      if (!sectionTitle || sectionTitle.trim() === '') {
        log(`Warning: Empty section title found, skipping`, 'warn');
        continue;
      }

      log(`Attempting to insert section: "${sectionTitle}"`);

      try {
        // Insert section
        const { data: sectionData, error: sectionError } = await supabase
          .from('sections')
          .upsert({
            chapter_id: chapterId,
            category_id: categoryId,
            title: sectionTitle,
            display_order: i * 10,
          })
          .select();

        if (sectionError) {
          log(
            `Error inserting section "${sectionTitle}": ${sectionError.message}`,
            'error'
          );
          continue;
        }

        if (!sectionData || sectionData.length === 0) {
          log(
            `No data returned when inserting section "${sectionTitle}"`,
            'error'
          );
          continue;
        }

        sectionIdMap[sectionTitle] = sectionData[0].id;
        log(
          `Inserted/updated section: ${sectionTitle} (ID: ${sectionData[0].id})`
        );
      } catch (error) {
        log(
          `Exception when inserting section "${sectionTitle}": ${error.message}`,
          'error'
        );
        continue;
      }
    }

    // Check if we have any valid sections before proceeding
    if (Object.keys(sectionIdMap).length === 0) {
      log(`No valid sections were created, skipping item insertion`, 'error');
      return false;
    }

    // Batch insert all items
    const { insertedCount, itemIdByPath } = await batchInsertItems(
      processedItems,
      sectionIdMap
    );

    // If no items were inserted, consider this a failure
    if (insertedCount === 0) {
      log(`No items were inserted for file ${fileName}`, 'error');
      return false;
    }

    // Update parent-child relationships
    await updateParentChildRelationships(itemIdByPath);

    log(
      `Successfully processed file ${fileName}: inserted ${insertedCount} items`
    );
    return true;
  } catch (error) {
    logError(`Error processing file ${filePath}`, error);
    return false;
  }
}

/**
 * Process a single chapter directory
 */
async function processChapter(chapterDir, categoryMap) {
  const chapterName = path.basename(chapterDir);
  log(`Processing chapter: ${chapterName}`);

  try {
    // Extract chapter number from directory name (e.g., "Ch11_Syncope" -> 11)
    const chapterMatch = chapterName.match(/Ch(\d+)_(.+)/);
    if (!chapterMatch) {
      throw new Error(`Invalid chapter directory name format: ${chapterName}`);
    }

    const chapterNumber = parseInt(chapterMatch[1], 10);
    const chapterTitle = chapterMatch[2].replace(/_/g, ' ');

    // Check if chapter already exists and handle it properly
    log(`Checking if chapter ${chapterNumber} exists...`);
    const { data: existingChapters, error: checkError } = await supabase
      .from('chapters')
      .select('id')
      .eq('chapter_number', chapterNumber);

    if (checkError) throw checkError;

    let chapterId;

    if (existingChapters && existingChapters.length > 0) {
      // Chapter exists, use its ID
      chapterId = existingChapters[0].id;
      log(`Found existing chapter with ID: ${chapterId}`);

      // Update the chapter title if needed
      const { error: updateError } = await supabase
        .from('chapters')
        .update({ title: chapterTitle })
        .eq('id', chapterId);

      if (updateError) throw updateError;
      log(`Updated chapter: ${chapterTitle} (ID: ${chapterId})`);
    } else {
      // Chapter doesn't exist, insert it
      const { data: newChapter, error: insertError } = await supabase
        .from('chapters')
        .insert({
          chapter_number: chapterNumber,
          title: chapterTitle,
        })
        .select();

      if (insertError) throw insertError;
      chapterId = newChapter[0].id;
      log(`Inserted new chapter: ${chapterTitle} (ID: ${chapterId})`);
    }

    // Process each markdown file in the chapter directory
    const files = fs
      .readdirSync(chapterDir)
      .filter((file) => file.endsWith('.md'))
      .sort((a, b) => {
        const orderA = config.categories[a]?.order || 999;
        const orderB = config.categories[b]?.order || 999;
        return orderA - orderB;
      });

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      const categoryInfo = config.categories[file];
      if (!categoryInfo) {
        log(`Skipping unknown file: ${file}`, 'warn');
        continue;
      }

      const categoryId = categoryMap[categoryInfo.name];
      if (!categoryId) {
        logError(`Category not found: ${categoryInfo.name}`, {
          message: `Could not find category ${categoryInfo.name} in the database`,
        });
        continue;
      }

      const success = await processMarkdownFile(
        path.join(chapterDir, file),
        chapterId,
        categoryId
      );

      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    log(
      `Completed processing chapter ${chapterName}: ${successCount} files processed, ${errorCount} files had errors`
    );
    return errorCount === 0; // Chapter is successful only if all files processed without errors
  } catch (error) {
    logError(`Error processing chapter ${chapterName}`, error);
    return false;
  }
}

/**
 * Main migration function
 */
async function migrateData() {
  log('Starting migration...');

  try {
    // Update schema to ensure we have the required columns
    log('Ensuring database schema has required columns...');
    try {
      // Check if needed columns exist and add them if they don't
      const { error: error1 } = await supabase.rpc('execute_sql', {
        sql_query: `
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'checklist_items' AND column_name = 'is_header') THEN
              ALTER TABLE checklist_items ADD COLUMN is_header BOOLEAN DEFAULT false;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'checklist_items' AND column_name = 'header_level') THEN
              ALTER TABLE checklist_items ADD COLUMN header_level INTEGER;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'checklist_items' AND column_name = 'path') THEN
              ALTER TABLE checklist_items ADD COLUMN path TEXT;
            END IF;
          END $$;
        `,
      });

      if (error1) {
        log(
          'Warning: Could not verify schema columns. If they do not exist, the migration may fail.',
          'warn'
        );
        log(`Error details: ${error1.message}`, 'warn');
      } else {
        log('Schema columns verified/updated successfully');
      }
    } catch (error) {
      logError('Schema verification failed', error);
      // Continue with migration even if schema verification fails
    }

    // Insert categories first and get mapping
    const categoryMap = await insertCategories();

    // Get command line arguments
    const args = process.argv.slice(2);
    const testMode = args.includes('--test');
    const specificChapter = args
      .find((arg) => arg.startsWith('--chapter='))
      ?.split('=')[1];

    if (testMode) {
      log('Running in TEST MODE - no data will be inserted');
    }

    // Get all chapter directories
    let chapterDirs = [];

    if (specificChapter) {
      // Process a single chapter
      const chapterPath = path.join(config.markdownBasePath, specificChapter);
      if (
        fs.existsSync(chapterPath) &&
        fs.statSync(chapterPath).isDirectory()
      ) {
        chapterDirs = [chapterPath];
      } else {
        throw new Error(`Chapter directory not found: ${chapterPath}`);
      }
    } else {
      // Process all chapters
      chapterDirs = fs
        .readdirSync(config.markdownBasePath)
        .filter(
          (dir) =>
            dir.startsWith('Ch') &&
            fs.statSync(path.join(config.markdownBasePath, dir)).isDirectory()
        )
        .map((dir) => path.join(config.markdownBasePath, dir));
    }

    log(`Found ${chapterDirs.length} chapter directories to process`);

    // Process each chapter
    let successCount = 0;
    let errorCount = 0;

    for (const chapterDir of chapterDirs) {
      if (testMode) {
        log(`[TEST] Would process: ${path.basename(chapterDir)}`);
        successCount++;
        continue;
      }

      const success = await processChapter(chapterDir, categoryMap);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    log(
      `Migration completed: ${successCount} chapters processed successfully, ${errorCount} chapters had errors`
    );
    log(`Migration completed in ${(new Date() - startTime) / 1000} seconds`);
  } catch (error) {
    logError('Migration failed', error);
    process.exit(1);
  }
}

// Run the migration
migrateData().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
