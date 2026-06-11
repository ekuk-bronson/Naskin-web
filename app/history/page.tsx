import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sessionUserId } from '@/auth';
import { prisma } from '@/lib/prisma';
import { serializeMole } from '@/lib/serializeMole';
import Shell from '@/components/Shell';
import RiskBadge from '@/components/RiskBadge';
import HistoryChart from '@/components/HistoryChart';

export default async function HistoryPage() {
  const userId = await sessionUserId();
  if (!userId) redirect('/login');

  const moles = (
    await prisma.mole.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } })
  ).map(serializeMole);

  return (
    <Shell>
      <div className="mb-5">
        <p className="text-[9px] tracking-[0.22em] uppercase text-stone font-semibold mb-1">
          Динамика наблюдений
        </p>
        <h1 className="font-display text-[30px] font-bold tracking-tight text-dark">История</h1>
      </div>

      {moles.length === 0 ? (
        <div className="flex flex-col items-center py-14 gap-2">
          <span className="w-[82px] h-[82px] rounded-full bg-line border border-[#E0DAD2] flex items-center justify-center mb-1">
            <span className="w-9 h-8 rounded-full bg-faint" />
          </span>
          <p className="text-[15px] font-bold text-dim tracking-tight">История пуста</p>
          <p className="text-xs text-faint text-center leading-relaxed px-8">
            Добавьте родинку — после каждого сканирования здесь появится её динамика.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          {moles.map((m) => (
            <Link
              key={m.id}
              href={`/moles/${m.id}`}
              className="card-lift block bg-white border border-line rounded-2xl p-4 shadow-[0_2px_12px_rgba(28,26,24,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-dark tracking-tight truncate">
                    {m.name}
                  </p>
                  <p className="text-[11px] text-dim truncate">
                    {m.loc} · {m.history.length}{' '}
                    {m.history.length % 10 === 1 && m.history.length % 100 !== 11
                      ? 'замер'
                      : [2, 3, 4].includes(m.history.length % 10) &&
                          ![12, 13, 14].includes(m.history.length % 100)
                        ? 'замера'
                        : 'замеров'}
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
