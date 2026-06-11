import Link from 'next/link';
import { RISK_LEVELS } from '@/lib/riskLevels';
import Reveal from './Reveal';

const ABCDE = [
  { k: 'A', title: 'Асимметрия', text: 'Половинки родинки не совпадают по форме' },
  { k: 'B', title: 'Границы', text: 'Края размытые, неровные или зубчатые' },
  { k: 'C', title: 'Цвет', text: 'Несколько оттенков внутри одного образования' },
  { k: 'D', title: 'Диаметр', text: 'Больше 6 мм — повод присмотреться' },
  { k: 'E', title: 'Эволюция', text: 'Меняется размер, форма или цвет со временем' },
];

const STEPS = [
  { n: '01', title: 'Сфотографируйте', text: 'Камера телефона или загрузка с компьютера — без оборудования и записи к врачу.' },
  { n: '02', title: 'Получите оценку', text: 'Алгоритм оценивает признаки по шкале ABCDE и относит родинку к уровню риска.' },
  { n: '03', title: 'Наблюдайте динамику', text: 'Повторные сканы строят историю: график изменений и сравнение «было — стало».' },
];

const MARQUEE = [
  'Шкала ABCDE', 'История изменений', 'Сравнение замеров', 'Уровни риска',
  'Напоминания о проверке', 'Приватность: данные у вас',
];

function Mark() {
  return (
    <span className="relative inline-flex w-9 h-9 rounded-full bg-line border border-faint/40 items-center justify-center shadow-[0_4px_16px_rgba(139,115,85,0.25)]">
      <span className="w-3.5 h-3 rounded-full bg-[#7A5035]" />
    </span>
  );
}

