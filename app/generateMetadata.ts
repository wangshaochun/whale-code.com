import { getTranslation } from '@/lib/translations';

export function generateMetadata(language: 'en' | 'zh' = 'zh') {
  return {
    title: getTranslation(language, 'metaTitle'),
    description: getTranslation(language, 'metaDescription'),
    openGraph: {
      title: getTranslation(language, 'metaTitle'),
      description: getTranslation(language, 'metaDescription'),
      images: ['/images/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: getTranslation(language, 'metaTitle'),
      description: getTranslation(language, 'metaDescription'),
      images: ['images/og-image.png'],
    },
  };
} 