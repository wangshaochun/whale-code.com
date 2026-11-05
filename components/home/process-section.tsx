'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/section-heading';
import { useLanguage } from '@/components/language-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { deliverySteps } from '@/lib/site-data';

export function ProcessSection() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <section
      id="process"
      className="relative scroll-mt-20 overflow-hidden bg-zinc-950 py-20 text-white md:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <SectionHeading
          eyebrow={t('processEyebrow')}
          title={t('processTitle')}
          description={t('processDesc')}
          inverted
        />

        <div className="mt-14 grid gap-10 md:grid-cols-5 md:gap-4">
          {deliverySteps.map((step, index) => (
            <motion.div
              key={step.title.en}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true, margin: '-60px' }}
              className="relative"
            >
              {index < deliverySteps.length - 1 && (
                <span className="absolute left-12 right-[-16px] top-5 hidden h-px bg-gradient-to-r from-white/25 to-white/5 md:block" />
              )}
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-zinc-950 font-mono text-sm text-primary">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title[language]}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {step.description[language]}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {language === 'zh'
              ? '每个阶段都有明确产出与验收标准，项目进度随时可见。'
              : 'Every stage has clear deliverables and acceptance criteria, so progress is always visible.'}
          </p>
          <a
            href="#contact"
            className="font-medium text-primary transition-opacity hover:opacity-80"
          >
            {language === 'zh' ? '从一次沟通开始 →' : 'Start with a conversation →'}
          </a>
        </div>
      </div>
    </section>
  );
}
