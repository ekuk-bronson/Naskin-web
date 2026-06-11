'use client';

import Link from 'next/link';
import type { MoleDto } from '@/lib/types';
import { RISK_LEVELS } from '@/lib/riskLevels';
import RiskBadge from './RiskBadge';

/** Карточка родинки в списке — белая плита с чернильной рамкой. */
export default function MoleCard({
  mole,
  onDelete,
}: {
  mole: MoleDto;
  onDelete?: (id: number) => void;
}) {
  const cfg = RISK_LEVELS[mole.risk];

  return (
    <div className="group hard-sm hard-hover relative bg-white px-4 py-3.5 flex items-center gap-3.5">
      <Link href={`/moles/${mole.id}`} className="absolute inset-0" aria-label={mole.name} />

      {mole.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mole.imageUrl}
          alt=""
          className="w-12 h-12 object-cover border-2 border-ink shrink-0"
        />
      ) : (
        <span
          className="w-12 h-12 border-2 flex items-center justify-center shrink-0 bg-paper"
          style={{ borderColor: cfg.color }}
        >
          <span className="w-5 h-4 rounded-full bg-ink/70" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[13px] font-bold uppercase tracking-tight truncate">{mole.name}</p>
          {mole.changed && (
            <span className="font-label text-[9px] font-bold text-risk-high border-2 border-risk-high px-1 shrink-0">
              !
            </span>
          )}
        </div>
        <p className="font-label text-[10px] uppercase tracking-wider text-grey truncate">
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
          className="relative z-10 w-8 h-8 border-2 border-ink bg-white text-ink hover:bg-risk-high hover:border-risk-high hover:text-white transition-colors flex items-center justify-center font-label text-[11px] font-bold opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={`Удалить ${mole.name}`}
          title="Удалить"
        >
          ✕
        </button>
      )}
    </div>
  );
}
