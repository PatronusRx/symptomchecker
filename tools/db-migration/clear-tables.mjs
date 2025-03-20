import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import config from './config.mjs';

// Setup path for .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env.local') });

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

/**
 * Log function for consistent logging
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
}

/**
 * Clear all data from the tables in the database
 */
async function clearTables() {
  log('Starting to clear data from database tables...');

  try {
    // Using a single command to truncate all tables in the correct order
    // TRUNCATE with CASCADE automatically truncates all tables with foreign key references
    log('Truncating all tables...');
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        TRUNCATE TABLE checklist_items, sections, chapters, categories
        RESTART IDENTITY CASCADE;
      `,
    });

    if (error) throw error;

    log('All table data has been cleared successfully.');
  } catch (error) {
    log(`Error clearing table data: ${error.message}`, 'error');
    if (config.verbose && error.stack) {
      log(error.stack, 'error');
    }
    process.exit(1);
  }
}

// Run the clearTables function
clearTables().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
