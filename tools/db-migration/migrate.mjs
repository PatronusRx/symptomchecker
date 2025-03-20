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
 * Generate a simple path based on hierarchy stack and current position
 */
function generateSimplePath(stack, position) {
  return stack.length > 0 ? `${stack.join('.')}.${position}` : `${position}`;
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

    // Reset counters for each level when a new section starts
    let levelCounters = {};

    // Track hierarchy with a simple array
    let hierarchyStack = [];

    // Process the file line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) continue;

      // Extract title from first line (# 1. History) - we skip this
      if (i === 0 && trimmedLine.startsWith('# ')) {
        continue;
      }

      // Extract section headers (## headers)
      if (trimmedLine.startsWith('## ')) {
        currentSection = trimmedLine.substring(3).trim();
        log(`Found section: "${currentSection}" at line ${i}`);
        // Reset everything when a new section starts
        hierarchyStack = [];
        levelCounters = {};
        continue;
      }

      // Process subheaders (### and ####)
      if (trimmedLine.startsWith('### ') || trimmedLine.startsWith('#### ')) {
        if (!currentSection) {
          log(
            `Warning: Found header without a parent section at line ${i}, using default section`,
            'warn'
          );
          currentSection = 'Default Section';
        }

        const headerLevel = trimmedLine.startsWith('### ') ? 3 : 4;
        const headerTitle = trimmedLine.substring(headerLevel + 1).trim();
        const indentLevel = headerLevel - 3; // ### = level 0, #### = level 1

        // Reset hierarchy for this level
        hierarchyStack = hierarchyStack.slice(0, indentLevel);

        // Get/update counter for this level
        if (!levelCounters[indentLevel]) levelCounters[indentLevel] = 0;
        levelCounters[indentLevel]++;

        // Reset deeper counters
        Object.keys(levelCounters).forEach((level) => {
          if (parseInt(level) > indentLevel) delete levelCounters[level];
        });

        // Generate path
        const path = generateSimplePath(
          hierarchyStack,
          levelCounters[indentLevel]
        );
        hierarchyStack.push(levelCounters[indentLevel]);

        log(`Header "${headerTitle}" with path ${path}, level: ${indentLevel}`);

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
        const indentLevel = Math.floor(indentStr.length / 2);
        const itemText = checklistMatch[2].trim();

        // Reset hierarchy for this level
        hierarchyStack = hierarchyStack.slice(0, indentLevel);

        // Get/update counter for this level
        if (!levelCounters[indentLevel]) levelCounters[indentLevel] = 0;
        levelCounters[indentLevel]++;

        // Reset deeper counters
        Object.keys(levelCounters).forEach((level) => {
          if (parseInt(level) > indentLevel) delete levelCounters[level];
        });

        // Generate simple path
        const path = generateSimplePath(
          hierarchyStack,
          levelCounters[indentLevel]
        );

        // Add this item's position to the hierarchy stack
        hierarchyStack.push(levelCounters[indentLevel]);

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
            const subPath = `${path}.${j}`;

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

    return { items, sections };
  } catch (error) {
    logError(`Error preprocessing file ${filePath}`, error);
    return { items: [], sections: [] };
  }
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
  log('Updating parent-child relationships based on paths...');

  if (Object.keys(itemIdByPath).length === 0) {
    log('No items to update parent-child relationships for', 'warn');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

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

  // For each item with a path containing dots, find its parent
  for (const [path, id] of Object.entries(itemIdByPath)) {
    // Skip root items (no dots in path)
    if (!path.includes('.')) continue;

    // Extract parent path (everything before the last dot)
    const lastDotIndex = path.lastIndexOf('.');
    const parentPath = path.substring(0, lastDotIndex);
    const parentId = itemIdByPath[parentPath];

    if (!parentId) {
      log(`Warning: No parent found for path ${path}`, 'warn');
      continue;
    }

    // Update the parent relationship in the database
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
    `Completed parent-child relationship updates: ${successCount} successful, ${errorCount} failed`
  );
}

/**
 * Process a single markdown file and insert into database
 */
async function processMarkdownFile(filePath, chapterId, categoryId) {
  const fileName = path.basename(filePath);
  log(`Processing file: ${fileName}`);

  try {
    // Start a transaction for this file
    log(`Starting transaction for file: ${fileName}`);

    // Preprocess file to extract structure and generate paths
    const { items, sections } = preprocessMarkdownFile(filePath);

    if (items.length === 0) {
      log(`No items found in ${fileName}`, 'warn');
      return false;
    }

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
      items,
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
