// Create a temporary file like inspect-notion-db.js
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function inspectDatabase() {
  try {
    // Get database structure
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    // Log the property schema
    console.log('Database Properties:');
    for (const [name, property] of Object.entries(database.properties)) {
      console.log(`- ${name} (${property.type})`);
    }

    // Get a sample page to see actual property values
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 1,
    });

    if (response.results.length > 0) {
      console.log('\nSample Page Properties:');
      for (const [name, property] of Object.entries(
        response.results[0].properties
      )) {
        console.log(
          `- ${name}: ${JSON.stringify(property).substring(0, 100)}...`
        );
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectDatabase();
