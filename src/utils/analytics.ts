// Инициализация аналитики
declare global {
  interface Window {
    dataLayer: any[];
    __utm: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    };
  }
}

// Инициализация dataLayer
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

// Функция трекинга
export function track(event: string, payload: any = {}) {
  if (typeof window !== 'undefined') {
    // Добавляем фоновые атрибуты для аналитики
    const abVariant = localStorage.getItem('calc_ab_period_tooltip') || 'A';
    const utmParams = window.__utm || {};
    const fullPayload = { 
      ...payload, 
      ab: abVariant,
      utm: utmParams,
      ts: Date.now()
    };
    
    // Отправляем в dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({ event, ...fullPayload });
    }
    
    // Fallback на console.log
    console.log(event, fullPayload);
  }
}

// Дебаунс для частых событий
let debounceTimer: NodeJS.Timeout | null = null;

export function debouncedTrack(event: string, payload: any = {}, delay: number = 500) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    track(event, payload);
    debounceTimer = null;
  }, delay);
}

// Сбор UTM параметров из URL
export function collectUTMParams() {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
  };
  
  // Сохраняем только если есть хотя бы один параметр
  if (utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign) {
    window.__utm = utmParams;
  }
}

// Инициализация при загрузке страницы
if (typeof window !== 'undefined') {
  collectUTMParams();
}
