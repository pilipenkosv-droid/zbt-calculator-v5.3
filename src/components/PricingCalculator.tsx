import React, { useState } from 'react';
import { CalculatorState } from '../types';
import { calculatePrice } from '../lib/pricing';
import { formatPrice } from '../utils/formatCurrency';
import { track, debouncedTrack } from '../utils/analytics';
import { normalizeCalculatorState, getCalculatorFlags } from '../utils/validation';
import { getActiveABTests } from '../utils/abTesting';
import { useFunnelTracking } from '../hooks/useFunnelTracking';
import EmailModal from './EmailModal';
import DebugStrip from './DebugStrip';
import TestCases from './TestCases';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="tooltip">
      {children}
      <span className="tooltiptext">{content}</span>
    </div>
  );
};

const PricingCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    period: 12,
    patientBase: 50000,
    branches: 1,
    whatsappNumbers: 0,
    marketingLevel: 'premium',
    techSupport: 'weekdays',
  });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const priceBreakdown = calculatePrice(state);
  const flags = getCalculatorFlags(state);
  const abTests = getActiveABTests();
  const funnel = useFunnelTracking();

  // Трекинг назначения A/B варианта
  React.useEffect(() => {
    track('ab_variant_assigned', { variant: abTests.periodTooltip });
  }, [abTests.periodTooltip]);

  const handleParamChange = (param: keyof CalculatorState, value: any) => {
    // Проверяем, изменилось ли значение
    if (state[param] === value) return;
    
    const newState = { ...state, [param]: value };
    const normalizedState = normalizeCalculatorState(newState);
    setState(normalizedState);
    
    const newPriceBreakdown = calculatePrice(normalizedState);
    const monthly = newPriceBreakdown.patientBase + newPriceBreakdown.branches + newPriceBreakdown.whatsapp + newPriceBreakdown.marketing + newPriceBreakdown.techSupport;
    const flags = getCalculatorFlags(normalizedState);
    
    // Трекинг воронки
    funnel.trackParamChange();
    
    // Дебаунс для calc_param_change
    debouncedTrack('calc_param_change', {
      period: normalizedState.period,
      baseSize: normalizedState.patientBase,
      branches: normalizedState.branches,
      whatsappNumbers: normalizedState.whatsappNumbers,
      mmLevel: normalizedState.marketingLevel,
      supportLevel: normalizedState.techSupport,
      monthly,
      breakdown: newPriceBreakdown,
      flags
    });
  };

  const handleSubmit = () => {
    const monthlyTotal = priceBreakdown.patientBase + priceBreakdown.branches + priceBreakdown.whatsapp + priceBreakdown.marketing + priceBreakdown.techSupport;
    const discountPercent = Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount);
    
    // Трекинг воронки
    funnel.trackSubmit();
    
    track('calc_submitted', {
      monthly: monthlyTotal,
      total: priceBreakdown.total,
      discountPercent,
      paramsSnapshot: {
        period: state.period,
        months: state.period,
        baseSize: state.patientBase,
        branches: state.branches,
        whatsappNumbers: state.whatsappNumbers,
        mmLevel: state.marketingLevel,
        supportLevel: state.techSupport
      },
      priceSnapshot: {
        monthly: monthlyTotal,
        total: priceBreakdown.total,
        discountPercent,
        breakdown: priceBreakdown
      }
    });
  };

  const handleSavePDF = () => {
    const monthlyTotal = priceBreakdown.patientBase + priceBreakdown.branches + priceBreakdown.whatsapp + priceBreakdown.marketing + priceBreakdown.techSupport;
    
    // Трекинг воронки
    funnel.trackPDFClick();
    
    track('calc_saved_pdf', {
      monthly: monthlyTotal,
      total: priceBreakdown.total
    });

    // Создаем HTML для печати
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #333; margin-bottom: 30px;">Расчёт тарифа Zabota 2.0</h1>
        
        <div style="margin-bottom: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #FF7A1A; padding-bottom: 10px;">Параметры</h2>
          <p><strong>Период:</strong> ${state.period} месяцев</p>
          <p><strong>База пациентов:</strong> ${state.patientBase.toLocaleString()}</p>
          <p><strong>Количество филиалов:</strong> ${state.branches}</p>
          <p><strong>Дополнительные номера WhatsApp:</strong> ${state.whatsappNumbers}</p>
          <p><strong>Уровень поддержки мед. маркетинга:</strong> ${state.marketingLevel}</p>
          <p><strong>Техподдержка:</strong> ${state.techSupport === 'daily' ? 'Каждый день' : 'В рабочие дни'}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #FF7A1A; padding-bottom: 10px;">Разложение цены</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Поддержка ММ:</span>
            <span>${formatPrice(priceBreakdown.marketing)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>База пациентов:</span>
            <span>${formatPrice(priceBreakdown.patientBase)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Филиалы:</span>
            <span>${formatPrice(priceBreakdown.branches)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>WhatsApp номера:</span>
            <span>${formatPrice(priceBreakdown.whatsapp)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Техподдержка:</span>
            <span>${formatPrice(priceBreakdown.techSupport)}</span>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #FF7A1A; padding-bottom: 10px;">Итоги</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 18px;">
            <span><strong>В месяц:</strong></span>
            <span><strong>${formatPrice(monthlyTotal)}</strong></span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 20px;">
            <span><strong>Итого за период:</strong></span>
            <span><strong>${formatPrice(priceBreakdown.total)}</strong></span>
          </div>
          <div style="text-align: right; color: #16C784; font-size: 14px;">
            С учетом скидки –${Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount)}%
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>Расчёт сгенерирован: ${new Date().toLocaleString('ru-RU')}</p>
          <p>Zabota 2.0 — Единая платформа для управления клиниками</p>
        </div>
      </div>
    `;

    // Создаем новое окно для печати
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Расчёт тарифа Zabota 2.0</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleRequestQuote = (payload: any) => {
    const monthlyTotal = priceBreakdown.patientBase + priceBreakdown.branches + priceBreakdown.whatsapp + priceBreakdown.marketing + priceBreakdown.techSupport;
    
    // Трекинг воронки
    funnel.trackEmailClick();
    
    track('calc_request_quote_email', {
      email: payload.email,
      monthly: monthlyTotal,
      total: priceBreakdown.total
    });
    
    // Показываем toast
    track('toast_show', { type: 'quote_email_success' });
    alert('КП отправим в ближайшее время');
  };

  return (
    <div className="glass-card p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Калькулятор тарифа</h2>
      
      {/* Период подписки */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">Период подписки</label>
          <Tooltip content={
            abTests.periodTooltip === 'B' 
              ? "Скидка применяется только к итогу за период. Сеть 2+ даёт ещё −5%."
              : "Скидка зависит от срока: 3 мес −5%, 6 мес −10%, 9 мес −15%, 12 мес −20%. Применяется только к итогу за период."
          }>
            <span 
              className="text-blue-400 cursor-help" 
              aria-label="Подсказка о периоде подписки" 
              role="button"
              onMouseEnter={() => track('tooltip_show', { field: 'period' })}
            >ⓘ</span>
          </Tooltip>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 3, 6, 9, 12].map(period => (
            <button
              key={period}
              onClick={() => handleParamChange('period', period)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                state.period === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {period}м
              {period > 1 && (
                <div className="text-xs text-green-400">
                  -{((period === 3 ? 5 : period === 6 ? 10 : period === 9 ? 15 : 20))}%
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* База пациентов */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">База пациентов</label>
          {flags.bigBase && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
              100k+ база
            </span>
          )}
          <Tooltip content="Размер базы влияет на объём сценариев и стоимость каналов. При 50 000+ включается контроль анти‑спам квот, при 100 000+ рекомендован уровень Expert.">
            <span 
              className="text-blue-400 cursor-help" 
              aria-label="Подсказка о базе пациентов" 
              role="button"
              onMouseEnter={() => track('tooltip_show', { field: 'patientBase' })}
            >ⓘ</span>
          </Tooltip>
        </div>
        {flags.bigBase && (
          <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-xs text-orange-400">
              💡 Рекомендуем Expert для 100k+ базы
            </p>
          </div>
        )}
        <div className="space-y-2">
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={state.patientBase}
            onChange={(e) => handleParamChange('patientBase', parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>1 000</span>
            <span className="font-medium">{state.patientBase.toLocaleString()}</span>
            <span>100 000+</span>
          </div>
        </div>
      </div>

      {/* Количество филиалов */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">Количество филиалов</label>
          {flags.bigNetwork && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
              Сеть 10+
            </span>
          )}
          <Tooltip content="Сетевая скидка −5% применяется с 2 филиалов и суммируется со скидкой периода.">
            <span 
              className="text-blue-400 cursor-help" 
              aria-label="Подсказка о количестве филиалов" 
              role="button"
              onMouseEnter={() => track('tooltip_show', { field: 'branches' })}
            >ⓘ</span>
          </Tooltip>
        </div>
        {state.branches >= 2 && (
          <div className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-xs text-green-400">
              ✅ Суммарная скидка включает –5% сеть
            </p>
          </div>
        )}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 5, 10].map(branches => (
            <button
              key={branches}
              onClick={() => handleParamChange('branches', branches)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                state.branches === branches
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {branches === 10 ? '10+' : branches}
              {branches >= 2 && (
                <div className="text-xs text-green-400">-5%</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Дополнительные номера WhatsApp */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">Дополнительные номера WhatsApp</label>
          <Tooltip content="Каждый доп. номер +6 000 ₽/мес. Каналы: WhatsApp/SMS/Email. Действуют дневные/недельные анти‑спам квоты.">
            <span 
              className="text-blue-400 cursor-help" 
              aria-label="Подсказка о дополнительных номерах WhatsApp" 
              role="button"
              onMouseEnter={() => track('tooltip_show', { field: 'whatsappNumbers' })}
            >ⓘ</span>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const newCount = Math.max(0, state.whatsappNumbers - 1);
              handleParamChange('whatsappNumbers', newCount);
              track('ui_change_whatsapp', { count: newCount });
            }}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          >
            −
          </button>
          <span className="text-lg font-medium min-w-[3rem] text-center">
            {state.whatsappNumbers}
          </span>
          <button
            onClick={() => {
              const newCount = state.whatsappNumbers + 1;
              handleParamChange('whatsappNumbers', newCount);
              track('ui_change_whatsapp', { count: newCount });
            }}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          >
            +
          </button>
          <span className="text-sm text-white/60">
            Номеров: {state.whatsappNumbers} • +{formatPrice(6000)}/мес за номер
          </span>
        </div>
      </div>

      {/* Уровень поддержки мед. маркетинга */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">Уровень поддержки мед. маркетинга</label>
          <Tooltip content="Base — базовые сценарии, помощь по запросу, квартальная отчётность. Advanced — расширенные сценарии, персональные рекомендации, ежемесячная аналитика. Premium — максимум сценариев, регулярный аудит, план развития. Expert — стратегические сессии и персональный менеджер для сетей клиник.">
            <span 
              className="text-blue-400 cursor-help" 
              aria-label="Подсказка об уровнях поддержки мед. маркетинга" 
              role="button"
              onMouseEnter={() => track('tooltip_show', { field: 'marketingLevel' })}
            >ⓘ</span>
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'base', name: 'Base', price: 10170 },
            { id: 'advanced', name: 'Advanced', price: 30510 },
            { id: 'premium', name: 'Premium', price: 61020 },
            { id: 'expert', name: 'Expert', price: 122040 },
          ].map(level => (
            <button
              key={level.id}
              onClick={() => {
                handleParamChange('marketingLevel', level.id);
                track('ui_select_mm_level', { level: level.id });
              }}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                state.marketingLevel === level.id
                  ? 'bg-blue-500 text-white font-bold shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <div className={state.marketingLevel === level.id ? 'font-bold' : 'font-medium'}>{level.name}</div>
              <div className="text-xs">{formatPrice(level.price)}/мес</div>
            </button>
          ))}
        </div>
      </div>

      {/* Техподдержка */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">Техподдержка</label>
          <Tooltip content="Будни — включено (Пн–Пт 9:00–18:00). Каждый день — +5 000 ₽/мес, SLA и мониторинг 24/7.">
            <span 
              className="text-blue-400 cursor-help" 
              aria-label="Подсказка о техподдержке" 
              role="button"
              onMouseEnter={() => track('tooltip_show', { field: 'techSupport' })}
            >ⓘ</span>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              handleParamChange('techSupport', 'weekdays');
              track('ui_select_support', { value: 'weekdays' });
            }}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              state.techSupport === 'weekdays'
                ? 'bg-blue-500 text-white font-bold shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Будни
          </button>
          <button
            onClick={() => {
              handleParamChange('techSupport', 'daily');
              track('ui_select_support', { value: 'daily' });
            }}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              state.techSupport === 'daily'
                ? 'bg-blue-500 text-white font-bold shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Каждый день (+{formatPrice(5000)})
          </button>
        </div>
      </div>

      {/* Итоговый расчет */}
      <div className="glass-card p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Ваш расчет готов!</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>В месяц:</span>
            <span className="font-bold">{formatPrice(priceBreakdown.patientBase + priceBreakdown.branches + priceBreakdown.whatsapp + priceBreakdown.marketing + priceBreakdown.techSupport)}</span>
          </div>
          <div className="flex justify-between">
            <span>Итого за период:</span>
            <span className="font-bold text-lg">{formatPrice(priceBreakdown.total)}</span>
          </div>
          {Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount) > 0 && (
            <div className="text-right">
              <span className="text-xs text-green-400">
                С учетом скидки –{Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount)}%
              </span>
            </div>
          )}
          {Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount) === 0 && (
            <div className="text-right">
              <span className="text-xs text-gray-400">
                С учетом скидки –0%
              </span>
            </div>
          )}
          
          {/* Разложение цены */}
          <div 
            className="mt-4 pt-3 border-t border-white/20"
            onMouseEnter={() => funnel.trackBreakdownView()}
          >
            <div className="text-xs font-medium mb-2">Разложение цены:</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-left">Поддержка ММ:</span>
                <span className="text-right">{formatPrice(priceBreakdown.marketing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-left">База пациентов:</span>
                <span className="text-right">{formatPrice(priceBreakdown.patientBase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-left">Филиалы:</span>
                <span className="text-right">{formatPrice(priceBreakdown.branches)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-left">WhatsApp номера:</span>
                <span className="text-right">{formatPrice(priceBreakdown.whatsapp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-left">Техподдержка:</span>
                <span className="text-right">{formatPrice(priceBreakdown.techSupport)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA кнопки */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleSubmit}
          className="bg-brand-orange text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Отправить заявку
        </button>
        <button
          onClick={() => {
            track('ab_secondary_cta', { variant: abTests.secondaryCTA, click: true });
            handleSavePDF();
          }}
          className="bg-white/10 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
        >
          {abTests.secondaryCTA === 'B' ? 'Сохранить PDF' : 'PDF'}
        </button>
        <button
          onClick={() => {
            track('modal_open', { type: 'quote_email' });
            setIsEmailModalOpen(true);
          }}
          className="bg-white/10 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
        >
          КП на email
        </button>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={(payload) => {
          const monthlyTotal = priceBreakdown.patientBase + priceBreakdown.branches + priceBreakdown.whatsapp + priceBreakdown.marketing + priceBreakdown.techSupport;
          const discountPercent = Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount);
          
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
          
          handleRequestQuote(fullPayload);
        }}
      />
      
      {/* Debug Strip */}
      <DebugStrip state={state} currentStep={funnel.currentStep} />
      
      {/* Test Cases */}
      <TestCases />
    </div>
  );
};

export default PricingCalculator;
