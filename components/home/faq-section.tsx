'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeading } from '@/components/section-heading';
import { useLanguage } from '@/components/language-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { faqs } from '@/lib/site-data';

export function FaqSection() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <section id="faq" className="scroll-mt-20 border-t py-20 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={t('faqEyebrow')}
            title={t('faqTitle')}
            description={t('faqDesc')}
          />
          <a
            href="#contact"
            className="mt-6 inline-flex text-sm font-medium text-primary hover:opacity-80"
          >
            {language === 'zh' ? '还有其他问题？直接联系我们 →' : 'Still curious? Talk to us →'}
          </a>
        </div>

        <div className="rounded-2xl border bg-card px-5 sm:px-7">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question.en}
                value={`item-${index}`}
                className={index === faqs.length - 1 ? 'border-b-0' : undefined}
              >
                <AccordionTrigger className="gap-4 py-5 text-left text-sm font-medium hover:no-underline sm:text-base">
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs text-primary/70">
                      0{index + 1}
                    </span>
                    {faq.question[language]}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-7 text-sm leading-7 text-muted-foreground">
                  {faq.answer[language]}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
