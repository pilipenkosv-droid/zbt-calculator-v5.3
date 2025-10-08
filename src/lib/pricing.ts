import { CalculatorState, PriceBreakdown } from '../types';

// Базовые цены
const PATIENT_BASE_PRICES = {
  1000: 6900,
  4000: 10900,
  12000: 14900,
  24000: 16900,
  40000: 18900,
  60000: 20900,
};

// Скидки за период
const PERIOD_DISCOUNTS = {
  1: 0,
  3: 0.05,
  6: 0.10,
  9: 0.15,
  12: 0.20,
};

// Скидки за количество филиалов
const NETWORK_DISCOUNTS = {
  1: 0,
  2: 0.05,
  3: 0.10,
  5: 0.15,
};

// Цены за уровни маркетинга
const MARKETING_PRICES = {
  base: 9900,
  advanced: 29900,
  premium: 59900,
  expert: 119900,
};

// Дополнительные номера WhatsApp
const WHATSAPP_PRICE_PER_NUMBER = 1500;

// Техподдержка
const TECH_SUPPORT_DAILY_PRICE = 5000;

export function getPatientBasePrice(patientBase: number): number {
  if (patientBase <= 4000) return PATIENT_BASE_PRICES[1000];
  if (patientBase <= 12000) return PATIENT_BASE_PRICES[4000];
  if (patientBase <= 24000) return PATIENT_BASE_PRICES[12000];
  if (patientBase <= 40000) return PATIENT_BASE_PRICES[24000];
  if (patientBase <= 60000) return PATIENT_BASE_PRICES[40000];
  return PATIENT_BASE_PRICES[60000];
}

export function calculatePrice(state: CalculatorState): PriceBreakdown {
  // Скидки
  const periodDiscount = PERIOD_DISCOUNTS[state.period as keyof typeof PERIOD_DISCOUNTS] || 0;
  const networkDiscount = state.branches >= 2 ? 0.05 : 0; // -5% при филиалах ≥2
  let totalDiscount = periodDiscount + networkDiscount;
  
  // Каппируем скидку до 25%
  if (totalDiscount > 0.25) {
    totalDiscount = 0.25;
  }
  
  // НОВАЯ ЛОГИКА: Расчет на один филиал
  // Базовая стоимость на один филиал (до скидок)
  const basePricePerBranch = getPatientBasePrice(state.patientBase);
  const mmPricePerBranch = MARKETING_PRICES[state.marketingLevel];
  const supportPricePerBranch = state.techSupport === 'daily' ? TECH_SUPPORT_DAILY_PRICE : 0;
  const whatsappPrice = WHATSAPP_PRICE_PER_NUMBER * Math.max(0, (state.whatsappNumbers - 1));
  
  // Стоимость на один филиал в месяц (с учетом скидок)
  const monthlyPerBranch = (basePricePerBranch + mmPricePerBranch + supportPricePerBranch) * (1 - totalDiscount);
  
  // Общая стоимость за период
  const total = (monthlyPerBranch * state.branches + whatsappPrice) * state.period;
  
  // Цена до скидки (для отображения)
  const beforeDiscount = (basePricePerBranch + mmPricePerBranch + supportPricePerBranch) * state.branches * state.period;
  
  return {
    patientBase: basePricePerBranch,
    branches: state.branches, // Количество филиалов вместо суммы
    whatsapp: whatsappPrice,
    marketing: mmPricePerBranch,
    techSupport: supportPricePerBranch,
    periodDiscount: periodDiscount * 100,
    networkDiscount: networkDiscount * 100,
    total: total,
    monthlyPerBranch: monthlyPerBranch, // Новая переменная для отображения
    beforeDiscount: beforeDiscount, // Цена до скидки
  };
}
