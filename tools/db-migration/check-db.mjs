#!/usr/bin/env node

/**
 * Database Validation Utilities
 *
 * This script provides utilities for validating the database state after migration.
 * It checks for data integrity, relationships, and expected counts.
 */

import { createClient } from '@supabase/supabase-js';
import tables from './config.mjs';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY environment variables.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Validation functions
async function checkTableCounts() {
  console.log('Checking table counts...');

  const results = {};

  for (const tableName of Object.values(tables)) {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`Error checking count for table ${tableName}:`, error);
      continue;
    }

    results[tableName] = count;
  }

  console.table(results);
  return results;
}

async function checkOrphanedRelations() {
  console.log('Checking for orphaned relations...');

  // Check for symptom_condition_map entries with no matching symptom
  const { data: orphanedSymptoms, error: symptomError } = await supabase
    .from(tables.symptomConditionMap)
    .select(
      `
      id,
      symptom:symptoms!inner(id)
    `
    )
    .is('symptom', null);

  if (symptomError) {
    console.error('Error checking orphaned symptoms:', symptomError);
  } else {
    console.log(
      `Found ${orphanedSymptoms?.length || 0} relations with orphaned symptoms`
    );
  }

  // Check for symptom_condition_map entries with no matching condition
  const { data: orphanedConditions, error: conditionError } = await supabase
    .from(tables.symptomConditionMap)
    .select(
      `
      id,
      condition:conditions!inner(id)
    `
    )
    .is('condition', null);

  if (conditionError) {
    console.error('Error checking orphaned conditions:', conditionError);
  } else {
    console.log(
      `Found ${
        orphanedConditions?.length || 0
      } relations with orphaned conditions`
    );
  }

  return {
    orphanedSymptoms: orphanedSymptoms || [],
    orphanedConditions: orphanedConditions || [],
  };
}

async function checkDuplicates() {
  console.log('Checking for duplicates...');

  const results = {};

  // Check for duplicate symptoms (case insensitive)
  const { data: symptomDuplicates, error: symptomError } = await supabase.rpc(
    'find_duplicate_symptoms'
  );

  if (symptomError) {
    console.error('Error checking duplicate symptoms:', symptomError);
  } else {
    results.symptoms = symptomDuplicates || [];
    console.log(`Found ${symptomDuplicates?.length || 0} duplicate symptoms`);
  }

  // Check for duplicate conditions (case insensitive)
  const { data: conditionDuplicates, error: conditionError } =
    await supabase.rpc('find_duplicate_conditions');

  if (conditionError) {
    console.error('Error checking duplicate conditions:', conditionError);
  } else {
    results.conditions = conditionDuplicates || [];
    console.log(
      `Found ${conditionDuplicates?.length || 0} duplicate conditions`
    );
  }

  return results;
}

async function runAllChecks() {
  console.log('Running all database validation checks...');

  const counts = await checkTableCounts();
  const orphans = await checkOrphanedRelations();
  const duplicates = await checkDuplicates();

  console.log('\nValidation Summary:');
  console.log('==================');
  console.log(`Total symptoms: ${counts[tables.symptoms]}`);
  console.log(`Total conditions: ${counts[tables.conditions]}`);
  console.log(`Total relations: ${counts[tables.symptomConditionMap]}`);
  console.log(`Total categories: ${counts[tables.categories]}`);
  console.log(
    `Orphaned relations: ${
      orphans.orphanedSymptoms.length + orphans.orphanedConditions.length
    }`
  );
  console.log(`Duplicate symptoms: ${duplicates.symptoms?.length || 0}`);
  console.log(`Duplicate conditions: ${duplicates.conditions?.length || 0}`);

  // Determine if there are any issues
  const hasIssues =
    orphans.orphanedSymptoms.length > 0 ||
    orphans.orphanedConditions.length > 0 ||
    (duplicates.symptoms?.length || 0) > 0 ||
    (duplicates.conditions?.length || 0) > 0;

  if (hasIssues) {
    console.log(
      '\n⚠️ Issues were found in the database. See above for details.'
    );
    return false;
  } else {
    console.log('\n✅ Database validation passed. No issues found.');
    return true;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  Database Validation Tool
  
  Usage: node check-db.js [command]
  
  Commands:
    counts      Check table record counts
    orphans     Check for orphaned relations
    duplicates  Check for duplicate entries
    all         Run all checks (default)
    
  Options:
    --help, -h  Show this help message
  `);
  process.exit(0);
}

// Run the appropriate check based on command
const command = args[0] || 'all';

switch (command) {
  case 'counts':
    checkTableCounts();
    break;
  case 'orphans':
    checkOrphanedRelations();
    break;
  case 'duplicates':
    checkDuplicates();
    break;
  case 'all':
  default:
    runAllChecks();
    break;
}

export {
  checkTableCounts,
  checkOrphanedRelations,
  checkDuplicates,
  runAllChecks,
};
