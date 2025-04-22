// app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { notion, databaseId } from '@/lib/notion';

export async function GET() {
  try {
    console.log('Using database ID:', databaseId);

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published', // Only get published posts
        },
      },
      sorts: [
        {
          property: 'Published Date', // Correct property name from your DB
          direction: 'descending',
        },
      ],
    });

    console.log(
      'Notion response received:',
      response.results.length,
      'results'
    );

    // Transform the results using the exact properties you have
    const posts = response.results.map((page) => {
      return {
        id: page.id,
        title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
        slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
        excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
        publishedDate: page.properties['Published Date']?.date?.start || null,
        tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
        author: page.properties.Author?.people?.[0]?.name || 'Anonymous',
        featuredImage: page.properties['Featured Image']?.url || null,
        status: page.properties.Status?.select?.name || 'Draft',
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
