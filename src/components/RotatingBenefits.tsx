import React, { useEffect, useMemo, useRef, useState } from "react";

type Benefit = {
  emoji: string;
  text: string;
};

const BENEFITS: Benefit[] = [
  { emoji: "📈", text: "+14–20% конверсия в повторный приём" },
  { emoji: "🛡️", text: "Защита от спама" },
  { emoji: "💤", text: "Возвращаем «спящих» пациентов" },
  { emoji: "📱", text: "Автоматизация напоминаний" },
  { emoji: "🎯", text: "Персонализированные акции" },
  { emoji: "⭐️", text: "Рост рейтинга клиники" },
  { emoji: "🔗", text: "Интеграции с 35+ МИС" },
  { emoji: "⚡", text: "Запуск от 7 дней" },
  { emoji: "😌", text: "Перехват негатива до публикации" },
  { emoji: "🔒", text: "Оператор ПДн" },
];

const DISPLAY_MOBILE = 4;
const DISPLAY_DESKTOP = 4; // Always 4 items to prevent layout shift
const INTERVAL_MS = 3750; // 50% slower (was 2500ms)
const TRANSITION_MS = 800;

// Utility: detect reduced motion
const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return reduced;
};

// Utility: responsive count via resize observer
const useDisplayCount = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [count, setCount] = useState<number>(DISPLAY_MOBILE);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const width = el.clientWidth;
      // Simple heuristic: switch at ~640px
      setCount(width >= 640 ? DISPLAY_DESKTOP : DISPLAY_MOBILE);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);
  return count;
};

const RotatingBenefits: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const displayCount = useDisplayCount(containerRef);

  // index of the "start" item in BENEFITS
  const [startIndex, setStartIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [enteringIndex, setEnteringIndex] = useState<number | null>(null);

  const slice = useMemo(() => {
    const len = BENEFITS.length;
    const count = Math.min(displayCount, len);
    return Array.from({ length: count }, (_, i) => BENEFITS[(startIndex + i) % len]);
  }, [startIndex, displayCount]);

  // Rotation timer with exit/enter animation
  useEffect(() => {
    if (paused) return;
    if (BENEFITS.length <= displayCount) return; // no rotation needed if all fit
    
    const t = setInterval(() => {
      // Mark first item as exiting
      setExitingIndex(0);
      
      // After animation starts, update indices and mark new item as entering
      setTimeout(() => {
        setStartIndex((i) => (i + 1) % BENEFITS.length);
        setExitingIndex(null);
        setEnteringIndex(displayCount - 1);
        
        // Clear entering state after animation completes
        setTimeout(() => {
          setEnteringIndex(null);
        }, 800); // Match animation duration
      }, 400); // Start transition at 50% of animation
    }, INTERVAL_MS);
    
    return () => clearInterval(t);
  }, [paused, displayCount]);

  // Accessibility: pause/resume handlers
  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);
  const handleFocus = () => setPaused(true);
  const handleBlur = () => setPaused(false);

  // Animation classes adapted for orange banner background - lighter for better contrast
  const baseItemClass =
    "flex items-center gap-2.5 rounded-full px-3.5 py-2.5 " +
    "bg-white/40 hover:bg-white/50 " +
    "shadow-sm " +
    "transition-all duration-700 ease-in-out " +
    "will-change-transform will-change-opacity " +
    "inline-flex"; // Natural inline-flex behavior like Chatfuel

  const emojiClass = 
    "text-base flex-shrink-0 w-8 h-8 flex items-center justify-center " +
    "bg-white/90 rounded-full";
  const textClass =
    "text-[13px] sm:text-[14px] font-medium tracking-[-0.01em] " +
    "text-[#1A1A1A] leading-tight whitespace-nowrap";

  // Animation helper to get item-specific classes
  const getItemAnimationClass = (index: number) => {
    if (prefersReducedMotion) return "";
    
    if (exitingIndex === index) {
      return "animate-[fadeOutLeft_800ms_ease-in-out_forwards]";
    }
    if (enteringIndex === index) {
      return "animate-[fadeInRight_800ms_ease-in-out_forwards]";
    }
    return "";
  };

  const animationKeyframes = `
@keyframes fadeOutLeft {
  0% { 
    opacity: 1; 
    transform: translateX(0) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: translateX(-20px) scale(0.9);
  }
  100% { 
    opacity: 0; 
    transform: translateX(-50px) scale(0.6);
  }
}
@keyframes fadeInRight {
  0% { 
    opacity: 0; 
    transform: translateX(50px) scale(0.6);
  }
  50% {
    opacity: 0.5;
    transform: translateX(25px) scale(0.85);
  }
  100% { 
    opacity: 1; 
    transform: translateX(0) scale(1);
  }
}
@keyframes slideLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-4px);
  }
}
`;

  return (
    <div
      ref={containerRef}
      className="relative"
      aria-live="polite"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Inject keyframes inline to keep file self-contained */}
      <style>{animationKeyframes}</style>

      {/* Two explicit rows with natural item widths; no wrapping within a row. */}
      <div className="flex flex-col gap-1.5 w-full max-w-[1000px] overflow-visible">
        <div className="flex flex-nowrap gap-1.5">
          {slice.slice(0, 2).map((b, idx) => {
            const isExiting = exitingIndex === idx;
            const isEntering = enteringIndex === idx;
            return (
              <div
                key={`${b.text}`}
                className={`${baseItemClass} ${getItemAnimationClass(idx)} shrink-0`}
                style={{
                  transitionDuration: prefersReducedMotion ? "0ms" : "700ms",
                  transitionProperty: prefersReducedMotion ? "none" : "all",
                  transitionTimingFunction: "ease-in-out",
                  transform: !isExiting && !isEntering && exitingIndex === 0 
                    ? 'translateX(-3px)'
                    : 'translateX(0)',
                }}
              >
                <span className={emojiClass} aria-hidden="true">{b.emoji}</span>
                <span className={textClass}>{b.text}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-nowrap gap-1.5">
          {slice.slice(2, 4).map((b, idx) => {
            const logicalIndex = idx + 2; // align with slice index for animations
            const isExiting = exitingIndex === logicalIndex;
            const isEntering = enteringIndex === logicalIndex;
            return (
              <div
                key={`${b.text}`}
                className={`${baseItemClass} ${getItemAnimationClass(logicalIndex)} shrink-0`}
                style={{
                  transitionDuration: prefersReducedMotion ? "0ms" : "700ms",
                  transitionProperty: prefersReducedMotion ? "none" : "all",
                  transitionTimingFunction: "ease-in-out",
                  transform: !isExiting && !isEntering && exitingIndex === 0 
                    ? 'translateX(-3px)'
                    : 'translateX(0)',
                }}
              >
                <span className={emojiClass} aria-hidden="true">{b.emoji}</span>
                <span className={textClass}>{b.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RotatingBenefits;

