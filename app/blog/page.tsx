import type { Metadata } from 'next';
import { BlogListing } from '@/components/blog-listing';
import { getAllPosts } from '@/lib/posts';
import { siteUrl, siteName } from '@/app/generateMetadata';

export const metadata: Metadata = {
  title: '技术博客',
  description:
    '鲸码研发团队的技术文章，涵盖 AI 应用、数据平台、后端架构、Elasticsearch、云原生与效率工具。',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: '技术博客',
    description:
      '鲸码研发团队的技术文章，涵盖 AI 应用、数据平台、后端架构、Elasticsearch、云原生与效率工具。',
    url: `${siteUrl}/blog`,
    siteName,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '鲸码科技技术博客',
    url: `${siteUrl}/blog`,
    inLanguage: 'zh-CN',
    publisher: { '@id': `${siteUrl}/#organization` },
    blogPost: posts.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${encodeURIComponent(post.id)}`,
      ...(post.date ? { datePublished: post.date } : {}),
    })),
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <BlogListing posts={posts} />
    </div>
  );
}
