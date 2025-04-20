'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useLanguage } from './language-provider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import Logo from './logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-foreground/60 hover:text-primary transition-colors">
            {t('home')}
          </a>
          <a href="/#services" className="text-foreground/60 hover:text-primary transition-colors">
            {t('services')}
          </a>
          <a href="/#about" className="text-foreground/60 hover:text-primary transition-colors">
            {t('about')}
          </a> 
          <a href="/blog" className="text-foreground/60 hover:text-primary transition-colors">
            {t('blog')}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('zh')}>
                中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="hover:text-primary"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-6 mt-6">
                <a href="/" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('home')}
                </a>
                <a href="/blog" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('blog')}
                </a>
                <a href="#services" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('services')}
                </a>
                <a href="#products" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('products')}
                </a>
                <a href="#about" className="text-foreground/60 hover:text-primary transition-colors">
                  {t('about')}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}