import type { Mole } from '@prisma/client';
import type { MoleDto } from './types';
import type { RiskLevel } from './riskLevels';

/** Дни с момента последнего обновления записи. */
function daysSince(d: Date): number {
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86_400_000));
}

export function serializeMole(m: Mole): MoleDto {
  let abcde = null;
  let history: MoleDto['history'] = [];
  try { abcde = JSON.parse(m.abcdeJson); } catch { /* битый JSON — отдаём null */ }
  try { history = JSON.parse(m.historyJson); } catch { /* битый JSON — пустая история */ }
  return {
    id: m.id,
    name: m.name,
    loc: m.loc,
    score: m.score,
    risk: m.risk as RiskLevel,
    days: daysSince(m.updatedAt),
    changed: m.changed,
    size: m.size,
    since: m.since,
    imageUrl: m.imageUrl,
    abcde,
    history,
    summary: m.summary,
    rec: m.rec,
  };
}
