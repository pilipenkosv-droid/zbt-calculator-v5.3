# Платформенная архитектура

## 🎯 Цель

Полная изоляция мобильной и десктопной версий для предотвращения перекрестного влияния изменений.

## 📁 Структура проекта

```
src/
├── platforms/
│   ├── mobile/                 # Мобильная платформа
│   │   ├── MobileApp.tsx      # Точка входа мобильного приложения
│   │   ├── components/        # Мобильные компоненты
│   │   └── styles/            # Мобильные стили
│   │       └── mobile.css
│   └── desktop/               # Десктопная платформа
│       ├── DesktopApp.tsx    # Точка входа десктопного приложения
│       ├── components/       # Десктопные компоненты
│       └── styles/           # Десктопные стили
│           └── desktop.css
├── shared/                    # Общий код
│   ├── app/
│   │   └── AppShell.tsx     # Точка композиции платформ
│   ├── components/          # Общие компоненты
│   ├── hooks/               # Общие хуки
│   ├── lib/                 # Бизнес-логика (pricing, levelDetails)
│   ├── platform/
│   │   └── usePlatform.ts  # Определение платформы
│   ├── types/               # Типы
│   │   ├── platform.ts
│   │   ├── calculator.ts
│   │   └── index.ts
│   ├── utils/               # Утилиты (validation, formatCurrency)
│   └── styles/
│       └── platform/        # Платформо-специфичные глобальные стили
├── utils/                   # Оригинальные утилиты (analytics, abTesting)
└── main.tsx                # Entry point

```

## 🔧 Принципы работы

### 1. Определение платформы

Платформа определяется автоматически через `usePlatform()` hook:

```typescript
// Брейкпоинт: < 1024px = mobile, >= 1024px = desktop
// Дополнительная проверка: pointer: coarse (touch устройства)
// Fallback: user agent

const { platform, screenWidth, isTouch } = usePlatform();
```

### 2. Условная загрузка (Code Splitting)

AppShell загружает только нужную платформу через React.lazy:

```typescript
const MobileApp = lazy(() => import('../../platforms/mobile/MobileApp'));
const DesktopApp = lazy(() => import('../../platforms/desktop/DesktopApp'));

// Рендерится ТОЛЬКО выбранная платформа
{platform === 'mobile' ? <MobileApp /> : <DesktopApp />}
```

### 3. Аналитика с platform

Все события автоматически включают платформу:

```typescript
track('calc_param_change', {
  platform: 'mobile', // Автоматически добавляется
  // ... остальные параметры
});
```

## 📝 Правила разработки

### Создание нового компонента

#### Если компонент общий для обеих платформ:
```
src/shared/components/Button.tsx
```

#### Если компонент платформо-специфичный:
```
src/platforms/mobile/components/MobileHeader.tsx
src/platforms/desktop/components/DesktopHeader.tsx
```

### Стили

#### Глобальные платформенные стили:
```
src/platforms/mobile/styles/mobile.css
src/platforms/desktop/styles/desktop.css
```

#### Компонентные стили (CSS Modules):
```
src/platforms/mobile/components/Header.mobile.module.scss
src/platforms/desktop/components/Header.desktop.module.scss
```

### Импорты

❌ **ЗАПРЕЩЕНО** перекрестные импорты:
```typescript
// В mobile/ компоненте
import Something from '../../desktop/components/Something'; // ❌
```

✅ **РАЗРЕШЕНО**:
```typescript
// Импорт из shared
import { pricing } from '../../shared/lib/pricing';

// Импорт из своей платформы
import MobileHeader from './components/MobileHeader';
```

## 🚀 Текущее состояние

### ✅ Реализовано:

1. **Структура каталогов** - platforms/{mobile,desktop}, shared/
2. **usePlatform.ts** - определение платформы по screenWidth + pointer
3. **AppShell.tsx** - точка композиции с React.lazy
4. **Общие модули** - lib/, types/, utils/ в shared/
5. **MobileApp.tsx** - базовая мобильная версия (placeholder)
6. **DesktopApp.tsx** - использует оригинальный App.tsx
7. **Analytics** - автоматическое добавление platform в события

### 🔄 В процессе:

8. Расколоть компоненты на платформенные версии
9. Создать компонентные стили (*.mobile.module.scss, *.desktop.module.scss)
10. Добавить тесты

## 📊 Метрики

### Проверка Code Splitting:

Откройте DevTools → Network → JS:
- При загрузке на мобильном: загружается только `MobileApp.[hash].js`
- При загрузке на десктопе: загружается только `DesktopApp.[hash].js`

### Проверка Analytics:

Все события в console.log включают:
```
[Analytics][mobile] calc_param_change { platform: 'mobile', ... }
[Analytics][desktop] app_loaded { platform: 'desktop', ... }
```

## 🧪 Тестирование

### Ручное тестирование платформ:

```typescript
// В main.tsx или через props
<AppShell forcePlatform="mobile" />  // Принудительно мобильная
<AppShell forcePlatform="desktop" /> // Принудительно десктопная
```

### Автоматические тесты:

```bash
# Запуск тестов (когда будут добавлены)
npm test
```

## 📖 Миграция существующих компонентов

### Шаг 1: Определить различия
- Есть ли различия в UI между mobile/desktop?
- Есть ли различия в поведении?

### Шаг 2: Если различия есть
```
# Создать платформенные версии
src/platforms/mobile/components/Header.tsx
src/platforms/desktop/components/Header.tsx
```

### Шаг 3: Если различий нет
```
# Оставить в shared
src/shared/components/Button.tsx
```

## 🔍 Отладка

### Проверка определения платформы:

```javascript
// В консоли браузера
console.log('Screen width:', window.innerWidth);
console.log('Platform:', window.innerWidth < 1024 ? 'mobile' : 'desktop');
```

### Проверка загруженных чанков:

```javascript
// В консоли браузера
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('App'))
  .forEach(r => console.log(r.name));
```

## 💡 Best Practices

1. **Всегда используйте shared/** для общей логики (pricing, types, utils)
2. **Избегайте дублирования** - если компонент одинаковый, он должен быть в shared/
3. **Тестируйте обе платформы** после каждого изменения
4. **Используйте TypeScript** для контроля типов и импортов
5. **Документируйте** платформо-специфичные решения в коде

## 📚 Дополнительные ресурсы

- [React.lazy документация](https://react.dev/reference/react/lazy)
- [Code Splitting in Vite](https://vitejs.dev/guide/features.html#async-chunk-loading-optimization)
- [Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)

