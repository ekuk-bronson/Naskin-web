import { RISK_LEVELS } from '@/lib/riskLevels';
import type { MoleDto } from '@/lib/types';

/** Тёмная hero-карточка статистики — аналог hero из app/(tabs)/index.tsx. */
export default function HeroCard({ moles }: { moles: MoleDto[] }) {
  // 5 уровней схлопываются в 3 бейджа: high = high+urgent, low = low+notable
  const high = moles.filter((m) => m.risk === 'high' || m.risk === 'urgent').length;
  const moderate = moles.filter((m) => m.risk === 'moderate').length;
  const low = moles.filter((m) => m.risk === 'low' || m.risk === 'notable').length;
  const normPct = moles.length ? Math.round((low / moles.length) * 100) : 100;
  const lastDays = moles.length ? Math.min(...moles.map((m) => m.days)) : null;

  const badges = [
    { num: high, label: 'ВЫСОКИЙ', color: RISK_LEVELS.high.color },
    { num: moderate, label: 'СРЕДНИЙ', color: RISK_LEVELS.moderate.color },
    { num: low, label: 'НОРМА', color: RISK_LEVELS.low.color },
  ];

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-dark p-6 mb-3">
      {/* Тёплые свечения */}
      <div className="absolute -top-10 -right-8 w-[170px] h-[170px] rounded-full bg-[rgba(160,120,58,0.2)] pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-[110px] h-[110px] rounded-full bg-[rgba(45,80,200,0.1)] pointer-events-none" />

      <div className="relative flex justify-between items-start mb-5">
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-[#5A5248] font-semibold mb-2">
            Всего под наблюдением
          </p>
          <p className="text-[56px] leading-none font-extrabold text-[#F0EDE8] tracking-tighter mb-2">
            {moles.length}
          </p>
          <p className="text-[11px] text-[#524B43]">
            {moles.length
              ? `Последняя проверка ${lastDays} дн. назад`
              : 'Добавьте первую родинку'}
          </p>
        </div>
        <div className="w-[68px] h-[68px] rounded-full border-[1.5px] border-stone/50 bg-stone/10 flex flex-col items-center justify-center mt-1 shrink-0">
          <span className="text-[20px] font-extrabold text-stone tracking-tight leading-none">
            {normPct}%
          </span>
          <span className="text-[7px] tracking-widest uppercase text-[#5A5248] mt-0.5">норма</span>
        </div>
      </div>

      <div className="relative flex gap-2">
        {badges.map((b) => (
          <div
            key={b.label}
            className="flex-1 rounded-2xl border bg-[rgba(248,246,243,0.04)] py-3 flex flex-col items-center gap-1"
            style={{ borderColor: b.color + '30' }}
          >
            <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-[21px] font-extrabold leading-none" style={{ color: b.color }}>
              {b.num}
            </span>
            <span className="text-[7px] tracking-[0.12em] uppercase text-[#504840]">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
