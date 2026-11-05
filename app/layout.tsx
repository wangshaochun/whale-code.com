import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import ClientLayout from '@/components/client-layout';
import GoogleAnalytics from '@/components/google-analytics';
import { generateMetadata } from './generateMetadata';
import { contactInfo } from '@/lib/site-data';

const inter = Inter({ subsets: ['latin'] });

// 默认导出中文元数据
export const metadata: Metadata = generateMetadata('zh');

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: contactInfo.company.zh,
  alternateName: 'Whale Code',
  url: 'https://whale-code.com',
  logo: 'https://whale-code.com/logo.png',
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
    availableLanguage: ['zh-CN', 'en'],
  })),
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
    <html suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}