// components/BlogIndex.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedDate: string;
  tags: string[];
  author: string;
  featuredImage: string | null;
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {post.featuredImage && (
              <div className="relative h-48 w-full">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex gap-2 mb-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-gray-600 mb-4">{post.excerpt}</p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.author}</span>
                <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center p-8">
          <p className="text-gray-500">No posts found</p>
        </div>
      )}
    </div>
  );
}
