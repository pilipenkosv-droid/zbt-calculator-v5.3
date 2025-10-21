import React from 'react';
import './MobileBanner.css';

interface MobileBannerProps {
  imageSrc?: string;
  imageAlt?: string;
  onCalculate?: () => void;
  onConsultation?: () => void;
}

/**
 * Мобильный Hero-блок
 * Оптимизирован с 2 CTA и ценностным предложением
 */
const MobileBanner: React.FC<MobileBannerProps> = ({
  imageSrc = '/images/Group_9206.png.webp',
  imageAlt = 'Zabota 2.0',
  onCalculate,
  onConsultation,
}) => {
  const handleCalculate = () => {
    if (onCalculate) {
      onCalculate();
    } else {
      const calculatorEl = document.getElementById('calculator');
      if (calculatorEl) {
        const headerHeight = 60;
        const elementPosition = calculatorEl.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleConsultation = () => {
    if (onConsultation) {
      onConsultation();
    } else {
      // Открыть модалку заявки
      window.dispatchEvent(new CustomEvent('openApplyModal'));
    }
  };

  return (
    <section className="mobile-banner">
      <div className="mobile-banner__container">
        {/* Заголовок */}
        <h1 className="mobile-banner__title">
          Zabota 2.0
          <span className="mobile-banner__subtitle">
            Платформа медицинского маркетинга
          </span>
        </h1>

        {/* Ценностное предложение */}
        <div className="mobile-banner__value">
          <div className="mobile-banner__value-item">
            <span className="mobile-banner__value-number">+14–20%</span>
            <span className="mobile-banner__value-text">повторных приёмов</span>
          </div>
          <div className="mobile-banner__value-divider" />
          <div className="mobile-banner__value-item">
            <span className="mobile-banner__value-number">7 дней</span>
            <span className="mobile-banner__value-text">запуск сервиса</span>
          </div>
        </div>

        {/* Описание */}
        <p className="mobile-banner__description">
          Автоматизируйте коммуникации с пациентами, увеличьте доходимость 
          и управляйте репутацией клиники
        </p>

        {/* CTA кнопки */}
        <div className="mobile-banner__cta">
          <button
            onClick={handleCalculate}
            className="mobile-banner__btn mobile-banner__btn--primary"
          >
            Посчитать стоимость
          </button>
          <button
            onClick={handleConsultation}
            className="mobile-banner__btn mobile-banner__btn--secondary"
          >
            Получить консультацию
          </button>
        </div>

        {/* Контакты */}
        <div className="mobile-banner__contacts">
          <a href="tel:88005553862" className="mobile-banner__contact-link">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M18.3 14.9c-1.5 0-3-.3-4.4-.8-.4-.2-.9 0-1.2.3l-2.7 2.7c-3.5-1.8-6.4-4.6-8.2-8.2L4.6 6.2c.3-.3.4-.8.3-1.2-.5-1.4-.8-2.9-.8-4.4 0-.6-.4-1-1-1H1c-.6 0-1 .4-1 1 0 10.5 8.5 19 19 19 .6 0 1-.4 1-1v-2.1c0-.6-.4-1-1-1z" fill="currentColor"/>
            </svg>
            <span>8 800 555 38 62</span>
          </a>
          <a href="mailto:info@zabota.tech" className="mobile-banner__contact-link">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M18 4H2C.9 4 0 4.9 0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
            <span>info@zabota.tech</span>
          </a>
          <a 
            href="https://wa.me/88005553862" 
            className="mobile-banner__contact-link mobile-banner__contact-link--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Изображение (опционально) */}
        {imageSrc && (
          <div className="mobile-banner__image">
            <img src={imageSrc} alt={imageAlt} loading="lazy" />
          </div>
        )}
      </div>
    </section>
  );
};

export default MobileBanner;

