'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { BODY_LOCATIONS } from '@/lib/riskLevels';
import { checkPhotoQuality, fileToDataUrl, type QualityResult } from '@/lib/clientImage';
import type { AnalysisResult } from '@/lib/mockAnalyzer';

type Step = 1 | 2 | 3;

function StepDots({ current }: { current: Step }) {
  return (
    <span className="flex gap-1.5 items-center">
      {([1, 2, 3] as Step[]).map((s) => (
        <span
          key={s}
          className="h-1.5 rounded-full transition-all"
          style={{
            width: s === current ? 18 : s < current ? 8 : 6,
            backgroundColor:
              s === current ? 'var(--dark)' : s < current ? 'var(--stone)' : 'var(--faint)',
          }}
        />
      ))}
    </span>
  );
}

export default function AddWizard({
  rescanMoleId,
  rescanMoleName,
  defaultName,
}: {
  rescanMoleId: number | null;
  rescanMoleName: string | null;
  defaultName: string;
}) {
  const router = useRouter();
  const isRescan = rescanMoleId !== null;

  const [step, setStep] = useState<Step>(isRescan ? 2 : 1);
  const [name, setName] = useState('');
  const [loc, setLoc] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<QualityResult | null>(null);
  const [qualityLoading, setQualityLoading] = useState(false);
  const [qualityIgnored, setQualityIgnored] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const analysisStarted = useRef(false);

  const acceptFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setImageUrl(dataUrl);
    } catch {
      setError('Не удалось обработать фото. Попробуйте другой файл.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    noClick: true,
    onDrop: (files) => acceptFile(files[0]),
  });

  // Автопроверка качества при смене фото
  useEffect(() => {
    if (!imageUrl) {
      setQuality(null);
      setQualityIgnored(false);
      return;
    }
    let cancelled = false;
    setQualityLoading(true);
    setQuality(null);
    setQualityIgnored(false);
    checkPhotoQuality(imageUrl)
      .then((q) => { if (!cancelled) setQuality(q); })
      .catch(() => { if (!cancelled) setQuality(null); })
      .finally(() => { if (!cancelled) setQualityLoading(false); });
    return () => { cancelled = true; };
  }, [imageUrl]);

  const qualityOk = !quality || quality.ok || qualityIgnored;

  // Шаг 3 — запуск анализа
  useEffect(() => {
    if (step !== 3 || !imageUrl || analysisStarted.current) return;
    analysisStarted.current = true;

    (async () => {
      try {
        const base64 = imageUrl.split(',')[1] ?? imageUrl;
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        if (!res.ok) throw new Error();
        const result: AnalysisResult = await res.json();

        let moleId = rescanMoleId;
        if (isRescan && rescanMoleId) {
          const patch = await fetch(`/api/moles/${rescanMoleId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rescan: {
                score: result.score,
                sizeMm: result.sizeMm,
                imageUrl,
                abcde: result.abcde,
                summary: result.summary,
                rec: result.rec,
              },
            }),
          });
          if (!patch.ok) throw new Error();
        } else {
          const post = await fetch('/api/moles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name.trim() || defaultName,
              loc,
              score: result.score,
              sizeMm: result.sizeMm,
              imageUrl,
              abcde: result.abcde,
              summary: result.summary,
              rec: result.rec,
            }),
          });
          if (!post.ok) throw new Error();
          const created = await post.json();
          moleId = created.id;
        }
        router.replace(`/moles/${moleId}`);
      } catch {
        analysisStarted.current = false;
        setError('Не удалось выполнить анализ. Попробуйте ещё раз.');
        setStep(2);
      }
    })();
  }, [step, imageUrl, isRescan, rescanMoleId, name, loc, defaultName, router]);

  const back = () => {
    if (step === 1 || (step === 2 && isRescan)) router.back();
    else if (step === 2) setStep(1);
  };

  const title =
    step === 3
      ? 'Анализ…'
      : isRescan
        ? `Повторный скан · ${rescanMoleName ?? ''}`
        : step === 1
          ? 'Новая родинка'
          : 'Фотография';

  return (
    <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-line">
        <button
          type="button"
          onClick={back}
          disabled={step === 3}
          className="w-9 h-9 rounded-full border border-line bg-white text-dark flex items-center justify-center disabled:opacity-20 hover:bg-line/40 transition"
          aria-label="Назад"
        >
          ←
        </button>
        <p className="text-[13px] font-semibold text-dark truncate px-3">{title}</p>
        <StepDots current={step} />
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-2xl border border-[#FFD0D8] bg-[#FFF0F3] px-4 py-3 text-[12px] text-[#E8003D] font-semibold">
          {error}
        </div>
      )}

      {/* ── Шаг 1: имя + локация ── */}
      {step === 1 && (
        <>
          <div className="flex-1 px-6 pt-7 pb-32">
            <h1 className="font-display text-[32px] font-bold tracking-tight text-dark mb-6">
              Как назовём родинку?
            </h1>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-faint mb-2.5">
              Название
            </p>
            <div className="bg-white border border-line rounded-2xl px-4 shadow-[0_2px_8px_rgba(28,26,24,0.03)]">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={defaultName}
                maxLength={48}
                className="w-full py-3.5 text-[15px] font-medium text-dark placeholder:text-faint outline-none bg-transparent"
              />
            </div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-faint mt-6 mb-2.5">
              Расположение
            </p>
            <div className="flex flex-wrap gap-2">
              {BODY_LOCATIONS.map((l) => {
                const on = loc === l;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLoc(l)}
                    className={`px-3.5 py-2 rounded-full border text-xs font-medium transition ${
                      on
                        ? 'bg-dark border-dark text-[#F0EDE8] font-semibold'
                        : 'bg-white border-line text-dark hover:bg-line/40'
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-line">
            <div className="max-w-2xl mx-auto px-6 py-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!loc}
                className="w-full py-4 rounded-[18px] bg-dark text-sm font-bold text-[#F0EDE8] tracking-wide disabled:opacity-35 hover:opacity-90 transition"
              >
                {loc ? 'Далее' : 'Выберите расположение'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Шаг 2: фото ── */}
      {step === 2 && (
        <>
          <div className="flex-1 px-6 pt-7 pb-32">
            <h1 className="font-display text-[32px] font-bold tracking-tight text-dark mb-6">
              Сфотографируйте родинку
            </h1>

            {imageUrl ? (
              <div className="flex flex-col items-center mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Предпросмотр"
                  className="w-full max-w-md aspect-square object-cover rounded-3xl"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="mt-3 text-xs font-semibold text-stone hover:underline"
                >
                  Переснять
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`h-52 rounded-3xl border-[1.5px] border-dashed flex flex-col items-center justify-center mb-5 transition ${
                  isDragActive ? 'border-stone bg-stone/5' : 'border-line'
                }`}
              >
                <input {...getInputProps()} />
                <span className="text-4xl text-faint mb-3">◎</span>
                <p className="text-xs text-faint text-center leading-relaxed px-8">
                  Перетащите фото сюда или используйте кнопки ниже.
                  <br />
                  Родинка — в центре кадра, при хорошем освещении.
                </p>
              </div>
            )}

            {/* Баннер проверки качества */}
            {imageUrl && qualityLoading && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-faint mt-1.5 animate-dot" />
                <p className="text-xs text-dim font-medium mt-0.5">Проверяем качество снимка…</p>
              </div>
            )}
            {imageUrl && !qualityLoading && quality && !quality.ok && !qualityIgnored && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-[#F0D8A8] bg-[#FFF8F0] px-3.5 py-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E06000] mt-1.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#E06000] mb-0.5">Проблема со снимком</p>
                  <p className="text-xs text-dark leading-snug">{quality.reason}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="text-xs font-bold text-stone hover:underline"
                    >
                      Переснять
                    </button>
                    <span className="text-xs text-faint">·</span>
                    <button
                      type="button"
                      onClick={() => setQualityIgnored(true)}
                      className="text-xs font-medium text-dim hover:underline"
                    >
                      Всё равно продолжить
                    </button>
                  </div>
                </div>
              </div>
            )}
            {imageUrl && !qualityLoading && quality?.ok && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-[#C8E8D4] bg-[#F0FFF6] px-3.5 py-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#00904A] mt-1.5" />
                <p className="text-xs font-semibold text-[#00904A] mt-0.5">
                  Качество снимка подходит для анализа
                </p>
              </div>
            )}

            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
            <input
              ref={galleryInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => cameraInput.current?.click()}
              className="w-full py-4 rounded-2xl bg-dark text-sm font-bold text-[#F0EDE8] tracking-wide mb-2.5 hover:opacity-90 transition"
            >
              Сделать фото
            </button>
            <button
              type="button"
              onClick={() => galleryInput.current?.click()}
              className="w-full py-4 rounded-2xl bg-white border border-line text-sm font-bold text-dark tracking-wide hover:bg-line/40 transition"
            >
              Выбрать из галереи
            </button>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-line">
            <div className="max-w-2xl mx-auto px-6 py-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!imageUrl || !qualityOk}
                className="w-full py-4 rounded-[18px] bg-dark text-sm font-bold text-[#F0EDE8] tracking-wide disabled:opacity-35 hover:opacity-90 transition"
              >
                Продолжить
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Шаг 3: анализ ── */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-[60vh]">
          <span className="w-[120px] h-[120px] rounded-full bg-line shadow-[0_4px_20px_rgba(139,115,85,0.15)] mb-7 animate-orb" />
          <p className="font-display text-2xl font-bold tracking-tight text-dark mb-2">Анализируем…</p>
          <p className="text-xs text-faint">Оцениваем признаки по шкале ABCDE</p>
          <span className="w-[72%] max-w-xs h-[3px] bg-line rounded-full mt-8 overflow-hidden">
            <span className="block h-full bg-stone rounded-full animate-progress" />
          </span>
          <span className="flex items-center gap-2 mt-7 px-3.5 py-2 rounded-full border border-line bg-[#FBFAF7]">
            <span className="w-[7px] h-[7px] rounded-full bg-stone" />
            <span className="text-[11px] font-semibold text-stone tracking-wide">
              Демо-режим анализа
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
