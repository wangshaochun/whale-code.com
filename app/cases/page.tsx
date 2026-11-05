import type { Metadata } from 'next';
import { CasesListing } from '@/components/cases-listing';
import { caseStudies } from '@/lib/site-data';
import { siteUrl, siteName } from '@/app/generateMetadata';

export const metadata: Metadata = {
  title: '项目案例',
  description:
    '航运监管、数据中台、高校教材选用、审计知识库、校园智能监控、医疗评估与电商小程序等已上线项目案例。',
  alternates: { canonical: '/cases' },
  openGraph: {
    type: 'website',
    title: '项目案例',
    description:
      '航运监管、数据中台、高校教材选用、审计知识库、校园智能监控、医疗评估与电商小程序等已上线项目案例。',
    url: `${siteUrl}/cases`,
    siteName,
  },
};

const listJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '鲸码科技项目案例',
  itemListElement: caseStudies.map((study, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: study.title,
    description: study.summary,
    url: `${siteUrl}/cases/${study.id}`,
  })),
};

export default function CasesPage() {
  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <CasesListing />
    </div>
  );
}
