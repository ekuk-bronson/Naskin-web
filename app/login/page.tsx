import { redirect } from 'next/navigation';
import { auth, signIn, guestEnabled } from '@/auth';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');

  const hasGoogle = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Логотип-орб в мраморном стиле */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-line border border-faint/40 shadow-[0_8px_30px_rgba(139,115,85,0.18)] flex items-center justify-center mb-6">
            <div className="w-8 h-7 rounded-full bg-[#7A5035]" />
          </div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone font-semibold mb-2">
            Дерматологический мониторинг
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-dark">FreeSkin</h1>
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
