import { useLanguage } from '@/components/language-provider';
import { TranslationKey, getTranslation } from '@/lib/translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };
  
  return { t };
}
