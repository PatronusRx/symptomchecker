import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import config from './config.mjs';

/**
 * Process text from a checklist item to extract components
 */
function processItemText(itemText) {
  // Base item structure
  const processedItem = {
    text: itemText,
    hasTextInput: false,
    inputLabel: null,
    inputPlaceholder: null,
    inputUnit: null,
    icd10Code: null,
  };

  // Process ICD-10 codes in parentheses, e.g. "Vasovagal syncope (R55)"
  const icd10Match = itemText.match(/\(([A-Z][0-9]{2}(?:\.[0-9]{1,2})?)\)$/);
  if (icd10Match) {
    processedItem.icd10Code = icd10Match[1];
    // Remove ICD-10 code from the displayed text
    processedItem.text = itemText.replace(
      / \([A-Z][0-9]{2}(?:\.[0-9]{1,2})?\)$/,
      ''
    );
  }

  // Check for blank fields like "_____ mmHg"
  const blankFieldMatch = processedItem.text.match(/(_+)\s*([^_]*?)$/);
  if (blankFieldMatch) {
    processedItem.hasTextInput = true;

    // Extract unit if present (e.g., "mmHg", "bpm")
    if (blankFieldMatch[2].trim()) {
      processedItem.inputUnit = blankFieldMatch[2].trim();
    }

    // In some cases there might be a placeholder or label
    if (processedItem.text.includes(':')) {
      const parts = processedItem.text.split(':');
      processedItem.inputLabel = parts[0].trim();
      // Only set placeholder if there's content between the colon and the underscores
      const afterColon = parts[1].trim();
      const placeholderMatch = afterColon.match(/^(.*?)_+/);
      if (placeholderMatch && placeholderMatch[1].trim()) {
        processedItem.inputPlaceholder = placeholderMatch[1].trim();
      }
    }
  }

  return processedItem;
}

/**
 * Build a nested structure of items
 */
function buildNestedStructure(items) {
  const result = [];
  const itemMap = new Map(); // Maps lineNumber to item and its index in result

  // First pass: add top-level items and create mapping
  items.forEach((item) => {
    if (item.indentLevel === 0) {
      const index = result.length;
      result.push({
        ...item,
        children: [],
      });
      itemMap.set(item.lineNumber, { item, index });
    }
  });

  // Second pass: place children under their parents
  items.forEach((item) => {
    if (item.indentLevel > 0) {
      // Find parent (the closest previous item with a smaller indent level)
      let parentLineNumber = null;
      for (let i = item.lineNumber - 1; i >= 0; i--) {
        const possibleParent = items.find((p) => p.lineNumber === i);
        if (possibleParent && possibleParent.indentLevel < item.indentLevel) {
          parentLineNumber = i;
          break;
        }
      }

      if (parentLineNumber !== null) {
        // Find the actual parent in our structure
        let parent = itemMap.get(parentLineNumber);
        if (parent) {
          // If parent is top-level, add directly to its children
          if (parent.item.indentLevel === 0) {
            result[parent.index].children.push({
              ...item,
              children: [],
            });
          } else {
            // For deeper nesting, we need to find the parent in the nested structure
            const findAndAddChild = (items) => {
              for (let i = 0; i < items.length; i++) {
                if (items[i].lineNumber === parentLineNumber) {
                  items[i].children.push({
                    ...item,
                    children: [],
                  });
                  return true;
                }
                if (items[i].children && items[i].children.length > 0) {
                  if (findAndAddChild(items[i].children)) {
                    return true;
                  }
                }
              }
              return false;
            };

            findAndAddChild(result);
          }
        }
      }
    }
  });

  return result;
}

/**
 * Parse a markdown file into structured JSON
 */
