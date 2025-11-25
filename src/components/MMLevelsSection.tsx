import React, { useEffect, useRef } from 'react';
import { formatPrice } from '../utils/formatCurrency';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';
import {
  DocumentIcon,
  QuestionIcon,
  ChartIcon,
  RocketIcon,
  LightbulbIcon,
  TrendingUpIcon,
  LightningIcon,
  TargetIcon,
  SearchIcon,
  StarIcon,
  PresentationIcon,
  UserIcon,
  BuildingIcon,
  WrenchIcon,
} from './MMIcons';

export type MMLevelId = 'base' | 'advanced' | 'premium' | 'expert';

interface MMLevelsSectionProps {
  selected: MMLevelId;
  onLevelChange: (level: MMLevelId) => void;
}

const levels = [
  {
    id: 'base' as MMLevelId,
    name: 'Эконом',
    price: 9900,
    features: [
      { icon: DocumentIcon, text: 'Базовое сопровождение' },
      { icon: QuestionIcon, text: 'Помощь по запросу' },
      { icon: ChartIcon, text: 'Ежемесячный отчет' },
    ],
  },
  {
    id: 'advanced' as MMLevelId,
    name: 'Актив',
    price: 29900,
    isRecommended: true,
    features: [
      { icon: RocketIcon, text: 'Расширенное сопровождение' },
      { icon: LightbulbIcon, text: 'Персональные рекомендации' },
      { icon: TrendingUpIcon, text: 'Ежемесячная аналитика' },
      { icon: LightningIcon, text: 'Быстрый запуск' },
    ],
  },
  {
    id: 'premium' as MMLevelId,
    name: 'Стандарт',
    price: 59900,
    features: [
      { icon: TargetIcon, text: 'Индивидуальное сопровождение' },
      { icon: SearchIcon, text: 'Регулярный аудит' },
      { icon: DocumentIcon, text: 'План развития' },
      { icon: StarIcon, text: 'Приоритет задач' },
    ],
  },
  {
    id: 'expert' as MMLevelId,
    name: 'Эксперт',
    price: 119900,
    features: [
      { icon: PresentationIcon, text: 'Стратегические сессии' },
      { icon: UserIcon, text: 'Персональный менеджер' },
      { icon: BuildingIcon, text: 'Для сетей и 100k+ базы' },
      { icon: WrenchIcon, text: 'Расширенная поддержка' },
    ],
  },
];

const levelTooltips: Record<MMLevelId, string> = {
  base: [
    'Улучшаем показатели:',
    '- Доходимость: меньше отмен «день в день», онлайн‑подтверждение визита в 1 клик.',
    '- Долечиваемость: напоминания о продолжении лечения, контрольные визиты, гигиена.',
    '- Лояльность: поздравления с днём рождения и праздниками, благодарности после визита.',
  ].join('\n\n'),
  advanced: [
    'Все что в "Эконом" и плюс:',
    '- Реактивация «спящих»: возврат пациентов дешевле привлечения первичных.',
    '- Точечные офферы: RFM‑сегментация → персональные предложения по услугам.',
    '- Рост повторных покупок: профилактика, контрольные визиты, компоновка пакетов.',
    '- Репутация: сбор NPS/отзывов и перехват негатива до публикации.',
  ].join('\n\n'),
  premium: [
    'Все что в "Эконом", "Актив" и плюс:',
    '- Замена внутреннего маркетолога: закрываем задачи по действующей базе.',
    '- План роста: квартальный план, регулярный аудит, A/B‑эксперименты.',
    '- Глубокая сегментация: семьи, частота, чеки, циклы лечения → кампании.',
    '- Виральность: реферальные механики и кампании рекомендаций.',
    '- Ежемесячная аналитика, цели/метрики.',
  ].join('\n\n'),
  expert: [
    'Все что в "Эконом", "Актив", "Стандарт" и плюс:',
    '- Стратегия: сессии с командой, роадмап на квартал/год.',
    '- Для сетей и 100k+: единые стандарты и локальные сценарии по филиалам.',
    '- Персональная команда: выделенный менеджер и мед‑маркетолог, приоритет задач.',
    '- Масштабирование: кастомные интеграции и поддержка сложных процессов.',
    '- Максимальный эффект: ускоренный апсейл, удержание и возврат по всем сегментам.',
  ].join('\n\n'),
};

const MMLevelsSection: React.FC<MMLevelsSectionProps> = ({ selected, onLevelChange }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<MMLevelId, HTMLDivElement | null>>({
    base: null,
    advanced: null,
    premium: null,
    expert: null,
  });

  // Автоматическая прокрутка к выбранной карточке на мобильных устройствах
  useEffect(() => {
    const selectedCard = cardRefs.current[selected];
    if (selectedCard && gridRef.current) {
      // Проверяем, что это мобильная версия (горизонтальный скролл)
      const isMobile = window.innerWidth <= 640;
      if (isMobile) {
        // Небольшая задержка для завершения рендеринга
        const timeoutId = setTimeout(() => {
          selectedCard.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [selected]);

  // Прокрутка при первом появлении компонента на экране (при скролле к калькулятору)
  useEffect(() => {
    const selectedCard = cardRefs.current[selected];
    if (selectedCard && gridRef.current) {
      const isMobile = window.innerWidth <= 640;
      if (isMobile) {
        // Используем Intersection Observer для отслеживания видимости компонента
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                // Компонент стал видимым, прокручиваем к выбранной карточке
                setTimeout(() => {
                  selectedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                  });
                }, 200);
                // Отключаем observer после первого срабатывания
                observer.disconnect();
              }
            });
          },
          {
            threshold: 0.1, // Срабатывает когда 10% компонента видно
            rootMargin: '0px',
          }
        );

        observer.observe(gridRef.current);

        return () => {
          observer.disconnect();
        };
      }
    }
  }, [selected]);

  return (
    <div ref={gridRef} className="mm-grid px-4 py-6">
          {levels.map((level) => (
            <div
              key={level.id}
              ref={(el) => {
                cardRefs.current[level.id] = el;
              }}
              onClick={() => onLevelChange(level.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onLevelChange(level.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Выбрать уровень ${level.name} за ${formatPrice(level.price)} в месяц`}
              className={`glass mm-card relative ${selected === level.id ? 'selected' : ''} ${
                level.id === 'advanced' ? 'advanced' : ''
              } ${level.id === 'premium' ? 'premium' : ''} ${level.id === 'expert' ? 'expert' : ''} ${
                selected === level.id ? 'rounded-b-none' : ''
              }`}
            >
              <div className="mm-card-tooltip absolute top-4 right-4">
                <Tooltip content={levelTooltips[level.id]} position="left">
                  <button
                    type="button"
                    className="rounded-full border border-white/50 bg-white/60 p-1.5 text-slate-600 hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <InfoIcon className="w-3 h-3" />
                  </button>
                </Tooltip>
              </div>
              <div className="mm-card-header">
                <div
                  className={`mm-title ${
                    level.id === 'premium' ? 'gradient-premium' : ''
                  } ${level.id === 'expert' ? 'metal' : ''}`}
                  data-text={level.name}
                >
                  {level.name}
                </div>
                <div className="mm-price">{formatPrice(level.price)}</div>
                <div className="mm-price-sub">в мес</div>
              </div>

              <div className="mm-card-body">
                <ul className="mm-list">
                  {level.features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
    </div>
  );
};

export default MMLevelsSection;