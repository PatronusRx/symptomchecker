import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import config from './config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
 * Recursively insert checklist items with proper parent-child relationships
 */
async function insertChecklistItems(
  items,
  sectionId,
  parentId = null,
  displayOrderBase = 0
) {
  let insertedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const displayOrder = displayOrderBase + i * 10;

    try {
      // Insert the main item
      const { data, error } = await supabase
        .from('checklist_items')
        .insert({
          section_id: sectionId,
          parent_item_id: parentId,
          display_order: displayOrder,
          item_text: item.text,
          indent_level: item.indentLevel,
          has_text_input: item.hasTextInput,
          input_label: item.inputLabel,
          input_placeholder: item.inputPlaceholder,
          input_unit: item.inputUnit,
          icd10_code: item.icd10Code,
        })
        .select();

      if (error) throw error;

      insertedCount++;
      const newItemId = data[0].id;

      // If this is a multi-input item, insert the split items as children
      if (item.multipleInputs && item.multipleInputs.length > 1) {
        for (let j = 1; j < item.multipleInputs.length; j++) {
          const splitItem = item.multipleInputs[j];

          const { error: splitError } = await supabase
            .from('checklist_items')
            .insert({
              section_id: sectionId,
              parent_item_id: newItemId,
              display_order: displayOrder + j,
              item_text: splitItem.text,
              indent_level: item.indentLevel + 1,
              has_text_input: splitItem.hasTextInput,
              input_label: splitItem.inputLabel,
              input_placeholder: splitItem.inputPlaceholder,
              input_unit: splitItem.inputUnit,
              icd10_code: splitItem.icd10Code,
            });

          if (splitError) throw splitError;
          insertedCount++;
        }
      }

      // Recursively insert children
      if (item.children && item.children.length > 0) {
        const childrenCount = await insertChecklistItems(
          item.children,
          sectionId,
          newItemId,
          displayOrder + 100 // Leave space between items and their children
        );
        insertedCount += childrenCount;
      }
    } catch (error) {
      logError(`Error inserting checklist item: ${item.text}`, error);
    }
  }

  return insertedCount;
}

/**
 * Process a JSON file and insert data into the database
 */
async function processJsonFile(jsonFilePath) {
  log(`Processing JSON file: ${jsonFilePath}`);

  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Insert chapter
    const { data: chapters, error: chapterError } = await supabase
      .from('chapters')
      .upsert({
        chapter_number: jsonData.number,
        title: jsonData.title,
      })
      .select();

    if (chapterError) throw chapterError;

    const chapterId = chapters[0].id;
    log(`Inserted/updated chapter: ${jsonData.title} (ID: ${chapterId})`);

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

    // Process each category
    for (const categoryData of jsonData.categories) {
      const categoryName = categoryData.category.name;
      const categoryId = categoryMap[categoryName];

      if (!categoryId) {
        logError(`Category not found: ${categoryName}`, {
          message: `Could not find category ${categoryName} in the database`,
        });
        continue;
      }

      log(`Processing category: ${categoryName}`);

      // Process each section
      for (let i = 0; i < categoryData.sections.length; i++) {
        const section = categoryData.sections[i];

        // Insert section
        const { data: sections, error: sectionError } = await supabase
          .from('sections')
          .upsert({
            chapter_id: chapterId,
            category_id: categoryId,
            title: section.title,
            display_order: i * 10,
          })
          .select();

        if (sectionError) throw sectionError;

        const sectionId = sections[0].id;
        log(`Inserted/updated section: ${section.title} (ID: ${sectionId})`);

        // Insert all checklist items for this section
        const itemCount = await insertChecklistItems(section.items, sectionId);
        log(
          `Inserted ${itemCount} checklist items for section ${section.title}`
        );
      }
    }

    log(`Completed processing file: ${jsonFilePath}`);
    return true;
  } catch (error) {
    logError(`Error processing JSON file ${jsonFilePath}`, error);
    return false;
  }
}

/**
 * Main migration function
 */
async function migrateData() {
  log('Starting migration from JSON to database...');

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

    // Get JSON files
    const jsonDir = path.join(__dirname, 'json');
    if (!fs.existsSync(jsonDir)) {
      throw new Error(
        `JSON directory not found: ${jsonDir}. Run markdown-to-json.mjs first.`
      );
    }

    let jsonFiles = [];

    if (specificChapter) {
      const specificFile = path.join(jsonDir, `Ch${specificChapter}_*.json`);
      const matchingFiles = fs
        .readdirSync(jsonDir)
        .filter(
          (file) =>
            file.startsWith(`Ch${specificChapter}_`) && file.endsWith('.json')
        )
        .map((file) => path.join(jsonDir, file));

      if (matchingFiles.length === 0) {
        throw new Error(`No JSON file found for chapter ${specificChapter}`);
      }

      jsonFiles = matchingFiles;
    } else {
      jsonFiles = fs
        .readdirSync(jsonDir)
        .filter((file) => file.endsWith('.json') && file.startsWith('Ch'))
        .map((file) => path.join(jsonDir, file));
    }

    log(`Found ${jsonFiles.length} JSON files to process`);

    // Process each JSON file
    let successCount = 0;
    let errorCount = 0;

    for (const jsonFile of jsonFiles) {
      if (testMode) {
        log(`[TEST] Would process: ${path.basename(jsonFile)}`);
        successCount++;
        continue;
      }

      const success = await processJsonFile(jsonFile);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    log(
      `Migration completed: ${successCount} files processed successfully, ${errorCount} files had errors`
    );
  } catch (error) {
    logError('Migration failed', error);
    process.exit(1);
  }
}

// Run the migration
migrateData().catch(console.error);
