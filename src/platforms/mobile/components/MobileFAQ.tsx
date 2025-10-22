import React, { useState, useEffect } from 'react';
import './MobileFAQ.css';
import { track } from '../../../utils/analytics';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Мобильная версия FAQ
 * Аккордеоны с якорями, ограничено до 5-6 ключевых вопросов
 */
const MobileFAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Топ 5 ключевых вопросов для мобильной версии (как в десктопе)
  const faqItems: FAQItem[] = [
    {
      id: 'pricing',
      question: 'Как рассчитывается стоимость сервиса?',
      answer: 'Цена зависит от размера базы пациентов, срока оплаты, уровня поддержки, количества филиалов, доп. WhatsApp-номеров и режима техподдержки. При оплате на 12 месяцев действует скидка 20%. Стоимость удобно посчитать в калькуляторе на странице (слайдеры «База пациентов», «Срок оплаты», «Филиалы», «WhatsApp», «Техподдержка»).'
    },
    {
      id: 'results',
      question: 'Какие результаты мы увидим после запуска?',
      answer: 'Средний рост конверсии в повторный приём составляет +14–20%. Практические кейсы: снижение отмен «день в день» за счёт напоминаний, возврат «потерянных» пациентов через фокус на повторных, экономия 20–40% рабочего времени администраторов за счёт отказа от ручных SMS, рост повторных визитов и лояльности благодаря NPS, отзывам и автоматизации базы.'
    },
    {
      id: 'integration',
      question: 'Насколько сложно внедрение и сколько занимает запуск?',
      answer: 'Запуск от 7 дней: предоставляете доступы → синхронизация с МИС → тест → пилот. Есть готовые коннекторы и опыт сложных кастомных внедрений, персональный специалист сопровождает на всех этапах. Поддерживаются 35+ интеграций (включая популярные МИС и YClients).'
    },
    {
      id: 'security',
      question: 'За счёт чего сервис эффективен и как мы защищены от спама?',
      answer: 'Эффективность обеспечивают релевантные сценарии на базе глубокой сегментации (86 параметров пациента) и постоянной обратной связи (NPS/отзывы/аналитика). Сервис включает защиту от спама и работает как оператор персональных данных (регистрационный номер 77-17-005444).'
    },
    {
      id: 'support',
      question: 'Чем отличаются уровни поддержки и сколько сценариев доступно?',
      answer: 'Уровни Base/Advanced/Premium/Expert различаются глубиной сценариев, аналитики и приоритета задач: от базовой помощи и ежемесячного отчёта до стратегических сессий и персонального менеджера. В Premium — до 40 активных сценариев без ограничений по типам, с рекомендованным распределением (сервисные, обратная связь/NPS, удержание/возврат, лояльность, персональные акции) и регулярным аудитом под цели роста; доступны A/B-эксперименты и «овертайм»-услуги.'
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
    <section className="mobile-faq">
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

