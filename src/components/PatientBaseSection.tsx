import React, { useEffect, useRef } from 'react';
import { CalculatorState } from '../types';
import { track } from '../utils/analytics';

interface PatientBaseSectionProps {
  state: CalculatorState;
  onParamChange: (param: keyof CalculatorState, value: any) => void;
}

const PatientBaseSection: React.FC<PatientBaseSectionProps> = ({ state, onParamChange }) => {
  const sliderRef = useRef<HTMLInputElement>(null);

  // Константы
  const MIN = 1000;
  const MAX = 100000;
  const STEP = 1000;

  // Нормализация к шагу 1000
  const clampToStep = (v: number, step: number = STEP, min: number = MIN, max: number = MAX): number => {
    const n = Math.round(Number(v) / step) * step;
    return Math.max(min, Math.min(max, n));
  };

  // Форматирование для русской локали
  const formatRu = (n: number) => new Intl.NumberFormat('ru-RU').format(n);

  // Обновление лейбла
  const updatePatientsLabel = (val: number) => {
    // Лейбл обновляется через React state, поэтому здесь только трекинг
    track('ui_change_patient_base', { value: val });
  };



  // Обработчики — работаем с «живым» значением, не мапим на ступени
  const onInputPatients = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const val = clampToStep(raw);
    
    // UI
    updatePatientsLabel(val);
    
    // Заливка отключена - только пересчет тарифа
    
    // Логика калькулятора — НЕ меняем, просто передаём val (шаг 1000)
    onParamChange('patientBase', val);
  };

  const onChangePatients = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const val = clampToStep(raw);
    
    // UI
    updatePatientsLabel(val);
    
    // Заливка отключена - только пересчет тарифа
    
    // Фиксация подтверждённого значения
    onParamChange('patientBase', val);
  };

  // Обработчики для управления классами заполненной части
  const onPointerDown = () => {
    // Логика для интерактивного состояния теперь в CSS
  };

  const onPointerUp = () => {
    // Логика для интерактивного состояния теперь в CSS
  };

  const onMouseLeave = () => {
    // Логика для интерактивного состояния теперь в CSS
  };

  // Инициализация атрибутов range
  useEffect(() => {
    if (sliderRef.current) {
      // Установка атрибутов
      sliderRef.current.min = String(MIN);
      sliderRef.current.max = String(MAX);
      sliderRef.current.step = String(STEP);
      
      // Инициализация значения
      const initial = clampToStep(state.patientBase || 50000);
      sliderRef.current.value = String(initial);
      
      // Заливка отключена - только инициализация значения
    }
  }, []);

  return (
    <section className="section-group">
      <h2 className="section-title" style={{ color: '#1A1A1A' }}>База пациентов</h2>
      
      <div className="slider-wrap">
        <input
          ref={sliderRef}
          id="patientsRange"
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={state.patientBase}
          onChange={onInputPatients}
          onMouseUp={() => onChangePatients({} as React.ChangeEvent<HTMLInputElement>)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onMouseLeave={onMouseLeave}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs" style={{ color: '#4A4A4A' }}>
          <span>1 000</span>
          <span>25 000</span>
          <span>50 000</span>
          <span>75 000</span>
          <span>100 000+</span>
        </div>
        
        <div className="range-value" style={{ color: '#1A1A1A' }}>
          {formatRu(state.patientBase)} пациентов
        </div>
      </div>
    </section>
  );
};

export default PatientBaseSection;