function parseMarkdownFile(filePath) {
  console.log(`Parsing file: ${filePath}`);

  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Get the file category from filename
  const fileName = path.basename(filePath);
  const category = config.categories[fileName] || {
    name: 'Unknown',
    order: 999,
  };

  // Extract category number and name from the first line (e.g., "# 1. History")
  const titleMatch = lines[0].match(/^# (\d+)\. (.+)$/);
  const categoryNumber = titleMatch
    ? parseInt(titleMatch[1], 10)
    : category.order;
  const categoryName = titleMatch ? titleMatch[2].trim() : category.name;

  // Parse the file structure
  const result = {
    fileName,
    category: {
      name: categoryName,
      order: categoryNumber,
    },
    sections: [],
  };

  let currentSection = null;
  let currentSectionItems = [];

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) continue;

    // Skip the file title line
    if (line.startsWith('# ')) continue;

    // Process section headers
    if (line.trim().startsWith('## ')) {
      // If we were processing a previous section, add it to the result
      if (currentSection) {
        result.sections.push({
          title: currentSection,
          items: buildNestedStructure(currentSectionItems),
        });
        currentSectionItems = [];
      }

      currentSection = line.trim().substring(3).trim();
      continue;
    }

    // Process checklist items
    const checklistMatch = line.match(/^(\s*)- \[ \] (.+)$/);
    if (checklistMatch && currentSection) {
      const indentStr = checklistMatch[1];
      const indentLevel = Math.floor(indentStr.length / 2);
      const itemText = checklistMatch[2].trim();

      // Process item
      const item = {
        lineNumber: i,
        indentLevel,
        raw: itemText,
        ...processItemText(itemText),
      };

      // Handle multiple inputs (comma-separated)
      if (itemText.includes(',') && (itemText.match(/_+/g) || []).length > 1) {
        const parts = itemText.split(',').map((part) => part.trim());

        item.multipleInputs = parts.map((part) => {
          const processed = processItemText(part);

          // If this part doesn't have a label but the original does, use original label
          if (!part.includes(':') && itemText.includes(':')) {
            const mainLabel = itemText.split(':')[0].trim();
            processed.text = `${mainLabel}: ${processed.text}`;
            processed.inputLabel = mainLabel;
          }

          return processed;
        });
      }

      currentSectionItems.push(item);
    }
  }

  // Add the last section if any
  if (currentSection) {
    result.sections.push({
      title: currentSection,
      items: buildNestedStructure(currentSectionItems),
    });
  }

  return result;
}

/**
 * Process a chapter directory and convert all markdown files to JSON
 */
async function processChapter(chapterDir) {
  const chapterName = path.basename(chapterDir);
  console.log(`Processing chapter: ${chapterName}`);

  // Extract chapter number and title
  const chapterMatch = chapterName.match(/Ch(\d+)_(.+)/);
  if (!chapterMatch) {
    console.error(`Invalid chapter directory name format: ${chapterName}`);
    return false;
  }

  const chapterNumber = parseInt(chapterMatch[1], 10);
  const chapterTitle = chapterMatch[2].replace(/_/g, ' ');

  // Create chapter data structure
  const chapterData = {
    number: chapterNumber,
    title: chapterTitle,
    categories: [],
  };

  // Process each markdown file in the chapter
  const files = fs
    .readdirSync(chapterDir)
    .filter((file) => file.endsWith('.md'))
    .sort((a, b) => {
      const orderA = config.categories[a]?.order || 999;
      const orderB = config.categories[b]?.order || 999;
      return orderA - orderB;
    });

  for (const file of files) {
    const filePath = path.join(chapterDir, file);
    const categoryData = parseMarkdownFile(filePath);
    chapterData.categories.push(categoryData);
  }

  // Write the JSON output
  const outputDir = path.join(__dirname, 'json');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${chapterName}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(chapterData, null, 2));

  console.log(`Generated JSON for chapter ${chapterNumber}: ${outputPath}`);
  return true;
}

/**
 * Main function
 */
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);

  // Get all chapter directories or a specific one
  let chapterDirs = [];

  const specificChapter = args[0];
  if (specificChapter) {
    const chapterPath = path.join(config.markdownBasePath, specificChapter);
    if (fs.existsSync(chapterPath) && fs.statSync(chapterPath).isDirectory()) {
      chapterDirs = [chapterPath];
    } else {
      console.error(`Chapter directory not found: ${chapterPath}`);
      process.exit(1);
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

  console.log(`Found ${chapterDirs.length} chapter directories to process`);

  // Process each chapter
  for (const chapterDir of chapterDirs) {
    await processChapter(chapterDir);
  }

  console.log('Conversion completed!');
}

main().catch(console.error);