export default function Landing() {
  return (
    <div className="flex-1 overflow-x-clip">
      {/* ── Навигация ── */}
      <header className="sticky top-0 z-40 glass border-b border-line/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="flex items-center gap-3">
            <Mark />
            <span className="font-display text-lg font-bold tracking-tight text-dark">FreeSkin</span>
          </span>
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-dim">
            <a href="#how" className="hover:text-dark transition">Как это работает</a>
            <a href="#abcde" className="hover:text-dark transition">Шкала ABCDE</a>
            <a href="#levels" className="hover:text-dark transition">Уровни риска</a>
          </nav>
          <Link
            href="/login"
            className="btn-sheen px-5 py-2.5 rounded-full bg-dark text-[#F0EDE8] text-[13px] font-bold tracking-wide shadow-lg shadow-dark/20 hover:-translate-y-px transition"
          >
            Войти
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative">
        {/* Дрейфующие свечения */}
        <div className="animate-drift absolute -top-32 -left-40 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(184,154,110,0.2),transparent_65%)] pointer-events-none" />
        <div className="animate-drift-slow absolute top-24 -right-48 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,rgba(139,115,85,0.15),transparent_65%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-[1.15fr_1fr] gap-16 items-center">
          <div>
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-stone mb-7">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping-soft absolute inline-flex w-full h-full rounded-full bg-stone" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-stone" />
              </span>
              Дерматологический мониторинг
            </p>
            <h1 className="animate-fade-up delay-100 font-display text-[44px] leading-[1.05] md:text-[68px] md:leading-[1.02] font-bold tracking-tight text-dark mb-7">
              Кожа под
              <br />
              <em className="text-gradient-stone not-italic">наблюдением.</em>
            </h1>
            <p className="animate-fade-up delay-200 text-[15px] md:text-base text-dim leading-relaxed max-w-md mb-9">
              FreeSkin следит за родинками вместо записной книжки: фото, оценка риска
              по шкале ABCDE и история изменений — чтобы к врачу вы пришли вовремя,
              а не «когда-нибудь».
            </p>
            <div className="animate-fade-up delay-300 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="btn-sheen px-7 py-4 rounded-full bg-dark text-[#F0EDE8] text-sm font-bold tracking-wide shadow-xl shadow-dark/25 hover:-translate-y-0.5 transition"
              >
                Начать наблюдение — бесплатно
              </Link>
              <a
                href="#how"
                className="px-7 py-4 rounded-full bg-white/80 border border-line text-sm font-bold text-dark hover:bg-white transition"
              >
                Как это работает ↓
              </a>
            </div>
            <p className="animate-fade-up delay-400 text-[11px] text-faint mt-6">
              Это не диагноз. FreeSkin не является медицинским устройством.
            </p>
          </div>

          {/* Мокап дашборда */}
          <div className="relative animate-fade-up delay-200 hidden sm:block">
            {/* Вращающаяся золотая аура */}
            <div className="gold-halo absolute inset-[-30px] rounded-full pointer-events-none" />
            <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(139,115,85,0.14),transparent_70%)]" />
            <div className="relative mx-auto w-full max-w-[340px] rounded-[34px] bg-dark p-6 shadow-[0_40px_90px_rgba(28,26,24,0.35)] animate-float">
              <div className="absolute -top-9 -right-7 w-36 h-36 rounded-full bg-[rgba(160,120,58,0.25)] blur-sm" />
              <p className="text-[9px] tracking-[0.22em] uppercase text-[#5A5248] font-semibold mb-2">
                Всего под наблюдением
              </p>
              <p className="font-display text-[64px] leading-none font-bold text-gradient-gold mb-1.5">7</p>
              <p className="text-[11px] text-[#524B43] mb-6">Последняя проверка 3 дн. назад</p>
              <div className="flex gap-2">
                {[
                  ['1', 'ВЫСОКИЙ', RISK_LEVELS.high.color],
                  ['2', 'СРЕДНИЙ', RISK_LEVELS.moderate.color],
                  ['4', 'НОРМА', RISK_LEVELS.low.color],
                ].map(([n, l, c]) => (
                  <div
                    key={l}
                    className="flex-1 rounded-2xl border bg-[rgba(248,246,243,0.05)] py-3 flex flex-col items-center gap-1"
                    style={{ borderColor: c + '35' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                    <span className="text-lg font-extrabold" style={{ color: c }}>{n}</span>
                    <span className="text-[7px] tracking-[0.14em] text-[#504840]">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Плавающие чипы */}
            <div className="absolute -left-8 top-10 glass border border-line rounded-2xl px-4 py-3 shadow-[0_12px_32px_rgba(28,26,24,0.12)] animate-float-slow">
              <p className="text-[10px] text-dim mb-0.5">Родинка «Спина-2»</p>
              <p className="text-[13px] font-bold" style={{ color: RISK_LEVELS.low.color }}>
                ● Низкий риск
              </p>
            </div>
            <div className="absolute -right-4 bottom-8 glass border border-line rounded-2xl px-4 py-3 shadow-[0_12px_32px_rgba(28,26,24,0.12)] animate-float-slow" style={{ animationDelay: '1.4s' }}>
              <p className="text-[10px] text-dim mb-0.5">Динамика за 6 мес.</p>
              <p className="text-[13px] font-bold text-stone">Стабильна ↘</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Бегущая строка ── */}
      <section className="border-y border-line bg-white/60 overflow-hidden py-4">
        <div className="flex w-max animate-marquee gap-12">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-12 text-[12px] font-semibold tracking-[0.16em] uppercase text-faint whitespace-nowrap">
              {t}
              <span className="w-1 h-1 rounded-full bg-stone/60" />
            </span>
          ))}
        </div>
      </section>

      {/* ── Как это работает ── */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone mb-3">Процесс</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-dark mb-14 max-w-xl">
            Три шага — и родинка под контролем
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 130}>
              <div className="card-lift gold-edge h-full rounded-[26px] p-7 shadow-[0_6px_24px_rgba(28,26,24,0.05)]">
                <p className="font-display text-[40px] font-bold text-gradient-stone leading-none mb-5">{s.n}</p>
                <p className="text-[16px] font-bold text-dark mb-2">{s.title}</p>
                <p className="text-[13px] text-dim leading-relaxed">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ABCDE ── */}
      <section id="abcde" className="relative bg-dark py-24 overflow-hidden">
        <div className="absolute -top-20 right-0 w-[420px] h-[420px] rounded-full bg-[rgba(160,120,58,0.18)] blur-2xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone mb-3">Методика</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#F0EDE8] mb-4">
              Шкала ABCDE
            </h2>
            <p className="text-sm text-[#9A9087] max-w-lg mb-12 leading-relaxed">
              Международный дерматологический чек-лист самоосмотра. FreeSkin оценивает
              каждый из пяти признаков и складывает их в общий уровень риска.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ABCDE.map((a, i) => (
              <Reveal key={a.k} delay={i * 90}>
                <div className="h-full rounded-[22px] border border-[rgba(216,194,154,0.18)] bg-[rgba(248,246,243,0.04)] p-5 hover:bg-[rgba(248,246,243,0.08)] hover:border-[rgba(216,194,154,0.4)] hover:-translate-y-1 transition duration-300">
                  <p className="font-display text-[34px] font-bold text-gradient-gold leading-none mb-3">{a.k}</p>
                  <p className="text-[14px] font-bold text-[#F0EDE8] mb-1.5">{a.title}</p>
                  <p className="text-[12px] text-[#7A7268] leading-relaxed">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Уровни риска ── */}
      <section id="levels" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-stone mb-3">Результат</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-dark mb-14 max-w-2xl">
            Понятный ответ вместо тревожных догадок
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl">
          {(['low', 'moderate', 'high'] as const).map((lvl, i) => {
            const cfg = RISK_LEVELS[lvl];
            return (
              <Reveal key={lvl} delay={i * 130}>
                <div
                  className="card-lift h-full rounded-[26px] border p-7"
                  style={{ backgroundColor: cfg.colorBg, borderColor: cfg.colorBorder }}
                >
                  <span className="relative inline-flex w-3 h-3 mb-5">
                    <span className="animate-ping-soft absolute inline-flex w-full h-full rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="relative inline-flex w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                  </span>
                  <p className="font-display text-[22px] font-bold tracking-tight mb-2" style={{ color: cfg.color }}>
                    {cfg.label}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: cfg.color, opacity: 0.85 }}>
                    {cfg.rec}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Финальный CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[34px] bg-dark px-8 py-16 md:py-20 text-center">
            <div className="animate-drift absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[rgba(184,154,110,0.26)] blur-2xl" />
            <div className="animate-drift-slow absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-[rgba(116,88,60,0.3)] blur-2xl" />
            <h2 className="relative font-display text-3xl md:text-5xl font-bold tracking-tight mb-5">
              <span className="text-[#F0EDE8]">Первая проверка — </span>
              <span className="text-gradient-gold">сегодня</span>
            </h2>
            <p className="relative text-sm text-[#9A9087] max-w-md mx-auto mb-9 leading-relaxed">
              Бесплатно, без карты и установки. Одна фотография — и у родинки появится история.
            </p>
            <Link
              href="/login"
              className="btn-sheen relative inline-block px-9 py-4 rounded-full bg-[#F0EDE8] text-dark text-sm font-bold tracking-wide shadow-xl hover:-translate-y-0.5 transition"
            >
              Создать аккаунт
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Подвал ── */}
      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="flex items-center gap-2.5">
            <Mark />
            <span className="font-display text-sm font-bold text-dark">FreeSkin</span>
          </span>
          <p className="text-[11px] text-faint text-center leading-relaxed max-w-md">
            Это не диагноз. FreeSkin не является медицинским устройством.
            При любых сомнениях обратитесь к дерматологу.
          </p>
          <p className="text-[11px] text-faint">© {new Date().getFullYear()} FreeSkin</p>
        </div>
      </footer>
    </div>
  );
}
