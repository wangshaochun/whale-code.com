import {
  extractFaq,
  extractHeadings,
  getAllPostIds,
  getPostData,
  getPostDescription,
  getRelatedPosts,
  slugifyHeading,
} from '@/lib/posts';
import ReactMarkdown, { type Components } from 'react-markdown';
import Link from 'next/link';
import { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
import { siteUrl, siteName } from '@/app/generateMetadata';

// 内容来自本地 Markdown，按小时增量静态化，兼顾更新与 CDN 缓存
export const revalidate = 3600;

// 未在 generateStaticParams 中声明的旧 URL 直接 404；
// 已合并的文章由 middleware.ts 做 301，不会走到这里。
export const dynamicParams = false;

export async function generateStaticParams() {
  const postIds = getAllPostIds();
  return postIds.map((params) => ({
    id: params.id,
  }));
}

function canonicalPath(id: string) {
  return `/blog/${encodeURIComponent(decodeURIComponent(id))}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const post = getPostData(id);
    const description = getPostDescription(post, post.content);
    const url = `${siteUrl}${canonicalPath(id)}`;

    return {
      title: post.title,
      description,
      keywords: post.tags,
      ...(post.author ? { authors: [{ name: post.author }] } : {}),
      alternates: { canonical: canonicalPath(id) },
      openGraph: {
        type: 'article',
        title: post.title,
        description,
        url,
        siteName,
        ...(post.date ? { publishedTime: post.date } : {}),
        ...(post.updated || post.date ? { modifiedTime: post.updated ?? post.date } : {}),
        tags: post.tags,
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
    const description = getPostDescription(post, post.content);
    const headings = extractHeadings(post.content);
    const faqs = extractFaq(post.content);
    const relatedPosts = getRelatedPosts(post.id, 3);
    const displayDate = post.updated ?? post.date;

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
          ...(post.date ? { datePublished: post.date } : {}),
          ...(displayDate ? { dateModified: displayDate } : {}),
          author: {
            '@type': 'Organization',
            name: post.author ?? siteName,
            url: siteUrl,
          },
          publisher: { '@id': `${siteUrl}/#organization` },
          image: `${siteUrl}/images/og-image.png`,
          isPartOf: { '@id': `${siteUrl}/#website` },
          ...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
          ...(post.tags.length ? { articleSection: post.tags[0] } : {}),
          wordCount: post.content.replace(/\s/g, '').length,
          timeRequired: `PT${post.readingTime}M`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '首页', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: '技术博客', item: `${siteUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        },
        ...(faqs.length
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              },
            ]
          : []),
      ],
    };

    const headingComponents: Components = {
      h2: ({ children }) => (
        <h2 id={slugifyHeading(String(children))} className="scroll-mt-24">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 id={slugifyHeading(String(children))} className="scroll-mt-24">
          {children}
        </h3>
      ),
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
            {post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>{post.author ?? '鲸码研发团队'}</span>
              {post.date && (
                <time dateTime={post.date}>
                  发布：{post.date}
                </time>
              )}
              {post.updated && post.updated !== post.date && (
                <time dateTime={post.updated}>
                  更新：{post.updated}
                </time>
              )}
              <span>{post.readingTime} 分钟阅读</span>
            </div>
          </header>

          {headings.length > 1 && (
            <nav className="mt-8 rounded-2xl border bg-muted/30 p-5" aria-label="文章目录">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                本文目录
              </p>
              <ol className="mt-3 space-y-2 text-sm">
                {headings.map((heading) => (
                  <li key={`${heading.id}-${heading.text}`} className={heading.level === 3 ? 'pl-4' : ''}>
                    <a
                      href={`#${heading.id}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="markdown-body mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={headingComponents}>
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-10 rounded-2xl border bg-muted/30 p-6">
            <p className="text-sm font-semibold">关于作者</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {post.author ?? '鲸码研发团队'}
              ，长期做企业级系统、AI 知识库、数据中台与信创环境交付。文中命令与配置均来自实际项目，版本不同请先在测试环境验证。
            </p>
            <Link
              href="/#contact"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
            >
              有类似的技术需求？聊聊 →
            </Link>
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-12 border-t pt-8">
              <h2 className="text-lg font-semibold">继续阅读</h2>
              <div className="mt-4 grid gap-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${encodeURIComponent(related.id)}`}
                    className="group rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                        {related.tags[0] ?? '工程实践'}
                      </span>
                      {(related.updated ?? related.date) && (
                        <span>{related.updated ?? related.date}</span>
                      )}
                    </div>
                    <p className="mt-2 font-medium transition-colors group-hover:text-primary">
                      {related.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              ← 继续阅读其他文章
            </Link>
            <Link
              href="/cases"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              查看项目案例 →
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
