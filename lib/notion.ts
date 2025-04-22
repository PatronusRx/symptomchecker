// lib/notion.ts
import { Client } from '@notionhq/client';

// Create Notion client with API key
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Export database ID from environment variables
export const databaseId = process.env.NOTION_DATABASE_ID as string;

// Function to fetch blog pages from Notion
export async function fetchPages() {
  console.log('Using database ID:', databaseId);
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Status',
      select: {
        equals: 'Live',
      },
    },
  });

  console.log('Notion response received:', response.results.length, 'results');

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
    slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
    excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
    publishedDate: page.properties['Published Date']?.date?.start || null,
    tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
    featuredImage: page.properties['Featured Image']?.url || null,
  }));
}
