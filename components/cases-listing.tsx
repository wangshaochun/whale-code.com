'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { CaseCard } from '@/components/case-card';
import { CaseCategory, caseCategories, caseStudies } from '@/lib/site-data';
import { cn } from '@/lib/utils';

export function CasesListing() {
const [active, setActive] = useState<'all' | CaseCategory>('all');

  const filtered = useMemo(
    () => (active === 'all' ? caseStudies : caseStudies.filter((study) => study.category === active)),
    [active]
  );

  return (
    <>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.05] to-background py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-8 bg-primary/70" />
            {'项目案例'}
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {'把业务难题，做成可落地的系统'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {'从企业级平台、AI 知识库到小程序与数据中台，以下项目均已上线运行，并持续迭代维护。'}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{caseStudies.length}</strong>{' '}
              {'个完整案例'}
            </span>
            <span>
              <strong className="text-foreground">6</strong>{' '}
              {'个行业场景'}
            </span>
            <span>
              <strong className="text-foreground">10+</strong>{' '}
              {'年研发经验'}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="/whale-code-cases.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <Download className="h-4 w-4" />
              {'下载项目案例 PDF'}
            </a>
            <span className="text-xs text-muted-foreground">
              {'19 页 · 含项目截图'}
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-wrap gap-2">
            {caseCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActive(category.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-colors',
                  active === category.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                {category.label}
                <span
                  className={cn(
                    'ml-2 text-[11px]',
                    active === category.id ? 'text-primary-foreground/70' : 'text-muted-foreground/60'
                  )}
                >
                  {category.id === 'all'
                    ? caseStudies.length
                    : caseStudies.filter((study) => study.category === category.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((study, index) => (
              <CaseCard key={study.id} study={study} priority={index === 0} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {'暂无该分类案例。'}
            </p>
          )}

          <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border bg-muted/40 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-xl font-semibold">
                {'你的项目，也可以从这里开始'}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {'告诉我们业务场景、目标和时间预期，我们会给出可执行的方案与报价。'}
              </p>
            </div>
            <Link
              href="/#contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {'聊聊你的需求'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
