import type { Metadata } from 'next';
import { BlogListing } from '@/components/blog-listing';
import { getAllPosts, getPostDescription } from '@/lib/posts';
import { siteUrl, siteName } from '@/app/generateMetadata';

const blogDescription =
  '鲸码研发团队的技术文章：企业 AI 知识库、数据中台、Elasticsearch、微服务排障、麒麟信创与离线部署。只写能落地、能验证的经验。';

export const metadata: Metadata = {
  title: '技术博客',
  description: blogDescription,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: '技术博客',
    description: blogDescription,
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
    description: blogDescription,
    inLanguage: 'zh-CN',
    publisher: { '@id': `${siteUrl}/#organization` },
    blogPost: posts.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: getPostDescription(post),
      url: `${siteUrl}/blog/${encodeURIComponent(post.id)}`,
      ...(post.date ? { datePublished: post.date } : {}),
      ...(post.updated ?? post.date ? { dateModified: post.updated ?? post.date } : {}),
      ...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
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
