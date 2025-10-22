import React from 'react';
import { formatPrice } from '../utils/formatCurrency';
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
    name: 'Base',
    price: 9900,
    features: [
      { icon: DocumentIcon, text: 'Базовые сценарии' },
      { icon: QuestionIcon, text: 'Помощь по запросу' },
      { icon: ChartIcon, text: 'Ежемесячный отчет' },
    ],
  },
  {
    id: 'advanced' as MMLevelId,
    name: 'Advanced',
    price: 29900,
    isRecommended: true,
    features: [
      { icon: RocketIcon, text: 'Расширенные сценарии' },
      { icon: LightbulbIcon, text: 'Персональные рекомендации' },
      { icon: TrendingUpIcon, text: 'Ежемесячная аналитика' },
      { icon: LightningIcon, text: 'Быстрый запуск' },
    ],
  },
  {
    id: 'premium' as MMLevelId,
    name: 'Premium',
    price: 59900,
    features: [
      { icon: TargetIcon, text: 'Максимум сценариев' },
      { icon: SearchIcon, text: 'Регулярный аудит' },
      { icon: DocumentIcon, text: 'План развития' },
      { icon: StarIcon, text: 'Приоритет задач' },
    ],
  },
  {
    id: 'expert' as MMLevelId,
    name: 'Expert',
    price: 119900,
    features: [
      { icon: PresentationIcon, text: 'Стратегические сессии' },
      { icon: UserIcon, text: 'Персональный менеджер' },
      { icon: BuildingIcon, text: 'Для сетей и 100k+ базы' },
      { icon: WrenchIcon, text: 'Расширенная поддержка' },
    ],
  },
];

const MMLevelsSection: React.FC<MMLevelsSectionProps> = ({ selected, onLevelChange }) => {
  return (
    <div className="mm-grid px-4 py-6">
          {levels.map((level) => (
            <div
              key={level.id}
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
              className={`glass mm-card ${selected === level.id ? 'selected' : ''} ${
                level.id === 'advanced' ? 'advanced' : ''
              } ${level.id === 'premium' ? 'premium' : ''} ${level.id === 'expert' ? 'expert' : ''} ${
                selected === level.id ? 'rounded-b-none' : ''
              }`}
            >
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