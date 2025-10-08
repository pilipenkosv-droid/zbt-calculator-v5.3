// ДИАГНОСТИЧЕСКИЙ СКРИПТ ДЛЯ КОНСОЛИ БРАУЗЕРА
// Вставить в консоль браузера на странице http://localhost:3001

(function(){
  console.log('🔍 === ДИАГНОСТИКА СЛАЙДЕРОВ ZBT CALCULATOR ===');
  
  const ranges = Array.from(document.querySelectorAll('input[type="range"]'));
  console.log(`Найдено слайдеров: ${ranges.length}`);
  
  if (ranges.length === 0) {
    console.warn('⚠️ Слайдеры не найдены! Проверьте, что страница загружена полностью.');
    return;
  }
  
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
    const warnings = [];
    if (s.backgroundImage !== 'none') {
      warnings.push('Фон элемента не пустой - возможна двойная заливка!');
    }
    if (a.content !== 'none') {
      warnings.push('::after имеет content - возможен второй слой!');
    }
    if (track.margin !== '9px 0px') {
      warnings.push(`Неправильный margin трека: ${track.margin}`);
    }
    if (!result.fillPct) {
      warnings.push('CSS переменная --fill-pct не установлена!');
    }
    
    if (warnings.length > 0) {
      result.warnings = warnings;
    }
    
    return result;
  });
  
  console.table(report);
  
  // Дополнительная проверка
  console.log('\n=== ПРОВЕРКА КАЧЕСТВА ===');
  const problems = report.filter(r => r.warnings);
  if (problems.length === 0) {
    console.log('✅ Все слайдеры в порядке!');
  } else {
    console.log('❌ Найдены проблемы:');
    problems.forEach(p => {
      console.log(`- ${p.id}: ${p.warnings.join(', ')}`);
    });
  }
  
  // Проверка визуального соответствия
  console.log('\n=== ВИЗУАЛЬНАЯ ПРОВЕРКА ===');
  console.log('Проверьте в браузере:');
  console.log('1. Заливка начинается от внутренней кромки трека');
  console.log('2. Заливка не касается внешней рамки');
  console.log('3. При max значении заливка не выходит за правую внутреннюю кромку');
  console.log('4. Все слайдеры выглядят одинаково');
  console.log('5. Нет двойных слоев заливки');
  
  // Тест обновления заливки
  console.log('\n=== ТЕСТ ОБНОВЛЕНИЯ ЗАЛИВКИ ===');
  ranges.forEach(el => {
    const min = Number(el.min || 0);
    const max = Number(el.max || 100);
    const val = Number(el.value);
    const pct = ((val - min) / (max - min)) * 100;
    el.style.setProperty('--fill-pct', pct + '%');
  });
  console.log('CSS переменные --fill-pct обновлены для всех слайдеров!');
  
  console.log('\n=== ДИАГНОСТИКА ЗАВЕРШЕНА ===');
  console.log('Если есть проблемы, проверьте CSS правила и убедитесь, что нет конфликтующих стилей.');
  
})();
