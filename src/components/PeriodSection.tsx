import React from 'react';
import { CalculatorState } from '../types';
import { track } from '../utils/analytics';

interface PeriodSectionProps {
  state: CalculatorState;
  onParamChange: (param: keyof CalculatorState, value: any) => void;
}

const PeriodSection: React.FC<PeriodSectionProps> = ({ state, onParamChange }) => {
  const getDiscount = (period: number) => {
    if (period <= 1) return 0;
    if (period <= 3) return 5;
    if (period <= 6) return 10;
    if (period <= 9) return 15;
    return 20;
  };

  const currentDiscount = getDiscount(state.period);


  return (
    <section className="section-group">
      <h2 className="section-title" style={{ color: '#1A1A1A' }}>Период подписки</h2>
      
      <div className="slider-wrap">
        <input
          type="range"
          id="periodRange"
          min="1"
          max="12"
          step="1"
          value={state.period}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            // Округляем до ближайшего значения из ряда 1,3,6,9,12
            const validPeriods = [1, 3, 6, 9, 12];
            const closestPeriod = validPeriods.reduce((prev, curr) => 
              Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
            );
            
            // Заливка отключена - только пересчет тарифа
            
            onParamChange('period', closestPeriod);
            track('ui_change_period', { value: closestPeriod });
          }}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs" style={{ color: '#4A4A4A' }}>
          <span>1 мес</span>
          <span>3 мес</span>
          <span>6 мес</span>
          <span>9 мес</span>
          <span>12 мес</span>
        </div>
        
        <div className="period-summary">
          <span className="period-months">
            {state.period} {state.period === 1 ? 'месяц' : state.period < 5 ? 'месяца' : 'месяцев'}
          </span>
          {currentDiscount > 0 && (
            <>
              <span className="period-sep">—</span>
              <span className="period-discount">
                Скидка {currentDiscount}%
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PeriodSection;
