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
      <div className="mb-6">
        <p className="font-label text-[9px] tracking-[0.25em] text-accent font-bold mb-1.5 uppercase">
          Динамика наблюдений
        </p>
        <h1 className="font-display text-[26px] font-extrabold uppercase tracking-tight">История</h1>
      </div>

      {moles.length === 0 ? (
        <div className="hard bg-white flex flex-col items-center py-14 gap-3">
          <span className="w-16 h-16 border-2 border-ink flex items-center justify-center">
            <span className="w-6 h-5 rounded-full bg-ink/60" />
          </span>
          <p className="font-display text-[15px] font-bold uppercase tracking-tight">История пуста</p>
          <p className="font-label text-[10px] uppercase tracking-wider text-grey text-center leading-relaxed px-8">
            Добавьте родинку — после каждого
            <br />
            сканирования здесь появится динамика
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
