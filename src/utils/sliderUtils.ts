// Упрощенная логика слайдеров без заливки
(function(){
  function initSliders() {
    const ranges = Array.from(document.querySelectorAll('input[type="range"]'));
    console.log('Инициализация слайдеров без заливки:', ranges.length);
    ranges.forEach(el => { 
      // Только обработчики событий для пересчета тарифа
      el.addEventListener('input', () => {
        // Логика пересчета будет в компонентах
        console.log('Слайдер изменен:', el.id, (el as HTMLInputElement).value);
      }); 
      el.addEventListener('change', () => {
        console.log('Слайдер подтвержден:', el.id, (el as HTMLInputElement).value);
      }); 
    });
  }
  
  // Инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliders);
  } else {
    initSliders();
  }
  
  // Повторная инициализация для React компонентов
  setTimeout(initSliders, 100);
  setTimeout(initSliders, 500);
})();
