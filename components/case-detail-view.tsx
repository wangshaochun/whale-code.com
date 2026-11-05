'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { caseCategories, caseStudies } from '@/lib/site-data';

interface CaseDetailViewProps {
  caseId: string;
}

export function CaseDetailView({ caseId }: CaseDetailViewProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const study = caseStudies.find((item) => item.id === caseId);

  if (!study) {
    return (
      <div className="container py-24 text-center">
        <p className="text-lg font-medium">
          {language === 'zh' ? '案例不存在或已下线。' : 'This case could not be found.'}
        </p>
        <Link href="/cases" className="mt-4 inline-flex text-sm text-primary hover:underline">
          {t('backToCases')}
        </Link>
      </div>
    );
  }

  const category = caseCategories.find((item) => item.id === study.category);
  const currentIndex = caseStudies.findIndex((item) => item.id === study.id);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <article>
      <header className="border-b bg-gradient-to-b from-primary/[0.05] to-background">
        <div className="container py-10 md:py-14">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToCases')}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {category?.label[language]}
                </span>
                <span className="text-muted-foreground">{study.subtitle[language]}</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-muted-foreground">{study.year}</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {study.title[language]}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                {study.summary[language]}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 lg:max-w-[300px] lg:justify-end">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container pt-10 md:pt-12">
        <div className="overflow-hidden rounded-2xl border bg-muted shadow-sm">
          <div className="flex h-9 items-center gap-1.5 border-b bg-muted/60 px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 truncate text-[11px] text-muted-foreground">
              {study.title[language]}
            </span>
          </div>
          <div className="relative aspect-[16/9]">
            <Image
              src={study.cover}
              alt={study.title[language]}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="container grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div className="min-w-0">
          <section>
            <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="font-mono text-xs text-primary/60">01</span>
              {t('projectBackground')}
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/80">
              {study.challenge[language]}
            </p>
          </section>

          <section className="mt-12">
            <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="font-mono text-xs text-primary/60">02</span>
              {t('projectSolution')}
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground/80">
              {study.solution[language]}
            </p>
          </section>

          <section className="mt-12">
            <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="font-mono text-xs text-primary/60">03</span>
              {t('projectResults')}
            </h2>
            <ul className="mt-5 space-y-3">
              {study.results.map((result) => (
                <li key={result.en} className="flex items-start gap-3 text-sm leading-6 sm:text-base">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground/80">{result[language]}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="font-mono text-xs text-primary/60">04</span>
              {t('projectGallery')}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {study.images.map((image, index) => {
                const isWide =
                  index === 0 ||
                  (index === study.images.length - 1 && (study.images.length - 1) % 2 === 1);

                return (
                  <figure key={image.src} className={isWide ? 'sm:col-span-2' : undefined}>
                    <div
                      className={`relative overflow-hidden rounded-xl border bg-muted ${
                        isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.caption[language]}
                        fill
                        sizes={
                          isWide
                            ? '(max-width: 1200px) 100vw, 800px'
                            : '(max-width: 768px) 100vw, 400px'
                        }
                        className={isWide ? 'object-cover object-top' : 'object-contain'}
                      />
                    </div>
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {image.caption[language]}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="grid grid-cols-3 gap-2 rounded-2xl border bg-muted/40 p-4 lg:grid-cols-1">
            {study.metrics.map((metric) => (
              <div key={metric.label.en} className="rounded-xl bg-background p-3 text-center lg:text-left">
                <p className="text-xl font-bold text-primary sm:text-2xl">
                  {language === 'en' && metric.valueEn ? metric.valueEn : metric.value}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                  {metric.label[language]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t('projectTech')}
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {study.tech.map((tech) => (
                <span key={tech} className="rounded-md bg-muted px-2 py-1 font-mono text-[11px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-950 p-5 text-white">
            <h3 className="text-base font-semibold">
              {language === 'zh' ? '有类似的项目需求？' : 'A similar project in mind?'}
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              {language === 'zh'
                ? '把场景和目标告诉我们，我们会给出可执行的建议与报价。'
                : 'Tell us the scenario and the goal. We will come back with a practical plan and quote.'}
            </p>
            <Link
              href="/#contact"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
            >
              {t('requestSimilar')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>

      <div className="border-t bg-muted/30">
        <div className="container py-10 md:py-12">
          <Link
            href={`/cases/${nextStudy.id}`}
            className="group flex flex-col gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:p-5"
          >
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-56">
              <Image
                src={nextStudy.cover}
                alt={nextStudy.title[language]}
                fill
                sizes="224px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                {t('projectNext')}
              </p>
              <h2 className="mt-2 text-lg font-semibold transition-colors group-hover:text-primary sm:text-xl">
                {nextStudy.title[language]}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{nextStudy.subtitle[language]}</p>
            </div>
            <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:block" />
          </Link>
        </div>
      </div>
    </article>
  );
}
