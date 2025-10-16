import React from 'react';
import { CalculatorState } from '../types';
import { track } from '../utils/analytics';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

// Usage example for the new SummaryDetailsPanel integration:
//
// The SummaryDetailsPanel is now integrated into StickyCalculation component
// and automatically displays level details when a marketing level is selected.
//
// Example usage in any component:
//
// import StickyCalculation from './StickyCalculation';
// import { getLevelDetails } from '../lib/levelDetails';
// import LevelDetailsContent from './LevelDetailsContent';
//
// const MyComponent = () => {
//   const levelData = getLevelDetails('Expert'); // returns LevelDetails or null
//
//   return (
//     <StickyCalculation
//       state={calculatorState} // Your calculator state
//       onRequestQuote={handleQuote} // Your quote handler
//       // The details panel is automatically integrated and shows level details
//     />
//   );
// };
//
// The panel smoothly expands with max-height animations and visually
// slides from under the totals card using z-index layering.

// Удаляем неиспользуемый компонент Tooltip

interface CalculatorParamsProps {
  state: CalculatorState;
  onParamChange: (param: keyof CalculatorState, value: any) => void;
}

const CalculatorParams: React.FC<CalculatorParamsProps> = ({
  state,
  onParamChange,
}) => {
  // Константы для филиалов
  const BRANCHES_MIN = 1;
  const BRANCHES_MAX = 5;
  const BRANCHES_STEP = 1;

  // Константы для WhatsApp
  const WHATSAPP_MIN = 0;
  const WHATSAPP_MAX = 10;
  const WHATSAPP_STEP = 1;

  // Форматирование для русской локали
  const formatRu = (n: number) => new Intl.NumberFormat('ru-RU').format(n);

  // Правильное склонение «филиал/филиала/филиалов»
  const pluralizeFilial = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'филиал';
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14))
      return 'филиала';
    return 'филиалов';
  };

  // Унифицированная функция для радиокнопок техподдержки
  const handleSupportChange = (value: string) => {
    onParamChange('techSupport', value);
    track('ui_select_support', { value });
    // Убираем активный класс у всех и добавляем к текущему
    document
      .querySelectorAll('.support-radio')
      .forEach(l => l.classList.remove('active'));
    document
      .querySelector(`.support-radio:has(input[value="${value}"])`)
      ?.classList.add('active');
  };

  // Обработчики для филиалов
  const handleBranchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      BRANCHES_MIN,
      Math.min(BRANCHES_MAX, Math.round(Number(e.target.value)))
    );

    // Заливка отключена - только пересчет тарифа

    onParamChange('branches', value);
    track('ui_select_branches', { branches: value });
  };

  const handleBranchesConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      BRANCHES_MIN,
      Math.min(BRANCHES_MAX, Math.round(Number(e.target.value)))
    );

    // Заливка отключена - только пересчет тарифа

    onParamChange('branches', value);
    track('ui_select_branches', { branches: value });
  };

  // Обработчики для WhatsApp
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      WHATSAPP_MIN,
      Math.min(WHATSAPP_MAX, Math.round(Number(e.target.value)))
    );

    // Заливка отключена - только пересчет тарифа

    onParamChange('whatsappNumbers', value);
    track('ui_change_whatsapp', { count: value });
  };

  const handleWhatsAppConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      WHATSAPP_MIN,
      Math.min(WHATSAPP_MAX, Math.round(Number(e.target.value)))
    );

    // Заливка отключена - только пересчет тарифа

    onParamChange('whatsappNumbers', value);
    track('ui_change_whatsapp', { count: value });
  };

  return (
    <section className="extra-section py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center gap-2">
          <p className="mm-section-subtitle">Дополнительные параметры</p>
          <Tooltip content="Дополнительные параметры влияют на итоговую стоимость. Филиалы увеличивают цену, WhatsApp номера добавляют стоимость за каждый номер, техподдержка влияет на качество обслуживания.">
            <InfoIcon />
          </Tooltip>
        </div>

        <div className="extra-row-3">
          {/* Количество филиалов */}
          <div className="extra-col branches">
            <div className="flex items-center gap-2">
              <div
                className="section-title"
                style={{
                  color: '#1A1A1A',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                Количество филиалов
              </div>
              <Tooltip content="Количество филиалов вашей клиники. Каждый дополнительный филиал увеличивает стоимость тарифа.">
                <InfoIcon className="w-3 h-3" />
              </Tooltip>
            </div>
            <div className="slider-wrap">
              <input
                type="range"
                id="branchesRange"
                min={BRANCHES_MIN}
                max={BRANCHES_MAX}
                step={BRANCHES_STEP}
                value={state.branches}
                onChange={handleBranchesChange}
                onMouseUp={() =>
                  handleBranchesConfirm(
                    {} as React.ChangeEvent<HTMLInputElement>
                  )
                }
                onTouchEnd={() =>
                  handleBranchesConfirm(
                    {} as React.ChangeEvent<HTMLInputElement>
                  )
                }
                className="w-full"
              />
            </div>
            <div
              className="range-value"
              id="branchesLabel"
              style={{ color: '#1A1A1A' }}
            >
              <span className="text">
                {formatRu(state.branches)} {pluralizeFilial(state.branches)}
              </span>
              {state.branches === 2 && (
                <span className="discount"> — Скидка 5%</span>
              )}
              {state.branches >= 3 && state.branches <= 4 && (
                <span className="discount"> — Скидка 10%</span>
              )}
              {state.branches >= 5 && (
                <span className="discount"> — Скидка 15%</span>
              )}
            </div>
          </div>

          {/* Дополнительные номера WhatsApp */}
          <div className="extra-col whatsapp">
            <div className="flex items-center gap-2">
              <div
                className="section-title"
                style={{
                  color: '#1A1A1A',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                Дополнительные номера WhatsApp
              </div>
              <Tooltip content="Количество дополнительных WhatsApp номеров для рассылок. Каждый номер добавляет 500₽/мес к стоимости.">
                <InfoIcon className="w-3 h-3" />
              </Tooltip>
            </div>
            <div className="slider-wrap">
              <input
                type="range"
                id="waRange"
                min={WHATSAPP_MIN}
                max={WHATSAPP_MAX}
                step={WHATSAPP_STEP}
                value={state.whatsappNumbers}
                onChange={handleWhatsAppChange}
                onMouseUp={() =>
                  handleWhatsAppConfirm(
                    {} as React.ChangeEvent<HTMLInputElement>
                  )
                }
                onTouchEnd={() =>
                  handleWhatsAppConfirm(
                    {} as React.ChangeEvent<HTMLInputElement>
                  )
                }
                className="w-full"
              />
            </div>
            <div
              className="range-value"
              id="waLabel"
              style={{ color: '#1A1A1A' }}
            >
              Номеров: {state.whatsappNumbers} • +1 500 ₽/мес за доп. номер
            </div>
          </div>

          {/* Техподдержка (радиокнопки) */}
          <div className="extra-col support">
            <div className="flex items-center gap-2">
              <div
                className="section-title"
                style={{
                  color: '#1A1A1A',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                Техподдержка
              </div>
              <Tooltip content="Уровень техподдержки влияет на время отклика и доступность. 'Будни' - поддержка в рабочие дни, 'Каждый день' - круглосуточная поддержка с SLA.">
                <InfoIcon className="w-3 h-3" />
              </Tooltip>
            </div>
            <div className="support-block">
              <div className="support-row">
                <button
                  className={`support-pill ${state.techSupport === 'weekdays' ? 'active' : ''}`}
                  data-value="weekdays"
                  onClick={() => handleSupportChange('weekdays')}
                >
                  Будни
                </button>
                <button
                  className={`support-pill ${state.techSupport === 'daily' ? 'active' : ''}`}
                  data-value="daily"
                  onClick={() => handleSupportChange('daily')}
                >
                  Каждый день
                </button>
              </div>
              {state.techSupport && (
                <div className="support-note">
                  Пн–Пт 9:00–18:00 • включено. «Каждый день» — SLA и мониторинг
                  24/7.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorParams;
