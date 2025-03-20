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

  // Fix Orientation assessment hierarchy
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

  // First pass: collect information about orientation assessment-related items
  let orientationAssessmentPath = null;
  let orientationAssessmentId = null;
  let orientationChildrenPaths = [];

  for (const [path, id] of Object.entries(itemIdByPath)) {
    // Check if this path contains item text (we'd need to fetch from DB)
    // For now we'll use the path format to guess
    if (path.includes('Orientation') || path.match(/\d+$/)) {
      // Fetch the item from DB to check its text
      try {
        const { data, error } = await supabase
          .from('checklist_items')
          .select('item_text')
          .eq('id', id)
          .single();

        if (!error && data) {
          if (data.item_text.includes('Orientation assessment')) {
            orientationAssessmentPath = path;
            orientationAssessmentId = id;
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
  }

  // Now process all parent-child relationships
  for (const [path, id] of Object.entries(itemIdByPath)) {
    // Skip root items
    if (!path.includes('.')) continue;

    let parentId = null;
    let specialFix = false;

    // Check if this is an orientation child that needs special handling
    if (
      orientationAssessmentId &&
      orientationChildrenPaths.includes(path) &&
      !path.startsWith(orientationAssessmentPath + '.')
    ) {
      // Apply special fix - use the orientation assessment as parent
      parentId = orientationAssessmentId;
      specialFix = true;
      log(
        `Applying special fix for orientation child: ${path} -> parent: ${orientationAssessmentPath}`
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

  // Verification step - check for specific orientation assessment hierarchy
  if (orientationAssessmentId) {
    log(`VERIFICATION: Checking final Orientation assessment hierarchy...`);

    try {
      // Get the orientation assessment children from DB
      const { data, error } = await supabase
        .from('checklist_items')
        .select('id, item_text')
        .eq('parent_item_id', orientationAssessmentId);

      if (error) throw error;

      log(
        `Found ${data.length} children for Orientation assessment in database:`
      );
      data.forEach((item) => {
        log(` - Child item: ${item.item_text} (ID: ${item.id})`);
      });

      // Check if we have all expected children
      const expectedChildren = ['Person:', 'Place:', 'Time:', 'Situation:'];
      const missingChildren = expectedChildren.filter(
        (text) => !data.some((item) => item.item_text.includes(text))
      );

      if (missingChildren.length > 0) {
        log(
          `WARNING: Missing expected children: ${missingChildren.join(', ')}`,
          'warn'
        );
      } else {
        log(`SUCCESS: All expected children found for Orientation assessment!`);
      }
    } catch (error) {
      logError(
        `Error during verification of Orientation assessment hierarchy`,
        error
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
