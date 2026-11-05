'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import Logo from './logo';
import { useTranslation } from '@/hooks/useTranslation';
import { contactInfo, services } from '@/lib/site-data';

const navLinks = [
  { href: '/#services', key: 'services' },
  { href: '/cases', key: 'cases' },
  { href: '/#capabilities', key: 'capabilities' },
  { href: '/#process', key: 'process' },
  { href: '/#about', key: 'about' },
  { href: '/blog', key: 'blog' },
] as const;

export default function Footer() {
  const { t } = useTranslation();
return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              {t('footerDesc')}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(['软件定制', 'AI 应用', '数据中台', '小程序']).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t('footerNav')}</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t('footerServices')}</h3>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.title} className="text-sm text-muted-foreground">
                  {service.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t('footerContact')}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="space-y-1">
                  {contactInfo.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:+86${phone.replace(/-/g, '')}`}
                      className="block transition-colors hover:text-primary"
                    >
                      {phone}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="leading-6">{contactInfo.address}</span>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-white">
                <Image
                  src="/weixin-qrcode.jpg"
                  alt="WeChat QR code"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                {t('footerWechat')}
                <br />
                {'扫码添加，备注项目咨询'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {t('companyName')}. {t('footerRights')}
          </p>
          <p>
            {'石家庄 · 中国 · 服务全国'}
          </p>
        </div>
      </div>
    </footer>
  );
}
