export interface CalculatorState {
  period: number; // 1, 3, 6, 9, 12
  patientBase: number; // 1000-100000
  branches: number; // 1+
  whatsappNumbers: number; // 0+
  marketingLevel: 'base' | 'advanced' | 'premium' | 'expert';
  techSupport: 'weekdays' | 'daily';
}

export interface CalculatorFlags {
  bigBase: boolean;
  bigNetwork: boolean;
}

export interface PriceBreakdown {
  patientBase: number;
  branches: number;
  whatsapp: number;
  marketing: number;
  techSupport: number;
  periodDiscount: number;
  networkDiscount: number;
  total: number;
  monthlyPerBranch: number; // Стоимость на один филиал в месяц
  beforeDiscount: number; // Цена до скидки
}

export interface MarketingLevel {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}
