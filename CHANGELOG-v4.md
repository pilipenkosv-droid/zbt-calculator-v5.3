# Changelog v4.0 - Apple-Optimized

## 🎨 Версия 4.0.0 - Apple-Optimized (2025-10-03)

### ✨ Новые возможности:

#### **Apple HIG Design System**
- ✅ Системные шрифты Apple (SF Pro Text/Display)
- ✅ Цветовые токены с WCAG AA контрастом
- ✅ Типографика: H1 32px, H2 24px, H3 18px
- ✅ Сетка: 1200px контейнеры, 60/40 split

#### **Glassmorphism UI**
- ✅ Стеклянные панели с backdrop-filter
- ✅ Pill-кнопки с тактильностью
- ✅ Sticky-панель расчёта справа
- ✅ Apple-плитки для уровней ММ (4 равные карточки)

#### **Производительность**
- ✅ Оптимизированные анимации (только transform/opacity)
- ✅ Reduced motion поддержка
- ✅ Backdrop-filter только для ключевых элементов
- ✅ Fallback для старых браузеров

#### **Адаптивность**
- ✅ 1100px: sticky становится статичным
- ✅ 1024px: 2 колонки для MM-карточек
- ✅ 640px: 1 колонка, полная ширина кнопок
- ✅ Адаптивные отступы контейнеров

#### **Accessibility (WCAG AA)**
- ✅ Контраст: все тексты соответствуют стандартам
- ✅ Keyboard navigation: полная поддержка
- ✅ Screen readers: ARIA labels и семантика
- ✅ Focus states: четкие outline для навигации

### 🔧 Технические улучшения:

#### **CSS Architecture**
- ✅ Цветовые токены с контрастными значениями
- ✅ Оптимизированные анимации (180ms ease)
- ✅ Адаптивные брейки
- ✅ Производительный backdrop-filter

#### **Компоненты**
- ✅ StickyCalculation: Apple-стиль с flex-разложением
- ✅ MMLevelsSection: 4 равные плитки с бейджем
- ✅ EmailModal: pill-кнопки и стеклянные поля
- ✅ Tooltip: читабельные с backdrop-filter

#### **Производительность**
- ✅ Анимации только transform/opacity
- ✅ Backdrop-filter только для ключевых элементов
- ✅ Reduced motion поддержка
- ✅ Fallback для браузеров без backdrop-filter

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

### 📦 Сохранение:

- ✅ Проект скопирован в `zbt-calculator-v4/`
- ✅ package.json обновлен: `4.0.0-apple-optimized`
- ✅ Создан архив: `zbt-calculator-v4-20251003-010009.tar.gz`
- ✅ README-v4.md с полным описанием
- ✅ CHANGELOG-v4.md с изменениями

### 🚀 Запуск v4:

```bash
cd zbt-calculator-v4
npm install
npm run dev
```

Открыть: http://localhost:3000

---

**Версия 4.0** - Apple-оптимизированный калькулятор с glassmorphism, производительными анимациями и полной адаптивностью.

