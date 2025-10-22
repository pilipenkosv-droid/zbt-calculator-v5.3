import React, { useState, useEffect } from 'react';
import './MobileHeader.css';

interface MobileHeaderProps {
  onMenuItemClick?: (section: string) => void;
}

/**
 * Мобильный Header с бургер-меню
 * Компактный дизайн с липкой навигацией
 */
const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuItemClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрыть меню при клике вне его
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleMenuClick = (section: string) => {
    setIsMenuOpen(false);
    onMenuItemClick?.(section);
    
    // Скролл к секции
    const element = document.getElementById(section);
    if (element) {
      const headerHeight = 60;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  const menuItems = [
    { id: 'features', label: 'Продукт' },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'integrations', label: 'Интеграции' },
    { id: 'cases', label: 'Кейсы' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contacts', label: 'Контакты' },
  ];

  return (
    <>
      <header className={`mobile-header ${isScrolled ? 'mobile-header--scrolled' : ''}`}>
        <div className="mobile-header__container">
          {/* Логотип */}
          <div className="mobile-header__logo">
            <img 
              src="/images/logo___descript (3).svg" 
              alt="Zabota 2.0" 
              className="mobile-header__logo-img"
            />
          </div>

          {/* Контакты (только телефон на мобильном) */}
          <a href="tel:88005553862" className="mobile-header__phone">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM5 5h1.5c.1.9.2 1.8.5 2.6L5.8 8.8C5.4 7.6 5.1 6.3 5 5zm14 14c-1.3-.1-2.6-.4-3.8-.8l1.2-1.2c.8.2 1.7.4 2.6.5V19z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Бургер-меню */}
          <button
            className={`mobile-header__burger ${isMenuOpen ? 'mobile-header__burger--active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Выдвижное меню */}
      <nav className={`mobile-menu ${isMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__header">
          <button
            className="mobile-menu__close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Закрыть меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <ul className="mobile-menu__list">
          {menuItems.map((item) => (
            <li key={item.id} className="mobile-menu__item">
              <button
                onClick={() => handleMenuClick(item.id)}
                className="mobile-menu__link"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mobile-menu__contacts">
          <a href="tel:88005553862" className="mobile-menu__contact">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM5 5h1.5c.1.9.2 1.8.5 2.6L5.8 8.8C5.4 7.6 5.1 6.3 5 5zm14 14c-1.3-.1-2.6-.4-3.8-.8l1.2-1.2c.8.2 1.7.4 2.6.5V19z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>8 800 555 38 62</span>
          </a>
          <a href="mailto:info@zabota.tech" className="mobile-menu__contact">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 4H2C.9 4 0 4.9 0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
            <span>info@zabota.tech</span>
          </a>
          <a 
            href="https://wa.me/88005553862" 
            className="mobile-menu__contact mobile-menu__contact--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>
    </>
  );
};

export default MobileHeader;

