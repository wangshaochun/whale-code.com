'use client';

import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';
import { Phone } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="max-w-md mb-8 md:mb-0 text-left">
            <h3 className="text-lg font-semibold mb-4">石家庄鲸码互联网科技责任有限公司</h3>
            <p className="text-sm text-muted-foreground">
              {t('footerDesc')}
            </p>
          </div>
          <div className="max-w-md mb-8 md:mb-0 text-left">
            <h4 className="text-lg font-semibold mb-4">{t('businessCooperation')}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  156-1439-2011 <br/>
                  137-8020-0356
            </p>
          </div> 
            <div className="flex flex-col space-y-4 md:items-end"> 
                <Image 
                  src="/weixin-qrcode.jpg" 
                  alt="WeChat QR Code" 
                  width={120} 
                  height={120} 
                  className="rounded-md"
                />
            </div> 
            <div className="flex flex-col space-y-4 md:items-end">  
                 <Image 
                  src="/weixin-qrcode1.jpg" 
                  alt="WeChat QR Code" 
                  width={120} 
                  height={120} 
                  className="rounded-md"
                />
            </div> 
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t('companyName')}. {t('footerRights')}
        </div>
      </div>
    </footer>
  );
}