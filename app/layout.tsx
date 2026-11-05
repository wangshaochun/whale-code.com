import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ClientLayout from '@/components/client-layout';
import GoogleAnalytics from '@/components/google-analytics';
import { generateMetadata as buildMetadata, siteName, siteUrl } from './generateMetadata';
import { contactInfo } from '@/lib/site-data';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = buildMetadata();

const organizationJsonLd = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: contactInfo.company,
  alternateName: 'Whale Code',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    '专注企业级软件定制、AI 智能体与知识库、数据中台、小程序开发与运维的软件科技公司。',
  telephone: '+86-156-1439-2011',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CN',
    addressRegion: '河北省',
    addressLocality: '石家庄市',
    streetAddress: '桥西区鸿锐大厦 2 号楼 1105 室',
  },
  contactPoint: contactInfo.phones.map((phone) => ({
    '@type': 'ContactPoint',
    telephone: `+86-${phone}`,
    contactType: 'sales',
    availableLanguage: ['zh-CN'],
  })),
  areaServed: {
    '@type': 'Country',
    name: 'CN',
  },
  knowsAbout: [
    '企业级软件定制',
    'AI 智能体',
    '知识库与 RAG',
    '数据中台',
    '微信小程序',
    '系统集成',
  ],
};

const websiteJsonLd = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  alternateName: 'Whale Code',
  description: '企业级软件定制、AI 应用与数字化交付',
  inLanguage: 'zh-CN',
  publisher: { '@id': `${siteUrl}/#organization` },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [organizationJsonLd, websiteJsonLd],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
