'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, ArrowRight } from 'lucide-react';
import Logo from './logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const { theme, setTheme } = useTheme();
const { t } = useTranslation();

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/#services', label: t('services') },
    { href: '/cases', label: t('cases') },
    { href: '/#capabilities', label: t('capabilities') },
    { href: '/#process', label: t('process') },
    { href: '/#about', label: t('about') },
    { href: '/blog', label: t('blog') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/60 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button size="sm" className="hidden rounded-full px-4 md:inline-flex" asChild>
            <Link href="/#contact">
              {t('contact')}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="hover:text-primary"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="hover:text-primary" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-3 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/#contact"
                  className="mt-4 flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                >
                  {t('contact')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="mt-6 border-t pt-4 text-xs text-muted-foreground">
                  {'石家庄市桥西区鸿锐大厦 2 号楼 1105 室'}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
