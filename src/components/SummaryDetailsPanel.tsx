import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

type SummaryDetailsPanelProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  onToggle?: (open: boolean) => void;
};

export const SummaryDetailsPanel: React.FC<SummaryDetailsPanelProps> = ({
  title,
  defaultOpen = false,
  children,
  className = '',
  onToggle,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;
    const target = open ? content.scrollHeight : 0;
    panel.style.maxHeight = `${target}px`;
    panel.style.opacity = open ? '1' : '0';
    panel.style.transform = open ? 'translateY(0)' : 'translateY(-6px)';
  }, [open]);

  useEffect(() => {
    if (onToggle) onToggle(open);
  }, [open, onToggle]);

  const toggle = () => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;
    // Force reflow to prevent jump in some browsers
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    panel.offsetHeight;
    const target = open ? 0 : content.scrollHeight;
    panel.style.maxHeight = `${target}px`;
    panel.style.opacity = open ? '0' : '1';
    panel.style.transform = open ? 'translateY(-6px)' : 'translateY(0)';
    setOpen(s => !s);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-[15px] font-semibold text-slate-900 hover:text-slate-950"
      >
        <span>{title}</span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* Panel visually slides from under the totals card thanks to -mt-2 and z-index layering */}
      <div
        ref={panelRef}
        role="region"
        aria-hidden={!open}
        className="relative z-[1] -mt-2 overflow-hidden rounded-xl border border-black/10 bg-white/70 backdrop-blur-md shadow-xl transition-[max-height,opacity,transform] duration-250 ease-in-out"
        style={{
          maxHeight: 0,
          opacity: 0,
          transform: 'translateY(-6px)',
          willChange: 'max-height, opacity, transform',
        }}
      >
        <div ref={contentRef} className="px-4 py-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SummaryDetailsPanel;
