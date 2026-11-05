'use client';

import Image from 'next/image';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { contactInfo } from '@/lib/site-data';

export function ContactSection() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <section id="contact" className="scroll-mt-20 py-20 md:py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-7 text-white shadow-2xl sm:p-10 md:p-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_75%)]" />
            <div className="absolute -right-10 top-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <span className="h-px w-8 bg-primary/70" />
                {t('contactEyebrow')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('contactTitle')}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
                {t('contactDesc')}
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {t('footerContact')}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-base font-medium text-white">
                      {contactInfo.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:+86${phone.replace(/-/g, '')}`}
                          className="transition-colors hover:text-primary"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {t('footerAddress')}
                    </p>
                    <p className="mt-1 leading-6 text-zinc-300">
                      {contactInfo.address[language]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="group h-12 rounded-full px-6" asChild>
                  <a href={`tel:+86${contactInfo.phones[0].replace(/-/g, '')}`}>
                    {t('callNow')}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <a href="#wechat-qr">{t('scanWechat')}</a>
                </Button>
              </div>
            </div>

            <div id="wechat-qr" className="scroll-mt-24 rounded-2xl bg-white p-5 text-zinc-900 shadow-xl lg:self-center">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{t('footerWechat')}</p>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                  WeChat
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { src: '/weixin-qrcode.jpg', label: language === 'zh' ? '微信咨询' : 'Consulting' },
                  { src: '/weixin-qrcode1.jpg', label: language === 'zh' ? '商务合作' : 'Partnership' },
                ].map((qr) => (
                  <div key={qr.src} className="text-center">
                    <div className="relative mx-auto aspect-square w-full max-w-[150px] overflow-hidden rounded-xl border bg-white">
                      <Image
                        src={qr.src}
                        alt={qr.label}
                        fill
                        sizes="150px"
                        className="object-contain"
                      />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">{qr.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-[11px] leading-5 text-zinc-500">
                {language === 'zh'
                  ? '扫码添加微信，备注「项目咨询」'
                  : 'Scan to connect on WeChat and mention “project enquiry”.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
