'use client';

import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { getT, LOCALE_COOKIE, type DictKey, type Locale } from './i18n';

const LocaleContext = createContext<Locale>('ru');

/** Провайдер локали — оборачивает приложение в layout. */
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Хук для клиентских компонентов: локаль, t() и переключение языка. */
export function useLocale() {
  const locale = useContext(LocaleContext);
  const router = useRouter();

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return { locale, t: getT(locale), setLocale };
}

export type { DictKey, Locale };
