/*
Задача: Превратить блок «поинтов преимуществ» на баннере в стеклянные карточки (glassmorphism), читабельные на ярко-оранжевом фоне Zabota 2.0. Проект: React + Vite + TypeScript + Tailwind. Без синего цвета, соблюсти контраст WCAG AA.

Требования:
- Полупрозрачные карточки с эффектом размытости заднего фона (backdrop-blur), мягкой тенью и тонким светлым обводом.
- Большие шрифты (emoji 2.2–2.6rem, текст 1.1–1.2rem на мобиле, 1.25rem+ на десктопе), увеличенный интерлиньяж.
- Высокий контраст текста (тёмный #1A1A1A для светлой темы; светлый #FAFAFA для тёмной).
- Акцентная вертикальная полоска слева в тоне бренда #FF7A00 (но не слишком насыщенная, 80–90%).
- Анимация появления: лёгкий fade+rise (opacity+translateY), 220–300ms, GPU-friendly. Respect prefers-reduced-motion.
- Ховер/фокус: лёгкий подъём и усиление «стекла» (чуть больше blur, тень), без дерганья макета.
- Адаптив: плотная сетка, карточки растягиваются; на мобиле по одной в ряд, на планшете/десктопе по 2–3.
- Предоставить: Tailwind стили (utility классы + дополнительные CSS-переменные), пример разметки (4 поинта: 🔒, 📈, 🛡, 💤).
*/

import React from "react";

type Point = { emoji: string; text: string };

const POINTS: Point[] = [
  { emoji: "🔒", text: "Оператор ПДн" },
  { emoji: "📈", text: "+14–20% конверсия в повторный приём" },
  { emoji: "🛡", text: "Защита от спама" },
  { emoji: "💤", text: "Возвращаем «спящих» пациентов" },
];

const GlassPoints: React.FC = () => {
  const accent = "#FF7A00";

  const keyframes = `
@keyframes fadeRise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .motion-safe { transition: none !important; animation: none !important; }
}
  `;

  return (
    <div className="relative w-full">
      <style>{keyframes}</style>

      {/* Контейнер сетки: адаптивные колонки */}
      <div
        className="
          grid gap-12
          sm:gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-2
        "
      >
        {POINTS.map((p, i) => (
          <article
            key={`${p.emoji}-${p.text}-${i}`}
            className="
              group relative isolate
              rounded-2xl
              p-4 sm:p-5 lg:p-6
              ring-1
              shadow-md
              backdrop-blur-md
              bg-white/16 dark:bg-neutral-900/20
              ring-white/35 dark:ring-white/15
              shadow-black/10
              motion-safe
            "
          >
            {/* Акцент слева */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-[6px] rounded-l-2xl"
              style={{ background: `${accent}CC` }}
            />

            {/* Контент карточки */}
            <div className="flex items-start gap-3">
              <span
                className="
                  select-none
                  leading-none
                  text-[2.2rem] sm:text-[2.4rem] lg:text-[2.6rem]
                "
                aria-hidden="true"
              >
                {p.emoji}
              </span>

              <div className="flex-1">
                <p
                  className="
                    font-semibold
                    tracking-[-0.01em]
                    text-[1.125rem] sm:text-[1.25rem] lg:text-[1.35rem]
                    text-neutral-900 dark:text-neutral-50
                  "
                  style={{ lineHeight: 1.25 }}
                >
                  {p.text}
                </p>

                {/* Мелкие детали для «стекла» */}
                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    opacity-0 group-hover:opacity-100 focus-within:opacity-100
                    transition-opacity duration-200 motion-safe
                  "
                >
                  {/* лёгкая внутренняя подсветка */}
                  <div className="absolute inset-0 rounded-2xl bg-white/[0.03]" />
                </div>
              </div>
            </div>

            {/* Ховер/фокус эффекты: усиление стекла, подъём */}
            <div
              className="
                absolute inset-0 rounded-2xl
                transition-all duration-200 motion-safe
                group-hover:translate-y-[-2px] group-focus-within:translate-y-[-2px]
                group-hover:backdrop-blur-lg group-focus-within:backdrop-blur-lg
                group-hover:shadow-lg group-focus-within:shadow-lg
              "
              aria-hidden="true"
            />

            {/* Анимация появления карточки */}
            <div
              className="absolute inset-0"
              style={{
                animation: "fadeRise 260ms ease-out both",
                animationDelay: `${i * 60}ms`,
              }}
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
    </div>
  );
};

export default GlassPoints;


