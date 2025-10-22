import React, { useState, useRef, useEffect } from 'react';
import './MobileIntegrations.css';
import { track } from '../../../utils/analytics';

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
  { id: "klinika-online", title: "Клиника Онлайн", logoSrc: "/logo mis/клиника онлайн.png", alt: "Клиника Онлайн" },
  { id: "medialog", title: "Медиалог", logoSrc: "/logo mis/медиалог.png", alt: "Медиалог" },
];

/**
 * Мобильная карусель интеграций
 * Использует ту же структуру, что и блок "Кейсы клиентов"
 */
const MobileIntegrations: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Минимальная дистанция свайпа
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart(touch.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchEnd(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < INTEGRATIONS.length - 1) {
      goToSlide(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    const integration = INTEGRATIONS[index];
    if (integration) {
      track('integration_view', { 
        integrationName: integration.title,
        integrationIndex: index,
      });
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      const offset = -currentIndex * 100;
      carouselRef.current.style.transform = `translateX(${offset}%)`;
    }
  }, [currentIndex]);

  return (
    <section className="mobile-integrations">
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
            {INTEGRATIONS.map((integration) => (
              <div key={integration.id} className="mobile-integrations__slide">
                {/* Только логотип без рамок и названий */}
                <img
                  src={integration.logoSrc}
                  alt={integration.alt}
                  loading="lazy"
                  className="mobile-integrations__logo-only"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
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