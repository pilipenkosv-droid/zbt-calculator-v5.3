import React, { useState, useRef, useEffect } from 'react';
import './MobileIntegrations.css';
import { track } from '../../../utils/analytics';

type Integration = {
  id: string;
  title: string;
  logoSrc: string;
  alt: string;
  category: 'МИС' | 'Запись' | 'Другое';
  status?: 'ready' | 'connector';
};

const INTEGRATIONS: Integration[] = [
  { id: "1c-med-stom", title: "1С:Медицина Стоматология", logoSrc: "/logo mis/1c медицина стом.png", alt: "1С:Медицина Стоматология", category: "МИС", status: "ready" },
  { id: "apdent", title: "APDent", logoSrc: "/logo mis/apdent.png", alt: "APDent", category: "МИС", status: "ready" },
  { id: "d4w", title: "D4W", logoSrc: "/logo mis/d4w.png", alt: "D4W", category: "МИС", status: "ready" },
  { id: "dental-pro", title: "Dental Pro", logoSrc: "/logo mis/dental pro logo.jpg", alt: "Dental Pro", category: "МИС", status: "ready" },
  { id: "denta-pro", title: "Denta Pro", logoSrc: "/logo mis/denta pro.jpg", alt: "Denta Pro", category: "МИС", status: "ready" },
  { id: "ident", title: "iDent", logoSrc: "/logo mis/ident.png", alt: "iDent", category: "МИС", status: "ready" },
  { id: "infodent", title: "InfoDent", logoSrc: "/logo mis/infodent.png", alt: "InfoDent", category: "МИС", status: "ready" },
  { id: "istom", title: "iStom", logoSrc: "/logo mis/iStom.webp", alt: "iStom", category: "МИС", status: "ready" },
  { id: "medods", title: "MedODS", logoSrc: "/logo mis/medods.png", alt: "MedODS", category: "МИС", status: "ready" },
  { id: "renovatio", title: "Renovatio", logoSrc: "/logo mis/renovatio.png", alt: "Renovatio", category: "МИС", status: "ready" },
  { id: "sqns", title: "SQNS", logoSrc: "/logo mis/sqns.png", alt: "SQNS", category: "МИС", status: "ready" },
  { id: "stompro", title: "StomPro", logoSrc: "/logo mis/stompro.png", alt: "StomPro", category: "МИС", status: "ready" },
  { id: "stomx", title: "StomX", logoSrc: "/logo mis/stomx.png", alt: "StomX", category: "МИС", status: "ready" },
  { id: "universe-soft", title: "Universe Soft", logoSrc: "/logo mis/universe soft.png", alt: "Universe Soft", category: "МИС", status: "ready" },
  { id: "yclients", title: "YClients", logoSrc: "/logo mis/YClients.png", alt: "YClients", category: "Запись", status: "ready" },
  { id: "infoclinic-2", title: "МИС Инфоклиника", logoSrc: "/logo mis/инфоклиника 2.png", alt: "МИС Инфоклиника", category: "МИС", status: "ready" },
  { id: "klinika-online", title: "Клиника Онлайн", logoSrc: "/logo mis/клиника онлайн.png", alt: "Клиника Онлайн", category: "Запись", status: "ready" },
  { id: "medialog", title: "Медиалог", logoSrc: "/logo mis/медиалог.png", alt: "Медиалог", category: "МИС", status: "ready" },
];

/**
 * Мобильная версия интеграций с каруселью
 * Карусель как в блоке "Кейсы"
 */
const MobileIntegrations: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Обработчики touch для карусели
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < INTEGRATIONS.length - 1) {
      goToSlide(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      const offset = -index * 100;
      carouselRef.current.style.transform = `translateX(${offset}%)`;
    }
    track('integration_carousel_navigate', { index });
  };

  // Автоматическая прокрутка
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % INTEGRATIONS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Обновление позиции карусели при изменении currentIndex
  useEffect(() => {
    if (carouselRef.current) {
      const offset = -currentIndex * 100;
      carouselRef.current.style.transform = `translateX(${offset}%)`;
    }
  }, [currentIndex]);

  return (
    <section className="mobile-integrations section">
      <div className="container">
        <h2 className="mobile-integrations__title">
          <span className="mobile-integrations__count">35+</span> интеграций
        </h2>
        <p className="mobile-integrations__subtitle">
          Подключение к МИС и сервисам, которые вы используете каждый день
        </p>

        {/* Карусель */}
        <div className="mobile-integrations__carousel-wrapper">
          <div
            ref={carouselRef}
            className="mobile-integrations__carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {INTEGRATIONS.map((integration, index) => (
              <div key={integration.id} className="mobile-integrations__slide">
                <div className="mobile-integrations__card">
                  <div className="mobile-integrations__logo">
                    <img
                      src={integration.logoSrc}
                      alt={integration.alt}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="mobile-integrations__content">
                    <h3 className="mobile-integrations__name">{integration.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Индикаторы */}
        <div className="mobile-integrations__indicators">
          {INTEGRATIONS.map((_, index) => (
            <button
              key={index}
              className={`mobile-integrations__indicator ${currentIndex === index ? 'mobile-integrations__indicator--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к интеграции ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default MobileIntegrations;

