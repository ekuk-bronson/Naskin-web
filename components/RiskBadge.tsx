'use client';

import { RISK_LEVELS, type RiskLevel } from '@/lib/riskLevels';
import { useLocale } from '@/lib/i18n-client';
import type { DictKey } from '@/lib/i18n';

/** Чип уровня риска — жёсткий прямоугольник с цветной рамкой. */
export default function RiskBadge({ risk }: { risk: RiskLevel }) {
  const { t } = useLocale();
  const cfg = RISK_LEVELS[risk];
  return (
    <span
      className="inline-flex items-center gap-1.5 border-2 px-2 py-1 font-label text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
      style={{ color: cfg.color, borderColor: cfg.color }}
    >
      <span className="w-1.5 h-1.5" style={{ backgroundColor: cfg.color }} />
      {t(`risk.${risk}.short` as DictKey)}
    </span>
  );
}
