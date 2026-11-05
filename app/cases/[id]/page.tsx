import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseDetailView } from '@/components/case-detail-view';
import { caseStudies } from '@/lib/site-data';

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
    return { title: '案例未找到 | 石家庄鲸码互联网科技' };
  }

  return {
    title: `${study.title.zh} | 项目案例 | 石家庄鲸码互联网科技`,
    description: study.summary.zh,
    openGraph: {
      title: study.title.zh,
      description: study.summary.zh,
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

  return <CaseDetailView caseId={id} />;
}
