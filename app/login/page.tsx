import { redirect } from 'next/navigation';
import { auth, signIn, guestEnabled } from '@/auth';
import { getT } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import LangSwitch from '@/components/LangSwitch';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');

  const hasGoogle = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;
  const t = getT(await getLocale());

  return (
    <main className="grid-paper relative flex-1 flex items-center justify-center px-5 py-12">
      <div className="absolute top-5 right-5">
        <LangSwitch />
      </div>

      <div className="hard bg-paper w-full max-w-sm p-8 animate-fade-up">
        {/* Логотип */}
        <div className="flex flex-col items-center mb-8">
          <span className="w-16 h-16 bg-ink flex items-center justify-center mb-5">
            <span className="w-6 h-6 rounded-full bg-paper animate-square" />
          </span>
          <p className="font-label text-[9px] tracking-[0.28em] uppercase text-accent font-bold mb-2">
            {t('landing.badge')}
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">FreeSkin</h1>
          <p className="text-[13px] text-grey mt-3 text-center leading-relaxed">
            {t('login.lead')}
          </p>
        </div>

        <div className="space-y-3.5">
          {hasGoogle && (
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className="hard-sm hard-hover hard-press w-full py-3.5 bg-ink text-paper font-label text-[12px] font-bold uppercase tracking-wider"
              >
                {t('login.google')}
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
                className={`hard-sm hard-hover hard-press w-full py-3.5 font-label text-[12px] font-bold uppercase tracking-wider ${
                  hasGoogle ? 'bg-paper text-ink' : 'bg-accent text-white'
                }`}
              >
                {t('login.demo')}
              </button>
            </form>
          )}
        </div>

        <p className="font-label text-[9px] uppercase tracking-wider text-grey text-center mt-8 leading-relaxed">
          {t('landing.note')}
        </p>
      </div>
    </main>
  );
}
