'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, Layers, Server, Settings2 } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { useTranslation } from '@/hooks/useTranslation';
import { capabilityGroups } from '@/lib/site-data';

const icons = [Layers, Server, BrainCircuit, Settings2];

export function CapabilitiesSection() {
const { t } = useTranslation();

  return (
    <section id="capabilities" className="scroll-mt-20 py-20 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow={t('capabilitiesEyebrow')}
              title={t('capabilitiesTitle')}
              description={t('capabilitiesDesc')}
            />
            <div className="mt-8 rounded-2xl border bg-muted/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {'每个项目交付'}
              </p>
              <ul className="mt-3 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
                {(['可运行系统', '完整源码', '部署文档', '使用说明', '数据迁移', '质保期支持']).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              {'技术选型以稳定、可维护、可扩展为前提，不追逐短期噱头。'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {capabilityGroups.map((group, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  viewport={{ once: true, margin: '-60px' }}
                  className="group rounded-2xl border bg-card p-6 transition-all hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {group.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-foreground/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
