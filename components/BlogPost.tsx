// components/BlogPost.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

// Type for Notion rich text objects
interface NotionRichText {
  plain_text: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
  };
}

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedDate: string;
  tags: string[];
  author: string;
  featuredImage: string | null;
  content: NotionBlock[];
}

export default function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load blog post'
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
        <div className="mt-4">
          <Link
            href="/blog"
            className="text-blue-600 hover:underline flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-center p-8">
          <p className="text-gray-500">Post not found</p>
        </div>
        <div className="mt-4">
          <Link
            href="/blog"
            className="text-blue-600 hover:underline flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <Link
          href="/blog"
          className="text-blue-600 hover:underline flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Blog
        </Link>
      </div>

      <article>
        <header className="mb-6">
          <div className="flex gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>

          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>By {post.author}</span>
            <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
          </div>

          {post.featuredImage && (
            <div className="relative h-64 md:h-80 w-full mb-6">
              <Image
                src={post.featuredImage}
                alt={post.title}
                className="object-cover rounded-lg"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}
        </header>

        <div className="prose max-w-none">
          {renderNotionContent(post.content)}
        </div>
      </article>
    </div>
  );
}

// Function to render Notion content blocks
function renderNotionContent(blocks: NotionBlock[]) {
  return blocks.map((block) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={block.id} className="mb-4">
            {Array.isArray(
              (block as { paragraph?: { rich_text?: NotionRichText[] } })
                .paragraph?.rich_text
            ) &&
              (
                block as { paragraph?: { rich_text?: NotionRichText[] } }
              ).paragraph!.rich_text!.map(
                (text: NotionRichText, index: number) => (
                  <span
                    key={index}
                    className={`
                  ${text.annotations.bold ? 'font-bold' : ''}
                  ${text.annotations.italic ? 'italic' : ''}
                  ${text.annotations.underline ? 'underline' : ''}
                  ${text.annotations.strikethrough ? 'line-through' : ''}
                  ${
                    text.annotations.code
                      ? 'font-mono bg-gray-100 p-0.5 rounded'
                      : ''
                  }
                `}
                  >
                    {text.plain_text}
                  </span>
                )
              )}
          </p>
        );

      case 'heading_1':
        return (
          <h1 key={block.id} className="text-3xl font-bold mt-8 mb-4">
            {Array.isArray(
              (block as { heading_1?: { rich_text?: NotionRichText[] } })
                .heading_1?.rich_text
            ) &&
              (block as { heading_1?: { rich_text?: NotionRichText[] } })
                .heading_1!.rich_text!.map(
                  (page: NotionRichText) => page.plain_text
                )
                .join('')}
          </h1>
        );

      case 'heading_2':
        return (
          <h2 key={block.id} className="text-2xl font-bold mt-6 mb-3">
            {Array.isArray(
              (block as { heading_2?: { rich_text?: NotionRichText[] } })
                .heading_2?.rich_text
            ) &&
              (block as { heading_2?: { rich_text?: NotionRichText[] } })
                .heading_2!.rich_text!.map(
                  (page: NotionRichText) => page.plain_text
                )
                .join('')}
          </h2>
        );

      case 'heading_3':
        return (
          <h3 key={block.id} className="text-xl font-bold mt-5 mb-2">
            {Array.isArray(
              (block as { heading_3?: { rich_text?: NotionRichText[] } })
                .heading_3?.rich_text
            ) &&
              (block as { heading_3?: { rich_text?: NotionRichText[] } })
                .heading_3!.rich_text!.map(
                  (page: NotionRichText) => page.plain_text
                )
                .join('')}
          </h3>
        );

      case 'bulleted_list_item':
        return (
          <ul key={block.id} className="list-disc pl-6 mb-4">
            <li>
              {Array.isArray(
                (
                  block as {
                    bulleted_list_item?: { rich_text?: NotionRichText[] };
                  }
                ).bulleted_list_item?.rich_text
              ) &&
                (
                  block as {
                    bulleted_list_item?: { rich_text?: NotionRichText[] };
                  }
                )
                  .bulleted_list_item!.rich_text!.map(
                    (page: NotionRichText) => page.plain_text
                  )
                  .join('')}
            </li>
          </ul>
        );

      case 'numbered_list_item':
        return (
          <ol key={block.id} className="list-decimal pl-6 mb-4">
            <li>
              {Array.isArray(
                (
                  block as {
                    numbered_list_item?: { rich_text?: NotionRichText[] };
                  }
                ).numbered_list_item?.rich_text
              ) &&
                (
                  block as {
                    numbered_list_item?: { rich_text?: NotionRichText[] };
                  }
                )
                  .numbered_list_item!.rich_text!.map(
                    (page: NotionRichText) => page.plain_text
                  )
                  .join('')}
            </li>
          </ol>
        );

      case 'quote':
        return (
          <blockquote
            key={block.id}
            className="border-l-4 border-gray-300 pl-4 py-1 my-4 italic"
          >
            {Array.isArray(
              (block as { quote?: { rich_text?: NotionRichText[] } }).quote
                ?.rich_text
            ) &&
              (block as { quote?: { rich_text?: NotionRichText[] } })
                .quote!.rich_text!.map(
                  (page: NotionRichText) => page.plain_text
                )
                .join('')}
          </blockquote>
        );

      case 'code':
        return (
          <pre
            key={block.id}
            className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4"
          >
            <code>
              {Array.isArray(
                (block as { code?: { rich_text?: NotionRichText[] } }).code
                  ?.rich_text
              ) &&
                (block as { code?: { rich_text?: NotionRichText[] } })
                  .code!.rich_text!.map(
                    (page: NotionRichText) => page.plain_text
                  )
                  .join('')}
            </code>
          </pre>
        );

      case 'image':
        return (
          <figure key={block.id} className="my-6">
            <Image
              src={
                ((
                  block as {
                    image?: {
                      type?: string;
                      external?: { url?: string };
                      file?: { url?: string };
                    };
                  }
                ).image?.type === 'external'
                  ? (block as { image?: { external?: { url?: string } } }).image
                      ?.external?.url
                  : (block as { image?: { file?: { url?: string } } }).image
                      ?.file?.url) || ''
              }
              alt="Blog image"
              className="w-full rounded-md"
              width={1200}
              height={600}
              layout="responsive"
            />
            {(() => {
              const imageBlock = block as {
                image?: { caption?: NotionRichText[] };
              };
              return Array.isArray(imageBlock.image?.caption) &&
                imageBlock.image.caption.length > 0 ? (
                <figcaption className="text-sm text-center text-gray-500 mt-2">
                  {imageBlock.image.caption[0]?.plain_text}
                </figcaption>
              ) : null;
            })()}
          </figure>
        );

      case 'divider':
        return <hr key={block.id} className="my-6 border-gray-200" />;

      default:
        return (
          <div key={block.id} className="text-gray-500 my-2">
            Unsupported block type: {block.type}
          </div>
        );
    }
  });
}
