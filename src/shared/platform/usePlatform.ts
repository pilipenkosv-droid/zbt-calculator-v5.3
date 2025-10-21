import { useState, useEffect } from 'react';
import type { Platform, PlatformDetectionConfig, PlatformDetectionResult } from '../types/platform';

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG: PlatformDetectionConfig = {
  mobileBreakpoint: 1024, // < 1024px = mobile
  detectByPointer: true,
};

/**
 * Определяет платформу на основе характеристик устройства
 */
export function getInitialPlatform(config: Partial<PlatformDetectionConfig> = {}): PlatformDetectionResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  // SSR fallback
  if (typeof window === 'undefined') {
    return {
      platform: 'desktop',
      screenWidth: 1920,
      isTouch: false,
      userAgent: '',
    };
  }

  const screenWidth = window.innerWidth;
  const userAgent = navigator.userAgent || '';
  
  // Проверка по ширине экрана
  const isMobileByWidth = screenWidth < cfg.mobileBreakpoint;
  
  // Проверка по pointer (touch устройство)
  let isMobileByPointer = false;
  if (cfg.detectByPointer && window.matchMedia) {
    isMobileByPointer = window.matchMedia('(pointer: coarse)').matches;
  }
  
  // Проверка по user agent (запасной вариант)
  const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Итоговое определение: если хотя бы один признак указывает на мобильное
  const platform: Platform = (isMobileByWidth || isMobileByPointer || isMobileByUA) ? 'mobile' : 'desktop';
  
  return {
    platform,
    screenWidth,
    isTouch: isMobileByPointer || isMobileByUA,
    userAgent,
  };
}

/**
 * Хук для определения и отслеживания платформы
 * Реагирует на изменение размера окна
 */
export function usePlatform(config: Partial<PlatformDetectionConfig> = {}): PlatformDetectionResult {
  const [detection, setDetection] = useState<PlatformDetectionResult>(() => getInitialPlatform(config));

  useEffect(() => {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    
    const handleResize = () => {
      const newDetection = getInitialPlatform(cfg);
      // Обновляем только если платформа изменилась
      setDetection(prev => {
        if (prev.platform !== newDetection.platform || prev.screenWidth !== newDetection.screenWidth) {
          return newDetection;
        }
        return prev;
      });
    };

    // Слушаем изменение размера окна
    window.addEventListener('resize', handleResize);
    
    // Слушаем изменение orientation для мобильных
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [config]);

  return detection;
}

/**
 * Хук для проверки конкретной платформы
 */
export function useIsMobile(): boolean {
  const { platform } = usePlatform();
  return platform === 'mobile';
}

/**
 * Хук для проверки конкретной платформы
 */
export function useIsDesktop(): boolean {
  const { platform } = usePlatform();
  return platform === 'desktop';
}

