import { NextResponse } from 'next/server';
import { sessionUserId } from '@/auth';
import { prisma } from '@/lib/prisma';
import { serializeMole } from '@/lib/serializeMole';
import { getRiskLevel } from '@/lib/riskLevels';

export async function GET() {
  const userId = await sessionUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const moles = await prisma.mole.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(moles.map(serializeMole));
}

interface CreateBody {
  name?: string;
  loc?: string;
  score?: number;
  sizeMm?: number;
  imageUrl?: string | null;
  abcde?: unknown;
  summary?: string;
  rec?: string;
}

export async function POST(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const loc = (body.loc ?? '').trim();
  const score = typeof body.score === 'number' ? Math.max(0, Math.min(10, body.score)) : NaN;
  if (!name || !loc || Number.isNaN(score)) {
    return NextResponse.json({ error: 'Поля name, loc, score обязательны' }, { status: 400 });
  }

  const MONTHS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const now = new Date();
  const m = MONTHS_RU[now.getMonth()];

  const mole = await prisma.mole.create({
    data: {
      userId,
      name: name.slice(0, 48),
      loc: loc.slice(0, 48),
      score,
      risk: getRiskLevel(score),
      days: 0,
      changed: false,
      size: `${Math.max(1, Math.round(body.sizeMm ?? 4))} мм`,
      since: `${m} ${now.getFullYear()}`,
      imageUrl: body.imageUrl ?? null,
      abcdeJson: JSON.stringify(body.abcde ?? {}),
      historyJson: JSON.stringify([{ m, s: score }]),
      summary: body.summary ?? null,
      rec: body.rec ?? null,
    },
  });

  return NextResponse.json(serializeMole(mole), { status: 201 });
}
