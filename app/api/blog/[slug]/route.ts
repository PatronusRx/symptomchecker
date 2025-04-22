// app/api/blog/[slug]/route.ts
import { NextResponse } from 'next/server';
import { notion, databaseId } from '@/lib/notion';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    // Find the page by slug
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug,
        },
      },
    });

    if (!response.results[0]) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const page = response.results[0];

    // Get page content
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    // Process the post metadata
    const post = {
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
      publishedDate: page.properties['Published Date']?.date?.start || null,
      tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
      author: page.properties.Author?.people?.[0]?.name || 'Anonymous',
      featuredImage: page.properties['Featured Image']?.url || null,
      status: page.properties.Status?.select?.name || 'Draft',
      content: blocks.results,
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
