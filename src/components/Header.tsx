import React, { useState, useEffect } from "react";
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
        <a href="/" className={styles.brand} aria-label="Zabota 2.0 — на главную">
          <img
            src="/images/logo___descript (3).svg"
            alt="Zabota 2.0"
            className={styles.logo}
            decoding="async"
          />
        </a>
      </div>
    </header>
  );
}
