import { useState } from 'react';
import './FAQSection.css';

type FAQItem = { q: string; a: string };

const items: FAQItem[] = [
  {
    q: 'Как работает система простыми словами?',
    a: 'Персональные коммуникации по 270 сценариям на основе данных из МИС — рост доходимости и повторных визитов.',
  },
  {
    q: 'В чем главный секрет эффективности?',
    a: 'Глубокая сегментация: 86 параметров пациента + релевантные сценарии и постоянная обратная связь.',
  },
  {
    q: 'Сложно ли внедрить систему?',
    a: 'Интеграции из каталога; методология внедрения; средняя окупаемость — 3–4 месяца.',
  },
  {
    q: 'Почему Zabota 2.0 сработает в моей клинике?',
    a: 'Проверено на клиниках разных размеров: рост отзывов, доходов и конверсии повторного приема.',
  },
  {
    q: 'Как узнать больше о возможностях системы?',
    a: 'Закажите демо и посмотрите видео "О Zabota за 2 минуты".',
  },
  {
    q: 'Как познакомиться бесплатно?',
    a: 'Демо‑доступ + Telegram‑бот Zabota.Reputation в подарок.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  
  return (
    <section aria-labelledby="faq-title" className="faq">
      <div className="header">
        <h2 id="faq-title">Частые вопросы</h2>
        <p className="subtitle">Коротко о подключении, результатах и безопасности.</p>
      </div>

      <ul className="list">
        {items.map((item, idx) => (
          <li key={idx} className="item">
            <button
              className="toggle"
              aria-expanded={open === idx}
              aria-controls={`faq-panel-${idx}`}
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span className="q">{item.q}</span>
              <span className="icon" aria-hidden>{open === idx ? '−' : '+'}</span>
            </button>
            {open === idx && (
              <div id={`faq-panel-${idx}`} role="region" className="panel">
                <p className="a">{item.a}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

    </section>
  );
}
