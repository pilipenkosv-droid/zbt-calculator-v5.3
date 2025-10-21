import React, { useState } from 'react';
import type { PlatformDetectionResult } from '../../shared/types/platform';
import type { CalculatorState } from '../../shared/types/calculator';
import { normalizeCalculatorState } from '../../shared/utils/validation';
import { track } from '../../utils/analytics';

// Импорт стилей для мобильной версии
import './styles/mobile.css';

/**
 * Интерфейс пропсов MobileApp
 */
export interface MobileAppProps {
  detection: PlatformDetectionResult;
}

/**
 * Мобильное приложение
 * Содержит мобильную версию калькулятора и контента
 */
const MobileApp: React.FC<MobileAppProps> = ({ detection }) => {
  // Состояние калькулятора
  const [state, setState] = useState<CalculatorState>({
    period: 12,
    patientBase: 50000,
    branches: 1,
    whatsappNumbers: 0,
    marketingLevel: 'premium',
    techSupport: 'weekdays',
  });

  const handleParamChange = (param: keyof CalculatorState, value: any) => {
    if (state[param] === value) return;

    const newState = { ...state, [param]: value };
    const normalizedState = normalizeCalculatorState(newState);
    setState(normalizedState);

    track('calc_param_change', {
      platform: 'mobile',
      period: normalizedState.period,
      baseSize: normalizedState.patientBase,
      branches: normalizedState.branches,
      whatsappNumbers: normalizedState.whatsappNumbers,
      mmLevel: normalizedState.marketingLevel,
      supportLevel: normalizedState.techSupport,
    });
  };

  return (
    <div className="mobile-app" data-platform="mobile">
      <div className="mobile-placeholder">
        <h1>Mobile App</h1>
        <p>Platform: {detection.platform}</p>
        <p>Screen Width: {detection.screenWidth}px</p>
        <p>Is Touch: {detection.isTouch ? 'Yes' : 'No'}</p>
        
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h2>Калькулятор (мобильная версия)</h2>
          <p>База пациентов: {state.patientBase}</p>
          <p>Период: {state.period} мес</p>
          <p>Уровень: {state.marketingLevel}</p>
          
          <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
            Здесь будут мобильные компоненты калькулятора...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;

