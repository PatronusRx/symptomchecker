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
