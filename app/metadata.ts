import { Metadata } from 'next';
import { getTranslation } from '@/lib/translations';

type GenerateMetadataProps = {
  language: 'en' | 'zh';
};

export function generateMetadata({ language }: GenerateMetadataProps): Metadata {
  const title = getTranslation(language, 'metaTitle');
  const description = getTranslation(language, 'metaDescription');

  return {
    title,
    description,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/logo.png', sizes: 'any' }
      ],
      apple: '/logo.png',
    },
    openGraph: {
      title,
      description,
      images: ['/logo.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
    },
  };
}
