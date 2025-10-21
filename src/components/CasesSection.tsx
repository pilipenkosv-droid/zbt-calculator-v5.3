// import React from 'react';
import './CasesSection.css';

type CaseItem = {
  name: string;
  position: string;
  clinic: string;
  clients: string;
  task: string;
  solution: string;
  result: string;
  photo?: string;
  kpis: { label: string; value: string }[];
};

const cases: CaseItem[] = [
  {
    name: 'Любовь Гацура',
    position: 'главный врач',
    clinic: 'Love Dent',
    clients: '10 000 пациентов в базе',
    task: 'Сократить отмены приемов "день в день".',
    solution: 'Благодаря напоминаниям сократили отмены "день в день".',
    result: 'Прогноз доп. выручки за год и возврат части базы.',
    photo: '/clients photo/Любовь Гацура.webp',
    kpis: [
      { label: 'Потенциальная выручка/год', value: '+2,6 млн ₽' },
      { label: 'Вернувшиеся пациенты', value: '+126' },
      { label: 'Доходимость', value: '+5–7%' },
    ],
  },
  {
    name: 'Юсиф Акберов',
    position: 'гендиректор',
    clinic: 'Имплант 52',
    clients: '27 000 пациентов в базе',
    task: 'Вернуть "потерянных" пациентов.',
    solution: 'Фокус на повторных пациентах — вернули "потеряшек".',
    result: 'Рост выручки и подтверждённых покупок в тестовый период.',
    photo: '/clients photo/Юсиф Акберов.webp',
    kpis: [
      { label: 'Доп. выручка', value: '+1,7 млн ₽' },
      { label: 'Покупки', value: '+73' },
      { label: 'Отзывы (рост)', value: '×3–4' },
    ],
  },
  {
    name: 'Ирина Лалаян',
    position: 'Старший администратор',
    clinic: '"Стоматология доктора Мансурского"',
    clients: '11 000 пациентов в базе',
    task: 'Экономия рабочего времени администраторов.',
    solution: 'Отказ от ручных SMS — экономия 20–40% рабочего времени администраторов.',
    result: 'Рост визитов за первую неделю и доп. доход в месяц.',
    photo: '/clients photo/Ирина Лалаян.webp',
    kpis: [
      { label: 'Доход за месяц', value: '+56 000 ₽' },
      { label: 'Визиты (1 неделя)', value: '+12' },
      { label: 'Снижение no‑show', value: '−6%' },
    ],
  },
  {
    name: 'Борис Геберович',
    position: 'гендиректор',
    clinic: 'Super Смайл',
    clients: '15 000 пациентов в базе',
    task: 'Регулярный возврат пациентов.',
    solution: 'Напоминания, NPS и сбор отзывов + автоматизация базы — регулярный возврат пациентов.',
    result: 'Увеличение повторных визитов и лояльности пациентов.',
    photo: '/clients photo/Борис Геберович.webp',
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
          Задача <span className="orange-arrow">→</span> Решение <span className="orange-arrow">→</span> Результат
        </p>
      </div>

      <div className="grid">
        {cases.map((c, idx) => (
          <article key={idx} className="card" aria-label={`${c.name}, ${c.position}, ${c.clinic}`}>
            <header className="card-header">
              {c.photo && (
                <div className="client-photo">
                  <img src={c.photo} alt={c.name} />
                </div>
              )}
              <div className="card-header-text">
                <h3 className="card-title">
                  <div className="client-name">{c.name}</div>
                  <div className="client-position">{c.position}</div>
                  <div className="client-clinic">{c.clinic}</div>
                </h3>
                <p className="card-meta">{c.clients}</p>
              </div>
            </header>
            <div className="card-body">
              <div className="case-item">
                <strong>Задача:</strong>
                <p>{c.task}</p>
              </div>
              <div className="case-item">
                <strong>Решение:</strong>
                <p>{c.solution}</p>
              </div>
              <div className="case-item">
                <strong>Результат:</strong>
                <p>{c.result}</p>
              </div>
              {/* <ul className="kpis" aria-label="Ключевые метрики">
                {c.kpis.map((k, i) => (
                  <li key={i} className="kpi">
                    <span className="kpi-label">{k.label}</span>
                    <span className="kpi-value">{k.value}</span>
                  </li>
                ))}
              </ul> */}
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
