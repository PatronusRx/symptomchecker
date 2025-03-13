# Iterative Migration Scripts for Next.js Projects

You've raised an excellent point. Since you'll likely need to refine the parser through multiple iterations, let's set up a more robust structure that supports iterative development and testing.

## Enhanced Project Structure

```
your-nextjs-project/
├── app/                        # Your Next.js app directory
├── components/                 # React components
├── lib/                        # Shared utilities
├── tools/                      # Developer tools (better name than scripts)
│   ├── db-migration/           # Database migration tools
│   │   ├── config.js           # Shared configuration
│   │   ├── parser.js           # Markdown parser logic
│   │   ├── migrate.js          # Main migration script
│   │   ├── check-db.js         # DB validation utilities
│   │   ├── clear-tables.js     # Script to clean up tables for retesting
│   │   ├── test-parser.js      # Parser testing utilities
│   │   ├── logs/               # Directory for migration logs
│   │   └── README.md           # Documentation for the migration process
│   └── ...                     # Other tool directories
└── ... other Next.js files
```

## Improved Migration Setup

Let's build this with iteration in mind:

### 1. Create a configuration file (`config.js`)

```javascript
// tools/db-migration/config.js
require('dotenv').config({ path: '../../.env.local' }); // Read from Next.js env file

module.exports = {
  // Supabase config
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  // Paths
  markdownBasePath: '/Users/lucas/Documents/markdown_1-185/1-18',
  logsDir: './logs',

  // Mapping of filenames to categories
  categories: {
    'history.md': { name: 'History', order: 1 },
    'alarm-features.md': { name: 'Alarm Features', order: 2 },
    // ... other categories
  },

  // Enable verbose logging
  verbose: true,

  // Parser options
  parser: {
    extractICD10: true,
    handleMultipleInputs: true,
  },
};
```

### 2. Create a parser tester (`test-parser.js`)

```javascript
// tools/db-migration/test-parser.js
const fs = require('fs');
const path = require('path');
const { processItemText } = require('./parser');
const config = require('./config');

/**
 * Test the parser on a specific markdown file
 */
function testParser(mdFilePath) {
  console.log(`Testing parser on: ${mdFilePath}`);

  // Read the file
  const content = fs.readFileSync(mdFilePath, 'utf8');
  const lines = content.split('\n');

  // Initialize tracking variables
  const results = {
    sections: [],
    items: [],
    inputFields: [],
    multipleInputs: [],
    icd10Codes: [],
    nestedItems: {},
  };

  let currentSection = null;
  let indentLevels = {};

  // Process the file line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) continue;

    // Section header (## heading)
    if (line.startsWith('## ')) {
      currentSection = line.substring(3).trim();
      results.sections.push(currentSection);
      indentLevels[currentSection] = {};
      continue;
    }

    // Checklist item (- [ ] item)
    const checklistMatch = line.match(/^(\s*)- \[ \] (.+)$/);
    if (checklistMatch && currentSection) {
      const indentStr = checklistMatch[1];
      const indentLevel = indentStr.length;
      const itemText = checklistMatch[2].trim();

      // Process the item
      const processedItems = processItemText(itemText);

      // Track this indent level for the current section
      indentLevels[currentSection][indentLevel] =
        (indentLevels[currentSection][indentLevel] || 0) + 1;

      // Add to items list
      results.items.push({
        section: currentSection,
        indentLevel,
        text: itemText,
        processed: processedItems,
      });

      // Track special items
      processedItems.forEach((item) => {
        if (item.hasTextInput) {
          results.inputFields.push(item);
        }
        if (item.icd10Code) {
          results.icd10Codes.push(item);
        }
      });

      // Track items with multiple inputs
      if (processedItems.length > 1) {
        results.multipleInputs.push({
          original: itemText,
          processed: processedItems,
        });
      }
    }
  }

  // Calculate nesting statistics
  for (const section in indentLevels) {
    const levels = Object.keys(indentLevels[section])
      .map(Number)
      .sort((a, b) => a - b);
    results.nestedItems[section] = {
      maxDepth: levels.length,
      levelCounts: indentLevels[section],
      levels,
    };
  }

  // Print summary
  console.log('\n===== PARSER TEST RESULTS =====\n');
  console.log(`File: ${path.basename(mdFilePath)}`);
  console.log(`Sections: ${results.sections.length}`);
  console.log(`Total items: ${results.items.length}`);
  console.log(`Input fields: ${results.inputFields.length}`);
  console.log(`Multiple input fields: ${results.multipleInputs.length}`);
  console.log(`ICD-10 codes found: ${results.icd10Codes.length}`);

  console.log('\n----- Nesting Depth -----');
  for (const section in results.nestedItems) {
    const info = results.nestedItems[section];
    console.log(`Section "${section}": ${info.maxDepth} levels deep`);
    if (info.maxDepth > 1) {
      console.log(`  Levels: ${info.levels.join(', ')}`);
      console.log(
        `  Items per level: ${info.levels
          .map((l) => info.levelCounts[l])
          .join(', ')}`
      );
    }
  }

  // Show some examples of multiple inputs if found
  if (results.multipleInputs.length > 0) {
    console.log('\n----- Multiple Input Examples -----');
    results.multipleInputs.slice(0, 3).forEach((item, idx) => {
      console.log(`Example ${idx + 1}: "${item.original}"`);
      console.log('  Processed into:');
      item.processed.forEach((p) => {
        console.log(`  - "${p.itemText}" (unit: ${p.inputUnit || 'none'})`);
      });
    });
  }

  // Write detailed results to a JSON file
  const outputPath = path.join(
    config.logsDir,
    `parser-test-${path.basename(mdFilePath)}.json`
  );

  fs.mkdirSync(config.logsDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\nDetailed results saved to: ${outputPath}`);
  console.log('\n===============================\n');

  return results;
}

