'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CaseStudy, caseCategories } from '@/lib/site-data';
import { cn } from '@/lib/utils';

interface CaseCardProps {
  study: CaseStudy;
  priority?: boolean;
  className?: string;
}

export function CaseCard({ study, priority = false, className }: CaseCardProps) {
const category = caseCategories.find((item) => item.id === study.category);

  return (
    <Link
      href={`/cases/${study.id}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5',
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={study.cover}
          alt={study.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/5" />
        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
          {category?.label}
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-zinc-800">
          {study.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-primary">
          {study.subtitle}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
          {study.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {study.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {study.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-4 text-sm font-medium">
          <span className="text-muted-foreground transition-colors group-hover:text-foreground">
            {'查看案例'}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
