import React, { useEffect, useState } from 'react';
import './ClientsMarquee.css';

type Client = {
  id: string;
  title: string;
  logoSrc: string;
  alt: string;
};

const CLIENTS: Client[] = [
  { id: "giovane", title: "Giovane", logoSrc: "/clients logo/giovane.png.webp", alt: "Клиника Giovane" },
  { id: "iortho", title: "iOrtho", logoSrc: "/clients logo/iOrtho.png.webp", alt: "Клиника iOrtho" },
  { id: "silmplex", title: "Silmplex", logoSrc: "/clients logo/silmplex.webp", alt: "Клиника Silmplex" },
  { id: "smile-clinic", title: "Smile Clinic", logoSrc: "/clients logo/Smile_Clinic.png.webp", alt: "Smile Clinic" },
  { id: "supersmile", title: "SuperSmile", logoSrc: "/clients logo/supersmile.webp", alt: "SuperSmile" },
  { id: "belgravia", title: "Белгравия", logoSrc: "/clients logo/белгравия.webp", alt: "Клиника Белгравия" },
  { id: "dental-service", title: "Дентал Сервис", logoSrc: "/clients logo/дентал сервис.png", alt: "Дентал Сервис" },
  { id: "dental-fantasy", title: "Дентал Фэнтези", logoSrc: "/clients logo/дентал фентези.webp", alt: "Дентал Фэнтези" },
  { id: "doctor-keller", title: "Доктор Келлер", logoSrc: "/clients logo/доктор келлер.webp", alt: "Клиника Доктор Келлер" },
  { id: "idealdent", title: "ИдеалДент", logoSrc: "/clients logo/идеалдент.webp", alt: "ИдеалДент" },
  { id: "implant-52", title: "Имплант 52", logoSrc: "/clients logo/имплант 52.webp", alt: "Имплант 52" },
  { id: "klinika-1", title: "Клиника №1", logoSrc: "/clients logo/клиника №1.webp", alt: "Клиника №1" },
  { id: "smile-workshop", title: "Мастерская улыбок", logoSrc: "/clients logo/мастерская улыбок.webp", alt: "Мастерская улыбок" },
  { id: "paracelsus", title: "Парацельс", logoSrc: "/clients logo/парацельс.webp", alt: "Клиника Парацельс" },
  { id: "president", title: "Президент", logoSrc: "/clients logo/президент.webp", alt: "Стоматология Президент" },
  { id: "rzhd-medicina", title: "РЖД Медицина", logoSrc: "/clients logo/ржд медицина.png", alt: "РЖД Медицина" },
  { id: "celt", title: "ЦЭЛТ", logoSrc: "/clients logo/ЦЭЛТ.svg", alt: "Центр эндохирургии и литотрипсии" },
];

export const ClientsMarquee: React.FC = () => {
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
        // Скорость: проходим ширину одной копии за 60 секунд (замедлено на 45%)
        const speed = trackWidthRef.current / 60000; // px/ms
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
  const loopData = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <div className="clients-marquee-wrapper">
      <div
        ref={containerRef}
        className="clients-marquee-container"
        aria-label="Логотипы наших клиентов"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={trackRef}
          className="clients-marquee-track"
        >
          {loopData.map((client, idx) => (
            <ClientTile key={`${client.id}-${idx}`} client={client} />
          ))}
        </div>
        
        {/* Градиентные маски по краям */}
        <div className="clients-marquee-fade-left" />
        <div className="clients-marquee-fade-right" />
      </div>
    </div>
  );
};

const ClientTile: React.FC<{ client: Client }> = ({ client }) => {
  return (
    <div
      className="client-tile"
      aria-label={client.title}
      title={client.title}
    >
      <img
        src={client.logoSrc}
        alt={client.alt}
        loading="lazy"
        className="client-logo"
      />
    </div>
  );
};

export default ClientsMarquee;

