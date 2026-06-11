/**
 * 5-уровневая шкала риска меланомы — порт constants/riskLevels.ts из мобильного приложения.
 * ВАЖНО: число score пользователю НЕ показывается. Только категория.
 */

export type RiskLevel = 'low' | 'notable' | 'moderate' | 'high' | 'urgent';

export interface RiskConfig {
  label: string;       // полная подпись на hero
  short: string;       // короткое слово (для чипов/badge)
  rec: string;         // короткая рекомендация (одна строка)
  threshold: number;   // нижняя граница score (0–10)
  color: string;
  colorBg: string;
  colorBorder: string;
}

export const RISK_LEVELS: Record<RiskLevel, RiskConfig> = {
  low: {
    label: 'Низкий риск',
    short: 'Низкий',
    rec: 'Обычное наблюдение. Самоосмотр раз в 6 месяцев.',
    threshold: 0,
    color: '#00904A',
    colorBg: '#F0FFF6',
    colorBorder: '#A0E8C0',
  },
  notable: {
    label: 'Низкий риск',
    short: 'Внимание',
    rec: 'Покажите дерматологу при следующем плановом визите.',
    threshold: 2.0,
    color: '#7B8B1F',
    colorBg: '#F8F7E8',
    colorBorder: '#D8D6A0',
  },
  moderate: {
    label: 'Умеренный риск',
    short: 'Умеренный',
    rec: 'Обратитесь к дерматологу в течение месяца.',
    threshold: 4.0,
    color: '#E06000',
    colorBg: '#FFF8F0',
    colorBorder: '#FFD8A8',
  },
  high: {
    label: 'Высокий риск',
    short: 'Высокий',
    rec: 'Обратитесь к дерматологу в течение 2 недель.',
    threshold: 6.5,
    color: '#D03020',
    colorBg: '#FFF0EE',
    colorBorder: '#FFC0B8',
  },
  urgent: {
    label: 'Срочно к врачу',
    short: 'Срочно',
    rec: 'Срочно обратитесь к дерматологу.',
    threshold: 8.5,
    color: '#E8003D',
    colorBg: '#FFEDF1',
    colorBorder: '#FFB8C8',
  },
};

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 8.5) return 'urgent';
  if (score >= 6.5) return 'high';
  if (score >= 4.0) return 'moderate';
  if (score >= 2.0) return 'notable';
  return 'low';
}

export function scoreColor(s: number): string {
  return RISK_LEVELS[getRiskLevel(s)].color;
}

export function isActionable(level: RiskLevel): boolean {
  return level === 'moderate' || level === 'high' || level === 'urgent';
}

export function isUrgent(level: RiskLevel): boolean {
  return level === 'high' || level === 'urgent';
}

export const ABCDE_LABELS: Record<string, string> = {
  asymmetry: 'A · Асимметрия',
  border: 'B · Границы',
  color: 'C · Цвет',
  diameter: 'D · Диаметр',
  evolution: 'E · Изменение',
};

export const MEDICAL_DISCLAIMER =
  'Это не диагноз. FreeSkin не является медицинским устройством. Обратитесь к врачу.';

export const BODY_LOCATIONS = [
  'Голова', 'Шея', 'Грудь', 'Спина', 'Живот',
  'Левая рука', 'Правая рука', 'Левая нога', 'Правая нога', 'Другое',
];
