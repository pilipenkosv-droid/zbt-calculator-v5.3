import React from 'react';
import { CalculatorState } from '../types';
import { formatPrice } from '../utils/formatCurrency';
import { track } from '../utils/analytics';
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
  WrenchIcon 
} from './MMIcons';

// interface TooltipProps {
//   content: string;
//   children: React.ReactNode;
// }

// const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
//   return (
//     <div className="relative group">
//       {children}
//       <div className="tooltip">
//         <div className="tooltip-text">{content}</div>
//       </div>
//     </div>
//   );
// };

interface MMLevelsSectionProps {
  state: CalculatorState;
  onLevelChange: (level: string) => void;
}

const MMLevelsSection: React.FC<MMLevelsSectionProps> = ({ state, onLevelChange }) => {
  const levels = [
    {
      id: 'base',
      name: 'Base',
      price: 9900,
      features: [
        { icon: DocumentIcon, text: 'Базовые сценарии' },
        { icon: QuestionIcon, text: 'Помощь по запросу' },
        { icon: ChartIcon, text: 'Отчёты раз в квартал' }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced',
      price: 29900,
      isRecommended: true,
      features: [
        { icon: RocketIcon, text: 'Расширенные сценарии' },
        { icon: LightbulbIcon, text: 'Персональные рекомендации' },
        { icon: TrendingUpIcon, text: 'Ежемесячная аналитика' },
        { icon: LightningIcon, text: 'Быстрый запуск' }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 59900,
      features: [
        { icon: TargetIcon, text: 'Максимум сценариев' },
        { icon: SearchIcon, text: 'Регулярный аудит' },
        { icon: DocumentIcon, text: 'План развития' },
        { icon: StarIcon, text: 'Приоритет задач' }
      ]
    },
    {
      id: 'expert',
      name: 'Expert',
      price: 119900,
      features: [
        { icon: PresentationIcon, text: 'Стратегические сессии' },
        { icon: UserIcon, text: 'Персональный менеджер' },
        { icon: BuildingIcon, text: 'Для сетей и 100k+ базы' },
        { icon: WrenchIcon, text: 'Расширенная поддержка' }
      ]
    }
  ];

  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <p className="mm-section-subtitle">Выберите уровень поддержки медицинского маркетинга</p>
        </div>
        <div className="mm-grid">
          {levels.map((level) => (
            <div
              key={level.id}
              onClick={() => {
                onLevelChange(level.id);
                track('ui_select_mm_level', { level: level.id });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onLevelChange(level.id);
                  track('ui_select_mm_level', { level: level.id });
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Выбрать уровень ${level.name} за ${formatPrice(level.price)} в месяц`}
              className={`glass mm-card ${
                state.marketingLevel === level.id ? 'selected' : ''
              } ${level.id === 'advanced' ? 'advanced' : ''} ${level.id === 'expert' ? 'expert' : ''}`}
            >
              {/* Заголовок и цена */}
              <div className="mm-card-header">
                <div 
                  className={`mm-title ${level.id === 'premium' ? 'gradient-premium' : ''} ${level.id === 'expert' ? 'metal' : ''}`}
                  data-text={level.name}
                >
                  {level.name}
                  {/* Пасхалка "Рекомендуем" - зеленая точка с тултипом */}
                  {level.isRecommended && (
                    <div className="mm-easter-egg" title="Рекомендуем">
                      <div className="mm-dot"></div>
                      <div className="mm-easter-tooltip">Рекомендуем</div>
                    </div>
                  )}
                  {level.id === 'premium' && 
                    (() => {
                      track('ui_premium_gradient_applied', { method: 'two-layer', overlay: true });
                      return null;
                    })()
                  }
                </div>
                <div className="mm-price">{formatPrice(level.price)}</div>
                <div className="mm-price-sub">в мес</div>
              </div>
              
              {/* Список возможностей */}
              <div className="mm-card-body">
                <ul className="mm-list">
                  {level.features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <li key={index} className="flex items-start gap-2">
                        <IconComponent className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MMLevelsSection;
