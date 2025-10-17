import React, { useEffect, useState } from 'react';
import './IntegrationsMarquee.css';

type Integration = {
  id: string;
  title: string;
  logoSrc: string;
  alt: string;
};

const INTEGRATIONS: Integration[] = [
  { id: "1c-med-stom", title: "1С:Медицина Стоматология", logoSrc: "/logo mis/1c медицина стом.png", alt: "1С:Медицина Стоматология" },
  { id: "apdent", title: "APDent", logoSrc: "/logo mis/apdent.png", alt: "APDent" },
  { id: "d4w", title: "D4W", logoSrc: "/logo mis/d4w.png", alt: "D4W" },
  { id: "dental-pro", title: "Dental Pro", logoSrc: "/logo mis/dental pro logo.jpg", alt: "Dental Pro" },
  { id: "denta-pro", title: "Denta Pro", logoSrc: "/logo mis/denta pro.jpg", alt: "Denta Pro" },
  { id: "ident", title: "iDent", logoSrc: "/logo mis/ident.png", alt: "iDent" },
  { id: "infodent", title: "InfoDent", logoSrc: "/logo mis/infodent.png", alt: "InfoDent" },
  { id: "istom", title: "iStom", logoSrc: "/logo mis/iStom.webp", alt: "iStom" },
  { id: "medods", title: "MedODS", logoSrc: "/logo mis/medods.png", alt: "MedODS" },
  { id: "renovatio", title: "Renovatio", logoSrc: "/logo mis/renovatio.png", alt: "Renovatio" },
  { id: "sqns", title: "SQNS", logoSrc: "/logo mis/sqns.png", alt: "SQNS" },
  { id: "stompro", title: "StomPro", logoSrc: "/logo mis/stompro.png", alt: "StomPro" },
  { id: "stomx", title: "StomX", logoSrc: "/logo mis/stomx.png", alt: "StomX" },
  { id: "universe-soft", title: "Universe Soft", logoSrc: "/logo mis/universe soft.png", alt: "Universe Soft" },
  { id: "yclients", title: "YClients", logoSrc: "/logo mis/YClients.png", alt: "YClients" },
  { id: "infoclinic-2", title: "МИС Инфоклиника", logoSrc: "/logo mis/инфоклиника 2.png", alt: "МИС Инфоклиника" },
  { id: "medialog", title: "Медиалог", logoSrc: "/logo mis/медиалог.png", alt: "Медиалог" },
];

export const IntegrationsMarquee: React.FC = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<number>(0);
  const offsetRef = React.useRef<number>(0);
  const isDraggingRef = React.useRef<boolean>(false);
  const startXRef = React.useRef<number>(0);
  const dragStartOffsetRef = React.useRef<number>(0);
  const lastTimeRef = React.useRef<number>(0);
  const trackWidthRef = React.useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Главная анимационная петля
  useEffect(() => {
    if (prefersReduced) return;
    
    const track = trackRef.current;
    if (!track) return;

    // Вычисляем ширину одной копии (1/4 от всей ширины трека)
    trackWidthRef.current = track.scrollWidth / 4;
    lastTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!track) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (!isDraggingRef.current) {
        // Скорость: проходим ширину одной копии за 81 секунду (замедлено на 35%)
        const speed = trackWidthRef.current / 81000; // px/ms
        offsetRef.current -= speed * deltaTime;

        // Зацикливание: когда прошли одну копию, возвращаемся
        if (Math.abs(offsetRef.current) >= trackWidthRef.current) {
          offsetRef.current = 0;
        }
      }

      track.style.transform = `translateX(${offsetRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [prefersReduced]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    containerRef.current?.classList.add('dragging');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const walk = e.clientX - startXRef.current;
    offsetRef.current = dragStartOffsetRef.current + walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    containerRef.current?.classList.remove('dragging');
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      containerRef.current?.classList.remove('dragging');
    }
  };

  // Используем достаточно копий для бесшовного луп-эффекта
  const loopData = [...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS];

  return (
    <div className="integrations-marquee-wrapper">
      <div
        ref={containerRef}
        className="integrations-marquee-container"
        aria-label="Список МИС с готовыми интеграциями"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={trackRef}
          className="integrations-marquee-track"
        >
          {loopData.map((item, idx) => (
            <IntegrationTile key={`${item.id}-${idx}`} integration={item} />
          ))}
        </div>
        
        {/* Градиентные маски по краям */}
        <div className="integrations-marquee-fade-left" />
        <div className="integrations-marquee-fade-right" />
      </div>

      {/* Дополнительные факты */}
      <div className="integrations-facts">
        <div className="fact-item">
          <span className="fact-label">Запуск от 7 дней</span>
          <span className="fact-text">Доступы → синхронизация → тест → пилот</span>
        </div>
        <div className="fact-item">
          <span className="fact-label">Интегрируемся с вашей базой пациентов</span>
          <span className="fact-text">Готовые коннекторы и опыт сложных кастомных внедрений</span>
        </div>
        <div className="fact-item">
          <span className="fact-label">Персональный специалист</span>
          <span className="fact-text">Сопровождение на всех этапах</span>
        </div>
      </div>
    </div>
  );
};

const IntegrationTile: React.FC<{ integration: Integration }> = ({ integration }) => {
  return (
    <div
      className="integration-tile"
      aria-label={integration.title}
      title={integration.title}
    >
      <img
        src={integration.logoSrc}
        alt={integration.alt}
        loading="lazy"
        className="integration-logo"
      />
    </div>
  );
};

export default IntegrationsMarquee;
