import React from 'react';
import { CalculatorState } from '../types';
import { calculatePrice } from '../lib/pricing';
import { formatPrice } from '../utils/formatCurrency';

interface TestCase {
  name: string;
  state: CalculatorState;
  expectedDiscount: number;
  description: string;
}

const testCases: TestCase[] = [
  {
    name: "Тест 1: 12м, 25k база, 2 филиала, 5 WhatsApp, Advanced, будни",
    state: {
      period: 12,
      patientBase: 25000,
      branches: 2,
      whatsappNumbers: 5,
      marketingLevel: 'advanced',
      techSupport: 'weekdays'
    },
    expectedDiscount: 25,
    description: "discount=25%; breakdown без отрицательных"
  },
  {
    name: "Тест 2: 12м, 100k база, 10+ филиалов, 0 WhatsApp, Expert, ежедневная поддержка",
    state: {
      period: 12,
      patientBase: 100000,
      branches: 10,
      whatsappNumbers: 0,
      marketingLevel: 'expert',
      techSupport: 'daily'
    },
    expectedDiscount: 25,
    description: "discount=25%; base/branches >0"
  },
  {
    name: "Тест 3: 1м, 1k база, 1 филиал, 0 WhatsApp, Base, будни",
    state: {
      period: 1,
      patientBase: 1000,
      branches: 1,
      whatsappNumbers: 0,
      marketingLevel: 'base',
      techSupport: 'weekdays'
    },
    expectedDiscount: 0,
    description: "discount=0%; корректные нули/минимумы"
  }
];

const TestCases: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  const runTest = (testCase: TestCase) => {
    const result = calculatePrice(testCase.state);
    const actualDiscount = Math.round(result.periodDiscount + result.networkDiscount);
    const monthly = result.patientBase + result.branches + result.whatsapp + result.marketing + result.techSupport;
    
    console.log(`🧪 ${testCase.name}:`, {
      expectedDiscount: testCase.expectedDiscount,
      actualDiscount,
      monthly,
      total: result.total,
      breakdown: result,
      passed: actualDiscount === testCase.expectedDiscount
    });
    
    return {
      passed: actualDiscount === testCase.expectedDiscount,
      actualDiscount,
      monthly,
      total: result.total,
      breakdown: result
    };
  };

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white text-xs p-4 rounded-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">🧪 Тест-кейсы</h3>
      <div className="space-y-2">
        {testCases.map((testCase, index) => {
          const result = runTest(testCase);
          return (
            <div key={index} className="border border-white/20 p-2 rounded">
              <div className="font-medium text-xs">{testCase.name}</div>
              <div className="text-xs text-gray-300 mb-1">{testCase.description}</div>
              <div className={`text-xs ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                {result.passed ? '✅' : '❌'} Скидка: {result.actualDiscount}% (ожидалось: {testCase.expectedDiscount}%)
              </div>
              <div className="text-xs text-gray-400">
                Месяц: {formatPrice(result.monthly)} | Итого: {formatPrice(result.total)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestCases;
