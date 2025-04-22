// test-notion.js
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Log the environment variables (redacted for security)
console.log('API Key present:', !!process.env.NOTION_API_KEY);
console.log('Database ID:', process.env.NOTION_DATABASE_ID);

// Initialize the client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Test the connection
async function testConnection() {
  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    console.log('Connection successful!');
    console.log('Database title:', response.title[0]?.plain_text);
  } catch (error) {
    console.error('Error connecting to Notion:');
    console.error(error.message);
  }
}

testConnection();
