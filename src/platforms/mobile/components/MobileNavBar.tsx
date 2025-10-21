import React, { useState, useEffect } from 'react';
import './MobileNavBar.css';

/**
 * Sticky навигационный бар для быстрого перехода по секциям
 * Появляется после скролла вниз
 */
const MobileNavBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Показывать навигацию после скролла на 300px
      setIsVisible(window.scrollY > 300);

      // Определить активную секцию
      const sections = ['calculator', 'integrations', 'cases', 'faq', 'contacts'];
      const headerHeight = 60;
      const navBarHeight = 48;
      const offset = headerHeight + navBarHeight + 20;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверить при монтировании

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 60;
      const navBarHeight = 48;
      const elementPosition = element.offsetTop - headerHeight - navBarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  const navItems = [
    { id: 'calculator', label: 'Калькулятор', icon: '💰' },
    { id: 'integrations', label: 'Интеграции', icon: '🔗' },
    { id: 'cases', label: 'Кейсы', icon: '📊' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'contacts', label: 'Контакты', icon: '📞' },
  ];

  if (!isVisible) return null;

  return (
    <nav className="mobile-navbar">
      <div className="mobile-navbar__container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`mobile-navbar__item ${activeSection === item.id ? 'mobile-navbar__item--active' : ''}`}
            onClick={() => scrollToSection(item.id)}
          >
            <span className="mobile-navbar__icon">{item.icon}</span>
            <span className="mobile-navbar__label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;

