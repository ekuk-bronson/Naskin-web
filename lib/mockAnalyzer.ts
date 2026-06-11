/**
 * Мок-анализатор — порт services/mockAnalyzer.ts из мобильного приложения.
 * Детерминированный: один и тот же снимок всегда даёт одинаковый результат.
 * Заменяется реальным TFLite/FastAPI-бэкендом без изменения контракта.
 */
import { getRiskLevel, RISK_LEVELS, type RiskLevel } from './riskLevels';

export interface ABCDEScore {
  s: number;
  n: string;
}

export interface AnalysisResult {
  score: number;
  risk: RiskLevel;
  sizeMm: number;
  abcde: {
    asymmetry: ABCDEScore;
    border: ABCDEScore;
    color: ABCDEScore;
    diameter: ABCDEScore;
    evolution: ABCDEScore;
  };
  summary: string;
  rec: string;
  isMock?: boolean;
}

const ABCDE_NOTES: Record<string, [string, string, string]> = {
  asymmetry: ['Симметричная', 'Лёгкая асимметрия', 'Выраженная по двум осям'],
  border: ['Чёткие ровные края', 'Края слегка размыты', 'Нечёткие неровные края'],
  color: ['Однородный', 'Неоднородный', 'Неоднородный тёмный'],
  diameter: ['< 3 мм, стабильный', '~5 мм, стабильный', '> 6 мм, увеличился'],
  evolution: ['Без изменений', 'Небольшие изменения', 'Рост за последние месяцы'],
};

const SUMMARIES: Record<RiskLevel, string> = {
  low: 'Типичная доброкачественная родинка. Признаков беспокойства не выявлено.',
  notable: 'Родинка имеет лёгкие отличительные черты, но без явных признаков опасности.',
  moderate: 'Обнаружены признаки, требующие профессиональной оценки.',
  high: 'Выявлены признаки, характерные для подозрительных образований.',
  urgent: 'Признаки требуют немедленной оценки специалиста.',
};

function noteForScore(key: string, s: number): string {
  const notes = ABCDE_NOTES[key];
  if (s <= 3) return notes[0];
  if (s <= 6) return notes[1];
  return notes[2];
}

/** FNV-1a hash → 0..1. Тот же алгоритм, что в мобильном приложении. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

/**
 * Колоколообразное распределение, смещённое к низким значениям:
 * медиана ~2.4, 80% результатов ниже 4.0, ~15% moderate, ~5% high.
 */
function mockScoreFromKey(key: string): number {
  const h1 = hashStr(key);
  const h2 = hashStr(key + ':2');
  const tri = (h1 + h2) / 2;
  const skewed = tri * tri;
  return parseFloat((skewed * 6.5).toFixed(1));
}

/**
 * Анализирует изображение по его содержимому (base64) — детерминированно.
 * Для больших строк хэшируем выборку, чтобы не гонять FNV по мегабайтам.
 */
export function analyzeImageMock(imageKey: string): AnalysisResult {
  const key =
    imageKey.length > 4096
      ? imageKey.slice(0, 1024) + imageKey.slice(-1024) + imageKey.length
      : imageKey;

  const base = mockScoreFromKey(key);
  const criterion = (k: string) => {
    const h = hashStr(key + ':' + k);
    return parseFloat(Math.max(0.5, Math.min(8.5, base + (h - 0.5) * 2)).toFixed(1));
  };
  const scores = {
    asymmetry: criterion('a'),
    border: criterion('b'),
    color: criterion('c'),
    diameter: criterion('d'),
    evolution: criterion('e'),
  };

  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
  const score = parseFloat(avg.toFixed(1));
  const risk = getRiskLevel(score);
  const sizeMm = Math.max(2, Math.round(base * 0.9 + 2));

  const abcde = Object.fromEntries(
    Object.entries(scores).map(([k, v]) => {
      const s = Math.round(v);
      return [k, { s, n: noteForScore(k, s) }];
    }),
  ) as AnalysisResult['abcde'];

  return {
    score,
    risk,
    sizeMm,
    abcde,
    summary: SUMMARIES[risk],
    rec: RISK_LEVELS[risk].rec,
    isMock: true,
  };
}
