import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sessionUserId } from '@/auth';
import { prisma } from '@/lib/prisma';
import { serializeMole } from '@/lib/serializeMole';
import { getT, pluralScans } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import Shell from '@/components/Shell';
import RiskBadge from '@/components/RiskBadge';
import HistoryChart from '@/components/HistoryChart';

export default async function HistoryPage() {
  const userId = await sessionUserId();
  if (!userId) redirect('/login');

  const locale = await getLocale();
  const t = getT(locale);

  const moles = (
    await prisma.mole.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } })
  ).map(serializeMole);

  return (
    <Shell>
      <div className="mb-6">
        <p className="font-label text-[9px] tracking-[0.25em] text-accent font-bold mb-1.5 uppercase">
          {t('history.sup')}
        </p>
        <h1 className="font-display text-[26px] font-extrabold uppercase tracking-tight">
          {t('history.title')}
        </h1>
      </div>

      {moles.length === 0 ? (
        <div className="hard bg-white flex flex-col items-center py-14 gap-3">
          <span className="w-16 h-16 border-2 border-ink flex items-center justify-center">
            <span className="w-6 h-5 rounded-full bg-ink/60" />
          </span>
          <p className="font-display text-[15px] font-bold uppercase tracking-tight">
            {t('history.empty')}
          </p>
          <p className="font-label text-[10px] uppercase tracking-wider text-grey text-center leading-relaxed px-8 max-w-xs">
            {t('history.hint')}
          </p>
        </div>
      ) : (
        <div className="stagger-in space-y-4 pb-6">
          {moles.map((m) => (
            <Link
              key={m.id}
              href={`/moles/${m.id}`}
              className="hard-sm hard-hover block bg-white p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold uppercase tracking-tight truncate">
                    {m.name}
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-wider text-grey truncate">
                    {m.loc} · {m.history.length} {pluralScans(locale, m.history.length)}
                  </p>
                </div>
                <RiskBadge risk={m.risk} />
              </div>
              <HistoryChart history={m.history} />
            </Link>
          ))}
        </div>
      )}
    </Shell>
  );
}
