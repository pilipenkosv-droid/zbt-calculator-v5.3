# Навигация и индикатор прокрутки

## Обновление навигации в Header

### Header.tsx - Новая функциональность

#### 1. Индикатор прокрутки страницы
- **Визуализация**: тонкая горизонтальная полоска внизу хэдера
- **Цвет**: градиент от оранжевого (#FF6A00) до янтарного (#FF8C3A)
- **Высота**: 3px
- **Анимация**: плавное заполнение при прокрутке (0-100%)
- **Вычисление**: `(scrollTop / scrollableHeight) * 100`

#### 2. Обновленная навигация
**Удалено:**
- ❌ "Возможности" (#features)
- ❌ "Тарифы" (#pricing)

**Добавлено:**
- ✅ "Калькулятор" (#calculator)
- ✅ "Интеграции" (#integrations)
- ✅ "Кейсы" (#cases)
- ✅ "FAQ" (#faq)
- ✅ "Контакты" (#contacts)

#### 3. Подсветка активного раздела
- **Логика**: определение активной секции по позиции viewport (100px от верха)
- **Визуальные эффекты**:
  - Оранжевый цвет текста (#FF6A00)
  - Увеличенный вес шрифта (500)
  - Подчеркивание (2px оранжевая линия снизу)
- **Плавные переходы**: 0.2s ease для всех состояний

#### 4. Плавная прокрутка
- **Функция**: `handleNavClick` с `preventDefault`
- **Смещение**: учитывает высоту хэдера (80px)
- **Анимация**: `behavior: 'smooth'`

### Header.module.scss - Стили

#### Индикатор прокрутки (.scrollIndicator)
```scss
.scrollIndicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--brand) 0%, var(--brand-amber) 100%);
  transition: width 0.1s ease-out;
  z-index: 101;
}
```

#### Активная ссылка (.navLink.active)
```scss
.navLink.active {
  color: var(--brand) !important;
  font-weight: 500;
}

.navLink.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--brand);
  border-radius: 2px;
}
```

## Обновление якорей в App.tsx

### ID секций
- `#calculator` - Основной калькулятор (изменено с `#pricing`)
- `#integrations` - Секция интеграций
- `#cases` - Кейсы клиентов
- `#faq` - Часто задаваемые вопросы
- `#contacts` - Секция демо/контакты

## Технические особенности

### State Management
- `scrollProgress` - прогресс прокрутки (0-100%)
- `activeSection` - ID текущей активной секции
- `isScrolled` - состояние прокрутки для blur эффекта

### Performance
- **Debouncing**: отслеживание скролла без избыточных вычислений
- **Transition**: плавная анимация с `ease-out` для индикатора
- **GPU acceleration**: использование `transform` и `opacity` где возможно

### Accessibility
- Сохранены `aria-label` для ссылок
- Плавная прокрутка с учетом `prefers-reduced-motion`
- Семантически корректная навигация (`<nav>`)

## UX улучшения

✅ Визуальная обратная связь о позиции на странице
✅ Быстрая навигация по ключевым секциям
✅ Явное указание текущего раздела
✅ Плавные анимации и переходы
✅ Адаптивность для мобильных устройств (навигация скрыта < 768px)
