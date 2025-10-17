/*
Задача: На заголовке (например, H1 «Zabota 2.0») при наведении запустить красивый сложный градиент,
сочетающийся с палитрой страницы (тёплые оранжево‑красные + нейтральные), но контрастный и заметный.
Эффект проигрывается строго 2 раза и возвращается к исходному виду. Без синего. Respect prefers-reduced-motion.

Технологии: React + TypeScript + TailwindCSS. Один файл, готов к вставке. Никаких TODO.

Требования:
- Базовый стиль заголовка: высококонтрастный текст (neutral-900 / neutral-50), без градиента.
- При hover/focus-within: включается сложная анимация градиента (linear-gradient с несколькими цветами),
  которая «переливается» (сдвиг background-position и смена угла) в течение ~2.5s, повторяется 2 раза,
  затем возвращается к исходному стилю.
- Градиент цвета: #FF7A00, #FFB34D, #FF5A36, #9D2A00, плюс нейтральный тёмный (#1A1A1A) для контраста.
- Анимация не должна ломать верстку, использовать только opacity/transform/background-position.
- Accessibility: prefers-reduced-motion — отключить анимацию, оставить лёгкий color-accent без движения.
- Кросс-тема: светлая/тёмная (текст остаётся читаемым).
- API: компонент принимающий children и className, чтобы можно было навесить на ваш H1.

Файл: GradientHeadline.tsx
*/

import React, { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  id?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  triggerOnScroll?: boolean; // Новый проп для автозапуска при скролле
};

const GradientHeadline: React.FC<Props> = ({ className = "", children, id, as: Tag = 'h1', triggerOnScroll = false }) => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [animActive, setAnimActive] = useState(false);
  const [animRunCount, setAnimRunCount] = useState(0);
  const [hasTriggeredOnScroll, setHasTriggeredOnScroll] = useState(false);
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Запуск анимации на hover/focus, ограничение до 2 повторов (scroll считается как 1 раз)
  const trigger = () => {
    if (prefersReduced) return;
    // Разрешаем запуск, если не идёт анимация и выполнено < 2 раз
    if (!animActive && animRunCount < 2) {
      setAnimActive(true);
      setAnimRunCount((c) => c + 1);
    }
  };

  // IntersectionObserver для автозапуска при скролле
  useEffect(() => {
    if (!triggerOnScroll || prefersReduced || hasTriggeredOnScroll || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredOnScroll && animRunCount === 0) {
            setHasTriggeredOnScroll(true);
            trigger();
          }
        });
      },
      { threshold: 0.5 } // Запускаем когда 50% заголовка видно
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnScroll, prefersReduced, hasTriggeredOnScroll, animRunCount, trigger]);

  const stop = () => {
    // Завершаем текущий цикл и возвращаем базовый стиль
    setAnimActive(false);
  };

  // После завершения CSS-анимации сбрасываем флаг
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onAnimEnd = () => {
      setAnimActive(false);
    };
    el.addEventListener("animationend", onAnimEnd);
    return () => el.removeEventListener("animationend", onAnimEnd);
  }, []);

  const keyframes = `
@keyframes headlineGradientShift {
  0% {
    background-position: 0% 50%;
    filter: saturate(1);
  }
  25% {
    background-position: 50% 50%;
    filter: saturate(1.15) contrast(1.05);
  }
  50% {
    background-position: 100% 50%;
    filter: saturate(1.25) contrast(1.08);
  }
  75% {
    background-position: 50% 50%;
    filter: saturate(1.15) contrast(1.05);
  }
  100% {
    background-position: 0% 50%;
    filter: saturate(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .motion-safe { animation: none !important; transition: none !important; }
}
`;

  // Базовый градиент — невидим (текст обычный). Во время анимации используем bg-clip:text.
  const gradientStyle: React.CSSProperties = prefersReduced
    ? {
        // Без движения — просто аккуратный градиентный акцент по контуру текста
        backgroundImage:
          "linear-gradient(100deg, #FF7A00, #FFB34D, #FF5A36, #9D2A00)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }
    : animActive
    ? {
        backgroundImage:
          "linear-gradient(120deg, #FF7A00, #FFB34D, #FF5A36, #9D2A00, #FF7A00)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        animation: "headlineGradientShift 2500ms ease-in-out 1",
      }
    : {
        // Базовое состояние - обычный видимый текст
        color: "#1A1A1A",
        backgroundImage: "none",
        WebkitBackgroundClip: "initial",
        backgroundClip: "initial",
      };

  return (
    <div className="relative">
      <style>{keyframes}</style>
      <Tag
        ref={ref}
        id={id}
        className={
          "select-none " +
          "font-extrabold tracking-tight " +
          "text-[clamp(2rem,6vw,3.5rem)] " +
          "text-neutral-900 dark:text-neutral-50 " +
          // лёгкий внутренний свечения в тему оранжевого при hover, если анимация выключена
          (prefersReduced ? " hover:text-[#FF7A00]" : "") +
          " " +
          className
        }
        style={gradientStyle}
        onMouseEnter={trigger}
        onFocus={trigger}
        onMouseLeave={stop}
        onBlur={stop}
      >
        {children}
      </Tag>
      {/* подсказка для доступности */}
      <span className="sr-only">
        Наведите курсор или сфокусируйте заголовок, чтобы увидеть градиентный перелив (2 цикла).
      </span>
    </div>
  );
};

export default GradientHeadline;

