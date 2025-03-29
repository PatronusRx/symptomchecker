import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the SymptomSystem.json file
    const filePath = path.join(
      process.cwd(),
      'components',
      'SymptomSystem.json'
    );
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);

    // Return the data as JSON
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading symptom data:', error);
    return NextResponse.json(
      { error: 'Failed to load symptom data' },
      { status: 500 }
    );
  }
}
