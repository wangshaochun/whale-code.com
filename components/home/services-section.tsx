'use client';

import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Code2,
  Database,
  ShieldCheck,
  Smartphone,
  Workflow,
} from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { useLanguage } from '@/components/language-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { ServiceIcon, services } from '@/lib/site-data';

const icons: Record<ServiceIcon, typeof Code2> = {
  code: Code2,
  brain: BrainCircuit,
  database: Database,
  smartphone: Smartphone,
  workflow: Workflow,
  shield: ShieldCheck,
};

export function ServicesSection() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <section id="services" className="scroll-mt-20 py-20 md:py-24">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t('ourServices')}
            title={language === 'zh' ? '从业务出发，把想法交付成产品' : 'From business problem to working product'}
            description={
              language === 'zh'
                ? '不是简单堆功能，而是理解流程、角色与目标，用合适的技术解决真正的问题。'
                : 'Not just shipping features — we understand the process, the roles and the goal, then choose the right technology to solve the real problem.'
            }
          />
          <p className="hidden max-w-xs text-sm leading-6 text-muted-foreground md:block">
            {language === 'zh'
              ? '一支团队覆盖产品、设计、研发、AI 与运维，减少协作损耗。'
              : 'One team covering product, design, engineering, AI and operations — fewer hand-offs, less friction.'}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            return (
              <motion.div
                key={service.title.en}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true, margin: '-60px' }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {service.title[language]}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                  {service.description[language]}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag.en}
                      className="rounded-md border border-border/70 bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground"
                    >
                      {tag[language]}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
