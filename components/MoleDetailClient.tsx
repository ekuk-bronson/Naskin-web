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
      <div className="flex items-center gap-3 px-5 pt-4 pb-3.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-line bg-white text-dim flex items-center justify-center shrink-0 hover:bg-line/40 transition"
          aria-label="Назад"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold tracking-tight text-dark truncate">{mole.name}</p>
          <p className="text-[11px] text-faint truncate">
            {mole.loc} · с {mole.since}
          </p>
        </div>
        {mole.changed && !editing && (
          <span className="rounded-full border border-[#F0D8A8] bg-[#FFF8F0] px-3 py-1 text-[10px] font-semibold text-[#E06000] shrink-0">
            Изменилась
          </span>
        )}
        {editing ? (
          <>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 rounded-full border border-line bg-white text-[11px] font-semibold text-dim shrink-0"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="px-3 py-1.5 rounded-full bg-dark text-[11px] font-bold text-[#F0EDE8] shrink-0"
            >
              Сохранить
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="w-[34px] h-[34px] rounded-full border border-line bg-white text-stone flex items-center justify-center shrink-0 hover:bg-line/40 transition"
            aria-label="Редактировать"
          >
            ✎
          </button>
        )}
      </div>

      {/* Карточка редактирования */}
      {editing && (
        <div className="mx-5 mb-3 bg-white border border-line rounded-2xl p-4 shadow-[0_3px_10px_rgba(28,26,24,0.04)]">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-faint mb-2">
            Название
          </p>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder={mole.name}
            maxLength={48}
            autoFocus
            className="w-full border-b border-line py-1.5 text-sm font-semibold text-dark placeholder:text-faint outline-none bg-transparent"
          />
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-faint mt-4 mb-2">
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
                  className={`px-3.5 py-1.5 rounded-full border text-[11px] transition ${
                    on
                      ? 'bg-dark border-dark text-[#F0EDE8] font-semibold'
                      : 'bg-bg border-line text-dim font-medium hover:bg-line/40'
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
      <div className="px-5 pb-3.5">
        <div
          className="bg-white rounded-3xl border border-line p-4.5 flex items-center gap-3.5 relative overflow-hidden p-5"
          style={{ boxShadow: `0 6px 24px ${cfg.color}1F` }}
        >
          <span
            className="w-20 h-20 rounded-[20px] border-[1.5px] overflow-hidden flex items-center justify-center shrink-0"
            style={{ backgroundColor: cfg.colorBg, borderColor: cfg.colorBorder }}
          >
            {mole.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mole.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-9 h-8 rounded-full bg-[#7A5035]" />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <p
              className="font-display text-[26px] font-bold tracking-tight leading-8 mb-1.5"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </p>
            <p className="text-xs font-semibold leading-4 mb-2 opacity-85" style={{ color: cfg.color }}>
              {mole.rec ?? cfg.rec}
            </p>
            <p className="text-[11px] text-dim">
              Ø {mole.size} · {mole.days} дн. назад
            </p>
          </div>
          {mole.changed && (
            <span className="absolute top-2.5 right-2.5 rounded-full border border-[#F0D8A8] bg-[#FFF8F0] px-2.5 py-1 text-[9px] font-bold text-[#E06000]">
              Есть изменения
            </span>
          )}
        </div>
      </div>

      {/* Пересканировать */}
      {!editing && (
        <div className="px-5 mb-3">
          <Link
            href={`/moles/new?moleId=${mole.id}`}
            className="block w-full py-3.5 rounded-[18px] bg-dark text-center text-[13px] font-bold text-[#F0EDE8] tracking-wide shadow-lg shadow-dark/20 hover:opacity-90 transition"
          >
            Пересканировать
          </Link>
        </div>
      )}

      {/* Вкладки */}
      <div className="flex gap-1.5 px-5 pb-3">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3.5 py-2 rounded-full border-[1.5px] text-[11px] transition ${
                active
                  ? 'bg-dark border-dark text-[#F0EDE8] font-bold'
                  : 'bg-white border-line text-faint font-medium hover:text-dim'
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          );
        })}
      </div>

      <div className="px-5">
        {/* ── Анализ ── */}
        {tab === 'info' && (
          <>
            <div
              className="rounded-[18px] border p-4"
              style={{ borderColor: cfg.colorBorder, backgroundColor: cfg.colorBg }}
            >
              <p className="text-xs text-dim leading-5 mb-2">
                {mole.summary ?? SUMMARIES_FALLBACK[mole.risk]}
              </p>
              <p className="text-xs font-semibold" style={{ color: cfg.color }}>
                → {mole.rec ?? cfg.rec}
              </p>
            </div>
            <div className="mt-3 rounded-[14px] border border-line bg-[#FBFAF7] px-3.5 py-3">
              <p className="text-[11px] text-dim leading-4 text-center font-medium">
                {MEDICAL_DISCLAIMER}
              </p>
            </div>
          </>
        )}

        {/* ── История ── */}
        {tab === 'history' && (
          <>
            <div className="bg-white border border-line rounded-2xl p-4 mb-2.5 shadow-[0_2px_12px_rgba(28,26,24,0.04)]">
              <div className="flex justify-between items-center mb-3.5">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-faint">
                  Динамика
                </p>
                <p className="text-[10px] font-semibold text-stone">
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
              <div className="flex gap-2 px-0.5 w-max">
                {mole.history.map((h, i) => {
                  const color = scoreColor(h.s);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span
                        className="w-[52px] h-[52px] rounded-2xl border-[1.5px] flex items-center justify-center"
                        style={{ borderColor: `${color}55`, backgroundColor: `${color}12` }}
                      >
                        <span
                          className="w-[22px] h-5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </span>
                      <span className="text-[9px] text-faint font-medium">{h.m}</span>
                      <span className="text-[11px] font-extrabold" style={{ color }}>
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
              <div className="flex gap-2.5 mb-3">
                {[first, last].map((h, i) => {
                  const color = scoreColor(h.s);
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-2xl border-[1.5px] p-3.5 flex flex-col items-center"
                      style={{ borderColor: `${color}44`, backgroundColor: `${color}0A` }}
                    >
                      <span
                        className="w-[52px] h-[52px] rounded-2xl border-[1.5px] flex items-center justify-center mb-2.5"
                        style={{ borderColor: `${color}55`, backgroundColor: `${color}18` }}
                      >
                        <span
                          className="w-[22px] h-5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </span>
                      <p className="text-[10px] text-dim mb-1">
                        {h.m} {i === 0 ? mole.since.split(' ')[1] : new Date().getFullYear()}
                      </p>
                      <p className="text-sm font-extrabold tracking-tight" style={{ color }}>
                        {RISK_LEVELS[getRiskLevel(h.s)].short}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-white border border-line rounded-[18px] px-4 shadow-[0_2px_8px_rgba(28,26,24,0.03)]">
                {(() => {
                  const diff = last.s - first.s;
                  const dynamic =
                    Math.abs(diff) < 0.3
                      ? 'Стабильна'
                      : diff > 0
                        ? 'Растёт'
                        : 'Снижается';
                  const dynColor =
                    Math.abs(diff) < 0.3 ? '#8B7355' : diff > 0 ? '#D03020' : '#00904A';
                  const rows: Array<[string, string, string]> = [
                    ['Динамика', dynamic, dynColor],
                    ['Количество замеров', String(mole.history.length), '#8B7355'],
                    ['Текущий уровень', cfg.short, cfg.color],
                  ];
                  return rows.map(([label, val, color]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-3 border-b border-[#F5F2EE] last:border-b-0"
                    >
                      <span className="text-xs text-dim">{label}</span>
                      <span className="text-[13px] font-bold" style={{ color }}>
                        {val}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </>
          ) : (
            <p className="text-xs text-faint text-center leading-relaxed mt-10">
              Для сравнения нужно минимум два замера.
              <br />
              Пересканируйте родинку позже.
            </p>
          ))}
      </div>
    </div>
  );
}
