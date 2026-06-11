import { RISK_LEVELS, type RiskLevel } from '@/lib/riskLevels';

/** Цветной чип уровня риска — аналог components/RiskBadge.tsx из мобильного приложения. */
export default function RiskBadge({ risk }: { risk: RiskLevel }) {
  const cfg = RISK_LEVELS[risk];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold whitespace-nowrap"
      style={{ color: cfg.color, backgroundColor: cfg.colorBg, borderColor: cfg.colorBorder }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
      {cfg.short}
    </span>
  );
}
