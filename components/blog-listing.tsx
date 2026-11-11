'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock3, Search } from 'lucide-react';
import type { Post } from '@/lib/posts';

const tagRules: { pattern: RegExp; label: string }[] = [
  { pattern: /RAG|知识库|智能体|大模型|LLM|AI/i, label: 'AI 落地' },
  { pattern: /CDP|数据中台|标签|数据治理|用户画像/i, label: '数据平台' },
  { pattern: /麒麟|信创|ARM|离线部署|Nginx|MySQL|Redis/i, label: '信创与部署' },
  { pattern: /Elasticsearch|Elastic|Logstash|ELK|Kibana/i, label: '搜索与日志' },
  { pattern: /Flowable|工作流|BPM|微服务|网关|Spring/i, label: '后端与流程' },
  { pattern: /PPT|Skill|效率工具|编程工具|Copilot|Cursor/i, label: '效率工具' },
];

function getTag(post: Post) {
  if (post.tags.length) return post.tags[0];
  const rule = tagRules.find((item) => item.pattern.test(post.title));
  return rule ? rule.label : '工程实践';
}

function getDisplayDate(post: Post) {
  return post.updated ?? post.date;
}

export function BlogListing({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return posts;

    return posts.filter((post) => {
      const searchable = [post.title, post.description ?? '', ...post.tags].join(' ').toLowerCase();
      return searchable.includes(keyword);
    });
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
            {'技术博客'}
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {'把踩过的坑，写成可复用的经验'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {'只保留三类内容：能照着做的排障记录、能帮助决策的选型分析、能验证交付能力的项目复盘。'}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{posts.length}</strong>{' '}
              {'篇精选'}
            </span>
            <span>AI 落地</span>
            <span>{'数据平台'}</span>
            <span>{'信创与部署'}</span>
            <span>{'后端与流程'}</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {`共 ${filtered.length} 篇文章`}
            </p>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={'搜索标题、摘要或标签…'}
                className="h-10 w-full rounded-full border bg-background pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border bg-muted/30 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {'没有找到匹配的文章。'}
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
                      {getTag(post)}
                    </span>
                    {getDisplayDate(post) && (
                      <time className="shrink-0 text-[11px] text-muted-foreground">
                        {getDisplayDate(post)}
                      </time>
                    )}
                  </div>
                  <h2 className="mt-4 line-clamp-3 text-base font-semibold leading-6 transition-colors group-hover:text-primary sm:text-lg sm:leading-7">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {`${post.readingTime} 分钟阅读`}
                    </span>
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
