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
 * Extremely simplified markdown file processor
 */
async function processMarkdownFile(filePath, chapterId, categoryId) {
  const fileName = path.basename(filePath);
  log(`Processing file: ${fileName}`);

  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');

    // Split into sections
    const sections = content.split(/^## /m).filter(Boolean);

    // Process each section
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const sectionText = sections[sectionIndex];
      const sectionLines = sectionText.split('\n');

      // First line is section title
      const sectionTitle = sectionLines[0].trim();

      try {
        // Insert the section
        const { data: insertedSections, error: sectionError } = await supabase
          .from('sections')
          .upsert({
            chapter_id: chapterId,
            category_id: categoryId,
            title: sectionTitle,
            display_order: sectionIndex,
          })
          .select();

        if (sectionError) {
          throw sectionError;
        }

        const sectionId = insertedSections[0].id;
        log(`Inserted/updated section: ${sectionTitle} (ID: ${sectionId})`);

        // Extract all checklist items
        const checklistItems = [];
        const indentMap = new Map(); // Map of indent levels to item IDs

        for (let i = 1; i < sectionLines.length; i++) {
          const line = sectionLines[i];
          const match = line.match(/^(\s*)- \[ \] (.+)$/);

          if (match) {
            const indent = match[1].length;
            const text = match[2].trim();

            // Find parent based on indent level
            let parentId = null;
            for (let level = indent - 2; level >= 0; level -= 2) {
              if (indentMap.has(level)) {
                parentId = indentMap.get(level);
                break;
              }
            }

            // Create item with a GUARANTEED display order
            const tempId = `temp_${sectionIndex}_${i}`;
            const item = {
              tempId,
              section_id: sectionId,
              parent_item_id: parentId,
              display_order: i * 10, // Simple, sequential ordering
              item_text: text,
              has_text_input: text.includes('_____'),
              input_placeholder: null,
              input_unit: null,
              icd10_code: null,
            };

            // Extract ICD10 codes if present
            const icd10Match = text.match(
              /\(([A-Z][0-9]{2}(?:\.[0-9]{1,2})?)\)$/
            );
            if (icd10Match) {
              item.icd10_code = icd10Match[1];
              item.item_text = text.replace(
                /\s*\([A-Z][0-9]{2}(?:\.[0-9]{1,2})?\)$/,
                ''
              );
            }

            // Extract unit information if this is an input field
            if (item.has_text_input) {
              const unitMatch = text.match(/_+\s*([^_]+?)$/);
              if (unitMatch && unitMatch[1]) {
                item.input_unit = unitMatch[1].trim();
              }
            }

            checklistItems.push(item);

            // Store this item as a potential parent
            indentMap.set(indent, tempId);
          }
        }

        // Insert all items for this section
        if (checklistItems.length > 0) {
          log(
            `Inserting ${checklistItems.length} checklist items for section ${sectionId}`
          );

          // First insert all items without parent references
          const itemsToInsert = checklistItems.map((item, idx) => ({
            section_id: item.section_id,
            parent_item_id: null, // Will update in second pass
            display_order: item.display_order || idx * 10, // Force valid display_order
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

          if (insertError) {
            throw insertError;
          }

          // Create ID mapping for parent updates
          const idMap = {};
          checklistItems.forEach((item, idx) => {
            idMap[item.tempId] = insertedItems[idx].id;
          });

          // Update parent relationships
          const parentUpdates = [];

          for (let i = 0; i < checklistItems.length; i++) {
            const item = checklistItems[i];
            if (item.parent_item_id) {
              const actualParentId = idMap[item.parent_item_id];
              if (actualParentId) {
                parentUpdates.push({
                  id: insertedItems[i].id,
                  parent_item_id: actualParentId,
                });
              }
            }
          }

          if (parentUpdates.length > 0) {
            const { error: updateError } = await supabase
              .from('checklist_items')
              .upsert(parentUpdates);

            if (updateError) {
              throw updateError;
            }

            log(`Updated ${parentUpdates.length} parent references`);
          }

          log(`Successfully inserted ${insertedItems.length} checklist items`);
        }
      } catch (error) {
        logError(`Error processing section ${sectionTitle}`, error);
        // Continue with next section
      }
    }

    log(`Completed processing file: ${fileName}`);
    return true;
  } catch (error) {
    logError(`Error processing file ${filePath}`, error);
    return false;
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
