import { useRef, useEffect, useState } from "react";
import styles from "./Banner.module.scss";

type BannerProps = {
  title?: string;
  imageSrc: string; // вставите прозрачное PNG/WebP как на скрине
  imageAlt?: string;
  onLearnMore?: () => void;
};

export default function Banner({
  title = "Zabota 2.0",
  imageSrc,
  imageAlt = "Интерфейсы Забота 2.0 на ноутбуке и смартфоне",
  onLearnMore,
}: BannerProps) {
  const bannerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / documentHeight, 1);
      setScrollProgress(progress);
      
      // Обновляем CSS переменную
      if (bannerRef.current) {
        bannerRef.current.style.setProperty('--scroll-progress', progress.toString());
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для инициализации

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={bannerRef}
      className={styles.banner} 
      aria-labelledby="banner-title"
      data-scroll-progress={scrollProgress}
    >
      {/* Декоративные фигуры */}
      <div className={styles.decorativeShapes}>
        <div className={styles.roundedSquare1}></div>
        <div className={styles.roundedSquare2}></div>
        <div className={styles.roundedSquare3}></div>
        <div className={styles.star1}></div>
        <div className={styles.star2}></div>
        <div className={styles.star3}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.left}>
          <h1 id="banner-title" className={styles.title}>{title}</h1>
          <p className={styles.desc}>
            С заботой о ваших пациентах,<br />
            улучшаем доходимость, возвращаем "спящих" и защищаем от спама.
          </p>

          <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cta}
                  onClick={onLearnMore}
                  aria-label="Рассчитать тариф Zabota 2.0"
                >
                  Рассчитать тариф
                </button>
          </div>

          <div className={styles.meta}>
              <div className={styles.benefits}>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>📈</span>
                  <span className={styles.benefitText}>+14-20% конверсия в повторный прием</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>🛡️</span>
                  <span className={styles.benefitText}>Защита от спама</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>💤</span>
                  <span className={styles.benefitText}>Возвращаем "спящих" пациентов</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>📱</span>
                  <span className={styles.benefitText}>Автоматизация напоминаний</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>🎯</span>
                  <span className={styles.benefitText}>Персонализированные акции</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>⭐️</span>
                  <span className={styles.benefitText}>Рост рейтинга клиники</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>🔗</span>
                  <span className={styles.benefitText}>Интеграции с 35+ МИС</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>⚡</span>
                  <span className={styles.benefitText}>Запуск от 7 дней</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>😌</span>
                  <span className={styles.benefitText}>Перехват негатива до публикации</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>🔒</span>
                  <span className={styles.benefitText}>Оператор ПДн</span>
                </div>
              </div>
          </div>
        </div>

        <div className={styles.right}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={styles.heroImage}
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
