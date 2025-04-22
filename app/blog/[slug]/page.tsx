// app/blog/[slug]/page.tsx
import BlogPost from '@/components/BlogPost';

// Making this a server component and correctly handling params
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  return <BlogPost slug={slug} />;
}
