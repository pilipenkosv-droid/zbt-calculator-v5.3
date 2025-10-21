# 📱 Архитектура мобильной версии

## 🏗 Структура проекта

```
zbt-calculator-v5.3/
│
├── src/
│   ├── platforms/
│   │   ├── desktop/                          Desktop версия
│   │   │   ├── DesktopApp.tsx
│   │   │   ├── components/
│   │   │   └── styles/desktop.css
│   │   │
│   │   └── mobile/                           🎯 МОБИЛЬНАЯ ВЕРСИЯ
│   │       ├── MobileApp.tsx                 ← Главный компонент
│   │       │
│   │       ├── components/                   10 компонентов
│   │       │   ├── MobileHeader.tsx          Header + бургер-меню
│   │       │   ├── MobileHeader.css
│   │       │   ├── MobileBanner.tsx          Hero-блок
│   │       │   ├── MobileBanner.css
│   │       │   ├── MobileNavBar.tsx          Sticky навигация
│   │       │   ├── MobileNavBar.css
│   │       │   ├── MobileFAB.tsx             FAB кнопки
│   │       │   ├── MobileFAB.css
│   │       │   ├── MobileStickyPrice.tsx     Блок стоимости
│   │       │   ├── MobileStickyPrice.css
│   │       │   ├── MobileFAQ.tsx             FAQ
│   │       │   ├── MobileFAQ.css
│   │       │   ├── MobileCases.tsx           Карусель кейсов
│   │       │   ├── MobileCases.css
│   │       │   ├── MobileIntegrations.tsx    Интеграции
│   │       │   ├── MobileIntegrations.css
│   │       │   ├── MobileApplicationForm.tsx Форма
│   │       │   ├── MobileApplicationForm.css
│   │       │   ├── MobileDemo.tsx            Контакты
│   │       │   └── MobileDemo.css
│   │       │
│   │       └── styles/
│   │           └── mobile.css                 Базовые стили
│   │
│   ├── shared/                               Общий код
│   │   ├── app/PlatformApp.tsx              Роутер платформ
│   │   ├── platform/platform.ts             Детекция
│   │   └── types/
│   │
│   ├── components/                          Общие компоненты
│   ├── utils/                               Утилиты
│   └── types/                               Типы
│
└── dist/                                    Production билд
```

---

## 🔄 Поток данных

```
Вход
  ↓
main.tsx
  ↓
PlatformApp.tsx ← Детекция платформы
  ↓
  ├─→ Desktop? → DesktopApp.tsx
  └─→ Mobile?  → MobileApp.tsx ← МЫ ЗДЕСЬ
                    ↓
      ┌─────────────┴─────────────┐
      │                           │
  Layout.tsx              Аналитика
      │                           │
      ├─ MobileHeader             │
      ├─ MobileBanner             │
      ├─ MobileNavBar ────────────┤
      ├─ Calculator               │
      ├─ MobileStickyPrice ───────┤
      ├─ MobileIntegrations ──────┤
      ├─ MobileCases ─────────────┤
      ├─ MobileFAQ ───────────────┤
      ├─ MobileDemo ──────────────┤
      ├─ MobileFAB                │
      └─ ApplyModal ──────────────┘
                    ↓
                Рендеринг
```

---

## 🎨 Система дизайна

### Цвета

```css
/* Светлая тема */
#FFFFFF  /* Основной фон */
#F8F8F8  /* Вторичный фон */
#F0F0F0  /* Третичный фон */
#1A1A1A  /* Текст */

/* Акценты */
#FF6A00  /* Основной (оранжевый) */
#E56000  /* Hover */
#25D366  /* Успех (зелёный) */
#FF4444  /* Ошибка (красный) */
```

### Размеры

```css
/* Тап-цели */
44×44px   /* Минимум для touch */
48×48px   /* Комфортный размер */
56×56px   /* FAB кнопки */

/* Шрифты */
16-18px   /* Базовый текст */
22-26px   /* Заголовки H2 */
26-28px   /* Заголовки H1 */

/* Отступы */
12-16px   /* Маленькие */
24-32px   /* Средние */
40-48px   /* Большие */
```

### Границы и тени

```css
/* Радиусы */
border-radius: 6px   /* Маленькие элементы */
border-radius: 8px   /* Кнопки, инпуты */
border-radius: 12px  /* Карточки */
border-radius: 16px  /* Большие блоки */

/* Тени */
box-shadow: 0 2px 4px rgba(0,0,0,0.05)   /* Лёгкая */
box-shadow: 0 2px 8px rgba(0,0,0,0.08)   /* Средняя */
box-shadow: 0 4px 12px rgba(0,0,0,0.12)  /* Глубокая */
```

