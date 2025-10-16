import { useState, useEffect } from "react";
import styles from "./Header.module.scss";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      
      // Вычисление прогресса прокрутки
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      // Определение активной секции
      const sections = ['calculator', 'integrations', 'cases', 'faq', 'contacts'];
      let currentSection = '';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sectionId;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для инициализации
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Высота хэдера
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Индикатор прокрутки */}
      <div 
        className={styles.scrollIndicator}
        style={{ width: `${scrollProgress}%` }}
      />
      
      <div className={styles.container}>
        <div className={styles.leftGroup}>
          <a href="/" className={styles.brand} aria-label="Zabota 2.0 — на главную">
            <img
              src="/images/logo___descript (3).svg"
              alt="Zabota 2.0"
              className={styles.logo}
              decoding="async"
            />
          </a>
          
          <nav className={styles.nav}>
            <a 
              href="#calculator" 
              className={`${styles.navLink} ${activeSection === 'calculator' ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, 'calculator')}
            >
              Калькулятор
            </a>
            <a 
              href="#integrations" 
              className={`${styles.navLink} ${activeSection === 'integrations' ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, 'integrations')}
            >
              Интеграции
            </a>
            <a 
              href="#cases" 
              className={`${styles.navLink} ${activeSection === 'cases' ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, 'cases')}
            >
              Кейсы
            </a>
            <a 
              href="#faq" 
              className={`${styles.navLink} ${activeSection === 'faq' ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, 'faq')}
            >
              FAQ
            </a>
            <a 
              href="#contacts" 
              className={`${styles.navLink} ${activeSection === 'contacts' ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, 'contacts')}
            >
              Контакты
            </a>
          </nav>
        </div>
        
        <div className={styles.phone}>
          <a href="tel:+78005553862" className={styles.phoneLink}>8 800 555 38 62</a>
        </div>
      </div>
    </header>
  );
}
