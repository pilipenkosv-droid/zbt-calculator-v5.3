import React from 'react';
import { CalculatorState } from '../types';
import { calculatePrice } from '../lib/pricing';
import { formatPrice } from '../utils/formatCurrency';
import EmailModal from './EmailModal';
// import DoubleTicks from './DoubleTicks'; // временно отключено

interface StickyCalculationProps {
  state: CalculatorState;
  onParamChange?: (param: keyof CalculatorState, value: any) => void;
  onSubmit?: () => void;
  onSavePDF?: () => void;
  onRequestQuote: (payload: any) => void;
}

const StickyCalculation: React.FC<StickyCalculationProps> = ({
  state,
  onRequestQuote
}) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const priceBreakdown = calculatePrice(state);
  const rawDiscountPercent = priceBreakdown.periodDiscount + priceBreakdown.networkDiscount;
  const totalDiscountPercent = Math.min(25, rawDiscountPercent);
  const discountPercent = Math.round(totalDiscountPercent);

  const discountRub = priceBreakdown.beforeDiscount - priceBreakdown.total;

  const formatLevelName = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const hasDiscount = rawDiscountPercent > 0;

  return (
    <div className="relative w-full">
      {/* Totals card */}
      <div 
        id="summary-block"
        className={`relative rounded-xl border border-black/10 bg-white/70 px-4 py-3 shadow-xl backdrop-saturate-125 backdrop-blur-md ${
          hasDiscount ? 'discount-glow-green' : ''
        }`}
      >
        {/* Double Ticks Indicator - временно отключено */}
        {/* <DoubleTicks 
          calculatorSelector="#calculator" 
          attachToSelector="#summary-block" 
        /> */}
        {/* Стоимость сверху с увеличенным размером */}
        <div className="mb-2 text-[39px] font-bold text-slate-900">
          {formatPrice(priceBreakdown.monthlyPerBranch)}/мес
        </div>
        
        {/* Скидка в мягком зеленом или сером если нет скидки */}
        <div className={`mb-2 text-[23px] font-semibold ${discountPercent > 0 ? 'discount-text-green' : 'text-gray-500'}`}>
          С учетом скидки –{discountPercent}%
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-[20px] text-slate-700">
          <span>Ваша скидка составила: {formatPrice(discountRub)}</span>
          <span>Итого за {state.period} мес: {formatPrice(priceBreakdown.total)}</span>
        </div>
        <div className="mt-1 text-[18px] text-slate-700">
          Стоимость внедрения: {formatPrice(priceBreakdown.implementation)}
        </div>

        {/* Сворачиваемые "Показать детали" */}
        <div className="calc-breakdown-header">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-left hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          >
            <span className="text-[11px] font-medium text-gray-700">
              {showDetails ? 'Свернуть детали' : 'Показать детали'}
            </span>
            <span className={`text-[11px] transition-transform ${showDetails ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {showDetails && (
          <div className="calc-breakdown">
            <div className="label">Поддержка ММ ({formatLevelName(state.marketingLevel)})</div>
            <div className="value">{formatPrice(Math.max(0, priceBreakdown.marketing))}</div>
            <div className="label">База пациентов</div>
            <div className="value">{formatPrice(Math.max(0, priceBreakdown.patientBase))}</div>
            <div className="label">Филиалы</div>
            <div className="value">{priceBreakdown.branches} шт.</div>
            <div className="label">WhatsApp номера</div>
            <div className="value">{state.whatsappNumbers + 1} номер{state.whatsappNumbers === 0 ? '' : state.whatsappNumbers === 1 ? 'а' : 'ов'} - {formatPrice(Math.max(0, priceBreakdown.whatsapp))}</div>
            <div className="label">Техподдержка</div>
            <div className="value">{formatPrice(Math.max(0, priceBreakdown.techSupport))}</div>
            <div className="label">Стоимость внедрения</div>
            <div className="value">{formatPrice(Math.max(0, priceBreakdown.implementation))}</div>
          </div>
        )}

        {/* Мини-заметка */}
        <div className="calc-mini-note flex justify-between items-center">
          <span>До скидки:</span>
          <span>{formatPrice(priceBreakdown.beforeDiscount / state.period / state.branches)}/мес за филиал</span>
        </div>

        {/* CTA кнопки - только основная */}
        <div className="calc-actions">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openApplyModal'));
            }}
            className="btn-primary w-full rounded-lg py-3"
          >
            Отправить заявку
          </button>
          <button className="btn-secondary hidden">PDF</button>
          <button className="btn-secondary hidden">КП на email</button>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={(payload) => {
          const fullPayload = {
            ...payload,
            params: {
              period: state.period,
              baseSize: state.patientBase,
              branches: state.branches,
              whatsapp: state.whatsappNumbers,
              mmLevel: state.marketingLevel,
              support: state.techSupport
            },
            breakdown: priceBreakdown,
            monthly: priceBreakdown.monthlyPerBranch,
            total: priceBreakdown.total,
            discountPercent: discountPercent
          };

          onRequestQuote(fullPayload);
        }}
      />
    </div>
  );
};

export default StickyCalculation;