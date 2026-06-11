'use client';

import { RISK_LEVELS } from '@/lib/riskLevels';
import { useLocale } from '@/lib/i18n-client';
import type { MoleDto } from '@/lib/types';

/** Сводка-статистика на дашборде — чернильный блок с табличной сеткой. */
export default function HeroCard({ moles }: { moles: MoleDto[] }) {
  const { t } = useLocale();

  // 5 уровней схлопываются в 3 ячейки: high = high+urgent, low = low+notable
  const high = moles.filter((m) => m.risk === 'high' || m.risk === 'urgent').length;
  const moderate = moles.filter((m) => m.risk === 'moderate').length;
  const low = moles.filter((m) => m.risk === 'low' || m.risk === 'notable').length;
  const normPct = moles.length ? Math.round((low / moles.length) * 100) : 100;
  const lastDays = moles.length ? Math.min(...moles.map((m) => m.days)) : null;

  const cells = [
    { num: high, label: t('bucket.high'), color: RISK_LEVELS.high.color },
    { num: moderate, label: t('bucket.mid'), color: RISK_LEVELS.moderate.color },
    { num: low, label: t('bucket.low'), color: RISK_LEVELS.low.color },
  ];

  return (
    <section className="hard bg-ink text-paper mb-4">
      <div className="flex justify-between items-start p-5 pb-4">
        <div>
          <p className="font-label text-[9px] uppercase tracking-[0.22em] text-mist/60 mb-2">
            {t('landing.sticker.total')}
          </p>
          <p className="font-display text-[64px] font-extrabold leading-none mb-2">
            {moles.length}
          </p>
          <p className="font-label text-[10px] uppercase tracking-wider text-mist/60">
            {moles.length
              ? `${t('home.lastCheck')} ${lastDays} ${t('common.daysAgo')}`
              : t('home.addFirst')}
          </p>
        </div>
        <div className="border-2 border-paper/40 px-4 py-3 text-center">
          <p className="font-display text-[26px] font-extrabold leading-none">{normPct}%</p>
          <p className="font-label text-[8px] uppercase tracking-[0.2em] text-mist/60 mt-1.5">
            {t('home.norm')}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 border-t-2 border-paper/40">
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={`py-3.5 text-center ${i < 2 ? 'border-r-2 border-paper/40' : ''}`}
          >
            <p className="font-display text-[24px] font-extrabold leading-none" style={{ color: c.color }}>
              {c.num}
            </p>
            <p className="font-label text-[8px] uppercase tracking-[0.18em] text-mist/60 mt-1.5">
              {c.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
