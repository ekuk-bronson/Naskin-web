'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { checkPhotoQuality, fileToDataUrl, type QualityResult } from '@/lib/clientImage';
import { LOCATION_KEYS, type DictKey } from '@/lib/i18n';
import { useLocale } from '@/lib/i18n-client';
import type { AnalysisResult } from '@/lib/mockAnalyzer';

type Step = 1 | 2 | 3;

function StepBar({ current }: { current: Step }) {
  return (
    <span className="flex gap-1 items-center">
      {([1, 2, 3] as Step[]).map((s) => (
        <span
          key={s}
          className="w-6 h-1.5 border border-ink"
          style={{ backgroundColor: s <= current ? 'var(--ink)' : 'transparent' }}
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
  const { t } = useLocale();
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
      setError(t('wizard.errPhoto'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

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
        setError(t('wizard.errAnalyze'));
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
      ? t('wizard.titleAnalysis')
      : isRescan
        ? `${t('wizard.rescan')} · ${rescanMoleName ?? ''}`
        : step === 1
          ? t('wizard.titleNew')
          : t('wizard.titlePhoto');

  return (
    <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between px-5 h-14 border-b-2 border-ink">
        <button
          type="button"
          onClick={back}
          disabled={step === 3}
          className="w-9 h-9 border-2 border-ink bg-white flex items-center justify-center disabled:opacity-20 hover:bg-ink hover:text-paper transition-colors font-label"
          aria-label="Назад"
        >
          ←
        </button>
        <p className="font-label text-[11px] font-bold uppercase tracking-wider truncate px-3">{title}</p>
        <StepBar current={step} />
      </div>

      {error && (
        <div className="mx-5 mt-4 border-2 border-risk-high bg-white px-4 py-3 font-label text-[11px] font-bold uppercase tracking-wider text-risk-high">
          {error}
        </div>
      )}

      {/* ── Шаг 1: имя + локация ── */}
      {step === 1 && (
        <>
          <div className="flex-1 px-5 pt-7 pb-32">
            <h1 className="font-display text-[26px] font-extrabold uppercase tracking-tight mb-7">
              {t('wizard.nameQ')}
            </h1>
            <p className="font-label text-[9px] font-bold tracking-[0.25em] uppercase text-grey mb-2.5">
              {t('wizard.lblName')}
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={defaultName}
              maxLength={48}
              className="w-full border-2 border-ink bg-white px-4 py-3.5 text-[15px] font-medium placeholder:text-mist outline-none focus:bg-paper transition-colors"
            />
            <p className="font-label text-[9px] font-bold tracking-[0.25em] uppercase text-grey mt-7 mb-2.5">
              {t('wizard.lblLoc')}
            </p>
            <div className="flex flex-wrap gap-2">
              {LOCATION_KEYS.map((key) => {
                const l = t(key);
                const on = loc === l;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLoc(l)}
                    className={`border-2 border-ink px-3.5 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      on ? 'bg-ink text-paper' : 'bg-white hover:bg-mist/50'
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-paper border-t-2 border-ink">
            <div className="max-w-2xl mx-auto px-5 py-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!loc}
                className="hard-sm hard-hover hard-press w-full py-3.5 bg-accent text-white font-label text-[12px] font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none"
              >
                {loc ? t('wizard.next') : t('wizard.chooseLoc')}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Шаг 2: фото ── */}
      {step === 2 && (
        <>
          <div className="flex-1 px-5 pt-7 pb-32">
            <h1 className="font-display text-[26px] font-extrabold uppercase tracking-tight mb-7">
              {t('wizard.photoQ')}
            </h1>

            {imageUrl ? (
              <div className="flex flex-col items-center mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt=""
                  className="w-full max-w-md aspect-square object-cover border-2 border-ink"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="mt-3 font-label text-[11px] font-bold uppercase tracking-wider text-accent hover:underline"
                >
                  {t('wizard.retake')}
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`h-52 border-2 border-dashed border-ink flex flex-col items-center justify-center mb-5 transition-colors ${
                  isDragActive ? 'bg-mist/60' : 'bg-white'
                }`}
              >
                <input {...getInputProps()} />
                <span className="font-display text-3xl mb-3">⌖</span>
                <p className="font-label text-[10px] uppercase tracking-wider text-grey text-center leading-relaxed px-8">
                  {t('wizard.dropHint1')}
                  <br />
                  {t('wizard.dropHint2')}
                </p>
              </div>
            )}

            {/* Баннер проверки качества */}
            {imageUrl && qualityLoading && (
              <div className="border-2 border-ink bg-white px-4 py-3 mb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-ink animate-blink" />
                <p className="font-label text-[10px] font-bold uppercase tracking-wider text-grey">
                  {t('wizard.checking')}
                </p>
              </div>
            )}
            {imageUrl && !qualityLoading && quality && !quality.ok && !qualityIgnored && (
              <div className="border-2 border-risk-moderate bg-white px-4 py-3.5 mb-4">
                <p className="font-label text-[10px] font-bold uppercase tracking-wider text-risk-moderate mb-1">
                  {t('wizard.problem')}
                </p>
                <p className="text-[13px] leading-snug mb-2.5">
                  {quality.reason ? t(`wizard.q${quality.reason[0].toUpperCase()}${quality.reason.slice(1)}` as DictKey) : ''}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="font-label text-[10px] font-bold uppercase tracking-wider text-accent hover:underline"
                  >
                    {t('wizard.retake')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQualityIgnored(true)}
                    className="font-label text-[10px] uppercase tracking-wider text-grey hover:underline"
                  >
                    {t('wizard.anyway')}
                  </button>
                </div>
              </div>
            )}
            {imageUrl && !qualityLoading && quality?.ok && (
              <div className="border-2 border-risk-low bg-white px-4 py-3 mb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-risk-low" />
                <p className="font-label text-[10px] font-bold uppercase tracking-wider text-risk-low">
                  {t('wizard.qualityOk')}
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
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraInput.current?.click()}
                className="hard-sm hard-hover hard-press py-3.5 bg-ink text-paper font-label text-[11px] font-bold uppercase tracking-wider"
              >
                {t('wizard.take')}
              </button>
              <button
                type="button"
                onClick={() => galleryInput.current?.click()}
                className="hard-sm hard-hover hard-press py-3.5 bg-white font-label text-[11px] font-bold uppercase tracking-wider"
              >
                {t('wizard.gallery')}
              </button>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-paper border-t-2 border-ink">
            <div className="max-w-2xl mx-auto px-5 py-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!imageUrl || !qualityOk}
                className="hard-sm hard-hover hard-press w-full py-3.5 bg-accent text-white font-label text-[12px] font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none"
              >
                {t('wizard.continue')}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Шаг 3: анализ ── */}
      {step === 3 && (
        <div className="grid-paper flex-1 flex flex-col items-center justify-center px-5 min-h-[60vh]">
          <span className="w-24 h-24 bg-ink flex items-center justify-center mb-7 animate-square">
            <span className="w-9 h-9 rounded-full bg-paper" />
          </span>
          <p className="font-display text-2xl font-extrabold uppercase tracking-tight mb-2">
            {t('wizard.analyzing')}<span className="animate-blink">_</span>
          </p>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-grey">
            {t('wizard.abcdeHint')}
          </p>
          <div className="w-[72%] max-w-xs h-3 border-2 border-ink mt-8 overflow-hidden bg-white">
            <div className="stripes h-full" />
          </div>
          <span className="border-2 border-ink bg-white mt-7 px-3.5 py-1.5 font-label text-[10px] font-bold uppercase tracking-wider">
            {t('wizard.demo')}
          </span>
        </div>
      )}
    </div>
  );
}