---

## 🧩 Компоненты - быстрая справка

### MobileHeader
```tsx
import MobileHeader from './components/MobileHeader';

<MobileHeader onMenuItemClick={(section) => {...}} />
```
- Фиксированный сверху (60px)
- Бургер-меню справа
- Логотип слева
- Иконка телефона

---

### MobileBanner
```tsx
import MobileBanner from './components/MobileBanner';

<MobileBanner 
  onCalculate={() => {...}}
  onConsultation={() => {...}}
/>
```
- Hero-блок с 2 CTA
- Ценностное предложение
- Контактные ссылки

---

### MobileNavBar
```tsx
import MobileNavBar from './components/MobileNavBar';

<MobileNavBar />
```
- Sticky под header (60px)
- 5 секций с иконками
- Автоопределение активной

---

### MobileFAB
```tsx
import MobileFAB from './components/MobileFAB';

<MobileFAB />
```
- "Наверх" (после 500px)
- "Связаться" (всегда)
- Bottom-right позиция

---

### MobileStickyPrice
```tsx
import MobileStickyPrice from './components/MobileStickyPrice';

<MobileStickyPrice 
  state={calculatorState}
  onRequestQuote={() => {...}}
/>
```
- Фиксирован внизу
- Переключатель вида
- Модалка с деталями

---

### MobileFAQ
```tsx
import MobileFAQ from './components/MobileFAQ';

<MobileFAQ />
```
- 6 топовых вопросов
- Аккордеоны
- Якоря в URL
- Кнопка "Поделиться"

---

### MobileCases
```tsx
import MobileCases from './components/MobileCases';

<MobileCases />
```
- 4 кейса
- Свайп-навигация
- Метрики KPI
- Индикаторы

---

### MobileIntegrations
```tsx
import MobileIntegrations from './components/MobileIntegrations';

<MobileIntegrations />
```
- 18 интеграций
- Поиск
- Фильтры (МИС, Запись)
- Lazy-load по 12

---

### MobileApplicationForm
```tsx
import MobileApplicationForm from './components/MobileApplicationForm';

<MobileApplicationForm 
  onSubmit={async (data) => {...}}
  policyUrl="https://..."
/>
```
- 3 шага
- Валидация
- Маска телефона
- Экран успеха

---

### MobileDemo
```tsx
import MobileDemo from './components/MobileDemo';

<MobileDemo 
  onSubmit={async (data) => {...}}
  policyUrl="https://..."
/>
```
- Обёртка для формы
- Преимущества демо
- Контакты

---

## 🎯 Типичные задачи

### Добавить новую секцию
```tsx
// 1. Создайте компонент
src/platforms/mobile/components/MobileMySection.tsx

// 2. Добавьте стили
src/platforms/mobile/components/MobileMySection.css

// 3. Импортируйте в MobileApp.tsx
import MobileMySection from './components/MobileMySection';

// 4. Добавьте в рендер
<div id="my-section">
  <MobileMySection />
</div>

// 5. Добавьте в навигацию (опционально)
// MobileNavBar.tsx - добавьте в массив navItems
```

### Изменить цвета
```css
/* Откройте mobile.css */
src/platforms/mobile/styles/mobile.css

/* Обновите CSS переменные */
--accent-primary: #FF6A00;  /* Ваш цвет */
```

### Добавить аналитику
```tsx
import { track } from '../../../utils/analytics';

track('event_name', {
  platform: 'mobile',
  data: value,
});
```

---

## 📊 Метрики для мониторинга

### Performance
- Time to Interactive < 3s
- First Contentful Paint < 1.5s
- Bundle size gzip < 40 kB

### UX
- Conversion rate > 5%
- Bounce rate < 40%
- Session duration > 2 min

### Technical
- Build time < 2s
- No linter errors
- TypeScript strict mode

---

## 🔒 Best Practices

### CSS
✅ Используйте CSS переменные  
✅ Тап-цели ≥ 44px  
✅ Контраст WCAG AA минимум  
✅ Добавляйте тени для глубины  

### TypeScript
✅ Полная типизация  
✅ Интерфейсы для props  
✅ Нет any  

### React
✅ Functional components  
✅ Hooks правильно  
✅ useEffect с dependencies  
✅ Event cleanup  

### UX
✅ Loading states  
✅ Error states  
✅ Success feedback  
✅ Touch-first  

---

**Быстрый старт создан:** 21 октября 2025  
**Всё работает!** ✅

