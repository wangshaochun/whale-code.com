import { TranslationKey, getTranslation } from '@/lib/translations';

export function useTranslation() {
  const t = (key: TranslationKey): string => getTranslation(key);

  return { t };
}
