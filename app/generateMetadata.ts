import type { Metadata } from 'next';
import { getTranslation } from '@/lib/translations';

export const siteUrl = 'https://whale-code.com';
export const siteName = '石家庄鲸码互联网科技';
export const siteShortName = '鲸码科技';

export function generateMetadata(): Metadata {
  const title = getTranslation('metaTitle');
  const description = getTranslation('metaDescription');

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${siteShortName}`,
    },
    description,
    applicationName: siteShortName,
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': '/feed.xml',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: siteUrl,
      siteName: siteShortName,
      title,
      description,
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
