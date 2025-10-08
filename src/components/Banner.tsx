import React from "react";
import styles from "./Banner.module.scss";

type BannerProps = {
  title?: string;
  description?: string;
  phone?: string;
  imageSrc: string; // вставите прозрачное PNG/WebP как на скрине
  imageAlt?: string;
  onLearnMore?: () => void;
};

export default function Banner({
  title = "Zabota 2.0",
  description = "С заботой о ваших пациентах, улучшаем доходимость, возвращаем \"спящих\" и защищаем от спама.",
  phone = "8 800 555 38 62",
  imageSrc,
  imageAlt = "Интерфейсы Забота 2.0 на ноутбуке и смартфоне",
  onLearnMore,
}: BannerProps) {
  return (
    <section className={styles.banner} aria-labelledby="banner-title">
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
            <a className={styles.phone} href="tel:+78005553862">{phone}</a>
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
                  <span className={styles.benefitIcon}>🛡️</span>
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
