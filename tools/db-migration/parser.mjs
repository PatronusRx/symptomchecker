// tools/db-migration/parser.mjs

/**
 * Process text from a checklist item to extract components
 * @param {string} itemText - The text content of a checklist item
 * @returns {Array} Array of processed items
 */
export function processItemText(itemText) {
  // Base item structure
  const baseItem = {
    itemText,
    hasTextInput: false,
    inputPlaceholder: null,
    inputUnit: null,
    icd10Code: null,
  };

  // Process ICD-10 codes in parentheses, e.g. "Vasovagal syncope (R55)"
  const icd10Match = itemText.match(/\(([A-Z][0-9]{2}(?:\.[0-9]{1,2})?)\)$/);
  if (icd10Match) {
    baseItem.icd10Code = icd10Match[1];
    // Remove ICD-10 code from the displayed text
    baseItem.itemText = itemText.replace(
      / \([A-Z][0-9]{2}(?:\.[0-9]{1,2})?\)$/,
      ''
    );
  }

  // Check for blank fields like "_____ mmHg"
  const blankFieldMatch = itemText.match(/(_+)\s*([^_]*?)$/);
  if (blankFieldMatch) {
    baseItem.hasTextInput = true;

    // Extract unit if present (e.g., "mmHg", "bpm")
    if (blankFieldMatch[2].trim()) {
      baseItem.inputUnit = blankFieldMatch[2].trim();
    }

    // In some cases there might be a placeholder
    if (itemText.includes(':')) {
      const parts = itemText.split(':');
      baseItem.inputPlaceholder = parts[1].trim().replace(/_+\s*([^_]*?)$/, '');
    }
  }

  // Handle multiple inputs in a single line
  // e.g. "BP: _____ mmHg, HR: _____ bpm"
  if (itemText.includes(',') && itemText.match(/_+/g)?.length > 1) {
    // This is a complex case with multiple inputs
    const parts = itemText.split(',').map((part) => part.trim());

    return parts.map((part) => {
      // Recursively process each part
      const processedPart = processItemText(part)[0]; // Get first result

      // Prefix the label if needed
      if (!part.includes(':') && itemText.includes(':')) {
        const mainLabel = itemText.split(':')[0];
        processedPart.itemText = `${mainLabel}: ${processedPart.itemText}`;
      }

      return processedPart;
    });
  }

  return [baseItem];
}
