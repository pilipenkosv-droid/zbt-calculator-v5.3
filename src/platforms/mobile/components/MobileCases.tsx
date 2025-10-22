import React, { useState, useRef, useEffect } from 'react';
import './MobileCases.css';
import { track } from '../../../utils/analytics';

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
    clinic: 'Стоматология доктора Мансурского',
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

/**
 * Мобильная карусель кейсов
 * Свайп-навигация, метрики в бейджах, формат "проблема → решение → результат"
 */
const MobileCases: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Минимальная дистанция свайпа
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart(touch.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchEnd(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < cases.length - 1) {
      goToSlide(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    const caseItem = cases[index];
    if (caseItem) {
      track('case_view', { 
        caseName: caseItem.name,
        caseIndex: index,
      });
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      const offset = -currentIndex * 100;
      carouselRef.current.style.transform = `translateX(${offset}%)`;
    }
  }, [currentIndex]);

  return (
    <section className="mobile-cases">
      <div className="container">
        <h2 className="mobile-cases__title">Кейсы клиентов</h2>
        <p className="mobile-cases__subtitle">
          Проблема <span className="mobile-cases__arrow">→</span> Решение <span className="mobile-cases__arrow">→</span> Результат
        </p>

        {/* Карусель */}
        <div className="mobile-cases__carousel-wrapper">
          <div
            ref={carouselRef}
            className="mobile-cases__carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {cases.map((caseItem, index) => (
              <div key={index} className="mobile-cases__slide">
                <div className="mobile-cases__card">
                  {/* Хедер с фото и инфо */}
                  <div className="mobile-cases__header">
                    {caseItem.photo && (
                      <div className="mobile-cases__photo">
                        <img src={caseItem.photo} alt={caseItem.name} loading="lazy" />
                      </div>
                    )}
                    <div className="mobile-cases__info">
                      <h3 className="mobile-cases__name">{caseItem.name}</h3>
                      <div className="mobile-cases__position">{caseItem.position}</div>
                      <div className="mobile-cases__clinic">{caseItem.clinic}</div>
                      <div className="mobile-cases__clients">{caseItem.clients}</div>
                    </div>
                  </div>

                  {/* Проблема */}
                  <div className="mobile-cases__section">
                    <div className="mobile-cases__label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 4v5m0 2h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Проблема
                    </div>
                    <p className="mobile-cases__text">{caseItem.task}</p>
                  </div>

                  {/* Решение */}
                  <div className="mobile-cases__section">
                    <div className="mobile-cases__label mobile-cases__label--solution">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Решение
                    </div>
                    <p className="mobile-cases__text">{caseItem.solution}</p>
                  </div>

                  {/* Результат */}
                  <div className="mobile-cases__section">
                    <div className="mobile-cases__label mobile-cases__label--result">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 9l3 3L14 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Результат
                    </div>
                    <p className="mobile-cases__text">{caseItem.result}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Индикаторы */}
        <div className="mobile-cases__indicators">
          {cases.map((_, index) => (
            <button
              key={index}
              className={`mobile-cases__indicator ${currentIndex === index ? 'mobile-cases__indicator--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к кейсу ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default MobileCases;

