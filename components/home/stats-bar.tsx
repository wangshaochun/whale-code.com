'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { industries, stats } from '@/lib/site-data';

export function StatsBar() {
const { t } = useTranslation();

  return (
    <section className="border-b bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={`${stat.value}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="px-2 py-6 text-center sm:px-6 sm:py-8"
            >
              <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t py-4 text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-[0.18em] text-foreground/60">
            {t('industriesLabel')}
          </span>
          {industries.map((industry) => (
            <span key={industry} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
