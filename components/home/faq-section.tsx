import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { getTranslation } from '@/lib/translations';
import { faqs } from '@/lib/site-data';

// 使用原生 <details>：答案始终存在于服务端 HTML 中，便于搜索引擎与 AI 抓取
export function FaqSection() {
  const t = getTranslation;

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
            {'还有其他问题？直接联系我们 →'}
          </a>
        </div>

        <div className="rounded-2xl border bg-card px-5 sm:px-7">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group border-b last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-medium sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-xs text-primary/70">
                    0{index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="pb-5 pl-7 pr-6 text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
