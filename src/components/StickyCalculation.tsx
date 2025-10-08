import React from 'react';
import { CalculatorState } from '../types';
import { calculatePrice } from '../lib/pricing';
import { formatPrice } from '../utils/formatCurrency';
import { track } from '../utils/analytics';
import EmailModal from './EmailModal';
// ApplyModal импортируется в App.tsx

interface StickyCalculationProps {
  state: CalculatorState;
  onParamChange: (param: keyof CalculatorState, value: any) => void;
  onSubmit: () => void;
  onSavePDF: () => void;
  onRequestQuote: (payload: any) => void;
}

const StickyCalculation: React.FC<StickyCalculationProps> = ({
  state,
  onParamChange,
  onSubmit,
  onSavePDF,
  onRequestQuote
}) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  // Модаль управляется в App.tsx
  const priceBreakdown = calculatePrice(state);
  const discountPercent = Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount);
  
  // Расчет скидки в рублях
  const discountRub = priceBreakdown.beforeDiscount - priceBreakdown.total;

  return (
    <div className={`calc-card ${discountRub > 0 ? 'has-discount' : ''}`}>
      <div className="calc-title">Ваш расчет готов!</div>
      
      {/* Подпись скидки в процентах - над основной ценой */}
      {discountPercent > 0 && (
        <div className="calc-discount-percent">
          С учетом скидки –{discountPercent}%
        </div>
      )}
      
      {/* В месяц на один филиал - главный акцент */}
      <div className="calc-monthly">
        {formatPrice(priceBreakdown.monthlyPerBranch)}
        <span className="calc-monthly-suffix">в мес</span>
      </div>
      
      {/* Скидка в рублях */}
      {discountRub > 0 && (
        <div className="calc-discount-rub">
          Ваша скидка составила: –{formatPrice(discountRub)}
        </div>
      )}
      
      {/* Итого за период - второстепенный акцент */}
      <div className="calc-total">
        Итого за период: {formatPrice(priceBreakdown.total)}
      </div>
        
      {/* Разложение цены - компактный breakdown */}
      <div className="calc-breakdown">
        <div className="label">Поддержка ММ</div>
        <div className="value">{formatPrice(Math.max(0, priceBreakdown.marketing))}</div>
        <div className="label">База пациентов</div>
        <div className="value">{formatPrice(Math.max(0, priceBreakdown.patientBase))}</div>
        <div className="label">Филиалы</div>
        <div className="value">{priceBreakdown.branches} шт.</div>
        <div className="label">WhatsApp номера</div>
        <div className="value">{formatPrice(Math.max(0, priceBreakdown.whatsapp))}</div>
        <div className="label">Техподдержка</div>
        <div className="value">{formatPrice(Math.max(0, priceBreakdown.techSupport))}</div>
      </div>
      
          {/* Мини-заметка */}
          <div className="calc-mini-note">
            До скидки: {formatPrice(priceBreakdown.beforeDiscount / state.period / state.branches)}/мес за филиал<br />
            Период: {state.period} мес
          </div>
      
      {/* CTA кнопки - только основная */}
      <div className="calc-actions">
        <button
          onClick={() => {
            // Открываем модаль через глобальное событие
            window.dispatchEvent(new CustomEvent('openApplyModal'));
          }}
          className="btn-primary"
        >
          Отправить заявку
        </button>
        {/* Временно скрытые кнопки */}
        <button className="btn-secondary hidden">
          PDF
        </button>
        <button className="btn-secondary hidden">
          КП на email
        </button>
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
            monthly: monthlyTotal,
            total: priceBreakdown.total,
            discountPercent: discountPercent
          };
          
          onRequestQuote(fullPayload);
        }}
      />

      {/* Apply Modal управляется в App.tsx */}
    </div>
  );
};

export default StickyCalculation;
