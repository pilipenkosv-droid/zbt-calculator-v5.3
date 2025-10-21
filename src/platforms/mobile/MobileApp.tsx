import React, { useState, useEffect } from 'react';
import type { PlatformDetectionResult } from '../../shared/types/platform';
import { track, debouncedTrack } from '../../utils/analytics';
import { CalculatorState } from '../../types';
import { normalizeCalculatorState } from '../../utils/validation';
import { getActiveABTests } from '../../utils/abTesting';
import { useFunnelTracking } from '../../hooks/useFunnelTracking';

// Мобильные компоненты
import MobileHeader from './components/MobileHeader';
import MobileBanner from './components/MobileBanner';
import MobileNavBar from './components/MobileNavBar';
import MobileFAB from './components/MobileFAB';
import MobileStickyPrice from './components/MobileStickyPrice';
import MobileFAQ from './components/MobileFAQ';
import MobileCases from './components/MobileCases';
import MobileIntegrations from './components/MobileIntegrations';
import MobileDemo from './components/MobileDemo';

// Временно используем оригинальные компоненты (потом заменим на мобильные версии)
import PatientBaseSection from '../../components/PatientBaseSection';
import PeriodSection from '../../components/PeriodSection';
import SupportLevelsWithDetails from '../../components/SupportLevelsWithDetails';
import CalculatorParams from '../../components/CalculatorParams';
import ClientsSection from '../../components/ClientsSection';
import ApplyModal from '../../components/ApplyModal';
import { Layout } from '../../components/Layout';

// Импорт стилей для мобильной версии
import './styles/mobile.css';

/**
 * Интерфейс пропсов MobileApp
 */
export interface MobileAppProps {
  detection: PlatformDetectionResult;
}

/**
 * Мобильное приложение
 * Оптимизированное для мобильных устройств
 */
const MobileApp: React.FC<MobileAppProps> = ({ detection }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Состояние калькулятора
  const [state, setState] = useState<CalculatorState>({
    period: 12,
    patientBase: 50000,
    branches: 1,
    whatsappNumbers: 0,
    marketingLevel: 'premium',
    techSupport: 'weekdays',
  });

  const abTests = getActiveABTests();
  const funnel = useFunnelTracking();

  // Инициализация аналитики
  useEffect(() => {
    track('app_loaded', {
      platform: 'mobile',
      screenWidth: detection.screenWidth,
      isTouch: detection.isTouch,
    });
    
    track('ab_variant_assigned', { variant: abTests.periodTooltip });
  }, [detection, abTests.periodTooltip]);

  // Обработчик глобального события для открытия модали
  useEffect(() => {
    const handleOpenApplyModal = () => {
      setIsApplyModalOpen(true);
    };

    window.addEventListener('openApplyModal', handleOpenApplyModal);
    return () =>
      window.removeEventListener('openApplyModal', handleOpenApplyModal);
  }, []);

  const handleParamChange = (param: keyof CalculatorState, value: any) => {
    if (state[param] === value) return;

    const newState = { ...state, [param]: value };
    const normalizedState = normalizeCalculatorState(newState);
    setState(normalizedState);

    funnel.trackParamChange();

    debouncedTrack('calc_param_change', {
      platform: 'mobile',
      period: normalizedState.period,
      baseSize: normalizedState.patientBase,
      branches: normalizedState.branches,
      whatsappNumbers: normalizedState.whatsappNumbers,
      mmLevel: normalizedState.marketingLevel,
      supportLevel: normalizedState.techSupport,
    });
  };

  return (
    <Layout>
      <div className="mobile-app" data-platform="mobile">
        {/* Мобильный Header */}
        <MobileHeader />

        {/* Sticky Navigation Bar */}
        <MobileNavBar />

        {/* Hero-блок */}
        <div id="features">
          <MobileBanner />
        </div>

        {/* Калькулятор */}
        <section id="calculator" className="section">
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
              Рассчитайте стоимость
            </h2>
            
            {/* База пациентов и Период */}
            <div style={{ marginBottom: '24px' }}>
              <PatientBaseSection
                state={state}
                onParamChange={handleParamChange}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <PeriodSection
                state={state}
                onParamChange={handleParamChange}
              />
            </div>

            {/* Уровень ММ */}
            <div style={{ marginBottom: '24px' }}>
              <SupportLevelsWithDetails
                defaultLevel={
                  state.marketingLevel === 'base'
                    ? 'Base'
                    : state.marketingLevel === 'advanced'
                      ? 'Advanced'
                      : state.marketingLevel === 'premium'
                        ? 'Premium'
                        : 'Expert'
                }
                onLevelChange={level =>
                  handleParamChange('marketingLevel', level.toLowerCase())
                }
              />
            </div>

            {/* Остальные параметры */}
            <div style={{ marginBottom: '80px' }}>
              <CalculatorParams
                state={state}
                onParamChange={handleParamChange}
              />
            </div>
          </div>
        </section>

        {/* Интеграции */}
        <div id="integrations">
          <MobileIntegrations />
        </div>

        {/* Кейсы */}
        <div id="cases">
          <MobileCases />
        </div>

        {/* Клиенты */}
        <div id="clients">
          <ClientsSection />
        </div>

        {/* FAQ */}
        <div id="faq">
          <MobileFAQ />
        </div>

        {/* Демо и контакты */}
        <div id="contacts">
          <MobileDemo
            onSubmit={payload => {
              console.log('Demo form submitted:', payload);
              track('mobile_demo_form_submitted', payload);
            }}
            policyUrl="https://zabota.tech/personal"
          />
        </div>

        {/* Футер */}
        <footer className="footer" style={{ marginTop: '48px' }}>
          <div className="footer-top">
            <div className="footer-container">
              <div className="footer-contacts">
                <a href="tel:88005553862" className="phone">8 800 555 38 62</a>
                <a href="mailto:info@zabota.tech" className="email-link">
                  info@zabota.tech
                </a>
              </div>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="ВКонтакте">
                  <img src="/images/3.svg" alt="VK" className="social-icon" />
                </a>
                <a href="#" className="social-link" aria-label="Telegram">
                  <img src="/images/4.svg" alt="Telegram" className="social-icon" />
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <img src="/images/5.svg" alt="YouTube" className="social-icon" />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-container">
              <div style={{ textAlign: 'center', fontSize: '14px', padding: '16px' }}>
                <div>ООО «Медицина» • ИНН: 7721479230</div>
                <div style={{ marginTop: '8px' }}>
                  <a
                    href="https://zabota.tech/terms_of_use"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    Правила использования
                  </a>
                  {' • '}
                  <a
                    href="https://zabota.tech/personal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    Политика ПДн
                  </a>
                </div>
                <div style={{ marginTop: '8px' }}>
                  © {new Date().getFullYear()} Все права защищены
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* FAB кнопки */}
        <MobileFAB />

        {/* Липкий блок стоимости */}
        <MobileStickyPrice
          state={state}
          onRequestQuote={() => {
            track('calc_request_quote_mobile');
            window.dispatchEvent(new CustomEvent('openApplyModal'));
          }}
        />

        {/* Apply Modal */}
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSubmit={payload => {
            track('calc_apply_submitted', payload);
          }}
          calcData={{
            months: state.period,
            baseSize: state.patientBase,
            branches: state.branches,
            whatsappNumbers: state.whatsappNumbers,
            mmLevel: state.marketingLevel,
            supportLevel: state.techSupport,
            monthly: 0,
            total: 0,
            discountPercent: 0,
            breakdown: {},
          }}
        />
      </div>
    </Layout>
  );
};

export default MobileApp;

