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
                  <span className={styles.benefitIcon}>📊</span>
                  <span className={styles.benefitText}>Комплексный подход: более 10 сервисов и 270 сценариев</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>🧠</span>
                  <span className={styles.benefitText}>Умная автоматизация: учитывает 86 параметров пациента из вашей МИС</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>📈</span>
                  <span className={styles.benefitText}>Доходимость: интерактивные напоминания и подтверждения приемов</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>💤</span>
                  <span className={styles.benefitText}>Возвращение "спящих" пациентов: персональные сценарии приглашений</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>⚡</span>
                  <span className={styles.benefitText}>Эффективность: рост конверсий на всех этапах пути пациента</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>⭐️</span>
                  <span className={styles.benefitText}>Рейтинг на геосервисах: больше положительных отзывов клинике и врачам</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>⏰</span>
                  <span className={styles.benefitText}>Экономия времени: администраторы экономят до 3 часов в день</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>💬</span>
                  <span className={styles.benefitText}>Качество сервиса: оперативная обратная связь от пациентов</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>📋</span>
                  <span className={styles.benefitText}>Полная загруженность: система обеспечивает высокий КПД врачей</span>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.benefitIcon}>💰</span>
                  <span className={styles.benefitText}>Снижение расходов: оптимизация рекламных и маркетинговых бюджетов</span>
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
