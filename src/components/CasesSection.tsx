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
    title: 'Любовь Гацура, главный врач "Love Dent"',
    clients: '10 000 пациентов в базе',
    task: 'Сократить отмены приемов "день в день".',
    solution: 'Благодаря напоминаниям сократили отмены "день в день".',
    result: 'Прогноз доп. выручки за год и возврат части базы.',
    kpis: [
      { label: 'Потенциальная выручка/год', value: '+2,6 млн ₽' },
      { label: 'Вернувшиеся пациенты', value: '+126' },
      { label: 'Доходимость', value: '+5–7%' },
    ],
  },
  {
    title: 'Юсиф Акберов, гендиректор "Имплант 52"',
    clients: '27 000 пациентов в базе',
    task: 'Вернуть "потерянных" пациентов.',
    solution: 'Фокус на повторных пациентах — вернули "потеряшек".',
    result: 'Рост выручки и подтверждённых покупок в тестовый период.',
    kpis: [
      { label: 'Доп. выручка', value: '+1,7 млн ₽' },
      { label: 'Покупки', value: '+73' },
      { label: 'Отзывы (рост)', value: '×3–4' },
    ],
  },
  {
    title: 'Ирина Лалаян, старший администратор',
    clients: '11 000 пациентов в базе',
    task: 'Экономия рабочего времени администраторов.',
    solution: 'Отказ от ручных SMS — экономия 20–40% рабочего времени администраторов.',
    result: 'Рост визитов за первую неделю и доп. доход в месяц.',
    kpis: [
      { label: 'Доход за месяц', value: '+56 000 ₽' },
      { label: 'Визиты (1 неделя)', value: '+12' },
      { label: 'Снижение no‑show', value: '−6%' },
    ],
  },
  {
    title: 'Борис Геберович, гендиректор "Super Смайл"',
    clients: '15 000 пациентов в базе',
    task: 'Регулярный возврат пациентов.',
    solution: 'Напоминания, NPS и сбор отзывов + автоматизация базы — регулярный возврат пациентов.',
    result: 'Увеличение повторных визитов и лояльности пациентов.',
    kpis: [
      { label: 'Доход за месяц', value: '+78 000 ₽' },
      { label: 'Повторные визиты', value: '+45' },
      { label: 'Рост отзывов', value: '+25%' },
    ],
  },
];

export default function CasesSection() {
  return (
    <section aria-labelledby="cases-title" className="cases">
      <div className="header">
        <h2 id="cases-title">Кейсы клиентов</h2>
        <p className="subtitle">
          Задача <span className="orange-arrow">→</span> Решение <span className="orange-arrow">→</span> Результат. Только цифры и факты.
        </p>
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
