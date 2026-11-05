'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.04] via-background to-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-20 top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 grid items-center gap-14 py-14 md:py-20 lg:grid-cols-[1.04fr_1fr] lg:gap-10 lg:py-24">
        <div>
          <motion.div {...fadeUp} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t('heroBadge')}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.55rem]"
          >
            <span className="block">{t('heroTitleA')}</span>
            <span className="mt-1 block bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
          >
            {t('heroDescription')}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" className="group h-12 rounded-full px-6 text-base" asChild>
              <Link href="/cases">
                {t('heroPrimaryCta')}
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary/30 px-6 text-base text-foreground hover:bg-primary/5"
              asChild
            >
              <Link href="/#contact">{t('heroSecondaryCta')}</Link>
            </Button>
          </motion.div>

          <motion.ul
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 space-y-2.5"
          >
            {[t('heroPoint1'), t('heroPoint2'), t('heroPoint3')].map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[430px] lg:h-[500px]"
        >
          <div className="absolute right-0 top-10 w-[92%] overflow-hidden rounded-xl border border-black/5 bg-card shadow-2xl shadow-black/10 dark:border-white/10">
            <div className="flex h-8 items-center gap-1.5 border-b bg-muted/60 px-3">
              <span className="h-2 w-2 rounded-full bg-red-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              <span className="ml-3 max-w-[70%] truncate rounded-md bg-background/80 px-3 py-0.5 text-[10px] text-muted-foreground">
                {'航运监管 · 电子海图'}
              </span>
            </div>
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/cases/shipping-map.jpg"
                alt="Shipping supervision platform"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="absolute -left-1 bottom-0 w-44 overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/10 sm:w-52">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/cases/audit-assistant.jpg"
                alt="AI audit assistant"
                fill
                sizes="208px"
                className="object-cover object-top"
              />
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold">{'AI 审计助手'}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {'知识库问答 · 依据引用'}
              </p>
            </div>
          </div>

          <div className="absolute -left-3 top-0 rounded-xl border bg-card/90 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-2xl font-bold text-primary">80+</p>
            <p className="text-[10px] text-muted-foreground">
              {'审批流程上线'}
            </p>
          </div>

          <div className="absolute -right-2 bottom-14 rounded-xl border bg-card/90 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold">{'10+ 年'}</p>
            <p className="text-[10px] text-muted-foreground">
              {'核心团队研发经验'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
