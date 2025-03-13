/**
 * Markdown Parser for Medical Data
 *
 * This module parses markdown files containing medical symptom and condition data
 * and converts them into structured data for database insertion.
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

/**
 * Parse a markdown file and extract structured data
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} Structured data extracted from the markdown
 */
function parseMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return parseMarkdownContent(content, path.basename(filePath));
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Parse markdown content string and extract structured data
 * @param {string} content - Markdown content as string
 * @param {string} source - Source identifier (usually filename)
 * @returns {Object} Structured data extracted from the markdown
 */
function parseMarkdownContent(content, source) {
  // Parse markdown to tokens
  const tokens = marked.lexer(content);

  // Initialize data structure
  const data = {
    title: '',
    description: '',
    categories: [],
    symptoms: [],
    conditions: [],
    symptomConditionRelations: [],
    metadata: {
      source,
      parsedAt: new Date().toISOString(),
    },
  };

  // Extract title (first h1)
  const titleToken = tokens.find(
    (token) => token.type === 'heading' && token.depth === 1
  );
  if (titleToken) {
    data.title = titleToken.text;
  }

  // Extract description (first paragraph after title)
  const descIndex = tokens.findIndex(
    (token) => token.type === 'heading' && token.depth === 1
  );
  if (
    descIndex !== -1 &&
    tokens[descIndex + 1] &&
    tokens[descIndex + 1].type === 'paragraph'
  ) {
    data.description = tokens[descIndex + 1].text;
  }

  // Extract categories, symptoms, and conditions
  let currentSection = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Identify sections by headings
    if (token.type === 'heading' && token.depth === 2) {
      currentSection = token.text.toLowerCase();
      continue;
    }

    // Process lists in each section
    if (currentSection && token.type === 'list') {
      const items = token.items.map((item) => item.text);

      if (
        currentSection.includes('category') ||
        currentSection.includes('categories')
      ) {
        data.categories = items;
      } else if (currentSection.includes('symptom')) {
        data.symptoms = items;
      } else if (
        currentSection.includes('condition') ||
        currentSection.includes('diagnosis')
      ) {
        data.conditions = items;
      } else if (
        currentSection.includes('relation') ||
        currentSection.includes('mapping')
      ) {
        // Parse relations in format "symptom -> condition"
        items.forEach((item) => {
          const match = item.match(/(.+?)\s*->\s*(.+)/);
          if (match) {
            data.symptomConditionRelations.push({
              symptom: match[1].trim(),
              condition: match[2].trim(),
            });
          }
        });
      }
    }
  }

  return data;
}

/**
 * Parse multiple markdown files from a directory
 * @param {string} directory - Directory containing markdown files
 * @param {string} pattern - File pattern to match (e.g., "*.md")
 * @returns {Array<Object>} Array of structured data from all files
 */
function parseMarkdownDirectory(directory, pattern = '*.md') {
  // Use pattern to create a regex for filtering files if needed
  const patternRegex = new RegExp(pattern.replace('*', '.*'));

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md') && patternRegex.test(file))
    .map((file) => path.join(directory, file));

  return files.map((file) => parseMarkdownFile(file));
}

export { parseMarkdownFile, parseMarkdownContent, parseMarkdownDirectory };
