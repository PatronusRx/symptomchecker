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

  return response.results
    .map((page) => {
      if (!('properties' in page)) return null;

      const title =
        page.properties.Title?.type === 'title' &&
        Array.isArray(page.properties.Title.title)
          ? page.properties.Title.title[0]?.plain_text || 'Untitled'
          : 'Untitled';

      const slug =
        page.properties.Slug?.type === 'rich_text' &&
        Array.isArray(page.properties.Slug.rich_text)
          ? page.properties.Slug.rich_text[0]?.plain_text || ''
          : '';

      const excerpt =
        page.properties.Excerpt?.type === 'rich_text' &&
        Array.isArray(page.properties.Excerpt.rich_text)
          ? page.properties.Excerpt.rich_text[0]?.plain_text || ''
          : '';

      const publishedDate =
        page.properties['Published Date']?.type === 'date'
          ? page.properties['Published Date'].date?.start || null
          : null;

      const tags =
        page.properties.Tags?.type === 'multi_select' &&
        Array.isArray(page.properties.Tags.multi_select)
          ? page.properties.Tags.multi_select.map(
              (tag: { name: string }) => tag.name
            )
          : [];

      const featuredImage =
        page.properties['Featured Image']?.type === 'url'
          ? page.properties['Featured Image'].url
          : null;

      return {
        id: page.id,
        title,
        slug,
        excerpt,
        publishedDate,
        tags,
        featuredImage,
      };
    })
    .filter((page): page is NonNullable<typeof page> => page !== null);
}
