import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

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

async function addApproachChapters() {
  try {
    console.log('Reading approach chapters from SymptomSystem.json...');
    const filePath = path.join(
      process.cwd(),
      'components',
      'SymptomSystem.json'
    );
    const fileData = fs.readFileSync(filePath, 'utf8');
    const approaches = JSON.parse(fileData);

    console.log(`Found ${approaches.length} approaches to add as chapters.`);

    // Convert approaches to chapter format
    const chapters = approaches.map((title) => ({
      title,
      chapter_number: null, // You can set a specific number if needed
    }));

    // Insert chapters into the database
    console.log('Inserting approach chapters into the database...');
    const { error } = await supabase
      .from('chapters')
      .upsert(chapters, { onConflict: 'title' });

    if (error) {
      console.error('Error inserting chapters:', error);
      return;
    }

    console.log('Successfully added approach chapters to the database!');
    console.log('You should now be able to navigate to any approach page.');
  } catch (error) {
    console.error('Error:', error);
  }
}

addApproachChapters();
