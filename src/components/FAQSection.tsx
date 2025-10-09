import { useState } from 'react';
import './FAQSection.css';

type FAQItem = { q: string; a: string };

const items: FAQItem[] = [
  {
    q: 'Как происходит интеграция с МИС/CRM?',
    a: 'Доступы → синхронизация данных → настройка сценариев → тест → пилот. Назначаем специалиста и проверяем корректность обмена.',
  },
  {
    q: 'Сколько времени занимает запуск?',
    a: 'Обычно 7 рабочих дней. Сложные проекты — до 30 дней. Срок зависит от доступов и скорости обратной связи.',
  },
  {
    q: 'Насколько персонализированы сообщения?',
    a: 'AI/ML по истории обращений, назначениям, предпочтениям и активности. Релевантные напоминания повышают доходимость и доверие.',
  },
  {
    q: 'Какая есть поддержка?',
    a: 'На внедрении и после запуска: телефон, Telegram, личный кабинет. Помощь с кампаниями, сегментациями и метриками.',
  },
  {
    q: 'Как обеспечивается безопасность и ПДн?',
    a: 'Правовые основания, оператор ПДн, политика обработки. Шифрование, аудит действий, разграничение прав и контроль доступов.',
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
