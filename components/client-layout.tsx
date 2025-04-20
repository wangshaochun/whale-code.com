'use client';

import { useLanguage } from './language-provider';
import Header from './header';
import Footer from './footer';
import { useEffect, useState } from 'react';
import { generateMetadata } from '@/app/generateMetadata';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    // 更新HTML的lang属性
    document.documentElement.lang = language;
    
    // 获取新的元数据
    const metadata = generateMetadata(language);
    
    // 更新文档标题
    document.title = metadata.title;
    
    // 更新描述元标签
    const metaDescElement = document.querySelector('meta[name="description"]');
    if (metaDescElement) {
      metaDescElement.setAttribute('content', metadata.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metadata.description;
      document.head.appendChild(meta);
    }
    
    // 更新 Open Graph 元标签
    const ogTitleElement = document.querySelector('meta[property="og:title"]');
    const ogDescElement = document.querySelector('meta[property="og:description"]');
    
    if (ogTitleElement) {
      ogTitleElement.setAttribute('content', metadata.openGraph.title);
    }
    if (ogDescElement) {
      ogDescElement.setAttribute('content', metadata.openGraph.description);
    }
    
    // 更新 Twitter 卡片元标签
    const twitterTitleElement = document.querySelector('meta[name="twitter:title"]');
    const twitterDescElement = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitleElement) {
      twitterTitleElement.setAttribute('content', metadata.twitter.title);
    }
    if (twitterDescElement) {
      twitterDescElement.setAttribute('content', metadata.twitter.description);
    }
  }, [language]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
