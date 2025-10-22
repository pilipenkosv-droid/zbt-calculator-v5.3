import React from 'react';
import './MobileBanner.css';

interface MobileBannerProps {
  onCalculate?: () => void;
  onConsultation?: () => void;
}

/**
 * Мобильный Hero-блок
 * Оптимизирован с 2 CTA и ценностным предложением
 */
const MobileBanner: React.FC<MobileBannerProps> = ({
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
      {/* Декоративные элементы */}
      <div className="mobile-banner__decorations">
        <div className="mobile-banner__star mobile-banner__star--1"></div>
        <div className="mobile-banner__star mobile-banner__star--2"></div>
      </div>
      
      <div className="mobile-banner__container">
        {/* Заголовок */}
        <h1 className="mobile-banner__title">
          Zabota 2.0
          <span className="mobile-banner__subtitle">
            С заботой о ваших пациентах, улучшаем доходимость, возвращаем "спящих" и защищаем от спама.
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
      </div>
    </section>
  );
};

export default MobileBanner;

