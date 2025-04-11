import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase credentials. Set your environment variables.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Read the SymptomSystem.json file
    console.log('Reading SymptomSystem.json...');
    const filePath = path.join(
      process.cwd(),
      'components',
      'SymptomSystem.json'
    );
    const fileData = fs.readFileSync(filePath, 'utf8');
    const symptomData = JSON.parse(fileData);

    // Extract all unique chapter names from the JSON
    const allChapters = new Set();
    Object.entries(symptomData).forEach(([_system, symptoms]) => {
      Object.entries(symptoms).forEach(([_symptom, chapters]) => {
        chapters.forEach((chapter) => allChapters.add(chapter));
      });
    });

    const chaptersList = Array.from(allChapters);
    console.log(
      `Found ${chaptersList.length} unique chapters in SymptomSystem.json`
    );

    // Check which chapters exist in the database
    console.log('Checking database for chapters...');
    const { data: existingChapters, error } = await supabase
      .from('chapters')
      .select('id, title, chapter_number')
      .in('title', chaptersList);

    if (error) {
      console.error('Error fetching chapters:', error);
      return;
    }

    console.log(
      `Found ${existingChapters.length} matching chapters in database`
    );

    // Find missing chapters
    const existingTitles = new Set(existingChapters.map((c) => c.title));
    const missingChapters = chaptersList.filter(
      (chapter) => !existingTitles.has(chapter)
    );

    console.log('\nMissing chapters:');
    if (missingChapters.length === 0) {
      console.log('No missing chapters!');
    } else {
      missingChapters.forEach((chapter) => console.log(`- ${chapter}`));
      console.log(`\nTotal missing: ${missingChapters.length} chapters`);
    }

    // List the first few matched chapters from the database
    console.log('\nSample of existing chapters:');
    existingChapters.slice(0, 5).forEach((chapter) => {
      console.log(
        `- ID: ${chapter.id}, Number: ${chapter.chapter_number}, Title: ${chapter.title}`
      );
    });

    // Test specific navigation for approach-to-aortic-emergencies
    console.log('\nTesting navigation for "Approach to aortic emergencies":');

    // 1. The system it belongs to
    const systemOfInterest = Object.entries(symptomData).find(
      ([system, symptoms]) =>
        Object.keys(symptoms).includes('Approach to aortic emergencies')
    )?.[0];

    console.log(`System: ${systemOfInterest || 'Not found'}`);

    if (systemOfInterest) {
      // 2. The chapters it should link to
      const linkedChapters =
        symptomData[systemOfInterest]['Approach to aortic emergencies'];
      console.log(`Linked chapters: ${linkedChapters.join(', ')}`);

      // 3. Check if these chapters exist in DB
      const { data: aorticChapters, error: aorticError } = await supabase
        .from('chapters')
        .select('id, title, chapter_number')
        .in('title', linkedChapters);

      if (aorticError) {
        console.log('Error fetching linked chapters:', aorticError);
      } else {
        console.log(
          `Found ${aorticChapters.length}/${linkedChapters.length} chapters in database:`
        );
        aorticChapters.forEach((chapter) => {
          console.log(
            `- ID: ${chapter.id}, Number: ${chapter.chapter_number}, Title: ${chapter.title}`
          );
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
