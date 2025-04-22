// app/blog/[slug]/page.tsx
import BlogPost from '@/components/BlogPost';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPost slug={params.slug} />;
}

// import bookmarkPlugin from '@notion-render/bookmark-plugin';
// import { NotionRenderer } from '@notion-render/client';
// import hljsPlugin from '@notion-render/hljs-plugin';

// export default async function Page({ params }: { params: { slug: string } }) {
//   const page = await fetchBySlug(params.slug);
//   if (!page) {
//     return <div>Page not found</div>;
//   }
//   const blocks = await fetchPageBlocks(post.id);
//   const renderer = new NotionRendererRenderer({
//     client: notion,
//   });
//   renderer.use(hljsPlugin({}));
//   renderer.use(bookmarkPlugin(undefined));
//   const html = await renderer.render(...blocks);
//   return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
// }

// // return (
// //   <div>
// //     <h1>{page.properties.Name.title[0].text.content}</h1>
// //     <p>{page.properties.Description.rich_text[0].text.content}</p>
// //     <div>
// //       {blocks.map((block) => (
// //         <Block key={block.id} block={block} />
// //       ))}
// //     </div>
// //   </div>
// // );

// //
// // export async function generateStaticParams() {
// //   const pages = await fetchPages();
// //   return pages.map((page) => ({
// //     slug: page.properties.Slug.rich_text[0].text.content,
// //   }));
