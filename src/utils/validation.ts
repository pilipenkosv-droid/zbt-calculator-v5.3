import { CalculatorState, CalculatorFlags } from '../types';

// Нормализация ввода/состояния
export function normalizeCalculatorState(state: CalculatorState): CalculatorState {
  const normalized = { ...state };
  
  // months ∈ {1,3,6,9,12}, иначе months=1
  if (![1, 3, 6, 9, 12].includes(normalized.period)) {
    normalized.period = 1;
  }
  
  // baseSize: шаг 1000, диапазон 1000-100000
  const MIN_BASE = 1000;
  const MAX_BASE = 100000;
  const STEP_BASE = 1000;
  
  if (normalized.patientBase < MIN_BASE) {
    normalized.patientBase = MIN_BASE;
  } else if (normalized.patientBase > MAX_BASE) {
    normalized.patientBase = MAX_BASE;
  } else {
    // Нормализация к шагу 1000
    const n = Math.round(Number(normalized.patientBase) / STEP_BASE) * STEP_BASE;
    normalized.patientBase = Math.max(MIN_BASE, Math.min(MAX_BASE, n));
  }
  
  // branches >=1; если <1, ставь 1
  if (normalized.branches < 1) {
    normalized.branches = 1;
  }
  
  // whatsappNumbers >=0; если <0, ставь 0
  if (normalized.whatsappNumbers < 0) {
    normalized.whatsappNumbers = 0;
  }
  
  // mmLevel ∈ {'base','advanced','premium','expert'}
  if (!['base', 'advanced', 'premium', 'expert'].includes(normalized.marketingLevel)) {
    normalized.marketingLevel = 'base';
  }
  
  // supportLevel ∈ {'weekdays','daily'}
  if (!['weekdays', 'daily'].includes(normalized.techSupport)) {
    normalized.techSupport = 'weekdays';
  }
  
  return normalized;
}

// Получение флагов
export function getCalculatorFlags(state: CalculatorState): CalculatorFlags {
  return {
    bigBase: state.patientBase >= 100000,
    bigNetwork: state.branches >= 10
  };
}

// Проверка граничных случаев
export function validateCalculation(monthlyDesired: number, fixedComponents: number): boolean {
  return monthlyDesired >= fixedComponents;
}