/**
 * Main function
 */
function main() {
  // Get arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      'Usage: node test-parser.js <markdown_file> [markdown_file2 ...]'
    );
    console.error('Or:    node test-parser.js --chapter <chapter_dir>');
    process.exit(1);
  }

  if (args[0] === '--chapter' && args[1]) {
    // Test all markdown files in a chapter directory
    const chapterDir = args[1];
    if (!fs.existsSync(chapterDir)) {
      console.error(`Chapter directory not found: ${chapterDir}`);
      process.exit(1);
    }

    const files = fs
      .readdirSync(chapterDir)
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.join(chapterDir, file));

    files.forEach(testParser);
  } else {
    // Test specific markdown files
    args.forEach((file) => {
      if (!fs.existsSync(file)) {
        console.error(`File not found: ${file}`);
        return;
      }
      testParser(file);
    });
  }
}

main();
```

### 3. Create a table cleanup script (`clear-tables.js`)

```javascript
// tools/db-migration/clear-tables.js
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

async function clearTables() {
  const args = process.argv.slice(2);
  const isTestMode = args.includes('--test');
  const deleteAll = args.includes('--all');
  const chapter = args
    .find((arg) => arg.startsWith('--chapter='))
    ?.split('=')[1];

  console.log('Database cleanup script');
  console.log('----------------------');

  if (isTestMode) {
    console.log('TEST MODE: No data will be deleted');
  }

  if (deleteAll) {
    console.log('Will delete ALL data from tables');
  } else if (chapter) {
    console.log(`Will delete data for chapter: ${chapter}`);
  } else {
    console.log('No deletion parameters specified. Use:');
    console.log('  --all         Delete all data');
    console.log('  --chapter=N   Delete specific chapter (e.g., --chapter=11)');
    console.log('  --test        Test mode (no actual deletion)');
    process.exit(0);
  }

  if (!isTestMode) {
    console.log('\nWARNING: This will DELETE data from your database!');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  try {
    if (deleteAll) {
      if (!isTestMode) {
        // Delete in the correct order to respect foreign key constraints
        const { error: itemsError } = await supabase
          .from('checklist_items')
          .delete()
          .neq('id', 0);
        if (itemsError) throw itemsError;
        console.log('Deleted all checklist items');

        const { error: sectionsError } = await supabase
          .from('sections')
          .delete()
          .neq('id', 0);
        if (sectionsError) throw sectionsError;
        console.log('Deleted all sections');

        const { error: chaptersError } = await supabase
          .from('chapters')
          .delete()
          .neq('id', 0);
        if (chaptersError) throw chaptersError;
        console.log('Deleted all chapters');

        // Categories are often reused, so we might want to keep them
        console.log(
          'Note: Categories were preserved. Use SQL directly if you need to delete them.'
        );
      } else {
        console.log(
          '[TEST] Would delete all checklist_items, sections, and chapters'
        );
      }
    } else if (chapter) {
      // Get chapter ID
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id')
        .eq('chapter_number', chapter);

      if (chaptersError) throw chaptersError;

      if (chapters && chapters.length > 0) {
        const chapterId = chapters[0].id;

        // Get sections for this chapter
        const { data: sections, error: sectionsError } = await supabase
          .from('sections')
          .select('id')
          .eq('chapter_id', chapterId);

        if (sectionsError) throw sectionsError;

        if (sections && sections.length > 0) {
          const sectionIds = sections.map((s) => s.id);

          if (!isTestMode) {
            // Delete checklist items for these sections
            const { error: itemsError } = await supabase
              .from('checklist_items')
              .delete()
              .in('section_id', sectionIds);

            if (itemsError) throw itemsError;
            console.log(`Deleted checklist items for chapter ${chapter}`);

            // Delete sections
            const { error: deleteSectionsError } = await supabase
              .from('sections')
              .delete()
              .eq('chapter_id', chapterId);

            if (deleteSectionsError) throw deleteSectionsError;
            console.log(`Deleted sections for chapter ${chapter}`);

            // Delete chapter
            const { error: deleteChapterError } = await supabase
              .from('chapters')
              .delete()
              .eq('id', chapterId);

            if (deleteChapterError) throw deleteChapterError;
            console.log(`Deleted chapter ${chapter}`);
          } else {
            console.log(
              `[TEST] Would delete ${sectionIds.length} sections and their checklist items for chapter ${chapter}`
            );
          }
        } else {
          console.log(`No sections found for chapter ${chapter}`);
        }
      } else {
        console.log(`Chapter ${chapter} not found`);
      }
    }

    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error during database cleanup:', error);
  }
}

clearTables().catch(console.error);
```

### 4. Update the migration script with logging and error handling

```javascript
// tools/db-migration/migrate.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');
const { processItemText } = require('./parser');

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

// The rest of the script follows with added logging...
// (Include the rest of the migration script from before, adding log() calls)

// ... at the end of main():
log(`Migration completed in ${(new Date() - startTime) / 1000} seconds`);
log(`Results written to ${logFilePath}`);
```

## Script for Iterative Development

When developing iteratively, add this to your package.json:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",

    "migrate": "node tools/db-migration/migrate.js",
    "migrate:test": "node tools/db-migration/migrate.js --test",
    "migrate:chapter": "node tools/db-migration/migrate.js --chapter",

    "test:parser": "node tools/db-migration/test-parser.js",
    "clear:db": "node tools/db-migration/clear-tables.js",
    "check:db": "node tools/db-migration/check-db.js"
  }
}
```

## Development Workflow

For iterative parser development:

1. **Test parser on sample files**:

   ```bash
   npm run test:parser -- /Users/lucas/Documents/markdown_1-185/1-18/Ch11_Syncope/physical-exam.md
   ```

2. **Refine the parser** based on test results

3. **Clear previous test data**:

   ```bash
   npm run clear:db -- --chapter=11
   ```

4. **Run migration for a single chapter**:

   ```bash
   npm run migrate:chapter -- Ch11_Syncope
   ```

5. **Verify the results**:

   ```bash
   npm run check:db
   ```

6. **Repeat** steps 1-5 until the parser correctly handles all patterns

7. **Full migration** when ready:
   ```bash
   npm run migrate
   ```

## Documentation

Add a README.md in your tools/db-migration directory explaining:

1. The development workflow
2. Common parser issues and how to solve them
3. How to handle special cases in the markdown files
4. The database schema
5. How to run the scripts

This approach treats the migration as an iterative development process rather than a one-time task, making it easier to refine the parser and handle edge cases as you discover them.
