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
