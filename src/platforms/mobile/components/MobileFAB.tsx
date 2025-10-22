import React, { useState, useEffect } from 'react';
import './MobileFAB.css';

/**
 * Floating Action Buttons
 * Back-to-top и быстрый контакт
 */
const MobileFAB: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isStickyExpanded, setIsStickyExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Показывать кнопку "Наверх" после скролла на 500px
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Отслеживаем состояние блока итогов
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const expanded = document.body.getAttribute('data-sticky-expanded') === 'true';
      setIsStickyExpanded(expanded);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-sticky-expanded'],
    });

    // Проверяем начальное состояние
    const expanded = document.body.getAttribute('data-sticky-expanded') === 'true';
    setIsStickyExpanded(expanded);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`mobile-fab ${isStickyExpanded ? 'mobile-fab--sticky-expanded' : ''}`}>
      {/* Кнопка "Наверх" */}
      {showBackToTop && (
        <button
          className="mobile-fab__btn mobile-fab__btn--top"
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 4l-8 8h6v8h4v-8h6l-8-8z" fill="currentColor"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default MobileFAB;

