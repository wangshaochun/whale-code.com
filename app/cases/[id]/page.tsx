import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseDetailView } from '@/components/case-detail-view';
import { caseStudies } from '@/lib/site-data';
import { siteUrl, siteName } from '@/app/generateMetadata';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ id: study.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const study = caseStudies.find((item) => item.id === id);

  if (!study) {
    return { title: '案例未找到' };
  }

  const title = `${study.title} · 项目案例`;
  const url = `${siteUrl}/cases/${study.id}`;

  return {
    title,
    description: study.summary,
    alternates: { canonical: `/cases/${study.id}` },
    openGraph: {
      type: 'article',
      title: study.title,
      description: study.summary,
      url,
      siteName,
      images: [{ url: study.cover, alt: study.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: study.title,
      description: study.summary,
      images: [study.cover],
    },
  };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = caseStudies.find((item) => item.id === id);

  if (!study) {
    notFound();
  }

  const url = `${siteUrl}/cases/${study.id}`;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: `${study.title} · 项目案例`,
        description: study.summary,
        inLanguage: 'zh-CN',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: {
          '@type': 'CreativeWork',
          name: study.title,
          description: study.summary,
          abstract: study.challenge,
          keywords: study.tags.join(', '),
          genre: '项目案例',
          dateCreated: study.year,
        },
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: '项目案例', item: `${siteUrl}/cases` },
          { '@type': 'ListItem', position: 3, name: study.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <CaseDetailView caseId={id} />
    </>
  );
}
