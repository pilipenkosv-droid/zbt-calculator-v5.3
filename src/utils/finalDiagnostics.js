// ФИНАЛЬНАЯ ДИАГНОСТИКА СЛАЙДЕРОВ
// Вставить в консоль браузера для проверки

(function(){
  console.log('=== ФИНАЛЬНАЯ ДИАГНОСТИКА СЛАЙДЕРОВ ===');
  
  const ranges = Array.from(document.querySelectorAll('input[type="range"]'));
  console.log('Найдено слайдеров:', ranges.length);
  
  const report = ranges.map((el, i) => {
    const s = getComputedStyle(el);
    const b = getComputedStyle(el, '::before');
    const a = getComputedStyle(el, '::after');
    const track = getComputedStyle(el, '::-webkit-slider-runnable-track');
    
    const result = {
      index: i + 1,
      id: el.id || 'без ID',
      classes: el.className,
      value: el.value,
      min: el.min,
      max: el.max,
      fillPct: el.style.getPropertyValue('--fill-pct'),
      bg: s.backgroundImage,
      before: { 
        content: b.content, 
        width: b.width, 
        left: b.left, 
        backgroundImage: b.backgroundImage 
      },
      after: { 
        content: a.content, 
        width: a.width, 
        backgroundImage: a.backgroundImage 
      },
      track: { 
        height: track.height, 
        margin: track.margin, 
        borderWidth: track.borderWidth, 
        backgroundImage: track.backgroundImage 
      }
    };
    
    // Проверка на проблемы
    if (s.backgroundImage !== 'none') {
      result.warning = '⚠️ Фон элемента не пустой - возможна двойная заливка!';
    }
    if (a.content !== 'none') {
      result.warning = '⚠️ ::after имеет content - возможен второй слой!';
    }
    if (track.margin !== '9px 0px') {
      result.warning = '⚠️ Неправильный margin трека: ' + track.margin;
    }
    if (!result.fillPct) {
      result.warning = '⚠️ CSS переменная --fill-pct не установлена!';
    }
    
    return result;
  });
  
  console.table(report);
  
  // Дополнительная проверка
  console.log('\n=== ПРОВЕРКА КАЧЕСТВА ===');
  const problems = report.filter(r => r.warning);
  if (problems.length === 0) {
    console.log('✅ Все слайдеры в порядке!');
  } else {
    console.log('❌ Найдены проблемы:');
    problems.forEach(p => console.log(`- ${p.id}: ${p.warning}`));
  }
  
  // Проверка визуального соответствия
  console.log('\n=== ВИЗУАЛЬНАЯ ПРОВЕРКА ===');
  console.log('Проверьте в браузере:');
  console.log('1. Заливка начинается от внутренней кромки трека');
  console.log('2. Заливка не касается внешней рамки');
  console.log('3. При max значении заливка не выходит за правую внутреннюю кромку');
  console.log('4. Все слайдеры выглядят одинаково');
  console.log('5. Нет двойных слоев заливки');
  
})();
