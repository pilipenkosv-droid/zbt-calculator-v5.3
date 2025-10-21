/**
 * Тип платформы
 */
export type Platform = 'mobile' | 'desktop';

/**
 * Интерфейс для компонентов с platform prop
 */
export interface PlatformAware {
  platform?: Platform;
}

/**
 * Конфигурация определения платформы
 */
export interface PlatformDetectionConfig {
  /** Брейкпоинт для определения мобильной версии (в пикселях) */
  mobileBreakpoint: number;
  /** Использовать определение по pointer: coarse */
  detectByPointer: boolean;
}

/**
 * Результат определения платформы
 */
export interface PlatformDetectionResult {
  platform: Platform;
  /** Ширина экрана */
  screenWidth: number;
  /** Является ли устройство тач-устройством */
  isTouch: boolean;
  /** User agent string */
  userAgent: string;
}

