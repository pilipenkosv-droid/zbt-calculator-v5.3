# 📱 Мобильная версия - Быстрый старт

## 🚀 Запуск

```bash
# Development
npm run dev
# → http://localhost:5173

# Production
npm run build
npm run preview

# Деплой
vercel --prod
```

---

## 📱 Тестирование

### В браузере
1. Откройте http://localhost:5173
2. DevTools (F12) → Toggle Device Toolbar
3. Выберите iPhone или Android
4. Протестируйте все компоненты

### Быстрая проверка
- ✅ Бургер-меню → должно открываться/закрываться
- ✅ Скролл вниз → появляется sticky nav bar
- ✅ Кейсы → свайп работает
- ✅ FAQ → аккордеоны раскрываются
- ✅ Форма → 3 шага с валидацией
- ✅ Sticky price → внизу, светлый фон

---

## 🎨 Тема

**Фон:** Белый (#FFFFFF)  
**Текст:** Темный (#1A1A1A)  
**Акцент:** Оранжевый (#FF6A00)  
**Контраст:** WCAG AAA

---

## 📦 Что создано

### 10 компонентов
1. MobileHeader - Header + меню
2. MobileBanner - Hero
3. MobileNavBar - Sticky nav
4. MobileFAB - FAB кнопки
5. MobileStickyPrice - Цена
6. MobileFAQ - FAQ (6 вопросов)
7. MobileCases - Кейсы (4 шт)
8. MobileIntegrations - 18 интеграций
9. MobileApplicationForm - Форма (3 шага)
10. MobileDemo - Контакты

### Bundle
- CSS: 38.45 kB (6.49 kB gzip)
- JS: 48.26 kB (13.26 kB gzip)
- **Total:** ~35.6 kB gzip ⭐️

---

## 🔧 Где что находится

**Главный файл:**
```
src/platforms/mobile/MobileApp.tsx
```

**Компоненты:**
```
src/platforms/mobile/components/
```

**Стили:**
```
src/platforms/mobile/styles/mobile.css
src/platforms/mobile/components/*.css
```

---

## ⚡️ Если что-то не работает

### Header темный?
Проверьте `MobileHeader.css` строка 12:
```css
background: rgba(255, 255, 255, 0.95);
```

### Sticky bar темный?
Проверьте `MobileStickyPrice.css` строка 10:
```css
background: rgba(255, 255, 255, 0.98);
```

### Компоненты не загружаются?
```bash
# Очистите кэш
rm -rf node_modules/.vite
npm run dev
```

### TypeScript ошибки?
```bash
# Пересоберите
npm run build
```

---

## 📞 Контакты

**Email:** info@zabota.tech  
**Телефон:** 8 800 555 38 62  
**WhatsApp:** [Написать](https://wa.me/88005553862)

---

**Статус:** ✅ Production-ready  
**Версия:** 5.3.0  
**Последнее обновление:** 21 октября 2025

