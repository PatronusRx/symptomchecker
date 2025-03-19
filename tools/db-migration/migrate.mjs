// tools/db-migration/migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import config from './config.mjs';
import { processItemText, splitMultipleInputs } from './parser.mjs';

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
      .map(([_, { name, order }]) => ({
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
 * Process a single markdown file and directly insert into database
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

    // Track most recent item at each indent level (simplified approach)
    let previousItemsByIndent = {};

    // Track all headers (## / ### / ####) in the same simplified structure
    let currentHeadersByLevel = {
      2: { text: null, id: null },
      3: { text: null, id: null },
      4: { text: null, id: null },
    };

    // Treat special headers (##, ###, etc.) as items with specific indentation levels
    // This simplifies the hierarchy model
    const headerIndentMap = {
      2: -2, // ## headers are level -2 (above all items)
      3: -1, // ### headers are level -1 (between ## and top-level items)
      4: 0, // #### headers are level 0 (same as top-level items)
    };

    // Process the file line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) continue;

      // Skip the title line (# 1. History)
      if (trimmedLine.startsWith('# ')) continue;

      // Process all header levels
      const headerMatch = trimmedLine.match(/^(#{2,4})\s+(.+)$/);
      if (headerMatch) {
        const headerMarkers = headerMatch[1];
        const headerLevel = headerMarkers.length; // 2, 3, or 4
        const headerTitle = headerMatch[2].trim();

        // For ## (level 2), create a new section
        if (headerLevel === 2) {
          try {
            // Insert section
            const { data: sections, error } = await supabase
              .from('sections')
              .upsert({
                chapter_id: chapterId,
                category_id: categoryId,
                title: headerTitle,
                display_order: i,
              })
              .select();

            if (error) throw error;

            currentSection = headerTitle;
            currentSectionId = sections[0].id;

            // Reset all tracking for new section
            previousItemsByIndent = {};
            currentHeadersByLevel = {
              2: { text: headerTitle, id: null },
              3: { text: null, id: null },
              4: { text: null, id: null },
            };

            log(
              `Inserted/updated section: ${headerTitle} (ID: ${currentSectionId})`
            );
          } catch (error) {
            logError(`Error creating section ${headerTitle}`, error);
            currentSection = null;
            currentSectionId = null;
          }
        }
        // For ### and #### levels, create header items with appropriate parent links
        else if (headerLevel === 3 || headerLevel === 4) {
          if (!currentSectionId) continue; // Skip if no current section

          currentHeadersByLevel[headerLevel] = { text: headerTitle, id: null };

          // Reset deeper headers
          for (let h = headerLevel + 1; h <= 4; h++) {
            currentHeadersByLevel[h] = { text: null, id: null };
          }

          // Calculate effective indent level (negative for headers - see headerIndentMap)
          const effectiveIndentLevel = headerIndentMap[headerLevel];

          // Find parent based on indent levels
          let parentId = null;

          // For headers, we look for the closest higher-level header as parent
          for (let h = headerLevel - 1; h >= 2; h--) {
            if (currentHeadersByLevel[h].id) {
              parentId = currentHeadersByLevel[h].id;
              break;
            }
          }

          // If we couldn't find a parent header, get closest item in the indent hierarchy
          if (parentId === null) {
            // Look at previous indent levels
            for (
              let indent = effectiveIndentLevel - 1;
              indent >= -2;
              indent--
            ) {
              if (previousItemsByIndent[indent]) {
                parentId = previousItemsByIndent[indent];
                break;
              }
            }
          }

          // Insert header as a checklist item with is_header flag
          try {
            const { data, error } = await supabase
              .from('checklist_items')
              .insert({
                section_id: currentSectionId,
                parent_item_id: parentId,
                display_order: i * 10,
                item_text: headerTitle,
                indent_level: effectiveIndentLevel, // Use mapped header indentation
                is_header: true,
                header_level: headerLevel,
                has_text_input: false,
                input_label: null,
                input_placeholder: null,
                input_unit: null,
                icd10_code: null,
              })
              .select();

            if (error) throw error;

            const headerId = data[0].id;
            currentHeadersByLevel[headerLevel].id = headerId;

            // Also store in previousItemsByIndent for consistency
            previousItemsByIndent[effectiveIndentLevel] = headerId;

            log(
              `Inserted header: ${headerTitle} (level ${headerLevel}, ID: ${headerId})`
            );
          } catch (error) {
            logError(`Error inserting header: ${headerTitle}`, error);
          }
        }

        continue;
      }

      // Process checklist items
      const checklistMatch = line.match(/^(\s*)- \[ \] (.+)$/);
      if (checklistMatch && currentSectionId) {
        const indentStr = checklistMatch[1];
        // Calculate indent level based on spaces (usually 2 spaces per level)
        const indentLevel = Math.floor(indentStr.length / 2);
        const itemText = checklistMatch[2].trim();

        // Process the item text to extract components
        const processedItem = processItemText(itemText);

        // Find parent ID based on indentation level
        let parentId = null;

        // Look for parents at all previous indent levels
        for (let prevIndent = indentLevel - 1; prevIndent >= -2; prevIndent--) {
          if (previousItemsByIndent[prevIndent]) {
            parentId = previousItemsByIndent[prevIndent];
            break;
          }
        }

        // If no parent was found via indentation, use the closest header
        if (parentId === null) {
          // Try finding the deepest header as parent
          for (let h = 4; h >= 2; h--) {
            if (currentHeadersByLevel[h].id) {
              parentId = currentHeadersByLevel[h].id;
              break;
            }
          }
        }

        // Insert the checklist item
        try {
          const { data, error } = await supabase
            .from('checklist_items')
            .insert({
              section_id: currentSectionId,
              parent_item_id: parentId,
              display_order: i * 10,
              item_text: processedItem.itemText,
              indent_level: indentLevel,
              is_header: false,
              header_level: null,
              has_text_input: processedItem.hasTextInput,
              input_label: processedItem.inputLabel,
              input_placeholder: processedItem.inputPlaceholder,
              input_unit: processedItem.inputUnit,
              icd10_code: processedItem.icd10Code,
            })
            .select();

          if (error) throw error;

          const itemId = data[0].id;

          // Store this item's ID for potential children to reference
          previousItemsByIndent[indentLevel] = itemId;

          // Clear any deeper indent levels since they belong to previous items
          for (let deeper = indentLevel + 1; deeper <= 10; deeper++) {
            previousItemsByIndent[deeper] = null;
          }

          log(
            `Inserted item: "${itemText.substring(
              0,
              30
            )}..." (ID: ${itemId}, indent: ${indentLevel})`
          );

          // Handle multiple inputs (if comma-separated with multiple blanks)
          if (
            itemText.includes(',') &&
            (itemText.match(/_+/g) || []).length > 1
          ) {
            const multiItems = splitMultipleInputs(itemText);

            // Skip first one as it's already inserted
            for (let j = 1; j < multiItems.length; j++) {
              const subItem = multiItems[j];

              const { error: subError } = await supabase
                .from('checklist_items')
                .insert({
                  section_id: currentSectionId,
                  parent_item_id: itemId, // Parent is the main item
                  display_order: i * 10 + j,
                  item_text: subItem.itemText,
                  indent_level: indentLevel + 1, // One level deeper
                  is_header: false,
                  header_level: null,
                  has_text_input: subItem.hasTextInput,
                  input_label: subItem.inputLabel,
                  input_placeholder: subItem.inputPlaceholder,
                  input_unit: subItem.inputUnit,
                  icd10_code: subItem.icd10Code,
                });

              if (subError) throw subError;
              log(
                `Inserted sub-item: "${subItem.itemText.substring(0, 30)}..."`
              );
            }
          }
        } catch (error) {
          logError(`Error inserting checklist item: ${itemText}`, error);
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

    // Process each markdown file in the chapter directory
    const files = fs
      .readdirSync(chapterDir)
      .filter((file) => file.endsWith('.md'))
      .sort((a, b) => {
        const orderA = config.categories[a]?.order || 999;
        const orderB = config.categories[b]?.order || 999;
        return orderA - orderB;
      });

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
