'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  inverted?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]',
            align === 'center' && 'justify-center',
            inverted ? 'text-primary' : 'text-primary'
          )}
        >
          <span className="h-px w-8 bg-primary/70" />
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          'text-3xl font-bold tracking-tight sm:text-4xl',
          inverted ? 'text-white' : 'text-foreground'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-base leading-7 sm:text-lg',
            inverted ? 'text-zinc-400' : 'text-muted-foreground'
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
