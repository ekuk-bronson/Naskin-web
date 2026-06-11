'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { MoleDto } from '@/lib/types';
import HeroCard from './HeroCard';
import MoleCard from './MoleCard';

type SortKey = 'date' | 'score' | 'name';
const NEXT_SORT: Record<SortKey, SortKey> = { date: 'score', score: 'name', name: 'date' };
const SORT_LABELS: Record<SortKey, string> = {
  date: 'По дате',
  score: 'По риску',
  name: 'По имени',
};

export default function DashboardClient({ moles: initial }: { moles: MoleDto[] }) {
  const [moles, setMoles] = useState(initial);
  const [sortBy, setSortBy] = useState<SortKey>('date');

  const sorted = [...moles].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'ru');
    return 0; // date — серверный порядок (новые сверху)
  });

  const alertMole = moles.find((m) => m.changed);
  const monthLabel = new Date()
    .toLocaleString('ru', { month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase());

  const handleDelete = async (id: number) => {
    const mole = moles.find((m) => m.id === id);
    if (!mole) return;
    if (!confirm(`«${mole.name}» будет удалена без возможности восстановления. Удалить?`)) return;
    const res = await fetch(`/api/moles/${id}`, { method: 'DELETE' });
    if (res.ok) setMoles((p) => p.filter((m) => m.id !== id));
    else alert('Не удалось удалить. Попробуйте ещё раз.');
  };

  return (
    <div className="pb-24">
      {/* Заголовок */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-stone font-semibold mb-1">
            {monthLabel}
          </p>
          <h1 className="font-display text-[30px] font-bold tracking-tight text-dark">Мои родинки</h1>
        </div>
      </div>

      <HeroCard moles={moles} />

      {/* Alert-баннер об изменившейся родинке */}
      {alertMole && (
        <Link
          href={`/moles/${alertMole.id}`}
          className="flex items-center gap-3 bg-white border border-[#F0D8DC] rounded-2xl px-4 py-3.5 mb-3.5 shadow-[0_4px_16px_rgba(232,0,61,0.07)] hover:shadow-[0_6px_20px_rgba(232,0,61,0.12)] transition"
        >
          <span className="w-2 h-2 rounded-full bg-[#E8003D] shrink-0 animate-dot" />
          <span className="flex-1 min-w-0">
            <span className="block text-[12px] font-bold text-[#E8003D] mb-0.5">
              Обнаружены изменения
            </span>
            <span className="block text-[11px] text-dim truncate">
              {alertMole.name} · рекомендуем показать врачу
            </span>
          </span>
          <span className="text-xl text-faint">›</span>
        </Link>
      )}

      {/* Сортировка */}
      {moles.length > 0 && (
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[9px] tracking-[0.2em] uppercase text-faint font-semibold">
            Под наблюдением · {moles.length}
          </p>
          <button
            type="button"
            onClick={() => setSortBy(NEXT_SORT[sortBy])}
            className="px-2.5 py-1 rounded-full bg-white border border-line text-[10px] font-semibold text-stone hover:bg-line/40 transition"
          >
            {SORT_LABELS[sortBy]} ↕
          </button>
        </div>
      )}

      {/* Список / пустое состояние */}
      {moles.length === 0 ? (
        <div className="flex flex-col items-center py-14 gap-2">
          <span className="w-[82px] h-[82px] rounded-full bg-line border border-[#E0DAD2] flex items-center justify-center mb-1 shadow-[0_4px_12px_rgba(28,26,24,0.04)]">
            <span className="w-9 h-8 rounded-full bg-faint" />
          </span>
          <p className="text-[15px] font-bold text-dim tracking-tight">Пока пусто</p>
          <p className="text-xs text-faint text-center leading-relaxed px-8">
            Добавьте первую родинку, чтобы начать наблюдение за её состоянием.
          </p>
        </div>
      ) : (
        <div className="stagger-in space-y-2">
          {sorted.map((m) => (
            <MoleCard key={m.id} mole={m} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Закреплённая кнопка добавления */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAF8]/95 backdrop-blur border-t border-line">
        <div className="max-w-2xl mx-auto px-5 py-3">
          <Link
            href="/moles/new"
            className="btn-sheen block w-full py-4 rounded-[18px] bg-dark text-center text-sm font-bold text-[#F0EDE8] tracking-wide shadow-lg shadow-dark/20 hover:-translate-y-px transition"
          >
            + Добавить родинку
          </Link>
        </div>
      </div>
    </div>
  );
}
