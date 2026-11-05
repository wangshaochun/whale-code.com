import { getAllPostIds, getPostData, stripMarkdown } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
import { siteUrl, siteName } from '@/app/generateMetadata';

// 内容来自本地 Markdown，按小时增量静态化，兼顾更新与 CDN 缓存
export const revalidate = 3600;

export async function generateStaticParams() {
  const postIds = getAllPostIds();
  return postIds.map(params => ({
    id: params.id,
  }));
}

function buildDescription(title: string, content: string, limit = 140) {
  const text = stripMarkdown(content);
  const body = text.startsWith(title) ? text : `${title}：${text}`;
  return body.slice(0, limit);
}

function canonicalPath(id: string) {
  return `/blog/${encodeURIComponent(decodeURIComponent(id))}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const post = getPostData(id);
    const description = buildDescription(post.title, post.content);
    const url = `${siteUrl}${canonicalPath(id)}`;

    return {
      title: post.title,
      description,
      alternates: { canonical: canonicalPath(id) },
      openGraph: {
        type: 'article',
        title: post.title,
        description,
        url,
        siteName,
        ...(post.date ? { publishedTime: post.date, modifiedTime: post.date } : {}),
        images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: ['/images/og-image.png'],
      },
    };
  } catch (error) {
    return {
      title: '文章未找到',
    };
  }
}

export default async function PostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const resolvedParams = await params;
    const post = getPostData(resolvedParams.id);
    const url = `${siteUrl}${canonicalPath(resolvedParams.id)}`;
    const description = buildDescription(post.title, post.content, 200);

    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': url,
          headline: post.title,
          description,
          url,
          mainEntityOfPage: { '@id': url },
          inLanguage: 'zh-CN',
          ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
          author: { '@id': `${siteUrl}/#organization` },
          publisher: { '@id': `${siteUrl}/#organization` },
          image: `${siteUrl}/images/og-image.png`,
          isPartOf: { '@id': `${siteUrl}/#website` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '首页', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: '技术博客', item: `${siteUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        },
      ],
    };

    return (
      <div className="container mx-auto px-4 py-10 md:py-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← 返回博客列表
        </Link>

        <article className="mx-auto mt-8 max-w-3xl">
          <header className="border-b pb-7">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            {post.date && (
              <time dateTime={post.date} className="mt-3 block text-sm text-muted-foreground">
                发布时间：{post.date}
              </time>
            )}
          </header>

          <div className="markdown-body mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              ← 继续阅读其他文章
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
            >
              有类似的技术需求？聊聊 →
            </Link>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <div className="container mx-auto px-4 py-10">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          ← 返回博客列表
        </Link>
        <div className="py-20 text-center text-muted-foreground">文章加载失败</div>
      </div>
    );
  }
}
