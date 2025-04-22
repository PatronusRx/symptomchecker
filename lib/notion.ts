// import 'server-only';
// import { Client } from '@notionhq/client';
// import {
//   BlockObjectResponse,
//   PageObjectResponse,
// } from '@notionhq/client/build/src/api-endpoints';

// // Create a Notion client instance
// export const notion = new Client({
//   auth: process.env.NOTION_TOKEN,
// });

// // For pages directory, we can't use React.cache or server-only
// // Instead, we'll create regular async functions

// export async function fetchPages() {
//   const response = await notion.databases.query({
//     database_id: process.env.NOTION_DATABASE_ID!,
//     filter: {
//       property: 'Status',
//       select: {
//         equals: 'Live',
//       },
//     },
//   });
//   return response.results.map((page: any) => ({
//     id: page.id,
//     title: page.properties.Title.title[0]?.plain_text || '',
//     slug: page.properties.Slug.rich_text[0]?.plain_text || '',
//     date: page.properties.Date?.date?.start || '',
//   }));
// }

// export async function fetchBySlug(slug: string) {
//   const response = await notion.databases.query({
//     database_id: process.env.NOTION_DATABASE_ID!,
//     filter: {
//       property: 'Slug',
//       rich_text: {
//         equals: slug,
//       },
//     },
//   });

//   const page = response.results[0] as PageObjectResponse | undefined;
//   if (!page) return undefined;
//   return {
//     id: page.id,
//     title: page.properties.Title.title[0]?.plain_text || '',
//     slug: page.properties.Slug.rich_text[0]?.plain_text || '',
//     date: page.properties.Date?.date?.start || '',
//   };
// }

// export async function fetchPageBlocks(pageId: string) {
//   const response = await notion.blocks.children.list({
//     block_id: pageId,
//   });

//   return response.results as BlockObjectResponse[];
// }
// lib/notion.ts
import { Client } from '@notionhq/client';

// Create Notion client with API key
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Export database ID from environment variables
export const databaseId = process.env.NOTION_DATABASE_ID as string;
