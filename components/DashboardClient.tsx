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
    .toUpperCase();

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
      <div className="mb-5">
        <p className="font-label text-[9px] tracking-[0.25em] text-accent font-bold mb-1.5">
          {monthLabel}
        </p>
        <h1 className="font-display text-[26px] font-extrabold uppercase tracking-tight">
          Мои родинки
        </h1>
      </div>

      <HeroCard moles={moles} />

      {/* Alert-баннер об изменившейся родинке */}
      {alertMole && (
        <Link
          href={`/moles/${alertMole.id}`}
          className="hard-sm hard-hover flex items-center gap-3 bg-white px-4 py-3.5 mb-4"
          style={{ borderColor: 'var(--risk-high)', boxShadow: '3px 3px 0 var(--risk-high)' }}
        >
          <span className="w-2.5 h-2.5 bg-risk-high shrink-0 animate-blink" />
          <span className="flex-1 min-w-0">
            <span className="block font-label text-[11px] font-bold uppercase tracking-wider text-risk-high mb-0.5">
              Обнаружены изменения
            </span>
            <span className="block text-[12px] text-grey truncate">
              {alertMole.name} · рекомендуем показать врачу
            </span>
          </span>
          <span className="font-label text-base">→</span>
        </Link>
      )}

      {/* Сортировка */}
      {moles.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <p className="font-label text-[9px] uppercase tracking-[0.22em] text-grey font-bold">
            Под наблюдением · {moles.length}
          </p>
          <button
            type="button"
            onClick={() => setSortBy(NEXT_SORT[sortBy])}
            className="border-2 border-ink bg-white px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
          >
            {SORT_LABELS[sortBy]} ↕
          </button>
        </div>
      )}

      {/* Список / пустое состояние */}
      {moles.length === 0 ? (
        <div className="hard bg-white flex flex-col items-center py-14 gap-3">
          <span className="w-16 h-16 border-2 border-ink flex items-center justify-center">
            <span className="w-6 h-5 rounded-full bg-ink/60" />
          </span>
          <p className="font-display text-[15px] font-bold uppercase tracking-tight">Пока пусто</p>
          <p className="font-label text-[10px] uppercase tracking-wider text-grey text-center leading-relaxed px-8">
            Добавьте первую родинку,
            <br />
            чтобы начать наблюдение
          </p>
        </div>
      ) : (
        <div className="stagger-in space-y-3">
          {sorted.map((m) => (
            <MoleCard key={m.id} mole={m} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Закреплённая кнопка добавления */}
      <div className="fixed bottom-0 left-0 right-0 bg-paper border-t-2 border-ink">
        <div className="max-w-2xl mx-auto px-5 py-3.5">
          <Link
            href="/moles/new"
            className="hard hard-hover hard-press block w-full py-3.5 bg-accent text-white text-center font-label text-[12px] font-bold uppercase tracking-wider"
          >
            + Добавить родинку
          </Link>
        </div>
      </div>
    </div>
  );
}
