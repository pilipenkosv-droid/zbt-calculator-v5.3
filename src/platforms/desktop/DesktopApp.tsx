import React, { useState } from 'react';
import type { PlatformDetectionResult } from '../../shared/types/platform';
import type { CalculatorState } from '../../shared/types/calculator';
import { normalizeCalculatorState } from '../../shared/utils/validation';
import { track } from '../../utils/analytics';

// Импорт оригинального App для десктопа
import OriginalApp from '../../App';

// Импорт стилей для десктопной версии
import './styles/desktop.css';

/**
 * Интерфейс пропсов DesktopApp
 */
export interface DesktopAppProps {
  detection: PlatformDetectionResult;
}

/**
 * Десктопное приложение
 * На первом этапе использует оригинальный App.tsx
 * В дальнейшем будет содержать десктопную версию калькулятора
 */
const DesktopApp: React.FC<DesktopAppProps> = ({ detection }) => {
  // Инициализация аналитики с platform
  React.useEffect(() => {
    track('app_loaded', {
      platform: 'desktop',
      screenWidth: detection.screenWidth,
      isTouch: detection.isTouch,
    });
  }, [detection]);

  // Используем оригинальный App для десктопа
  return (
    <div className="desktop-app" data-platform="desktop">
      <OriginalApp />
    </div>
  );
};

export default DesktopApp;

