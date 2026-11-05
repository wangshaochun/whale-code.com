'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CaseCard } from '@/components/case-card';
import { SectionHeading } from '@/components/section-heading';
import { useLanguage } from '@/components/language-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { caseStudies } from '@/lib/site-data';

export function CaseStudiesSection() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <section id="cases" className="scroll-mt-20 border-y bg-muted/30 py-20 md:py-24">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t('caseStudiesEyebrow')}
            title={t('caseStudiesTitle')}
            description={t('caseStudiesDesc')}
          />
          <Link
            href="/cases"
            className="group hidden shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary md:inline-flex"
          >
            {t('viewAllCases')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}
              viewport={{ once: true, margin: '-60px' }}
              className="h-full"
            >
              <CaseCard study={study} />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-2"
          >
            <Link
              href="/cases"
              className="group flex h-full min-h-[180px] flex-col justify-between gap-6 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] p-6 transition-colors hover:border-primary/60 hover:bg-primary/[0.07] sm:flex-row sm:items-center sm:p-8"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {language === 'zh' ? '更多案例' : 'More work'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  {language === 'zh' ? '还有更多行业项目，等你来聊' : 'More industry projects behind the scenes'}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  {language === 'zh'
                    ? '航运、教育、审计、医疗、零售……每个项目都从具体业务问题开始。查看完整案例，或直接告诉我们你的场景。'
                    : 'Shipping, education, audit, healthcare, retail — every project starts with a concrete business problem. Browse the full portfolio or tell us about yours.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(language === 'zh'
                    ? ['航运物流', '教育', '审计', '医疗', '零售电商']
                    : ['Shipping', 'Education', 'Audit', 'Healthcare', 'Retail']
                  ).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-primary/15 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
