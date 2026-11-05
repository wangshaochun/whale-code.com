import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { caseStudies } from '@/lib/site-data';

const baseUrl = 'https://whale-code.com';

function postDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postDates = posts
    .map((post) => postDate(post.date))
    .filter((d): d is Date => Boolean(d));

  // 首页与博客列表以最新文章日期作为更新时间，避免每次构建都刷新 lastmod
  const latestContentDate = postDates.length
    ? new Date(Math.max(...postDates.map((d) => d.getTime())))
    : new Date('2026-01-01');

  const latestCaseYear = caseStudies.reduce(
    (max, study) => Math.max(max, Number(study.year) || 0),
    0,
  );

  return [
    {
      url: baseUrl,
      lastModified: latestContentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: new Date(`${latestCaseYear}-01-01`),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...caseStudies.map((study) => ({
      url: `${baseUrl}/cases/${study.id}`,
      lastModified: new Date(`${study.year}-01-01`),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/blog`,
      lastModified: latestContentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(post.id)}`,
      lastModified: postDate(post.date) ?? latestContentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
