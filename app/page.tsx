import { Hero } from '@/components/home/hero';
import { StatsBar } from '@/components/home/stats-bar';
import { ServicesSection } from '@/components/home/services-section';
import { CaseStudiesSection } from '@/components/home/case-studies-section';
import { CapabilitiesSection } from '@/components/home/capabilities-section';
import { ProcessSection } from '@/components/home/process-section';
import { AboutSection } from '@/components/home/about-section';
import { FaqSection } from '@/components/home/faq-section';
import { ContactSection } from '@/components/home/contact-section';

export default function Home() {
  return (
    <div className="flex flex-col">
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
