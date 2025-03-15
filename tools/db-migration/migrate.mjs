// tools/db-migration/migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import config from './config.mjs';

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
 * Process a single markdown file directly
 */
async function processMarkdownFile(filePath, chapterId, categoryId) {
  const fileName = path.basename(filePath);
  log(`Processing file: ${fileName}`);

  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let currentSection = null;
    let currentSectionId = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Process section headers
      if (line.startsWith('## ')) {
        const sectionTitle = line.substring(3).trim();

        try {
          // Insert section
          const { data: sections, error } = await supabase
            .from('sections')
            .upsert({
              chapter_id: chapterId,
              category_id: categoryId,
              title: sectionTitle,
              display_order: i,
            })
            .select();

          if (error) throw error;

          currentSection = sectionTitle;
          currentSectionId = sections[0].id;
          log(
            `Inserted/updated section: ${sectionTitle} (ID: ${currentSectionId})`
          );
        } catch (error) {
          logError(`Error creating section ${sectionTitle}`, error);
        }

        continue;
      }

      // Process checklist items
      if (line.startsWith('- [ ] ') && currentSectionId) {
        const checklistItems = [];
        let itemCount = 0;

        // Process all items at this level until we hit another section or end of file
        for (let j = i; j < lines.length; j++) {
          const itemLine = lines[j].trim();

          if (!itemLine || itemLine.startsWith('## ')) {
            break;
          }

          if (itemLine.startsWith('- [ ] ')) {
            // Just extract the text without complex parsing
            const itemText = itemLine.substring(6).trim();

            // Only capture simple attributes
            const hasTextInput = itemText.includes('_____');

            // Each item gets a unique, sequential display_order
            checklistItems.push({
              section_id: currentSectionId,
              parent_item_id: null,
              display_order: itemCount * 10, // GUARANTEED to be sequential
              item_text: itemText,
              has_text_input: hasTextInput,
              input_label: null,
              input_placeholder: null,
              input_unit: null,
              icd10_code: null,
            });

            itemCount++;
            i = j; // Skip this line in the outer loop
          }
        }

        // Insert all items for this section
        if (checklistItems.length > 0) {
          try {
            log(
              `Inserting ${checklistItems.length} checklist items for section ${currentSectionId}`
            );
            const { data, error } = await supabase
              .from('checklist_items')
              .insert(checklistItems)
              .select();

            if (error) throw error;

            log(`Successfully inserted ${data.length} checklist items`);
          } catch (error) {
            logError(
              `Error inserting checklist items for section ${currentSection}`,
              error
            );
          }
        }
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
