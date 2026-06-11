import { redirect } from 'next/navigation';
import { auth, signIn, guestEnabled } from '@/auth';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');

  const hasGoogle = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

  return (
    <main className="relative flex-1 flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Свечения фона */}
      <div className="absolute -top-32 -left-32 w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle,rgba(160,120,58,0.15),transparent_65%)] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(139,115,85,0.12),transparent_65%)] pointer-events-none" />

      <div className="relative w-full max-w-sm animate-fade-up">
        {/* Логотип-орб с вращающимся кольцом */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-24 h-24 flex items-center justify-center mb-6">
            <span className="absolute inset-0 rounded-full border border-dashed border-stone/40 animate-ring" />
            <span className="w-20 h-20 rounded-full bg-line border border-faint/40 shadow-[0_8px_30px_rgba(139,115,85,0.22)] flex items-center justify-center animate-orb">
              <span className="w-8 h-7 rounded-full bg-[#7A5035]" />
            </span>
          </div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone font-semibold mb-2">
            Дерматологический мониторинг
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-dark">FreeSkin</h1>
          <p className="text-sm text-dim mt-3 text-center leading-relaxed">
            Наблюдайте за родинками, отслеживайте изменения и вовремя обращайтесь к врачу.
          </p>
        </div>

        <div className="space-y-3">
          {hasGoogle && (
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-dark text-[#F0EDE8] text-sm font-bold tracking-wide shadow-lg shadow-dark/20 hover:opacity-90 transition"
              >
                Войти через Google
              </button>
            </form>
          )}

          {guestEnabled && (
            <form
              action={async () => {
                'use server';
                await signIn('guest', { redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className={`w-full py-4 rounded-2xl text-sm font-bold tracking-wide transition ${
                  hasGoogle
                    ? 'bg-white border border-line text-dark hover:bg-line/40'
                    : 'bg-dark text-[#F0EDE8] shadow-lg shadow-dark/20 hover:opacity-90'
                }`}
              >
                Войти в демо-режиме
              </button>
            </form>
          )}
        </div>

        <p className="text-[11px] text-faint text-center mt-8 leading-relaxed">
          Это не диагноз. FreeSkin не является медицинским устройством.
          <br />
          Обратитесь к врачу.
        </p>
      </div>
    </main>
  );
}
