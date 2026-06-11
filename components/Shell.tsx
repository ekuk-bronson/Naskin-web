'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Родинки' },
  { href: '/history', label: 'История' },
  { href: '/profile', label: 'Профиль' },
];

/** Общий каркас: шапка с логотипом и навигацией в мраморном стиле. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur border-b border-line">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-line border border-faint/40 flex items-center justify-center">
              <span className="w-3 h-2.5 rounded-full bg-[#7A5035]" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-dark">FreeSkin</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition ${
                    active
                      ? 'bg-dark text-[#F0EDE8]'
                      : 'text-dim hover:text-dark hover:bg-line/60'
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
