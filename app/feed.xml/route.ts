import { getAllPosts, getPostData, getPostDescription } from '@/lib/posts';
import { siteUrl, siteName } from '../generateMetadata';

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      let description = post.description ?? '';
      if (!description) {
        try {
          description = getPostDescription(post, getPostData(post.id).content);
        } catch {
          description = post.title;
        }
      }

      const url = `${siteUrl}/blog/${encodeURIComponent(post.id)}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
${categories}
    </item>`;
    })
    .join('\n');

  const latestDate = posts
    .map((post) => post.updated ?? post.date)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteName} · 技术博客`)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml('鲸码研发团队的技术文章：企业 AI 知识库、数据中台、Elasticsearch、微服务排障、麒麟信创与离线部署。')}</description>
    <language>zh-CN</language>
    ${latestDate ? `<lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>` : ''}
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
