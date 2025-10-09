import { useState, useEffect } from "react";
import styles from "./Header.module.scss";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // активируем эффект после 50px скролла
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
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
            <a href="#features" className={styles.navLink}>Возможности</a>
            <a href="#integrations" className={styles.navLink}>Интеграции</a>
            <a href="#cases" className={styles.navLink}>Кейсы</a>
            <a href="#pricing" className={styles.navLink}>Тарифы</a>
            <a href="#contacts" className={styles.navLink}>Контакты</a>
          </nav>
        </div>
        
        <div className={styles.phone}>
          <a href="tel:+78005553862" className={styles.phoneLink}>8 800 555 38 62</a>
        </div>
      </div>
    </header>
  );
}
