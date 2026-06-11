import { NextResponse } from 'next/server';
import { sessionUserId } from '@/auth';
import { prisma } from '@/lib/prisma';
import { serializeMole } from '@/lib/serializeMole';
import { getRiskLevel } from '@/lib/riskLevels';
import type { MoleHistoryPoint } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

async function findOwnMole(idStr: string) {
  const userId = await sessionUserId();
  if (!userId) return { error: NextResponse.json({ error: 'Не авторизован' }, { status: 401 }) };
  const id = Number(idStr);
  if (!Number.isInteger(id)) return { error: NextResponse.json({ error: 'Некорректный id' }, { status: 400 }) };
  const mole = await prisma.mole.findFirst({ where: { id, userId } });
  if (!mole) return { error: NextResponse.json({ error: 'Не найдено' }, { status: 404 }) };
  return { mole, userId };
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const found = await findOwnMole(id);
  if ('error' in found) return found.error;
  return NextResponse.json(serializeMole(found.mole));
}

interface PatchBody {
  // Переименование / смена локации
  name?: string;
  loc?: string;
  // Повторное сканирование — новый замер
  rescan?: {
    score: number;
    sizeMm?: number;
    imageUrl?: string | null;
    abcde?: unknown;
    summary?: string;
    rec?: string;
  };
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const found = await findOwnMole(id);
  if ('error' in found) return found.error;
  const { mole } = found;

  let body: PatchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim().slice(0, 48);
  if (typeof body.loc === 'string' && body.loc.trim()) data.loc = body.loc.trim().slice(0, 48);

  if (body.rescan && typeof body.rescan.score === 'number') {
    const score = Math.max(0, Math.min(10, body.rescan.score));
    let history: MoleHistoryPoint[] = [];
    try { history = JSON.parse(mole.historyJson); } catch { /* начинаем заново */ }

    const MONTHS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    history.push({ m: MONTHS_RU[new Date().getMonth()], s: score });
    if (history.length > 12) history = history.slice(-12);

    data.score = score;
    data.risk = getRiskLevel(score);
    data.changed = score - mole.score > 0.5;
    data.historyJson = JSON.stringify(history);
    if (body.rescan.sizeMm) data.size = `${Math.max(1, Math.round(body.rescan.sizeMm))} мм`;
    if (body.rescan.imageUrl !== undefined) data.imageUrl = body.rescan.imageUrl;
    if (body.rescan.abcde !== undefined) data.abcdeJson = JSON.stringify(body.rescan.abcde);
    if (body.rescan.summary) data.summary = body.rescan.summary;
    if (body.rescan.rec) data.rec = body.rescan.rec;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Нет полей для обновления' }, { status: 400 });
  }

  const updated = await prisma.mole.update({ where: { id: mole.id }, data });
  return NextResponse.json(serializeMole(updated));
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const found = await findOwnMole(id);
  if ('error' in found) return found.error;
  await prisma.mole.delete({ where: { id: found.mole.id } });
  return NextResponse.json({ ok: true });
}
