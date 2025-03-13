// tools/db-migration/config.mjs
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env.local') });

export default {
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
    'medications.md': { name: 'Medications', order: 3 },
    'diet.md': { name: 'Diet', order: 4 },
    'review-systems.md': { name: 'Review of Systems', order: 5 },
    'collateral-history.md': { name: 'Collateral History', order: 6 },
    'risk-factors.md': { name: 'Risk Factors', order: 7 },
    'differential-diagnosis.md': { name: 'Differential Diagnosis', order: 8 },
    'past-medical.md': { name: 'Past Medical History', order: 9 },
    'physical-exam.md': { name: 'Physical Exam', order: 10 },
    'lab-studies.md': { name: 'Lab Studies', order: 11 },
    'imaging.md': { name: 'Imaging', order: 12 },
    'special-tests.md': { name: 'Special Tests', order: 13 },
    'ecg.md': { name: 'ECG', order: 14 },
    'assessment.md': { name: 'Assessment', order: 15 },
    'plan.md': { name: 'Plan', order: 16 },
    'disposition.md': { name: 'Disposition', order: 17 },
    'patient-education.md': { name: 'Patient Education', order: 18 },
  },

  // Enable verbose logging
  verbose: true,

  // Parser options
  parser: {
    extractICD10: true,
    handleMultipleInputs: true,
  },
};
