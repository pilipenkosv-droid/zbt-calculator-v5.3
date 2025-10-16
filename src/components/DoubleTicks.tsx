import React, { useEffect, useRef, useState } from "react";

type Props = {
  // Pass a ref or CSS selector for the calculator root to observe (for visibility and interactions)
  calculatorSelector: string;
  // Optionally provide a selector for the summary block where ticks should be visually attached
  attachToSelector: string;
};

const BLUE = "#34B7F1"; // WhatsApp blue
const TICK_SIZE = 20;

const DoubleTicks: React.FC<Props> = ({ calculatorSelector, attachToSelector }) => {
  const [seenCalculator, setSeenCalculator] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const attachElRef = useRef<HTMLElement | null>(null);
  const calcElRef = useRef<HTMLElement | null>(null);

  // Prefers reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Resolve DOM elements by selectors (works with SSR hydration)
  useEffect(() => {
    const attachEl = document.querySelector<HTMLElement>(attachToSelector);
    const calcEl = document.querySelector<HTMLElement>(calculatorSelector);
    attachElRef.current = attachEl;
    calcElRef.current = calcEl;
  }, [attachToSelector, calculatorSelector]);

  // Observe visibility of calculator (tick #1)
  useEffect(() => {
    const el = calcElRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeenCalculator(true);
          }
        }
      },
      { root: null, threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Track interactions inside calculator (tick #2)
  useEffect(() => {
    const root = calcElRef.current;
    if (!root) return;
    const onInteract = () => {
      // Mark as interacted on first user action
      setInteracted(true);
    };
    const events: (keyof GlobalEventHandlersEventMap)[] = [
      "input",
      "change",
      "click",
      "keydown",
      "pointerdown",
      "touchstart",
    ];
    events.forEach((evt) => root.addEventListener(evt, onInteract, { passive: true }));
    return () => {
      events.forEach((evt) => root.removeEventListener(evt, onInteract as EventListener));
    };
  }, []);

  // Ensure positioning context
  useEffect(() => {
    const attachEl = attachElRef.current;
    if (!attachEl) return;
    // Ensure positioning context
    const computedStyle = window.getComputedStyle(attachEl);
    if (computedStyle.position === 'static') {
      attachEl.style.position = "relative";
    }
  }, []);

  // Animation helpers
  const tickStyleBase: React.CSSProperties = {
    width: TICK_SIZE,
    height: TICK_SIZE,
    display: "inline-block",
  };
  const tick1Style: React.CSSProperties = {
    opacity: seenCalculator ? 1 : 0,
    transform: seenCalculator || prefersReducedMotion ? "translateY(0)" : "translateY(-6px)",
    transition: prefersReducedMotion ? "none" : "opacity 220ms ease, transform 220ms ease",
  };
  const tick2Style: React.CSSProperties = {
    opacity: interacted ? 1 : 0,
    transform: interacted || prefersReducedMotion ? "translateY(0)" : "translateY(-6px)",
    transition: prefersReducedMotion ? "none" : "opacity 220ms ease 120ms, transform 220ms ease 120ms",
  };

  // Inline SVG ticks to avoid font deps
  const TickSVG = ({ style }: { style?: React.CSSProperties }) => (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="Отметка доставки"
      style={{ ...tickStyleBase, ...style }}
    >
      <path
        d="M6 13.2l2.8 2.8L18.5 6.8"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const DoubleSVG = ({ style1, style2 }: { style1?: React.CSSProperties; style2?: React.CSSProperties }) => (
    <div className="relative">
      <TickSVG style={style1} />
      <div className="absolute top-0 left-0" style={{ transform: 'translateX(6px)' }}>
        <TickSVG style={style2} />
      </div>
    </div>
  );

  // Render overlay anchored to top-right corner of the attach element
  return (
    <div
      className="
        pointer-events-none
        absolute
        top-2
        right-2
        z-30
        translate-y-0
      "
      aria-live="polite"
      aria-label={
        interacted
          ? "Калькулятор открыт и взаимодействие выполнено"
          : seenCalculator
          ? "Калькулятор открыт"
          : "Калькулятор ещё не открыт"
      }
    >
      {/* background halo for legibility */}
      <div className="absolute inset-[-4px] rounded-full bg-white/50 backdrop-blur-sm" />
      <DoubleSVG style1={tick1Style} style2={tick2Style} />
    </div>
  );
};

export default DoubleTicks;

