// tools/db-migration/parser.mjs

/**
 * Process text from a checklist item to extract components
 * @param {string} itemText - The text content of a checklist item
 * @returns {Object} Processed item with metadata
 */
export function processItemText(itemText) {
  // Base item structure
  const processedItem = {
    itemText,
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
    processedItem.itemText = itemText.replace(
      / \([A-Z][0-9]{2}(?:\.[0-9]{1,2})?\)$/,
      ''
    );
  }

  // Check for blank fields like "_____ mmHg"
  const blankFieldMatch = processedItem.itemText.match(/(_+)\s*([^_]*?)$/);
  if (blankFieldMatch) {
    processedItem.hasTextInput = true;

    // Extract unit if present (e.g., "mmHg", "bpm")
    if (blankFieldMatch[2].trim()) {
      processedItem.inputUnit = blankFieldMatch[2].trim();
    }

    // In some cases there might be a placeholder or label
    if (processedItem.itemText.includes(':')) {
      const parts = processedItem.itemText.split(':');
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
 * Split a multi-input item into multiple separate items
 * @param {string} itemText - The text content with multiple inputs
 * @returns {Array} Array of processed items
 */
export function splitMultipleInputs(itemText) {
  // If the item has commas and multiple input fields, split it
  if (itemText.includes(',') && (itemText.match(/_+/g) || []).length > 1) {
    const parts = itemText.split(',').map((part) => part.trim());

    // Return an array of individually processed parts
    return parts.map((part) => {
      // Process this part
      const processed = processItemText(part);

      // If this part doesn't have a label but the original item does, use the original label
      if (!part.includes(':') && itemText.includes(':')) {
        const mainLabel = itemText.split(':')[0].trim();
        processed.itemText = `${mainLabel}: ${processed.itemText}`;
        processed.inputLabel = mainLabel;
      }

      return processed;
    });
  }

  // If not a multi-input item, return the single processed item in an array
  return [processItemText(itemText)];
}
