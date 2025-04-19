import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define types for our data structure
interface Section {
  section: string;
  approaches: string[];
}

interface SymptomSystemData {
  sections: Section[];
}

export async function GET() {
  try {
    // Read the SymptomSystem.json file
    const filePath = path.join(
      process.cwd(),
      'components',
      'SymptomSystem.json'
    );
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileData) as SymptomSystemData;

    // Extract all approach names from sections and flatten into a single array
    const allApproaches = jsonData.sections.flatMap(
      (section: Section) => section.approaches
    );

    // Return the flattened array as JSON
    return NextResponse.json(allApproaches);
  } catch (error) {
    console.error('Error reading symptom data:', error);
    return NextResponse.json(
      { error: 'Failed to load symptom data' },
      { status: 500 }
    );
  }
}
