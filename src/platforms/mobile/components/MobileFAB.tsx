import React, { useState, useEffect } from 'react';
import './MobileFAB.css';

/**
 * Floating Action Buttons
 * Back-to-top и быстрый контакт
 */
const MobileFAB: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Показывать кнопку "Наверх" после скролла на 500px
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleContact = () => {
    // Открыть модалку заявки
    window.dispatchEvent(new CustomEvent('openApplyModal'));
  };

  return (
    <div className="mobile-fab">
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

      {/* Кнопка "Связаться" */}
      <button
        className="mobile-fab__btn mobile-fab__btn--contact"
        onClick={handleContact}
        aria-label="Связаться с нами"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default MobileFAB;

