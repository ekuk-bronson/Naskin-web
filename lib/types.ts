import type { RiskLevel } from './riskLevels';
import type { AnalysisResult } from './mockAnalyzer';

export interface MoleHistoryPoint {
  m: string; // месяц, напр. "Мар"
  s: number; // score 0–10
}

/** Клиентское представление родинки (распакованные JSON-поля). */
export interface MoleDto {
  id: number;
  name: string;
  loc: string;
  score: number;
  risk: RiskLevel;
  days: number;
  changed: boolean;
  size: string;
  since: string;
  imageUrl: string | null;
  abcde: AnalysisResult['abcde'] | null;
  history: MoleHistoryPoint[];
  summary: string | null;
  rec: string | null;
}

export const MONTHS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
