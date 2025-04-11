// tools/db-migration/config.mjs
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env.local') });

export default {
  // Base path for markdown files
  markdownBasePath:
    '/Users/lucas/Documents/gemini_ approaches/md_files/claude_approaches',

  // Directory for logs
  logsDir: './logs',

  // Supabase configuration - using service role key for migration
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  // IMPORTANT: Use the service role key for migrations to bypass RLS
  supabaseKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '',

  // Enable verbose logging
  verbose: true,

  // Category mappings (filename -> category info)
  categories: {
    'alarm-features.md': { name: 'Alarm Features', order: 2 },
    'assessment.md': { name: 'Assessment', order: 15 },
    'collateral-history.md': { name: 'Collateral History', order: 6 },
    'diet.md': { name: 'Diet', order: 4 },
    'differential-diagnosis.md': { name: 'Differential Diagnosis', order: 8 },
    'disposition.md': { name: 'Disposition', order: 17 },
    'ecg.md': { name: 'ECG', order: 14 },
    'history.md': { name: 'History', order: 1 },
    'imaging.md': { name: 'Imaging', order: 12 },
    'lab-studies.md': { name: 'Lab Studies', order: 11 },
    'medications.md': { name: 'Medications', order: 3 },
    'past-medical.md': { name: 'Past Medical History', order: 9 },
    'patient-education.md': { name: 'Patient Education', order: 18 },
    'physical-exam.md': { name: 'Physical Exam', order: 10 },
    'plan.md': { name: 'Plan', order: 16 },
    'review-systems.md': { name: 'Review of Systems', order: 5 },
    'risk-factors.md': { name: 'Risk Factors', order: 7 },
    'special-tests.md': { name: 'Special Tests', order: 13 },
  },

  // Parser options
  parser: {
    extractICD10: true,
    handleMultipleInputs: true,
  },
};
