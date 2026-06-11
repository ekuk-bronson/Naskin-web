import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { RISK_LEVELS } from '@/lib/riskLevels';
import { getT } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import Shell from '@/components/Shell';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const userId = session.user.id;
  const t = getT(await getLocale());

  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  const moles = await prisma.mole.findMany({ where: { userId }, select: { risk: true, changed: true } });

  const high = moles.filter((m) => m.risk === 'high' || m.risk === 'urgent').length;
  const moderate = moles.filter((m) => m.risk === 'moderate').length;
  const low = moles.filter((m) => m.risk === 'low' || m.risk === 'notable').length;
  const changed = moles.filter((m) => m.changed).length;

  const stats = [
    { label: t('profile.total'), value: moles.length, color: 'var(--ink)' },
    { label: t('profile.statHigh'), value: high, color: RISK_LEVELS.high.color },
    { label: t('profile.statMod'), value: moderate, color: RISK_LEVELS.moderate.color },
    { label: t('profile.statLow'), value: low, color: RISK_LEVELS.low.color },
  ];

  return (
    <Shell>
      <div className="mb-6">
        <p className="font-label text-[9px] tracking-[0.25em] text-accent font-bold mb-1.5 uppercase">
          {t('profile.sup')}
        </p>
        <h1 className="font-display text-[26px] font-extrabold uppercase tracking-tight">
          {t('profile.title')}
        </h1>
      </div>

      {/* Карточка пользователя */}
      <div className="hard bg-white p-5 flex items-center gap-4 mb-5">
        {dbUser?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dbUser.avatarUrl}
            alt=""
            className="w-14 h-14 object-cover border-2 border-ink shrink-0"
          />
        ) : (
          <span className="w-14 h-14 bg-ink text-paper flex items-center justify-center font-display text-xl font-extrabold shrink-0">
            {(dbUser?.name ?? '?').slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[15px] font-bold uppercase tracking-tight truncate">
            {dbUser?.name ?? t('common.user')}
          </p>
          <p className="font-label text-[10px] uppercase tracking-wider text-grey truncate">
            {dbUser?.email}
          </p>
          {userId === 'demo-user' && (
            <span className="inline-block mt-1.5 border-2 border-accent px-2 py-0.5 font-label text-[9px] font-bold uppercase tracking-wider text-accent">
              {t('profile.demoBadge')}
            </span>
          )}
        </div>
      </div>

      {/* Статистика — табличная сетка */}
      <div className="grid grid-cols-2 border-2 border-ink bg-white mb-5">
        {stats.map((st, i) => (
          <div
            key={st.label}
            className={`p-4 ${i % 2 === 0 ? 'border-r-2 border-ink' : ''} ${i < 2 ? 'border-b-2 border-ink' : ''}`}
          >
            <p className="font-display text-[30px] font-extrabold leading-9" style={{ color: st.color }}>
              {st.value}
            </p>
            <p className="font-label text-[9px] tracking-[0.18em] uppercase text-grey font-bold mt-1">
              {st.label}
            </p>
          </div>
        ))}
      </div>

      {/* Распределение риска */}
      {moles.length > 0 && (
        <div className="hard-sm bg-white p-4 mb-5">
          <p className="font-label text-[9px] font-bold tracking-[0.22em] uppercase text-grey mb-3">
            {t('profile.dist')}
          </p>
          <div className="flex h-4 border-2 border-ink overflow-hidden">
            {high > 0 && (
              <span style={{ width: `${(high / moles.length) * 100}%`, backgroundColor: RISK_LEVELS.high.color }} />
            )}
            {moderate > 0 && (
              <span style={{ width: `${(moderate / moles.length) * 100}%`, backgroundColor: RISK_LEVELS.moderate.color }} />
            )}
            {low > 0 && (
              <span style={{ width: `${(low / moles.length) * 100}%`, backgroundColor: RISK_LEVELS.low.color }} />
            )}
          </div>
          {changed > 0 && (
            <p className="font-label text-[10px] font-bold uppercase tracking-wider text-risk-moderate mt-3">
              {t('profile.changedSince')} {changed}
            </p>
          )}
        </div>
      )}

      {/* Выход */}
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/login' });
        }}
      >
        <button
          type="submit"
          className="hard-sm hard-hover hard-press w-full py-3.5 bg-white font-label text-[12px] font-bold uppercase tracking-wider text-risk-high"
          style={{ borderColor: 'var(--risk-high)', boxShadow: '3px 3px 0 var(--risk-high)' }}
        >
          {t('profile.signout')}
        </button>
      </form>

      <p className="font-label text-[9px] uppercase tracking-wider text-grey text-center mt-7 leading-relaxed pb-6">
        {t('common.disclaimer')}
      </p>
    </Shell>
  );
}
