import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { RISK_LEVELS } from '@/lib/riskLevels';
import Shell from '@/components/Shell';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const userId = session.user.id;

  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  const moles = await prisma.mole.findMany({ where: { userId }, select: { risk: true, changed: true } });

  const high = moles.filter((m) => m.risk === 'high' || m.risk === 'urgent').length;
  const moderate = moles.filter((m) => m.risk === 'moderate').length;
  const low = moles.filter((m) => m.risk === 'low' || m.risk === 'notable').length;
  const changed = moles.filter((m) => m.changed).length;

  const stats = [
    { label: 'Всего', value: moles.length, color: '#1C1A18' },
    { label: 'Высокий риск', value: high, color: RISK_LEVELS.high.color },
    { label: 'Умеренный', value: moderate, color: RISK_LEVELS.moderate.color },
    { label: 'В норме', value: low, color: RISK_LEVELS.low.color },
  ];

  return (
    <Shell>
      <div className="mb-5">
        <p className="text-[9px] tracking-[0.22em] uppercase text-stone font-semibold mb-1">
          Аккаунт
        </p>
        <h1 className="font-display text-[30px] font-bold tracking-tight text-dark">Профиль</h1>
      </div>

      {/* Карточка пользователя */}
      <div className="bg-white border border-line rounded-3xl p-5 flex items-center gap-4 shadow-[0_3px_12px_rgba(28,26,24,0.04)] mb-4">
        {dbUser?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dbUser.avatarUrl}
            alt=""
            className="w-16 h-16 rounded-full object-cover bg-line shrink-0"
          />
        ) : (
          <span className="w-16 h-16 rounded-full bg-line border border-faint/40 flex items-center justify-center text-xl font-extrabold text-stone shrink-0">
            {(dbUser?.name ?? '?').slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[16px] font-extrabold tracking-tight text-dark truncate">
            {dbUser?.name ?? 'Пользователь'}
          </p>
          <p className="text-xs text-dim truncate">{dbUser?.email}</p>
          {userId === 'demo-user' && (
            <span className="inline-block mt-1.5 rounded-full border border-line bg-[#FBFAF7] px-2.5 py-0.5 text-[10px] font-semibold text-stone">
              Демо-режим
            </span>
          )}
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {stats.map((st) => (
          <div
            key={st.label}
            className="bg-white border border-line rounded-2xl p-4 shadow-[0_2px_8px_rgba(28,26,24,0.03)]"
          >
            <p className="font-display text-[30px] font-bold tracking-tight leading-9" style={{ color: st.color }}>
              {st.value}
            </p>
            <p className="text-[10px] tracking-[0.14em] uppercase text-faint font-semibold mt-1">
              {st.label}
            </p>
          </div>
        ))}
      </div>

      {/* Распределение риска */}
      {moles.length > 0 && (
        <div className="bg-white border border-line rounded-2xl p-4 mb-4 shadow-[0_2px_8px_rgba(28,26,24,0.03)]">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-faint mb-3">
            Распределение риска
          </p>
          <div className="flex h-2.5 rounded-full overflow-hidden bg-line">
            {high > 0 && (
              <span
                style={{ width: `${(high / moles.length) * 100}%`, backgroundColor: RISK_LEVELS.high.color }}
              />
            )}
            {moderate > 0 && (
              <span
                style={{ width: `${(moderate / moles.length) * 100}%`, backgroundColor: RISK_LEVELS.moderate.color }}
              />
            )}
            {low > 0 && (
              <span
                style={{ width: `${(low / moles.length) * 100}%`, backgroundColor: RISK_LEVELS.low.color }}
              />
            )}
          </div>
          {changed > 0 && (
            <p className="text-[11px] text-[#E06000] font-semibold mt-3">
              ⚠ Изменились с последней проверки: {changed}
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
          className="w-full py-4 rounded-2xl bg-white border border-[#F0D8DC] text-sm font-bold text-[#E8003D] tracking-wide hover:bg-[#FFF0F3] transition"
        >
          Выйти из аккаунта
        </button>
      </form>

      <p className="text-[11px] text-faint text-center mt-6 leading-relaxed pb-6">
        Это не диагноз. FreeSkin не является медицинским устройством. Обратитесь к врачу.
      </p>
    </Shell>
  );
}
