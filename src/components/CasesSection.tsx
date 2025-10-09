// import React from 'react';
import './CasesSection.css';

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

    </section>
  );
}
