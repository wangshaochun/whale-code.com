'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Target, Users } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { useTranslation } from '@/hooks/useTranslation';

const reasons = [
  { icon: Users, title: 'whyUs1Title', desc: 'whyUs1Desc' },
  { icon: Sparkles, title: 'whyUs2Title', desc: 'whyUs2Desc' },
  { icon: Target, title: 'whyUs3Title', desc: 'whyUs3Desc' },
  { icon: Compass, title: 'whyUs4Title', desc: 'whyUs4Desc' },
] as const;

export function AboutSection() {
const { t } = useTranslation();

  return (
    <section id="about" className="scroll-mt-20 border-t bg-gradient-to-b from-background to-primary/[0.04] py-20 md:py-24">
      <div className="container">
        <SectionHeading
          eyebrow={t('aboutEyebrow')}
          title={t('aboutUs')}
          description={t('aboutDesc')}
          className="max-w-3xl"
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-xl">
              <Image
                src="/images/about-us.svg"
                alt="Whale Code product landscape"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-xl border bg-card px-5 py-3 shadow-lg">
              <p className="text-2xl font-bold text-primary">10+</p>
              <p className="text-xs text-muted-foreground">
                {'年研发经验'}
              </p>
            </div>
            <div className="absolute -right-3 -top-3 hidden rounded-full border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm sm:block">
              {'石家庄 · 服务全国'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Compass className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{t('ourVision')}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('visionDesc')}</p>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{t('ourMission')}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('missionDesc')}</p>
              </div>
            </div>

            <h3 className="mt-9 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {t('whyUsTitle')}
            </h3>
            <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex gap-3">
                  <reason.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{t(reason.title)}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(reason.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
