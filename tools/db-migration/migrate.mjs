// tools/db-migration/migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import config from './config.mjs';
import { processItemText } from './parser.mjs';

// Get directory name for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      .select('title');

    if (fetchError) throw fetchError;

    const existingTitles = existingCategories.map((c) => c.title);

    // Prepare categories that don't already exist
    const categoriesToInsert = Object.entries(config.categories)
      .map(([_, { name, order }]) => ({
        title: name,
        display_order: order,
      }))
      .filter((c) => !existingTitles.includes(c.title));

    if (categoriesToInsert.length === 0) {
      log('All categories already exist, skipping insertion');
      return;
    }

    // Insert categories
    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select();

    if (error) throw error;

    log(`Inserted ${data.length} categories`);
  } catch (error) {
    logError('Error inserting categories', error);
    throw error;
  }
}

/**
 * Process a single chapter directory
 */
async function processChapter(chapterDir) {
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

    // Insert chapter
    const { data: chapters, error: chapterError } = await supabase
      .from('chapters')
      .upsert({
        chapter_number: chapterNumber,
        title: chapterTitle,
      })
      .select();

    if (chapterError) throw chapterError;

    const chapterId = chapters[0].id;
    log(`Inserted/updated chapter: ${chapterTitle} (ID: ${chapterId})`);

    // Get category mappings
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, title');

    if (categoryError) throw categoryError;

    // Create a map of category titles to IDs
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.title] = cat.id;
    });

    // Process each markdown file in the chapter directory
    const files = fs.readdirSync(chapterDir);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

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

      await processMarkdownFile(
        path.join(chapterDir, file),
        chapterId,
        categoryId
      );
    }

    log(`Completed processing chapter: ${chapterName}`);
    return true;
  } catch (error) {
    logError(`Error processing chapter ${chapterName}`, error);
    return false;
  }
}

/**
 * Process a single markdown file
 */
async function processMarkdownFile(filePath, chapterId, categoryId) {
  const fileName = path.basename(filePath);
  log(`Processing file: ${fileName}`);

  try {
    // Read and parse the file
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let currentSection = null;
    let currentSectionId = null;
    let currentSectionItems = [];
    let indentStack = []; // Track parent items based on indentation

    // Process the file line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) continue;

      // Section header (## heading)
      if (line.startsWith('## ')) {
        // If we have a previous section, insert its items
        if (currentSection && currentSectionItems.length > 0) {
          await insertChecklistItems(currentSectionItems, currentSectionId);
          currentSectionItems = [];
          indentStack = [];
        }

        const sectionTitle = line.substring(3).trim();

        // Insert the new section
        const { data: sections, error: sectionError } = await supabase
          .from('sections')
          .upsert({
            chapter_id: chapterId,
            category_id: categoryId,
            title: sectionTitle,
            display_order: i, // Use line number as display order
          })
          .select();

        if (sectionError) throw sectionError;

        currentSection = sectionTitle;
        currentSectionId = sections[0].id;
        log(
          `Inserted/updated section: ${sectionTitle} (ID: ${currentSectionId})`
        );
        continue;
      }

      // Checklist item (- [ ] item)
      const checklistMatch = line.match(/^(\s*)- \[ \] (.+)$/);
      if (checklistMatch && currentSection) {
        const indentStr = checklistMatch[1];
        const indentLevel = indentStr.length;
        const itemText = checklistMatch[2].trim();

        // Process the item text
        const processedItems = processItemText(itemText);

        // Update the indent stack
        while (
          indentStack.length > 0 &&
          indentStack[indentStack.length - 1].level >= indentLevel
        ) {
          indentStack.pop();
        }

        // Add items to the current section
        processedItems.forEach((item, idx) => {
          const parentItemId =
            indentStack.length > 0
              ? indentStack[indentStack.length - 1].id
              : null;

          // Generate a temporary ID for this item (used for parent references)
          const tempId = `temp_${i}_${idx}`;

          // Add to current section items
          currentSectionItems.push({
            tempId,
            section_id: currentSectionId,
            parent_item_id: parentItemId,
            display_order: i * 100 + idx, // Leave space for ordering within a group
            item_text: item.itemText,
            has_text_input: item.hasTextInput,
            input_label: null, // Could be extracted if needed
            input_placeholder: item.inputPlaceholder,
            input_unit: item.inputUnit,
            icd10_code: item.icd10Code,
          });

          // If this is the first item at this indent level, add it to the indent stack
          if (idx === 0) {
            indentStack.push({
              level: indentLevel,
              id: tempId,
            });
          }
        });
      }
    }

    // Insert any remaining items from the last section
    if (currentSectionItems.length > 0) {
      await insertChecklistItems(currentSectionItems, currentSectionId);
    }

    log(`Completed processing file: ${fileName}`);
    return true;
  } catch (error) {
    logError(`Error processing file ${filePath}`, error);
    return false;
  }
}

/**
 * Insert checklist items and resolve parent relationships
 */
async function insertChecklistItems(items, sectionId) {
  if (items.length === 0) return;

  log(`Inserting ${items.length} checklist items for section ${sectionId}`);

  try {
    // First pass: insert all items without parent references
    const itemsToInsert = items.map((item) => ({
      section_id: sectionId,
      parent_item_id: null, // Will update in second pass
      display_order: item.display_order,
      item_text: item.item_text,
      has_text_input: item.has_text_input,
      input_label: item.input_label,
      input_placeholder: item.input_placeholder,
      input_unit: item.input_unit,
      icd10_code: item.icd10_code,
    }));

    const { data: insertedItems, error: insertError } = await supabase
      .from('checklist_items')
      .insert(itemsToInsert)
      .select();

    if (insertError) throw insertError;

    // Create a mapping of temp IDs to actual database IDs
    const idMap = {};
    items.forEach((item, idx) => {
      idMap[item.tempId] = insertedItems[idx].id;
    });

    // Second pass: update parent references
    const updates = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.parent_item_id) {
        // Look up the actual parent ID
        const actualParentId = idMap[item.parent_item_id];
        if (!actualParentId) {
          log(
            `Warning: Parent ID not found for temp ID ${item.parent_item_id}`,
            'warn'
          );
          continue;
        }

        updates.push({
          id: insertedItems[i].id,
          parent_item_id: actualParentId,
        });
      }
    }

    // Perform updates if needed
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('checklist_items')
        .upsert(updates);

      if (updateError) throw updateError;

      log(`Updated ${updates.length} parent references`);
    }

    log(`Successfully inserted ${insertedItems.length} checklist items`);
  } catch (error) {
    logError(`Error inserting checklist items for section ${sectionId}`, error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrateData() {
  log('Starting migration...');

  try {
    // Insert categories first
    await insertCategories();

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

      const success = await processChapter(chapterDir);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    log(
      `Migration completed: ${successCount} chapters processed successfully, ${errorCount} chapters had errors`
    );
  } catch (error) {
    logError('Migration failed', error);
    process.exit(1);
  }
}

// Run the migration
migrateData();
