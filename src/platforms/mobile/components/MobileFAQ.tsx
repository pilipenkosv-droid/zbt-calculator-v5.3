import React, { useState, useEffect } from 'react';
import './MobileFAQ.css';
import { track } from '../../../utils/analytics';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  details?: string;
}

/**
 * Мобильная версия FAQ
 * Аккордеоны с якорями, ограничено до 5-6 ключевых вопросов
 */
const MobileFAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Топ 6 ключевых вопросов для мобильной версии
  const faqItems: FAQItem[] = [
    {
      id: 'pricing',
      question: 'Как формируется цена?',
      answer: 'Цена складывается из: базы пациентов, количества филиалов, доп. номеров WhatsApp, уровня мед. маркетинга и техподдержки.',
      details: 'Скидки: до −20% за годовую подписку, −10% за полугодие, −5% за сеть (от 2 филиалов). Итоговая скидка суммируется.'
    },
    {
      id: 'quotas',
      question: 'Что такое анти-спам квоты?',
      answer: 'Лимиты на отправки по каналам: WhatsApp, SMS, Email — дневные и недельные. Защищают от блокировки и сохраняют доставляемость.',
      details: 'Например: WhatsApp — до 1000/день, 5000/неделя. При превышении система автоматически распределяет отправки.'
    },
    {
      id: 'demo',
      question: 'Можно протестировать?',
      answer: 'Да. Демо-доступ на 7 дней + Telegram-бот Zabota.Reputation на 3 месяца в подарок (Advanced/Premium/Expert).',
      details: 'Демо включает полный функционал выбранного тарифа. Для продления предоставим персональное предложение.'
    },
    {
      id: 'integration',
      question: 'Как быстро интегрируетесь?',
      answer: 'Запуск за 7 дней. Подключаем вашу МИС, настраиваем сценарии, обучаем команду.',
      details: 'Поддерживаем 35+ МИС и сервисов записи. Для нестандартных систем — интеграция через API (обсуждается отдельно).'
    },
    {
      id: 'scenarios',
      question: 'Какие сценарии включены?',
      answer: 'От базовых (напоминания, подтверждения) до премиальных (NPS, реактивация спящих, сегментированные цепочки).',
      details: 'Количество зависит от тарифа: Base — до 10, Advanced — до 25, Premium — до 40, Expert — неограниченно.'
    },
    {
      id: 'support',
      question: 'Какая поддержка?',
      answer: 'Выбор между помощью по запросу (будни) и круглосуточной поддержкой 24/7.',
      details: 'Включает: техподдержку, консультации по маркетингу, помощь в настройке сценариев. Premium/Expert — персональный менеджер.'
    }
  ];

  // Обработка якорей из URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && faqItems.find(item => item.id === hash)) {
      setOpenItem(hash);
      // Небольшая задержка для плавного скролла после загрузки
      setTimeout(() => {
        const element = document.getElementById(`faq-${hash}`);
        if (element) {
          const headerHeight = 60;
          const navBarHeight = 48;
          const elementPosition = element.offsetTop - headerHeight - navBarHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, []);

  const handleToggle = (itemId: string) => {
    const isOpening = openItem !== itemId;
    setOpenItem(isOpening ? itemId : null);
    
    // Обновить URL
    if (isOpening) {
      window.history.pushState(null, '', `#${itemId}`);
      track('faq_open', { question: itemId });
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
    
    track('faq_toggle', { question: itemId, action: isOpening ? 'open' : 'close' });
  };

  const handleShare = (itemId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${itemId}`;
    
    if (navigator.share) {
      navigator.share({
        title: faqItems.find(item => item.id === itemId)?.question,
        url: url,
      }).then(() => {
        track('faq_share', { question: itemId, method: 'native' });
      }).catch(() => {});
    } else {
      // Fallback - копирование в буфер
      navigator.clipboard.writeText(url).then(() => {
        track('faq_share', { question: itemId, method: 'clipboard' });
        alert('Ссылка скопирована в буфер обмена');
      });
    }
  };

  return (
    <section className="mobile-faq section">
      <div className="container">
        <h2 className="mobile-faq__title">Частые вопросы</h2>
        <p className="mobile-faq__subtitle">
          Быстрые ответы на ключевые вопросы
        </p>

        <div className="mobile-faq__list">
          {faqItems.map((item) => (
            <div
              key={item.id}
              id={`faq-${item.id}`}
              className={`mobile-faq__item ${openItem === item.id ? 'mobile-faq__item--open' : ''}`}
            >
              <button
                className="mobile-faq__question"
                onClick={() => handleToggle(item.id)}
                aria-expanded={openItem === item.id}
              >
                <span className="mobile-faq__question-text">{item.question}</span>
                <svg
                  className="mobile-faq__icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {openItem === item.id && (
                <div className="mobile-faq__answer">
                  <p className="mobile-faq__answer-text">{item.answer}</p>
                  {item.details && (
                    <div className="mobile-faq__details">
                      <p>{item.details}</p>
                    </div>
                  )}
                  <button
                    className="mobile-faq__share"
                    onClick={() => handleShare(item.id)}
                    aria-label="Поделиться ссылкой на вопрос"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 5.333a1.667 1.667 0 100-3.334 1.667 1.667 0 000 3.334zM4 9.333a1.667 1.667 0 100-3.334 1.667 1.667 0 000 3.334zM12 14a1.667 1.667 0 100-3.333A1.667 1.667 0 0012 14zM5.407 8.18l5.193 2.64M10.593 4.513l-5.186 2.64"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Поделиться ссылкой
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mobile-faq__footer">
          <p>Не нашли ответ?</p>
          <button
            className="mobile-faq__contact-btn"
            onClick={() => {
              const element = document.getElementById('contacts');
              if (element) {
                const headerHeight = 60;
                const elementPosition = element.offsetTop - headerHeight;
                window.scrollTo({
                  top: elementPosition,
                  behavior: 'smooth',
                });
              }
            }}
          >
            Задать вопрос
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileFAQ;

