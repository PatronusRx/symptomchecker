// tools/db-migration/migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import config from './config.mjs';
import { processItemText, splitMultipleInputs } from './parser.mjs';

// Add category number mapping
config.categoryNumbers = {
  1: 'History',
  2: 'Alarm Features',
  3: 'Medications',
  4: 'Diet',
  5: 'Review of Systems',
  6: 'Collateral History',
  7: 'Risk Factors',
  8: 'Differential Diagnosis',
  9: 'Past Medical History',
  10: 'Physical Exam',
  11: 'Lab Studies',
  12: 'Imaging',
  13: 'Special Tests',
  14: 'ECG',
  15: 'Assessment',
  16: 'Plan',
  17: 'Disposition',
  18: 'Patient Education',
};

// Create reverse mapping for name to number lookup
config.categoryNameToNumber = {};
Object.entries(config.categoryNumbers).forEach(([num, name]) => {
  config.categoryNameToNumber[name.toLowerCase()] = num;
});

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

    // Create a comprehensive category list from both numbered mapping and config
    const allCategories = new Set();

    // Add numbered categories
    Object.values(config.categoryNumbers).forEach((name) => {
      allCategories.add(name);
    });

    // Add categories from config
    Object.entries(config.categories).forEach(([, { name }]) => {
      allCategories.add(name);
    });

    // Prepare categories that don't already exist
    const categoriesToInsert = [];

    allCategories.forEach((name) => {
      if (!existingTitles.includes(name)) {
        // Find the order from config if it exists, otherwise use default order based on number
        let order = 999;

        // Look for order in config.categories
        for (const [, info] of Object.entries(config.categories)) {
          if (info.name === name) {
            order = info.order;
            break;
          }
        }

        // If not found in config, try to get order from number mapping
        if (order === 999) {
          for (const [num, catName] of Object.entries(config.categoryNumbers)) {
            if (catName === name) {
              order = parseInt(num, 10) * 10;
              break;
            }
          }
        }

        categoriesToInsert.push({
          title: name,
          display_order: order,
        });
      }
    });

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
    let currentCategoryNumber = null;
    let currentCategoryName = null;

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

      // Check for top-level category headers (both numbered and simple formats)
      const numberedCategoryMatch = trimmedLine.match(/^# (\d+)\. (.+)$/);
      const simpleCategoryMatch = trimmedLine.match(/^# (.+)$/);

      if (numberedCategoryMatch) {
        // Format: # 1. History
        currentCategoryNumber = numberedCategoryMatch[1].trim();
        const categoryTitle = numberedCategoryMatch[2].trim();

        // Map the number to a known category name
        currentCategoryName =
          config.categoryNumbers[currentCategoryNumber] || categoryTitle;

        log(`Found numbered category: "${currentCategoryName}" at line ${i}`);

        // Reset section and hierarchy when a new category starts
        currentSection = null;
        hierarchyStack = [];
        levelCounters = {};
        continue;
      } else if (simpleCategoryMatch && !trimmedLine.match(/^# \d+\./)) {
        // Format: # History (but not a numbered category)
        const categoryTitle = simpleCategoryMatch[1].trim();

        // Look up category by name
        currentCategoryName = categoryTitle;
        currentCategoryNumber =
          config.categoryNameToNumber[categoryTitle.toLowerCase()] || null;

        log(`Found simple category: "${currentCategoryName}" at line ${i}`);

        // Reset section and hierarchy when a new category starts
        currentSection = null;
        hierarchyStack = [];
        levelCounters = {};
        continue;
      }

      // Skip processing if no category found yet
      if (!currentCategoryName) continue;

      // Extract section headers (## headers)
      if (trimmedLine.startsWith('## ')) {
        currentSection = trimmedLine.substring(3).trim();
        log(
          `Found section: "${currentSection}" in category "${currentCategoryName}" at line ${i}`
        );
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
          categoryName: currentCategoryName,
          categoryNumber: currentCategoryNumber,
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
          categoryName: currentCategoryName,
          categoryNumber: currentCategoryNumber,
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
              categoryName: currentCategoryName,
              categoryNumber: currentCategoryNumber,
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

    // Get unique categories and sections
    const categories = [...new Set(items.map((item) => item.categoryName))];
    const sections = [];

    // Create unique section identifiers that include category
    items.forEach((item) => {
      const sectionKey = `${item.categoryName}|||${item.section}`;
      if (!sections.includes(sectionKey)) {
        sections.push(sectionKey);
      }
    });

    log(
      `Found ${categories.length} categories in file: ${categories.join(', ')}`
    );
    log(`Found ${sections.length} unique category-section combinations`);

    return { items, categories, sections };
  } catch (error) {
    logError(`Error preprocessing file ${filePath}`, error);
    return { items: [], categories: [], sections: [] };
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

  // Prepare all items for insertion - filter out items with missing section IDs
  const itemsToInsert = items
    .map((item) => {
      const sectionKey = `${item.categoryName}|||${item.section}`;
      const sectionId = sectionIdMap[sectionKey];

      if (!sectionId) {
        log(
          `Warning: No section ID found for item in category "${item.categoryName}", section "${item.section}" - item will be skipped`,
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
async function processMarkdownFile(filePath, chapterId, categoryMap) {
  const fileName = path.basename(filePath);
  log(`Processing file: ${fileName}`);

  try {
    // Preprocess file to extract structure and generate paths
    const { items, categories, sections } = preprocessMarkdownFile(filePath);

    if (items.length === 0) {
      log(`No items found in ${fileName}`, 'warn');
      return false;
    }

    // Create section mapping
    const sectionIdMap = {};

    // Process each category found in the file
    for (const categoryName of categories) {
      // Find category ID from the map
      const categoryId = categoryMap[categoryName];

      if (!categoryId) {
        log(
          `Warning: No category ID found for "${categoryName}" - skipping category`,
          'warn'
        );
        continue;
      }

      // Get sections for this category
      const categorySections = [
        ...new Set(
          items
            .filter((item) => item.categoryName === categoryName)
            .map((item) => item.section)
        ),
      ];

      // Insert or update sections for this category
      for (let i = 0; i < categorySections.length; i++) {
        const sectionTitle = categorySections[i];

        // Skip empty section titles
        if (!sectionTitle || sectionTitle.trim() === '') {
          log(
            `Warning: Empty section title found in category "${categoryName}", skipping`,
            'warn'
          );
          continue;
        }

        log(
          `Attempting to insert section: "${sectionTitle}" for category "${categoryName}"`
        );

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

          // Store section ID with category+section as key
          const sectionKey = `${categoryName}|||${sectionTitle}`;
          sectionIdMap[sectionKey] = sectionData[0].id;
          log(
            `Inserted/updated section: ${sectionTitle} in category ${categoryName} (ID: ${sectionData[0].id})`
          );
        } catch (error) {
          log(
            `Exception when inserting section "${sectionTitle}": ${error.message}`,
            'error'
          );
          continue;
        }
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
    // Use the directory name as the chapter title
    const chapterTitle = chapterName;

    // Generate a chapter number based on directory index or keep track in a map
    let chapterNumber;

    // Check if we have a chapter number mapping
    if (!config.chapterNumberMap) {
      config.chapterNumberMap = {};
      config.nextChapterNumber = 1;
    }

    // Look up chapter number or assign a new one
    if (config.chapterNumberMap[chapterTitle]) {
      chapterNumber = config.chapterNumberMap[chapterTitle];
    } else {
      chapterNumber = config.nextChapterNumber++;
      config.chapterNumberMap[chapterTitle] = chapterNumber;
    }

    log(`Using chapter number ${chapterNumber} for "${chapterTitle}"`);

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
      .sort();

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      const success = await processMarkdownFile(
        path.join(chapterDir, file),
        chapterId,
        categoryMap
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
      // Process all directories in the markdownBasePath
      chapterDirs = fs
        .readdirSync(config.markdownBasePath)
        .filter((dir) =>
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
