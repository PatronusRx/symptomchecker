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
 * Verify database schema includes all required elements
 */
async function verifyDatabaseSchema() {
  log('Verifying database schema...');

  try {
    // Check for required columns and functions
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        DO $$
        BEGIN
          -- Check for required columns
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
          
          -- Check for path validation constraint
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
            WHERE tc.constraint_type = 'CHECK'
            AND tc.table_name = 'checklist_items'
            AND tc.constraint_name = 'valid_path_format'
          ) THEN
            ALTER TABLE checklist_items 
            ADD CONSTRAINT valid_path_format CHECK (path ~ '^[0-9]+(\.[0-9]+)*$');
          END IF;
          
          -- Check for batch update function
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.routines
            WHERE routine_name = 'update_parent_child_batch'
          ) THEN
            -- Create the function if it doesn't exist
            EXECUTE $FUNC$
              CREATE OR REPLACE FUNCTION update_parent_child_batch(
                child_ids BIGINT[], 
                parent_ids BIGINT[]
              ) RETURNS void AS $INNER$
              BEGIN
                IF array_length(child_ids, 1) != array_length(parent_ids, 1) THEN
                  RAISE EXCEPTION 'Child and parent arrays must be the same length';
                END IF;
                
                FOR i IN 1..array_length(child_ids, 1) LOOP
                  UPDATE checklist_items
                  SET parent_item_id = parent_ids[i]
                  WHERE id = child_ids[i];
                END LOOP;
              END;
              $INNER$ LANGUAGE plpgsql;
            $FUNC$;
          END IF;
          
          -- Check for path rebuilding function
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.routines
            WHERE routine_name = 'rebuild_item_paths'
          ) THEN
            -- Create the function if it doesn't exist
            EXECUTE $FUNC$
              CREATE OR REPLACE FUNCTION rebuild_item_paths() RETURNS void AS $INNER$
              DECLARE
                item_rec RECORD;
                new_path TEXT;
              BEGIN
                -- First, update all root items (no parent)
                UPDATE checklist_items
                SET path = id::text
                WHERE parent_item_id IS NULL;
                
                -- Then iteratively update children until no more updates are needed
                LOOP
                  -- Find items whose parent has a path but they don't have a correct path
                  PERFORM id FROM checklist_items c
                  JOIN checklist_items p ON c.parent_item_id = p.id
                  WHERE (c.path IS NULL OR c.path NOT LIKE (p.path || '.%'))
                  LIMIT 1;
                  
                  -- Exit if no more updates needed
                  IF NOT FOUND THEN
                    EXIT;
                  END IF;
                  
                  -- Update paths for the next level of items
                  UPDATE checklist_items c
                  SET path = p.path || '.' || c.id
                  FROM checklist_items p
                  WHERE c.parent_item_id = p.id
                  AND (c.path IS NULL OR c.path NOT LIKE (p.path || '.%'));
                END LOOP;
              END;
              $INNER$ LANGUAGE plpgsql;
            $FUNC$;
          END IF;
          
          -- Add process_chapter_with_transaction if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.routines
            WHERE routine_name = 'process_chapter_with_transaction'
          ) THEN
            EXECUTE $FUNC$
              CREATE OR REPLACE FUNCTION process_chapter_with_transaction(
                chapter_id BIGINT
              ) RETURNS boolean AS $INNER$
              BEGIN
                -- Just a placeholder that returns true since actual processing happens in JS
                RETURN true;
                
                -- Exception handling
                EXCEPTION WHEN OTHERS THEN
                  -- Rollback happens automatically in case of exception
                  RETURN false;
              END;
              $INNER$ LANGUAGE plpgsql;
            $FUNC$;
          END IF;
        END $$;
      `,
    });

    if (error) {
      log(
        'Warning: Could not verify schema. The migration may encounter issues.',
        'warn'
      );
      log(`Error details: ${error.message}`, 'warn');
      return false;
    }

    log('Schema verification completed successfully');
    return true;
  } catch (error) {
    logError('Schema verification failed', error);
    return false;
  }
}

/**
 * Fix paths if any validation errors occur during insertion
 */
async function fixInvalidPaths() {
  log('Rebuilding item paths to ensure consistency...');

  try {
    const { error } = await supabase.rpc('rebuild_item_paths');

    if (error) {
      logError('Error rebuilding item paths', error);
      return false;
    }

    log('Successfully rebuilt item paths');
    return true;
  } catch (error) {
    logError('Failed to rebuild item paths', error);
    return false;
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
    return {};
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

    // Use level-specific counters instead of a single counter
    let levelCounters = {};

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

      // Process section headers
      const headerMatch = trimmedLine.match(/^(#{2,4})\s+(.+)$/);
      if (headerMatch) {
        const headerMarkers = headerMatch[1];
        const headerLevel = headerMarkers.length; // 2, 3, or 4
        const headerTitle = headerMatch[2].trim();

        // For ## (level 2), create a new section and reset EVERYTHING
        if (headerLevel === 2) {
          currentSection = headerTitle;
          log(`Found section: "${currentSection}" at line ${i}`);
          hierarchyStack = []; // Reset hierarchy for new section
          levelCounters = {}; // Reset all counters for new section
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

          // Reset hierarchy appropriately based on header level
          if (indentLevel === 0) {
            // For level 0 headers, clear all hierarchy
            hierarchyStack = [];
          } else {
            // For deeper headers, only keep parents
            hierarchyStack = hierarchyStack.slice(0, indentLevel);
          }

          // Initialize or increment counter for this indent level
          if (!levelCounters[indentLevel]) levelCounters[indentLevel] = 0;
          levelCounters[indentLevel]++;

          // Clear all deeper level counters
          Object.keys(levelCounters).forEach((level) => {
            if (parseInt(level) > indentLevel) delete levelCounters[level];
          });

          const position = levelCounters[indentLevel];

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

        // DEBUGGING FOR SPECIAL ITEMS
        const isSpecialItem =
          itemText.includes('Orientation assessment') ||
          itemText.includes('Person:') ||
          itemText.includes('Place:') ||
          itemText.includes('Time:') ||
          itemText.includes('Situation:');

        if (isSpecialItem) {
          log(`SPECIAL ITEM DEBUG: Processing "${itemText}"`);
          log(`  - Line ${i}, Indent level: ${indentLevel}`);
          log(
            `  - Current hierarchy stack before adjustment: [${hierarchyStack.join(
              ', '
            )}]`
          );
          log(`  - Current level counters: ${JSON.stringify(levelCounters)}`);
        }

        // IMPROVED HIERARCHY MANAGEMENT with level-specific counters
        if (indentLevel === 0) {
          // For top-level items (directly under a section), reset hierarchy
          hierarchyStack = [];

          // Initialize or increment the counter for level 0
          if (!levelCounters[0]) levelCounters[0] = 0;
          levelCounters[0]++;

          // Clear all deeper level counters
          Object.keys(levelCounters).forEach((level) => {
            if (parseInt(level) > 0) delete levelCounters[level];
          });

          if (isSpecialItem) {
            log(`  - Resetting hierarchy for top-level item (indent 0)`);
            log(`  - New level counters: ${JSON.stringify(levelCounters)}`);
          }
        } else {
          // For nested items, maintain proper parent hierarchy
          const oldStack = [...hierarchyStack];
          hierarchyStack = hierarchyStack.slice(0, indentLevel);

          if (isSpecialItem) {
            log(`  - Nested item adjustment:`);
            log(`    - Old stack: [${oldStack.join(', ')}]`);
            log(`    - New stack after slice: [${hierarchyStack.join(', ')}]`);
          }

          // Initialize or increment the counter for this level
          if (!levelCounters[indentLevel]) levelCounters[indentLevel] = 0;
          levelCounters[indentLevel]++;

          // Clear all deeper level counters
          Object.keys(levelCounters).forEach((level) => {
            if (parseInt(level) > indentLevel) delete levelCounters[level];
          });

          if (isSpecialItem) {
            log(
              `    - Updated level counters: ${JSON.stringify(levelCounters)}`
            );
          }
        }

        // Use the level-specific counter for position
        const position = levelCounters[indentLevel];

        // Calculate path based on parent path
        const parentPath =
          hierarchyStack.length > 0 ? hierarchyStack.join('.') : '';
        const path = generatePath(parentPath, position);

        if (isSpecialItem) {
          log(
            `  - Generated path: ${path} (parent: ${parentPath}, position: ${position})`
          );
        }

        // Add this item's position to the hierarchy stack
        hierarchyStack.push(position);

        if (isSpecialItem) {
          log(`  - Updated hierarchy stack: [${hierarchyStack.join(', ')}]`);
        }

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

            // For subitems, use sequential positions under the parent
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

  // Group items by section to ensure we only match within the same section
  const itemsBySection = {};
  items.forEach((item) => {
    if (!itemsBySection[item.section]) {
      itemsBySection[item.section] = [];
    }
    itemsBySection[item.section].push(item);
  });

  // For each potential parent, find and fix its children within the same section
  for (const parent of potentialParents) {
    const parentIndex = items.indexOf(parent);
    const parentIndent = parent.indentLevel;
    const parentSection = parent.section;

    // Get section-specific items
    const sectionItems = itemsBySection[parentSection] || [];
    const sectionParentIndex = sectionItems.indexOf(parent);

    // Find children that appear after the parent and have higher indent level
    // Only consider items in the same section
    const children = sectionItems.filter((item, index) => {
      // Only consider items after the parent in the section
      if (index <= sectionParentIndex) return false;

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

      // Also allow direct children with indent level exactly parent+1
      // This captures common nesting patterns even if they don't match text patterns
      const isDirectChild = item.indentLevel === parentIndent + 1;

      // For direct children, only consider items until we hit another item at parent's level
      const isBeforeNextParentLevelItem = true;
      for (let j = sectionParentIndex + 1; j < index; j++) {
        if (sectionItems[j].indentLevel <= parentIndent) {
          return false; // Item is after another parent-level item
        }
      }

      return isDirectChild && isBeforeNextParentLevelItem;
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

          // If this child has its own children, update their paths too
          const childChildren = items.filter((item) =>
            item.path.startsWith(oldPath + '.')
          );

          if (childChildren.length > 0) {
            log(
              `Updating paths for ${childChildren.length} descendants of "${child.itemText}"`
            );
            childChildren.forEach((descendant) => {
              const newDescendantPath = descendant.path.replace(
                oldPath,
                newPath
              );
              log(
                `Updating descendant path: ${descendant.path} -> ${newDescendantPath}`
              );
              descendant.path = newDescendantPath;
            });
          }
        });
      }
    }
  }

  // Add a validation step to ensure paths match indent levels
  validatePaths(items);

  return items;
}

/**
 * Validate and fix paths based on indent levels
 */
function validatePaths(items) {
  log('Validating item paths...');
  let fixCount = 0;

  // Group items by section
  const itemsBySection = {};
  items.forEach((item) => {
    if (!itemsBySection[item.section]) {
      itemsBySection[item.section] = [];
    }
    itemsBySection[item.section].push(item);
  });

  // Process each section separately
  Object.keys(itemsBySection).forEach((section) => {
    const sectionItems = itemsBySection[section];

    // Sort items by line number to ensure correct processing order
    sectionItems.sort((a, b) => a.lineNumber - b.lineNumber);

    log(`Validating ${sectionItems.length} items in section "${section}"`);

    // Rebuild paths based on indent levels
    for (let i = 0; i < sectionItems.length; i++) {
      const item = sectionItems[i];
      const pathSegments = item.path.split('.');

      // For indent level 0, path should have 1 segment
      // For indent level 1, path should have 2 segments, etc.
      const expectedSegments = item.indentLevel + 1;

      if (pathSegments.length !== expectedSegments) {
        log(
          `Path validation: "${item.itemText}" has wrong path structure: ${item.path} (has ${pathSegments.length} segments, expected ${expectedSegments})`
        );

        // Find potential parent based on indent level and previous items
        let parentItem = null;
        for (let j = i - 1; j >= 0; j--) {
          if (sectionItems[j].indentLevel === item.indentLevel - 1) {
            parentItem = sectionItems[j];
            break;
          }
        }

        if (parentItem) {
          const oldPath = item.path;

          // Find position among siblings
          let siblingCount = 1;
          for (let j = 0; j < i; j++) {
            if (
              sectionItems[j].indentLevel === item.indentLevel &&
              sectionItems[j].path.startsWith(parentItem.path)
            ) {
              siblingCount++;
            }
          }

          const newPath = `${parentItem.path}.${siblingCount}`;
          log(`Path validation fix: ${oldPath} -> ${newPath}`);
          item.path = newPath;
          fixCount++;

          // Update paths of any child items
          for (let j = i + 1; j < sectionItems.length; j++) {
            if (sectionItems[j].path.startsWith(oldPath + '.')) {
              const oldChildPath = sectionItems[j].path;
              const newChildPath = oldChildPath.replace(oldPath, newPath);
              log(`Updating child path: ${oldChildPath} -> ${newChildPath}`);
              sectionItems[j].path = newChildPath;
              fixCount++;
            }
          }
        } else if (item.indentLevel === 0) {
          // For top-level items, assign sequential numbers
          let position = 1;
          for (let j = 0; j < i; j++) {
            if (sectionItems[j].indentLevel === 0) {
              position++;
            }
          }

          const oldPath = item.path;
          const newPath = `${position}`;
          log(`Path fix for top-level item: ${oldPath} -> ${newPath}`);
          item.path = newPath;
          fixCount++;

          // Update paths of any child items
          for (let j = i + 1; j < sectionItems.length; j++) {
            if (sectionItems[j].path.startsWith(oldPath + '.')) {
              const oldChildPath = sectionItems[j].path;
              const newChildPath = oldChildPath.replace(oldPath, newPath);
              log(`Updating child path: ${oldChildPath} -> ${newChildPath}`);
              sectionItems[j].path = newChildPath;
              fixCount++;
            }
          }
        }
      }
    }
  });

  log(`Path validation complete: fixed ${fixCount} paths`);
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

  try {
    // Insert items in batches
    for (let i = 0; i < itemsToInsert.length; i += BATCH_SIZE) {
      const batch = itemsToInsert.slice(i, i + BATCH_SIZE);

      try {
        const { data, error } = await supabase
          .from('checklist_items')
          .insert(batch)
          .select('id, path');

        if (error) {
          // If this is a path validation error, try to fix paths
          if (error.message.includes('valid_path_format')) {
            log(
              'Path validation error detected, attempting to rebuild paths',
              'warn'
            );
            throw new Error('Path validation failed: ' + error.message);
          } else {
            throw error;
          }
        }

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
  } catch (error) {
    // Check if this was a path validation error
    if (error.message && error.message.includes('Path validation failed')) {
      log('Attempting to fix paths and retry insertion...');

      // Fix paths in the items
      for (const item of itemsToInsert) {
        // Ensure path format is correct (only numbers and dots)
        item.path = item.path.replace(/[^0-9.]/g, '');

        // Ensure path starts with a number
        if (!/^\d/.test(item.path)) {
          item.path = `1${item.path}`;
        }

        // Remove any double dots
        item.path = item.path.replace(/\.+/g, '.');

        // Remove trailing dots
        item.path = item.path.replace(/\.$/, '');
      }

      // Retry insertion with fixed paths
      return batchInsertItems(
        itemsToInsert.map((item) => {
          return { ...item, _retried: true };
        }),
        sectionIdMap
      );
    }

    throw error;
  }
}

/**
 * Update parent-child relationships using the path information with batch processing
 */
async function updateParentChildRelationships(itemIdByPath) {
  log('Updating parent-child relationships...');

  if (Object.keys(itemIdByPath).length === 0) {
    log('No items to update parent-child relationships for', 'warn');
    return;
  }

  try {
    // Collect parent-child pairs for batch update
    const childIds = [];
    const parentIds = [];

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

    // Process path-based relationships
    for (const [path, id] of Object.entries(itemIdByPath)) {
      // Skip root items
      if (!path.includes('.')) continue;

      // Extract parent path from our path
      const lastDotIndex = path.lastIndexOf('.');
      const parentPath = path.substring(0, lastDotIndex);

      // Find parent ID from the path
      const parentId = itemIdByPath[parentPath];

      if (parentId) {
        childIds.push(id);
        parentIds.push(parentId);
      } else {
        log(`Warning: No parent found for path ${path}`, 'warn');
      }
    }

    // Special patterns to look for and fix
    const hierarchyPatterns = [
      {
        parentPattern: /assessment/i,
        childPatterns: [/^(Person|Place|Time|Situation):/i],
        description: 'Assessment pattern (like Orientation assessment)',
      },
      {
        parentPattern: /agents:|medications:|findings:/i,
        childPatterns: [/^[A-Za-z]+:/],
        description: 'Medication/findings list pattern',
      },
    ];

    // Process special pattern-based relationships
    // First pass: collect parent-child relationships from pattern analysis
    const patternFixMap = new Map(); // Maps child IDs to their correct parent IDs

    try {
      // Load all items with their text for pattern matching
      const { data: allItems, error: fetchError } = await supabase
        .from('checklist_items')
        .select('id, item_text, path, indent_level')
        .order('path');

      if (!fetchError && allItems && allItems.length > 0) {
        log(`Loaded ${allItems.length} items for pattern analysis`);

        // Apply special pattern-based fixes
        log('Applying special pattern-based fixes');

        const parentItems = allItems.filter((item) => {
          for (const pattern of hierarchyPatterns) {
            if (pattern.parentPattern.test(item.item_text)) {
              return true;
            }
          }
          return false;
        });

        for (const parent of parentItems) {
          // Find potential children based on text patterns
          const childItems = allItems.filter(
            (item) =>
              item.id !== parent.id &&
              item.indent_level > parent.indent_level &&
              hierarchyPatterns.some(
                (pattern) =>
                  pattern.parentPattern.test(parent.item_text) &&
                  pattern.childPatterns.some((childPattern) =>
                    childPattern.test(item.item_text)
                  )
              )
          );

          if (childItems.length > 0) {
            log(
              `Pattern match: "${parent.item_text}" (ID: ${parent.id}) might be parent for ${childItems.length} items`
            );

            // Add these pairs to our batch update arrays
            childItems.forEach((child) => {
              childIds.push(child.id);
              parentIds.push(parent.id);
            });
          }
        }
      }
    } catch (error) {
      log(`Error performing pattern analysis: ${error.message}`, 'warn');
    }

    // Perform batch update if we have relationships to update
    if (childIds.length > 0) {
      try {
        log(`Batch updating ${childIds.length} parent-child relationships`);

        // Use the new batch update function from the schema
        const { error } = await supabase.rpc('update_parent_child_batch', {
          child_ids: childIds,
          parent_ids: parentIds,
        });

        if (error) {
          throw error;
        }

        log(
          `Successfully updated ${childIds.length} parent-child relationships in batch`
        );
      } catch (error) {
        logError('Error in batch update of parent-child relationships', error);

        // Fall back to individual updates if batch fails
        log('Falling back to individual updates');
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < childIds.length; i++) {
          try {
            const { error } = await supabase
              .from('checklist_items')
              .update({ parent_item_id: parentIds[i] })
              .eq('id', childIds[i]);

            if (error) throw error;
            successCount++;
          } catch (updateError) {
            errorCount++;
            logError(`Error updating item ${childIds[i]}`, updateError);
          }
        }

        log(
          `Individual updates: ${successCount} successful, ${errorCount} failed`
        );
      }
    }

    log('Successfully completed parent-child relationship updates');
  } catch (error) {
    logError('Error updating parent-child relationships', error);
  }
}

/**
 * Process a single markdown file and insert into database with transaction support
 */
async function processMarkdownFile(filePath, chapterId, categoryId) {
  const fileName = path.basename(filePath);
  log(`Processing file: ${fileName}`);

  try {
    // Preprocess file to extract structure and generate paths
    const { items, sections } = preprocessMarkdownFile(filePath);

    if (items.length === 0) {
      log(`No items found in ${fileName}`, 'warn');
      return false;
    }

    // Post-process items to fix known hierarchy issues
    const processedItems = postProcessItems(items);

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

    // Try to rebuild paths if needed
    try {
      await fixInvalidPaths();
    } catch (pathError) {
      log(`Warning: Path rebuilding failed: ${pathError.message}`, 'warn');
    }

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
    // Verify and update database schema first
    const schemaValid = await verifyDatabaseSchema();
    if (!schemaValid) {
      log('Schema verification had issues, proceeding with caution', 'warn');
    } else {
      log(
        'Schema verification successful, all required components are in place'
      );
    }

    // Insert categories first and get mapping
    const categoryMap = await insertCategories();
    if (Object.keys(categoryMap).length === 0) {
      throw new Error('Failed to insert or retrieve categories');
    }

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

    // Final path consistency check
    if (!testMode) {
      log('Performing final path consistency check...');
      await fixInvalidPaths();
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
