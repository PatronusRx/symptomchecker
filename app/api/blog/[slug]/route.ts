// app/api/blog/[slug]/route.ts
import { NextResponse } from 'next/server';
import { notion, databaseId } from '@/lib/notion';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

function hasProperties(page: unknown): page is PageObjectResponse {
  return !!page && typeof page === 'object' && 'properties' in page;
}

export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  // Destructure slug from params to avoid using params.slug directly
  const { slug } = context.params;

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

    if (!hasProperties(page)) {
      return NextResponse.json({ error: 'Invalid Notion page object' }, { status: 500 });
    }

    // Get page content
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    // Safely process the post metadata
    const { properties } = page;

    // Title
    let title = 'Untitled';
    const titleProp = properties.Title;
    if (titleProp && titleProp.type === 'title' && titleProp.title[0]) {
      title = titleProp.title[0].plain_text;
    }

    // Slug
    let slugValue = '';
    const slugProp = properties.Slug;
    if (slugProp && slugProp.type === 'rich_text' && slugProp.rich_text[0]) {
      slugValue = slugProp.rich_text[0].plain_text;
    }

    // Excerpt
    let excerpt = '';
    const excerptProp = properties.Excerpt;
    if (excerptProp && excerptProp.type === 'rich_text' && excerptProp.rich_text[0]) {
      excerpt = excerptProp.rich_text[0].plain_text;
    }

    // Published Date
    let publishedDate = null;
    const publishedDateProp = properties['Published Date'];
    if (publishedDateProp && publishedDateProp.type === 'date' && publishedDateProp.date) {
      publishedDate = publishedDateProp.date.start;
    }

    // Tags
    let tags: string[] = [];
    const tagsProp = properties.Tags;
    if (tagsProp && tagsProp.type === 'multi_select' && Array.isArray(tagsProp.multi_select)) {
      tags = tagsProp.multi_select.map((tag: { name: string }) => tag.name);
    }

    // Author
    let author = 'Anonymous';
    const authorProp = properties.Author;
    if (authorProp && authorProp.type === 'people' && authorProp.people[0]) {
      const person = authorProp.people[0];
      author = 'name' in person && person.name ? person.name : 'Anonymous';
    }

    // Featured Image
    let featuredImage = null;
    const featuredImageProp = properties['Featured Image'];
    if (featuredImageProp && featuredImageProp.type === 'url') {
      featuredImage = featuredImageProp.url;
    }

    // Status
    let status = 'Draft';
    const statusProp = properties.Status;
    if (statusProp && statusProp.type === 'select' && statusProp.select) {
      status = statusProp.select.name;
    }

    const post = {
      id: page.id,
      title,
      slug: slugValue,
      excerpt,
      publishedDate,
      tags,
      author,
      featuredImage,
      status,
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
