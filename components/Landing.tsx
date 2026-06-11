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
  { n: '01', title: 'Сфотографируйте', text: 'Камера телефона или загрузка с компьютера. Без оборудования и записи к врачу.' },
  { n: '02', title: 'Получите оценку', text: 'Алгоритм оценивает признаки по шкале ABCDE и относит родинку к уровню риска.' },
  { n: '03', title: 'Следите за динамикой', text: 'Повторные сканы строят историю: график изменений и сравнение «было — стало».' },
];

const MARQUEE = [
  'ШКАЛА ABCDE', 'ИСТОРИЯ ИЗМЕНЕНИЙ', 'СРАВНЕНИЕ ЗАМЕРОВ', 'УРОВНИ РИСКА',
  'НАПОМИНАНИЯ О ПРОВЕРКЕ', 'ДАННЫЕ ОСТАЮТСЯ У ВАС',
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="w-8 h-8 bg-ink flex items-center justify-center">
        <span className="w-3 h-3 rounded-full bg-paper" />
      </span>
      <span className="font-display text-sm font-bold tracking-tight uppercase">FreeSkin</span>
    </span>
  );
}

export default function Landing() {
  return (
    <div className="flex-1 overflow-x-clip">
      {/* ── Навигация ── */}
      <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 font-label text-[11px] uppercase tracking-wider">
            <a href="#how" className="hover:bg-ink hover:text-paper px-1.5 py-0.5 transition-colors">Процесс</a>
            <a href="#abcde" className="hover:bg-ink hover:text-paper px-1.5 py-0.5 transition-colors">ABCDE</a>
            <a href="#levels" className="hover:bg-ink hover:text-paper px-1.5 py-0.5 transition-colors">Риск</a>
          </nav>
          <Link
            href="/login"
            className="hard-sm hard-hover hard-press bg-ink text-paper px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider"
            style={{ boxShadow: '3px 3px 0 var(--accent)' }}
          >
            Войти
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="grid-paper border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="animate-fade-up inline-flex items-center gap-2.5 border-2 border-ink bg-paper px-3.5 py-1.5 font-label text-[10px] uppercase tracking-[0.2em] mb-8">
            <span className="w-2 h-2 bg-accent animate-blink" />
            Дерматологический мониторинг
          </p>

          <h1 className="animate-fade-up font-display font-extrabold uppercase leading-[0.98] tracking-tight text-[13vw] sm:text-[64px] md:text-[88px] mb-8">
            Кожа под
            <br />
            <span className="bg-ink text-paper px-3 box-decoration-clone">наблюде&shy;нием</span>
          </h1>

          <div className="grid md:grid-cols-[1fr_auto] gap-10 items-end">
            <div>
              <p className="max-w-md text-[15px] leading-relaxed text-grey mb-8">
                FreeSkin следит за родинками вместо записной книжки: фото, оценка
                риска по шкале ABCDE и история изменений — чтобы к врачу вы пришли
                вовремя, а не «когда-нибудь».
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="hard hard-hover hard-press bg-accent text-white px-7 py-4 font-label text-[12px] font-bold uppercase tracking-wider"
                >
                  Начать бесплатно →
                </Link>
                <a
                  href="#how"
                  className="hard hard-hover hard-press bg-paper px-7 py-4 font-label text-[12px] font-bold uppercase tracking-wider"
                >
                  Как это работает
                </a>
              </div>
              <p className="font-label text-[10px] uppercase tracking-wider text-grey mt-7">
                * Это не диагноз. FreeSkin — не медицинское устройство.
              </p>
            </div>

            {/* Стат-карточка как «стикер» */}
            <div className="hidden md:block hard bg-ink text-paper p-6 w-[300px] -rotate-2 animate-fade-up">
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-mist/70 mb-3">
                Всего под наблюдением
              </p>
              <p className="font-display text-[72px] font-extrabold leading-none mb-5">7</p>
              <div className="grid grid-cols-3 border-2 border-paper/30">
                {[
                  ['1', 'ВЫСОКИЙ', RISK_LEVELS.high.color],
                  ['2', 'СРЕДНИЙ', RISK_LEVELS.moderate.color],
                  ['4', 'НОРМА', RISK_LEVELS.low.color],
                ].map(([n, l, c], i) => (
                  <div key={l} className={`p-3 text-center ${i < 2 ? 'border-r-2 border-paper/30' : ''}`}>
                    <p className="font-display text-xl font-bold" style={{ color: c }}>{n}</p>
                    <p className="font-label text-[8px] tracking-wider text-mist/70 mt-1">{l}</p>
                  </div>
                ))}
              </div>
              <p className="font-label text-[9px] uppercase tracking-wider text-mist/70 mt-4">
                Последняя проверка: 3 дн. назад
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Бегущая строка ── */}
      <section className="bg-ink text-paper border-b-2 border-ink overflow-hidden py-3.5">
        <div className="flex w-max animate-marquee gap-10">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-10 font-label text-[12px] font-bold tracking-[0.18em] whitespace-nowrap">
              {t}
              <span className="text-accent">✳</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Процесс ── */}
      <section id="how" className="border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <Reveal>
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-accent mb-3">01 — Процесс</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-12 max-w-2xl">
              Три шага — и родинка под контролем
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 border-2 border-ink bg-paper">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`p-7 ${i < 2 ? 'md:border-r-2 border-ink' : ''} ${i > 0 ? 'border-t-2 md:border-t-0 border-ink' : ''} hover:bg-mist/40 transition-colors`}
              >
                <p className="font-display text-[44px] font-extrabold text-accent leading-none mb-5">{s.n}</p>
                <p className="font-display text-[15px] font-bold uppercase tracking-tight mb-3">{s.title}</p>
                <p className="text-[13px] text-grey leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABCDE ── */}
      <section id="abcde" className="bg-ink text-paper border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <Reveal>
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-accent mb-3">02 — Методика</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
              Шкала ABCDE
            </h2>
            <p className="text-sm text-mist/80 max-w-lg mb-12 leading-relaxed">
              Международный дерматологический чек-лист самоосмотра. FreeSkin оценивает
              каждый из пяти признаков и складывает их в общий уровень риска.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-2 border-paper/40">
            {ABCDE.map((a, i) => (
              <div
                key={a.k}
                className={`p-5 hover:bg-paper hover:text-ink transition-colors group ${i < 4 ? 'lg:border-r-2 border-paper/40' : ''} ${i > 0 ? 'border-t-2 sm:border-t-0 border-paper/40' : ''} ${i >= 2 ? 'sm:border-t-2 lg:border-t-0' : ''}`}
              >
                <p className="font-display text-[44px] font-extrabold leading-none mb-4 text-accent group-hover:text-ink transition-colors">
                  {a.k}
                </p>
                <p className="font-display text-[13px] font-bold uppercase tracking-tight mb-2">{a.title}</p>
                <p className="text-[12px] text-mist/70 group-hover:text-grey leading-relaxed transition-colors">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Уровни риска ── */}
      <section id="levels" className="border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <Reveal>
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-accent mb-3">03 — Результат</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-12 max-w-3xl">
              Понятный ответ вместо тревожных догадок
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {(['low', 'moderate', 'high'] as const).map((lvl, i) => {
              const cfg = RISK_LEVELS[lvl];
              return (
                <Reveal key={lvl} delay={i * 100}>
                  <div className="hard hard-hover bg-paper h-full">
                    <div className="h-2.5" style={{ backgroundColor: cfg.color }} />
                    <div className="p-6">
                      <p className="font-label text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: cfg.color }}>
                        ● {cfg.short}
                      </p>
                      <p className="font-display text-[20px] font-bold uppercase tracking-tight mb-3">
                        {cfg.label}
                      </p>
                      <p className="text-[13px] text-grey leading-relaxed">{cfg.rec}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Финальный CTA ── */}
      <section className="bg-accent border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-[1.02] mb-6">
              Первая проверка — сегодня
            </h2>
            <p className="font-label text-[12px] uppercase tracking-wider text-white/80 max-w-md mb-10">
              Бесплатно. Без карты и установки. Одна фотография — и у родинки появится история.
            </p>
            <Link
              href="/login"
              className="hard hard-hover hard-press inline-block bg-paper text-ink px-8 py-4 font-label text-[12px] font-bold uppercase tracking-wider"
            >
              Создать аккаунт →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Подвал ── */}
      <footer className="bg-paper">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="font-label text-[10px] uppercase tracking-wider text-grey text-center max-w-md leading-relaxed">
            Это не диагноз. FreeSkin не является медицинским устройством.
            При сомнениях обратитесь к дерматологу.
          </p>
          <p className="font-label text-[10px] uppercase tracking-wider text-grey">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
