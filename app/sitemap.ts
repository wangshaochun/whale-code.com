import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { caseStudies } from '@/lib/site-data';

const baseUrl = 'https://whale-code.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...caseStudies.map((study) => ({
      url: `${baseUrl}/cases/${study.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(post.id)}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
