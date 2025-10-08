# ZBT.calc v2.0-calc-ab1 — Калькулятор тарифа Zabota 2.0

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

## 📊 A/B тестирование

- **Подсказка периода**: Вариант A (текущий) vs Вариант B (усиленная формулировка)
- **Secondary CTA**: "PDF" vs "Сохранить PDF"
- **Трафик**: 10% получают вариант B, 90% — вариант A
- **Хранение**: localStorage с ключами `calc_ab_period_tooltip` и `calc_ab_secondary_cta`

## 🔍 Аналитика

### События
- `calc_viewed` — показ страницы
- `calc_param_change` — изменения параметров
- `calc_breakdown_view` — просмотр разложения цены
- `calc_saved_pdf` — сохранение PDF
- `calc_request_quote_email` — отправка КП
- `calc_submitted` — отправка заявки
- `funnel_step` — этапы воронки
- `ab_variant_assigned` — назначение A/B варианта
- `ab_secondary_cta` — клик по secondary CTA
- `ab_result` — результат A/B теста

### Воронка конверсии
1. `view` — просмотр страницы
2. `edit` — изменение параметров
3. `breakdown` — просмотр разложения цены
4. `cta_pdf` / `cta_email` — клик по CTA
5. `submit` — отправка заявки

## 🧪 Тест-кейсы

1. **12м, 25k база, 2 филиала, 5 WhatsApp, Advanced, будни** → discount=25%
2. **12м, 100k база, 10+ филиалов, 0 WhatsApp, Expert, ежедневная поддержка** → discount=25%
3. **1м, 1k база, 1 филиал, 0 WhatsApp, Base, будни** → discount=0%

## 🎯 Функции

- ✅ Интерактивный калькулятор тарифа
- ✅ A/B тестирование без внешних сервисов
- ✅ Отслеживание воронки конверсии
- ✅ Валидация и граничные случаи
- ✅ Экспорт в PDF
- ✅ Модалка для получения КП на email
- ✅ Responsive дизайн
- ✅ Glassmorphism UI
- ✅ SEO оптимизация

## 📱 Адаптивность

- **Mobile**: калькулятор сверху, summary снизу
- **Desktop**: калькулятор справа, summary sticky
- **Tablet**: адаптивная сетка

## 🔧 Технологии

- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- React Hook Form + Zod (валидация)
- Glassmorphism UI

## 📈 Метрики успеха

- **Просмотры**: `calc_viewed`
- **Взаимодействие**: `calc_param_change`
- **Глубина**: `calc_breakdown_view`
- **Конверсия**: `calc_saved_pdf`, `calc_request_quote_email`, `calc_submitted`
- **A/B результаты**: `ab_result`

## 🎨 UI/UX

- **Цвета**: brand-orange, discount-green, dark-gray, light-gray
- **Типографика**: Inter/Manrope, четкая иерархия
- **Эффекты**: glassmorphism, backdrop-filter, градиенты
- **Анимации**: плавные переходы, hover эффекты
- **Доступность**: ARIA, focus states, контрастность

## 📋 Чек-лист готовности

- ✅ Тест-кейсы проходят
- ✅ Формат валюты корректный
- ✅ Подсказки работают и логируются
- ✅ A/B тесты активны (10% трафика)
- ✅ Модалка валидирует email
- ✅ Трекинг в dataLayer + console.log
- ✅ SEO мета-теги
- ✅ Responsive дизайн
- ✅ PDF экспорт
- ✅ Версия зафиксирована: v2.0-calc-ab1
