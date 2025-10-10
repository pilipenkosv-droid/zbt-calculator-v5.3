import React from 'react';
import { CalculatorState } from '../types';
import { calculatePrice } from '../lib/pricing';
import { formatPrice } from '../utils/formatCurrency';
import EmailModal from './EmailModal';

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
  const priceBreakdown = calculatePrice(state);
  const discountPercent = Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount);

  const discountRub = priceBreakdown.beforeDiscount - priceBreakdown.total;

  const formatLevelName = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const hasDiscount = discountPercent > 0;

  return (
    <div className="relative w-full">
      {/* Totals card */}
      <div className={`relative rounded-xl border px-4 py-3 shadow-xl backdrop-saturate-125 backdrop-blur-md dark:bg-slate-900/70 dark:shadow-black/30 ${
        hasDiscount 
          ? 'border-green-400/40 bg-white/70 dark:border-green-400/30' 
          : 'border-black/10 bg-white/70 dark:border-white/10'
      }`}>
        {/* Стоимость сверху с увеличенным размером */}
        <div className="mb-2 text-[26px] font-bold text-slate-900 dark:text-white">
          {formatPrice(priceBreakdown.monthlyPerBranch)}/мес
        </div>
        
        {/* Скидка в мягком зеленом или сером если нет скидки */}
        <div className={`mb-2 text-[15px] font-semibold ${discountPercent > 0 ? 'discount-text-green' : 'text-gray-500 dark:text-gray-400'}`}>
          С учетом скидки –{discountPercent}%
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
          <span>Ваша скидка составила: {formatPrice(discountRub)}</span>
          <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />
          <span>Итого за период в {state.period} мес: {formatPrice(priceBreakdown.total)}</span>
        </div>

        {/* Разложение цены - компактный breakdown */}
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
        </div>

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