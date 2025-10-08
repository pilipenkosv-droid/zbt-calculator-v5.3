import React from 'react';
import styles from './BackgroundGradient.module.scss';

/**
 * BackgroundGradient - Компонент фона для калькулятора Zabota 2.0
 * 
 * Создает сложный многослойный градиент с теплыми оранжевыми тонами бренда Zabota.
 * Включает базовый linear-gradient, радиальные пятна, вигнетирование и текстуру.
 * 
 * Настройка цветов:
 * - Измените CSS переменные в theme.css для настройки палитры
 * - --color-brand: основной оранжевый цвет бренда
 * - --color-brand-2: вторичный янтарный цвет
 * - --color-accent: акцентный кораллово-оранжевый
 * - --bg-warm: теплый кремово-персиковый фон
 * 
 * Настройка градиентов:
 * - Угол базового градиента: измените 40deg в .container
 * - Позиции радиальных пятен: настройте at X% Y% в radial-gradient
 * - Размеры пятен: измените 90% 70% в radial-gradient
 * - Интенсивность: настройте opacity в color-mix()
 */
export const BackgroundGradient: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* SVG для дополнительных эффектов (опционально) */}
      <svg 
        className={styles.svgOverlay}
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Дополнительный conic-gradient для глубины */}
          <radialGradient id="depthGradient" cx="70%" cy="30%">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#depthGradient)" />
      </svg>
    </div>
  );
};

export default BackgroundGradient;
