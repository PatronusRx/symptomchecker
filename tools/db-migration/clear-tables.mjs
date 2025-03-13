// tools/db-migration/clear-tables.js
import { createClient } from '@supabase/supabase-js';
import config from './config.mjs';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

async function clearTables() {
  const args = process.argv.slice(2);
  const isTestMode = args.includes('--test');
  const deleteAll = args.includes('--all');
  const chapter = args
    .find((arg) => arg.startsWith('--chapter='))
    ?.split('=')[1];

  console.log('Database cleanup script');
  console.log('----------------------');

  if (isTestMode) {
    console.log('TEST MODE: No data will be deleted');
  }

  if (deleteAll) {
    console.log('Will delete ALL data from tables');
  } else if (chapter) {
    console.log(`Will delete data for chapter: ${chapter}`);
  } else {
    console.log('No deletion parameters specified. Use:');
    console.log('  --all         Delete all data');
    console.log('  --chapter=N   Delete specific chapter (e.g., --chapter=11)');
    console.log('  --test        Test mode (no actual deletion)');
    process.exit(0);
  }

  if (!isTestMode) {
    console.log('\nWARNING: This will DELETE data from your database!');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  try {
    if (deleteAll) {
      if (!isTestMode) {
        // Delete in the correct order to respect foreign key constraints
        const { error: itemsError } = await supabase
          .from('checklist_items')
          .delete()
          .neq('id', 0);
        if (itemsError) throw itemsError;
        console.log('Deleted all checklist items');

        const { error: sectionsError } = await supabase
          .from('sections')
          .delete()
          .neq('id', 0);
        if (sectionsError) throw sectionsError;
        console.log('Deleted all sections');

        const { error: chaptersError } = await supabase
          .from('chapters')
          .delete()
          .neq('id', 0);
        if (chaptersError) throw chaptersError;
        console.log('Deleted all chapters');

        // Categories are often reused, so we might want to keep them
        console.log(
          'Note: Categories were preserved. Use SQL directly if you need to delete them.'
        );
      } else {
        console.log(
          '[TEST] Would delete all checklist_items, sections, and chapters'
        );
      }
    } else if (chapter) {
      // Get chapter ID
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id')
        .eq('chapter_number', chapter);

      if (chaptersError) throw chaptersError;

      if (chapters && chapters.length > 0) {
        const chapterId = chapters[0].id;

        // Get sections for this chapter
        const { data: sections, error: sectionsError } = await supabase
          .from('sections')
          .select('id')
          .eq('chapter_id', chapterId);

        if (sectionsError) throw sectionsError;

        if (sections && sections.length > 0) {
          const sectionIds = sections.map((s) => s.id);

          if (!isTestMode) {
            // Delete checklist items for these sections
            const { error: itemsError } = await supabase
              .from('checklist_items')
              .delete()
              .in('section_id', sectionIds);

            if (itemsError) throw itemsError;
            console.log(`Deleted checklist items for chapter ${chapter}`);

            // Delete sections
            const { error: deleteSectionsError } = await supabase
              .from('sections')
              .delete()
              .eq('chapter_id', chapterId);

            if (deleteSectionsError) throw deleteSectionsError;
            console.log(`Deleted sections for chapter ${chapter}`);

            // Delete chapter
            const { error: deleteChapterError } = await supabase
              .from('chapters')
              .delete()
              .eq('id', chapterId);

            if (deleteChapterError) throw deleteChapterError;
            console.log(`Deleted chapter ${chapter}`);
          } else {
            console.log(
              `[TEST] Would delete ${sectionIds.length} sections and their checklist items for chapter ${chapter}`
            );
          }
        } else {
          console.log(`No sections found for chapter ${chapter}`);
        }
      } else {
        console.log(`Chapter ${chapter} not found`);
      }
    }

    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error during database cleanup:', error);
  }
}

clearTables().catch(console.error);
