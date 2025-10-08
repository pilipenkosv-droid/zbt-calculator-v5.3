# ZBT Calculator v4.0 - Apple-Optimized

## 🎨 Версия 4.0 - Apple-стиль с оптимизацией

### ✨ Ключевые улучшения:

#### **1. Apple HIG Design System**
- **Системные шрифты**: SF Pro Text/Display, Segoe UI, Roboto
- **Цветовые токены**: оптимизированная палитра для тёмной темы
- **Типографика**: H1 32px, H2 24px, H3 18px с правильным контрастом
- **Сетка**: 1200px контейнеры, 60/40 split для контента

#### **2. Glassmorphism UI**
- **Стеклянные панели**: backdrop-filter только для ключевых элементов
- **Pill-кнопки**: полностью скругленные с тактильностью
- **Sticky-панель**: всегда видна на десктопе, статична на мобильном
- **Apple-плитки**: 4 равные карточки ММ с hover-эффектами

#### **3. Производительность**
- **Оптимизированные анимации**: только transform/opacity
- **Reduced motion**: поддержка пользовательских настроек
- **Backdrop-filter**: только для sticky, хедера, MM-карточек
- **Fallback**: для браузеров без backdrop-filter

#### **4. Адаптивность**
- **1100px**: sticky становится статичным
- **1024px**: 2 колонки для MM-карточек
- **640px**: 1 колонка, полная ширина кнопок
- **Контейнеры**: адаптивные отступы

#### **5. Accessibility (WCAG AA)**
- **Контраст**: все тексты соответствуют стандартам
- **Keyboard navigation**: полная поддержка
- **Screen readers**: ARIA labels и семантика
- **Focus states**: четкие outline для навигации

### 🛠 Технические особенности:

#### **CSS Architecture**
```css
:root {
  --contrast-high: #ffffff;           /* WCAG AA */
  --contrast-medium: rgba(255,255,255,0.87);
  --contrast-low: rgba(255,255,255,0.6);
  --accent: #ff7a00;
  --surface: rgba(255,255,255,0.08);
  --border: rgba(255,255,255,0.18);
}
```

#### **Компоненты**
- **StickyCalculation**: Apple-стиль с flex-разложением цены
- **MMLevelsSection**: 4 равные плитки с бейджем "Рекомендуем"
- **EmailModal**: pill-кнопки и стеклянные поля
- **Tooltip**: читабельные с backdrop-filter

#### **Анимации**
```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}

.btn { transition: transform 180ms ease, opacity 180ms ease; }
.mm-card { transition: transform 180ms ease; }
```

### 📱 Адаптивные брейки:

- **Desktop (1100px+)**: 4 колонки MM, sticky справа
- **Tablet (640px-1100px)**: 2 колонки MM, sticky статичный
- **Mobile (640px-)**: 1 колонка MM, полная ширина кнопок

### 🎯 Результат:

- **Apple-стиль**: полное соответствие HIG
- **Производительность**: быстрые анимации без лагов
- **Доступность**: WCAG AA контраст
- **Адаптивность**: плавные переходы между брейками
- **Sticky-панель**: всегда видна на десктопе

### 🚀 Запуск:

```bash
cd zbt-calculator-v4
npm install
npm run dev
```

Открыть: http://localhost:3000

### 📦 Архив:

Создан архив: `zbt-calculator-v4-YYYYMMDD-HHMMSS.tar.gz`

---

**Версия 4.0** - Apple-оптимизированный калькулятор с glassmorphism, производительными анимациями и полной адаптивностью.

