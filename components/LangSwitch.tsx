'use client';

import { useLocale } from '@/lib/i18n-client';
import type { Locale } from '@/lib/i18n';

const LOCALES: Locale[] = ['ru', 'en'];

/** Брутальный переключатель языка RU|EN для шапки. */
export default function LangSwitch() {
  const { locale, setLocale } = useLocale();

  return (
    <span className="inline-flex border-2 border-ink bg-white">
      {LOCALES.map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-2 py-1 font-label text-[10px] font-bold uppercase tracking-wider transition-colors ${
            i === 0 ? 'border-r-2 border-ink' : ''
          } ${locale === l ? 'bg-ink text-paper' : 'hover:bg-mist/50'}`}
        >
          {l}
        </button>
      ))}
    </span>
  );
}
