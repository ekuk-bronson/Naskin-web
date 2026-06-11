'use client';

/**
 * Клиентские утилиты для фото: даунскейл до 768px (чтобы не раздувать БД)
 * и упрощённая проверка качества — веб-аналог services/preprocessing.ts.
 */

export type QualityReason = 'small' | 'dark' | 'bright';

export interface QualityResult {
  ok: boolean;
  /** Код причины — локализуется на стороне UI. */
  reason?: QualityReason;
}

const MAX_SIDE = 768;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не удалось прочитать изображение'));
    img.src = src;
  });
}

/** Файл → даунскейленный JPEG data-URL (макс. сторона 768px). */
export async function fileToDataUrl(file: File): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('Не удалось прочитать файл'));
    r.readAsDataURL(file);
  });

  const img = await loadImage(raw);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
  if (scale === 1 && file.size < 400_000) return raw;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

/** Проверка качества: разрешение и средняя яркость кадра. */
export async function checkPhotoQuality(dataUrl: string): Promise<QualityResult> {
  const img = await loadImage(dataUrl);

  if (Math.min(img.width, img.height) < 224) {
    return { ok: false, reason: 'small' };
  }

  const canvas = document.createElement('canvas');
  const side = 64;
  canvas.width = side;
  canvas.height = side;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { ok: true };
  ctx.drawImage(img, 0, 0, side, side);
  const { data } = ctx.getImageData(0, 0, side, side);

  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  const avg = sum / (side * side);

  if (avg < 35) return { ok: false, reason: 'dark' };
  if (avg > 225) return { ok: false, reason: 'bright' };
  return { ok: true };
}
