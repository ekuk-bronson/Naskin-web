'use client';

import Link from 'next/link';
import { RISK_LEVELS } from '@/lib/riskLevels';
import type { MoleDto } from '@/lib/types';
import RiskBadge from './RiskBadge';

/** Карточка родинки в списке — аналог mole card из app/(tabs)/index.tsx. */
export default function MoleCard({
  mole,
  onDelete,
}: {
  mole: MoleDto;
  onDelete?: (id: number) => void;
}) {
  const cfg = RISK_LEVELS[mole.risk];

  return (
    <div className="group card-lift relative bg-white border border-line rounded-2xl px-4 py-3.5 flex items-center gap-3.5 shadow-[0_3px_12px_rgba(28,26,24,0.04)]">
      <Link href={`/moles/${mole.id}`} className="absolute inset-0 rounded-2xl" aria-label={mole.name} />

      {mole.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mole.imageUrl}
          alt=""
          className="w-[50px] h-[50px] rounded-[15px] object-cover bg-line shrink-0"
        />
      ) : (
        <span
          className="w-[50px] h-[50px] rounded-[15px] border-[1.5px] bg-[#F8F0E8] flex items-center justify-center shrink-0"
          style={{ borderColor: cfg.colorBorder }}
        >
          <span className="w-6 h-[22px] rounded-full bg-[#7A5035]" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <p className="text-[13px] font-bold text-dark tracking-tight truncate">{mole.name}</p>
          {mole.changed && (
            <span className="w-[18px] h-[18px] rounded-full bg-[#FFF0F3] border border-[#FFD0D8] flex items-center justify-center text-[9px] shrink-0">
              ⚠
            </span>
          )}
        </div>
        <p className="text-[11px] text-dim truncate">
          {mole.loc} · {mole.days} дн.
        </p>
      </div>

      <RiskBadge risk={mole.risk} />

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete(mole.id);
          }}
          className="relative z-10 w-8 h-8 rounded-full border border-line bg-white text-faint hover:text-[#E8003D] hover:border-[#FFD0D8] transition flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={`Удалить ${mole.name}`}
          title="Удалить"
        >
          🗑
        </button>
      )}
    </div>
  );
}
