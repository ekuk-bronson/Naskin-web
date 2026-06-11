'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Родинки' },
  { href: '/history', label: 'История' },
  { href: '/profile', label: 'Профиль' },
];

/** Общий каркас приложения — брутальная шапка с чернильной линией. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-20 bg-paper border-b-2 border-ink">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-ink flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-paper" />
            </span>
            <span className="font-display text-[13px] font-bold uppercase tracking-tight">FreeSkin</span>
          </Link>
          <nav className="flex items-center">
            {NAV.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    active ? 'bg-ink text-paper' : 'text-grey hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-2xl mx-auto px-5 py-6">{children}</main>
    </div>
  );
}
