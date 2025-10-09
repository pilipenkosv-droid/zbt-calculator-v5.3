import React from 'react';

type CaseItem = {
  title: string;
  clients: string;
  task: string;
  solution: string;
  result: string;
  kpis: { label: string; value: string }[];
};

const cases: CaseItem[] = [
  {
    title: 'Стоматология: реактивация',
    clients: '10 000 пациентов в базе',
    task: 'Вернуть пациентов, прекративших посещения.',
    solution: 'AI‑сегментация по срокам и показаниям + триггерные напоминания.',
    result: 'Прогноз доп. выручки за год и возврат части базы.',
    kpis: [
      { label: 'Потенциальная выручка/год', value: '+2,6 млн ₽' },
      { label: 'Вернувшиеся пациенты', value: '+126' },
      { label: 'Доходимость', value: '+5–7%' },
    ],
  },
  {
    title: 'Косметология: запуск процедур',
    clients: '27 000 пациентов в базе',
    task: 'Продвинуть новые услуги без увеличения рекламы.',
    solution: 'Сегментация и персональные рекомендации по релевантности.',
    result: 'Рост выручки и подтверждённых покупок в тестовый период.',
    kpis: [
      { label: 'Доп. выручка', value: '+1,7 млн ₽' },
      { label: 'Покупки', value: '+73' },
      { label: 'Отзывы (рост)', value: '×3–4' },
    ],
  },
  {
    title: 'Стоматология: повторные визиты',
    clients: '11 000 пациентов в базе',
    task: 'Увеличить повторные визиты на гигиену и диагностику.',
    solution: 'Напоминания в мессенджерах + подтверждение в один клик.',
    result: 'Рост визитов за первую неделю и доп. доход в месяц.',
    kpis: [
      { label: 'Доход за месяц', value: '+56 000 ₽' },
      { label: 'Визиты (1 неделя)', value: '+12' },
      { label: 'Снижение no‑show', value: '−6%' },
    ],
  },
];

export default function CasesSection() {
  return (
    <section aria-labelledby="cases-title" className="cases">
      <div className="header">
        <h2 id="cases-title">Кейсы клиентов</h2>
        <p className="subtitle">Задача → Решение → Результат. Только цифры и факты.</p>
      </div>

      <div className="grid">
        {cases.map((c, idx) => (
          <article key={idx} className="card" aria-label={c.title}>
            <header className="card-header">
              <h3 className="card-title">{c.title}</h3>
              <p className="card-meta">{c.clients}</p>
            </header>
            <div className="card-body">
              <p><strong>Задача:</strong> {c.task}</p>
              <p><strong>Решение:</strong> {c.solution}</p>
              <p><strong>Результат:</strong> {c.result}</p>
              <ul className="kpis" aria-label="Ключевые метрики">
                {c.kpis.map((k, i) => (
                  <li key={i} className="kpi">
                    <span className="kpi-label">{k.label}</span>
                    <span className="kpi-value">{k.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .cases { 
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
        
        .cases .header h2 {
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
        
        .grid { 
          display: flex; 
          gap: 24px; 
          overflow-x: auto;
          padding: 0 0 16px 0;
          scrollbar-width: thin;
          scrollbar-color: #FF6A00 #F2F2F2;
        }
        
        .grid::-webkit-scrollbar {
          height: 8px;
        }
        
        .grid::-webkit-scrollbar-track {
          background: #F2F2F2;
          border-radius: 4px;
        }
        
        .grid::-webkit-scrollbar-thumb {
          background: #FF6A00;
          border-radius: 4px;
        }
        
        .grid::-webkit-scrollbar-thumb:hover {
          background: #F55E00;
        }
        
        .card { 
          border: 1px solid var(--border, #e5e5e5); 
          border-radius: 16px; 
          padding: 24px; 
          background: #ffffff !important;
          transition: box-shadow 0.2s ease;
          flex: 0 0 380px;
          min-width: 380px;
          max-width: 380px;
        }
        
        .card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        
        .card-title { 
          margin: 0 0 8px 0; 
          font-family: 'Navigo', 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--fg, #1a1a1a);
        }
        
        .card-meta { 
          margin: 0 0 20px 0; 
          color: var(--muted, #666666); 
          font-size: 14px;
        }
        
        .card-body p {
          margin: 0 0 16px 0;
          line-height: 1.6;
          font-size: 15px;
          color: var(--fg, #1a1a1a);
        }
        
        .card-body p:last-of-type {
          margin-bottom: 20px;
        }
        
        .kpis { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 8px; 
          margin: 0; 
          padding: 0; 
          list-style: none; 
        }
        
        .kpi { 
          background: var(--chip-bg, #f8f9fa); 
          color: var(--chip-fg, #1a1a1a); 
          border: 1px solid var(--border, #e5e5e5); 
          border-radius: 12px; 
          padding: 8px 12px; 
          display: flex; 
          flex-direction: column;
          gap: 2px;
          font-size: 13px;
          min-width: 0;
          flex: 1;
        }
        
        .kpi-label {
          font-size: 11px;
          color: var(--muted, #666666);
          font-weight: 500;
        }
        
        .kpi-value { 
          font-weight: 700; 
          font-size: 14px;
          color: var(--fg, #1a1a1a);
        }
        
        /* Адаптивность для мобильных */
        @media (max-width: 768px) {
          .card {
            flex: 0 0 320px;
            min-width: 320px;
            max-width: 320px;
            padding: 20px;
          }
          
          .kpi {
            flex: 1 1 calc(50% - 4px);
          }
        }
        
        @media (max-width: 480px) {
          .card {
            flex: 0 0 280px;
            min-width: 280px;
            max-width: 280px;
            padding: 16px;
          }
          
          .grid {
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
