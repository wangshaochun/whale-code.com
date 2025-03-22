'use client';

import { useLanguage } from './language-provider';
import Header from './header';
import Footer from './footer';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    // 更新HTML的lang属性
    document.documentElement.lang = language;
    
    // 动态导入翻译，避免服务器端渲染问题
    import('@/lib/translations').then(({ getTranslation }) => {
      const metaTitle = getTranslation(language, 'metaTitle');
      const metaDescription = getTranslation(language, 'metaDescription');
      
      setTitle(metaTitle);
      setDescription(metaDescription);
      
      // 更新文档标题
      document.title = metaTitle;
      
      // 更新描述元标签
      const metaDescElement = document.querySelector('meta[name="description"]');
      if (metaDescElement) {
        metaDescElement.setAttribute('content', metaDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = metaDescription;
        document.head.appendChild(meta);
      }
    });
  }, [language]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
