// Диагностический скрипт для проверки слайдеров в браузере
// Вставить в консоль браузера для диагностики

(function(){
  const ranges = Array.from(document.querySelectorAll('input[type="range"]'));
  const report = ranges.map(el => {
    const s = getComputedStyle(el);
    const b = getComputedStyle(el, '::before');
    const a = getComputedStyle(el, '::after');
    const track = getComputedStyle(el, '::-webkit-slider-runnable-track');
    return {
      id: el.id || null,
      classes: el.className,
      bg: s.backgroundImage,
      before: { content: b.content, width: b.width, left: b.left, backgroundImage: b.backgroundImage },
      after: { content: a.content, width: a.width, backgroundImage: a.backgroundImage },
      track: { height: track.height, margin: track.margin, borderWidth: track.borderWidth, backgroundImage: track.backgroundImage }
    };
  });
  console.table(report);
  
  // Дополнительная диагностика
  console.log('=== ДИАГНОСТИКА СЛАЙДЕРОВ ===');
  console.log('Найдено слайдеров:', ranges.length);
  
  ranges.forEach((el, i) => {
    console.log(`\n--- Слайдер ${i + 1} (${el.id || 'без ID'}) ---`);
    const s = getComputedStyle(el);
    const b = getComputedStyle(el, '::before');
    const a = getComputedStyle(el, '::after');
    
    console.log('Фон элемента:', s.backgroundImage);
    console.log('::before content:', b.content);
    console.log('::before width:', b.width);
    console.log('::before background:', b.backgroundImage);
    console.log('::after content:', a.content);
    console.log('::after background:', a.backgroundImage);
    
    // Проверка на двойную заливку
    if (s.backgroundImage !== 'none') {
      console.warn('⚠️  ВНИМАНИЕ: У элемента есть фон - возможна двойная заливка!');
    }
    if (a.content !== 'none') {
      console.warn('⚠️  ВНИМАНИЕ: У ::after есть content - возможен второй слой!');
    }
  });
})();
