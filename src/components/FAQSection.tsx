import React, { useState } from 'react';

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

      <style jsx>{`
        .faq { 
          padding: 48px 24px; 
          background: #ffffff !important; 
          color: var(--fg, #1a1a1a); 
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header { 
          max-width: 900px; 
          margin: 0 auto 32px; 
          text-align: center; 
        }
        
        .faq .header h2 {
          font-family: 'Navigo', 'Inter', sans-serif;
          font-size: 36px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #1a1a1a !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .subtitle { 
          color: var(--muted, #666666); 
          font-size: 16px;
          margin: 0;
        }
        
        .list { 
          max-width: 900px; 
          margin: 0 auto; 
          padding: 0; 
          list-style: none; 
        }
        
        .item { 
          border-bottom: 1px solid var(--border, #e5e5e5); 
          transition: background-color 0.2s ease;
        }
        
        .item:last-child {
          border-bottom: none;
        }
        
        .item:hover {
          background-color: rgba(255, 106, 0, 0.02);
        }
        
        .toggle { 
          width: 100%; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 20px 0; 
          background: none; 
          border: none; 
          font-size: 16px; 
          color: var(--fg, #1a1a1a); 
          cursor: pointer;
          transition: color 0.2s ease;
          text-align: left;
        }
        
        .toggle:hover {
          color: var(--brand, #FF6A00);
        }
        
        .toggle:focus {
          outline: 2px solid var(--brand, #FF6A00);
          outline-offset: 2px;
        }
        
        .q {
          font-family: 'Navigo', 'Inter', sans-serif;
          font-weight: 500;
          font-size: 16px;
          line-height: 1.5;
          flex: 1;
          margin-right: 16px;
        }
        
        .icon { 
          font-weight: 600; 
          font-size: 20px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--brand, #FF6A00);
          color: #ffffff !important;
          border-radius: 50%;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        
        .toggle[aria-expanded="true"] .icon {
          transform: rotate(180deg);
        }
        
        .panel { 
          padding: 0 0 20px 0; 
          color: var(--muted, #666666); 
          animation: slideDown 0.3s ease;
        }
        
        .a {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
          padding-left: 0;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Адаптивность для мобильных */
        @media (max-width: 768px) {
          .toggle {
            padding: 16px 0;
          }
          
          .q {
            font-size: 15px;
            margin-right: 12px;
          }
          
          .icon {
            width: 20px;
            height: 20px;
            font-size: 16px;
          }
          
          .a {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
