// A/B тестирование без внешних сервисов
export type ABVariant = 'A' | 'B';

export interface ABTest {
  name: string;
  variant: ABVariant;
  description: string;
}

// Получение или создание варианта A/B
export function getABVariant(testName: string): ABVariant {
  if (typeof window === 'undefined') return 'A';
  
  const storageKey = `calc_ab_${testName}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored && (stored === 'A' || stored === 'B')) {
    return stored as ABVariant;
  }
  
  // A/B только на 10% трафика (рандом: B если Math.random()<0.1, иначе A)
  const variant = Math.random() < 0.1 ? 'B' : 'A';
  localStorage.setItem(storageKey, variant);
  
  return variant;
}

// Получение всех активных A/B тестов
export function getActiveABTests(): Record<string, ABVariant> {
  return {
    periodTooltip: getABVariant('period_tooltip'),
    secondaryCTA: getABVariant('secondary_cta')
  };
}

// Проверка, активен ли тест
export function isTestActive(testName: string): boolean {
  const activeTests = ['period_tooltip', 'secondary_cta'];
  return activeTests.includes(testName);
}
