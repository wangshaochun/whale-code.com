'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import type { Post } from '@/lib/posts';

const tagRules: { pattern: RegExp; zh: string; en: string }[] = [
  { pattern: /AI|Transformer|模型|智能体/i, zh: 'AI / 模型', en: 'AI / Models' },
  { pattern: /Elastic|Logstash|ELK|Kibana/i, zh: '搜索与日志', en: 'Search & Logs' },
  { pattern: /Docker|K8S|Kubernetes|Linux|nginx|麒麟/i, zh: '云原生', en: 'Cloud Native' },
  { pattern: /mysql|redis|postgres|数据库/i, zh: '数据库', en: 'Database' },
  { pattern: /flowable|spring|微服务|网关|K8S/i, zh: '后端架构', en: 'Backend' },
  { pattern: /PPT|设计|图片|Dribbble|iloveimg/i, zh: '效率工具', en: 'Productivity' },
];

function getTag(title: string, language: 'zh' | 'en') {
  const rule = tagRules.find((item) => item.pattern.test(title));
  return rule ? rule[language] : language === 'zh' ? '工程实践' : 'Engineering';
}

export function BlogListing({ posts }: { posts: Post[] }) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(keyword));
  }, [posts, query]);

  return (
    <>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.05] to-background py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
          <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-8 bg-primary/70" />
            {language === 'zh' ? '技术博客' : 'Engineering blog'}
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {language === 'zh' ? '把踩过的坑，写成可复用的经验' : 'Notes from the field'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {language === 'zh'
              ? '研发团队在日常项目中沉淀的技术文章，涵盖 AI、数据、后端架构、运维与效率工具。'
              : 'Technical notes from our projects, covering AI, data, backend architecture, operations and productivity.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{posts.length}</strong>{' '}
              {language === 'zh' ? '篇文章' : 'articles'}
            </span>
            <span>AI / 数据</span>
            <span>{language === 'zh' ? '后端架构' : 'Backend'}</span>
            <span>{language === 'zh' ? '运维实践' : 'Operations'}</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {language === 'zh'
                ? `共 ${filtered.length} 篇文章`
                : `${filtered.length} article${filtered.length === 1 ? '' : 's'}`}
            </p>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={language === 'zh' ? '搜索文章标题…' : 'Search articles…'}
                className="h-10 w-full rounded-full border bg-background pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border bg-muted/30 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {language === 'zh' ? '没有找到匹配的文章。' : 'No matching articles.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${encodeURIComponent(post.id)}`}
                  className="group flex h-full flex-col rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      {getTag(post.title, language)}
                    </span>
                    {post.date && (
                      <time className="shrink-0 text-[11px] text-muted-foreground">
                        {post.date}
                      </time>
                    )}
                  </div>
                  <h2 className="mt-4 line-clamp-3 text-base font-semibold leading-6 transition-colors group-hover:text-primary sm:text-lg sm:leading-7">
                    {post.title}
                  </h2>
                  <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                    <span>{language === 'zh' ? '阅读文章' : 'Read article'}</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
