'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BODY_LOCATIONS, getRiskLevel, MEDICAL_DISCLAIMER, RISK_LEVELS, scoreColor,
} from '@/lib/riskLevels';
import type { MoleDto } from '@/lib/types';
import HistoryChart from './HistoryChart';

type Tab = 'info' | 'history' | 'compare';
const TAB_LABELS: Record<Tab, string> = {
  info: 'Анализ',
  history: 'История',
  compare: 'Сравнение',
};

const SUMMARIES_FALLBACK: Record<string, string> = {
  low: 'Типичная доброкачественная родинка. Признаков беспокойства не выявлено.',
  notable: 'Родинка имеет лёгкие отличительные черты, но без явных признаков опасности.',
  moderate: 'Обнаружены признаки, требующие профессиональной оценки.',
  high: 'Выявлены признаки, характерные для подозрительных образований.',
  urgent: 'Признаки требуют немедленной оценки специалиста.',
};

export default function MoleDetailClient({ mole: initial }: { mole: MoleDto }) {
  const router = useRouter();
  const [mole, setMole] = useState(initial);
  const [tab, setTab] = useState<Tab>('info');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLoc, setEditLoc] = useState('');

  const cfg = RISK_LEVELS[mole.risk];

  const startEdit = () => {
    setEditName(mole.name);
    setEditLoc(mole.loc);
    setEditing(true);
  };

  const saveEdit = async () => {
    const name = editName.trim() || mole.name;
    const loc = editLoc.trim() || mole.loc;
    const res = await fetch(`/api/moles/${mole.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, loc }),
    });
    if (res.ok) {
      setMole({ ...mole, name, loc });
      setEditing(false);
    } else {
      alert('Не удалось сохранить изменения.');
    }
  };

  const first = mole.history[0];
  const last = mole.history[mole.history.length - 1];

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto pb-10">
      {/* Верхняя панель */}
      <div className="flex items-center gap-3 px-5 h-14 border-b-2 border-ink mb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 border-2 border-ink bg-white flex items-center justify-center shrink-0 hover:bg-ink hover:text-paper transition-colors font-label"
          aria-label="Назад"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold uppercase tracking-tight truncate">{mole.name}</p>
          <p className="font-label text-[9px] uppercase tracking-wider text-grey truncate">
            {mole.loc} · с {mole.since}
          </p>
        </div>
        {mole.changed && !editing && (
          <span className="border-2 border-risk-moderate px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-wider text-risk-moderate shrink-0">
            Изменилась
          </span>
        )}
        {editing ? (
          <>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border-2 border-ink bg-white px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-wider shrink-0 hover:bg-mist/50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="border-2 border-ink bg-ink text-paper px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              Сохранить
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="w-9 h-9 border-2 border-ink bg-white flex items-center justify-center shrink-0 hover:bg-ink hover:text-paper transition-colors text-[13px]"
            aria-label="Редактировать"
          >
            ✎
          </button>
        )}
      </div>

      {/* Карточка редактирования */}
      {editing && (
        <div className="mx-5 mb-4 hard-sm bg-white p-4">
          <p className="font-label text-[9px] font-bold tracking-[0.22em] uppercase text-grey mb-2">
            Название
          </p>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder={mole.name}
            maxLength={48}
            autoFocus
            className="w-full border-2 border-ink bg-paper px-3 py-2 text-sm font-semibold placeholder:text-mist outline-none"
          />
          <p className="font-label text-[9px] font-bold tracking-[0.22em] uppercase text-grey mt-4 mb-2">
            Расположение
          </p>
          <div className="flex flex-wrap gap-1.5">
            {BODY_LOCATIONS.map((z) => {
              const on = editLoc === z;
              return (
                <button
                  key={z}
                  type="button"
                  onClick={() => setEditLoc(z)}
                  className={`border-2 border-ink px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    on ? 'bg-ink text-paper' : 'bg-white hover:bg-mist/50'
                  }`}
                >
                  {z}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hero уровня риска */}
      <div className="px-5 mb-4">
        <div
          className="bg-white p-5 flex items-center gap-4 relative"
          style={{ border: `2px solid ${cfg.color}`, boxShadow: `5px 5px 0 ${cfg.color}` }}
        >
          <span
            className="w-20 h-20 border-2 overflow-hidden flex items-center justify-center shrink-0 bg-paper"
            style={{ borderColor: cfg.color }}
          >
            {mole.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mole.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-8 h-7 rounded-full bg-ink/70" />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <p
              className="font-display text-[22px] font-extrabold uppercase tracking-tight leading-7 mb-1.5"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </p>
            <p className="text-[12px] font-semibold leading-4 mb-2" style={{ color: cfg.color }}>
              {mole.rec ?? cfg.rec}
            </p>
            <p className="font-label text-[10px] uppercase tracking-wider text-grey">
              Ø {mole.size} · {mole.days} дн. назад
            </p>
          </div>
        </div>
      </div>

      {/* Пересканировать */}
      {!editing && (
        <div className="px-5 mb-4">
          <Link
            href={`/moles/new?moleId=${mole.id}`}
            className="hard-sm hard-hover hard-press block w-full py-3.5 bg-accent text-white text-center font-label text-[12px] font-bold uppercase tracking-wider"
          >
            Пересканировать
          </Link>
        </div>
      )}

      {/* Вкладки — сегментированная линейка */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-3 border-2 border-ink bg-white">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t, i) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`py-2.5 font-label text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  i < 2 ? 'border-r-2 border-ink' : ''
                } ${active ? 'bg-ink text-paper' : 'hover:bg-mist/50'}`}
              >
                {TAB_LABELS[t]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5">
        {/* ── Анализ ── */}
        {tab === 'info' && (
          <>
            <div className="bg-white p-4" style={{ border: `2px solid ${cfg.color}` }}>
              <p className="text-[13px] leading-5 mb-2.5">
                {mole.summary ?? SUMMARIES_FALLBACK[mole.risk]}
              </p>
              <p className="font-label text-[11px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                → {mole.rec ?? cfg.rec}
              </p>
            </div>
            <div className="mt-3 border-2 border-ink bg-paper px-3.5 py-3">
              <p className="font-label text-[9px] uppercase tracking-wider text-grey leading-4 text-center">
                {MEDICAL_DISCLAIMER}
              </p>
            </div>
          </>
        )}

        {/* ── История ── */}
        {tab === 'history' && (
          <>
            <div className="hard-sm bg-white p-4 mb-3">
              <div className="flex justify-between items-center mb-3.5">
                <p className="font-label text-[9px] font-bold tracking-[0.22em] uppercase text-grey">
                  Динамика
                </p>
                <p className="font-label text-[10px] font-bold uppercase tracking-wider text-accent">
                  {mole.history.length}{' '}
                  {mole.history.length % 10 === 1 && mole.history.length % 100 !== 11
                    ? 'замер'
                    : [2, 3, 4].includes(mole.history.length % 10) &&
                        ![12, 13, 14].includes(mole.history.length % 100)
                      ? 'замера'
                      : 'замеров'}
                </p>
              </div>
              <HistoryChart history={mole.history} />
            </div>
            <div className="overflow-x-auto thin-scroll pb-2">
              <div className="flex gap-2 w-max">
                {mole.history.map((h, i) => {
                  const color = scoreColor(h.s);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <span
                        className="w-[52px] h-[52px] border-2 flex items-center justify-center bg-white"
                        style={{ borderColor: color }}
                      >
                        <span className="w-5 h-4 rounded-full" style={{ backgroundColor: color }} />
                      </span>
                      <span className="font-label text-[9px] uppercase text-grey">{h.m}</span>
                      <span className="font-label text-[9px] font-bold uppercase tracking-wider" style={{ color }}>
                        {RISK_LEVELS[getRiskLevel(h.s)].short}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Сравнение ── */}
        {tab === 'compare' &&
          (mole.history.length >= 2 && first && last ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[first, last].map((h, i) => {
                  const color = scoreColor(h.s);
                  return (
                    <div
                      key={i}
                      className="bg-white p-4 flex flex-col items-center"
                      style={{ border: `2px solid ${color}` }}
                    >
                      <span
                        className="w-[52px] h-[52px] border-2 flex items-center justify-center mb-2.5"
                        style={{ borderColor: color }}
                      >
                        <span className="w-5 h-4 rounded-full" style={{ backgroundColor: color }} />
                      </span>
                      <p className="font-label text-[9px] uppercase tracking-wider text-grey mb-1">
                        {h.m} {i === 0 ? mole.since.split(' ')[1] : new Date().getFullYear()}
                      </p>
                      <p className="font-display text-[14px] font-bold uppercase tracking-tight" style={{ color }}>
                        {RISK_LEVELS[getRiskLevel(h.s)].short}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="hard-sm bg-white px-4">
                {(() => {
                  const diff = last.s - first.s;
                  const dynamic =
                    Math.abs(diff) < 0.3
                      ? 'Стабильна'
                      : diff > 0
                        ? 'Растёт'
                        : 'Снижается';
                  const dynColor =
                    Math.abs(diff) < 0.3 ? 'var(--ink)' : diff > 0 ? '#D03020' : '#00904A';
                  const rows: Array<[string, string, string]> = [
                    ['Динамика', dynamic, dynColor],
                    ['Количество замеров', String(mole.history.length), 'var(--ink)'],
                    ['Текущий уровень', cfg.short, cfg.color],
                  ];
                  return rows.map(([label, val, color], i) => (
                    <div
                      key={label}
                      className={`flex justify-between items-center py-3 ${i < rows.length - 1 ? 'border-b-2 border-mist' : ''}`}
                    >
                      <span className="font-label text-[10px] uppercase tracking-wider text-grey">{label}</span>
                      <span className="text-[13px] font-bold uppercase" style={{ color }}>
                        {val}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </>
          ) : (
            <p className="font-label text-[10px] uppercase tracking-wider text-grey text-center leading-relaxed mt-10">
              Для сравнения нужно минимум два замера.
              <br />
              Пересканируйте родинку позже.
            </p>
          ))}
      </div>
    </div>
  );
}
