import { NextResponse } from 'next/server';
import { sessionUserId } from '@/auth';
import { analyzeImageMock } from '@/lib/mockAnalyzer';

/**
 * POST /api/analyze — { imageBase64 } → AnalysisResult.
 * Сейчас — детерминированный мок (как services/mockAnalyzer.ts в мобильном
 * приложении). Контракт совместим с будущим FastAPI/TFLite-бэкендом.
 */
export async function POST(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  let body: { imageBase64?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 });
  }
  if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
    return NextResponse.json({ error: 'Поле imageBase64 обязательно' }, { status: 400 });
  }

  // Имитация времени инференса (мобильный мок ждёт 1.5 c)
  await new Promise((r) => setTimeout(r, 1500));

  const result = analyzeImageMock(body.imageBase64);
  return NextResponse.json(result);
}
