import { Hero } from '@/components/home/hero';
import { StatsBar } from '@/components/home/stats-bar';
import { ServicesSection } from '@/components/home/services-section';
import { CaseStudiesSection } from '@/components/home/case-studies-section';
import { CapabilitiesSection } from '@/components/home/capabilities-section';
import { ProcessSection } from '@/components/home/process-section';
import { AboutSection } from '@/components/home/about-section';
import { FaqSection } from '@/components/home/faq-section';
import { ContactSection } from '@/components/home/contact-section';
import { faqs } from '@/lib/site-data';
import { siteUrl } from './generateMetadata';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteUrl}/#faq`,
  inLanguage: 'zh-CN',
  isPartOf: { '@id': `${siteUrl}/#website` },
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <StatsBar />
      <ServicesSection />
      <CaseStudiesSection />
      <CapabilitiesSection />
      <ProcessSection />
      <AboutSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
}
