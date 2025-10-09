import React, { useState, useEffect } from 'react';
import { CalculatorState } from './types';
import { normalizeCalculatorState } from './utils/validation';
import { track, debouncedTrack } from './utils/analytics';
import { getActiveABTests } from './utils/abTesting';
import { useFunnelTracking } from './hooks/useFunnelTracking';
import './utils/sliderUtils';
import './App.css';
import Header from './components/Header';
import Banner from './components/Banner';
import { Layout } from './components/Layout';
import PatientBaseSection from './components/PatientBaseSection';
import PeriodSection from './components/PeriodSection';
import MMLevelsSection from './components/MMLevelsSection';
import StickyCalculation from './components/StickyCalculation';
import CalculatorParams from './components/CalculatorParams';
import CasesSection from './components/CasesSection';
import IntegrationsSection from './components/IntegrationsSection';
import FAQSection from './components/FAQSection';
import DemoSection from './components/DemoSection';
import ApplyModal from './components/ApplyModal';

const App: React.FC = () => {
  const [selectedGiftModule, setSelectedGiftModule] = useState<string>('');
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Обработчик глобального события для открытия модали
  useEffect(() => {
    const handleOpenApplyModal = () => {
      setIsApplyModalOpen(true);
    };
    
    window.addEventListener('openApplyModal', handleOpenApplyModal);
    return () => window.removeEventListener('openApplyModal', handleOpenApplyModal);
  }, []);
  
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

  // Трекинг назначения A/B варианта
  React.useEffect(() => {
    track('ab_variant_assigned', { variant: abTests.periodTooltip });
  }, [abTests.periodTooltip]);

  const handleParamChange = (param: keyof CalculatorState, value: any) => {
    if (state[param] === value) return;
    
    const newState = { ...state, [param]: value };
    const normalizedState = normalizeCalculatorState(newState);
    setState(normalizedState);
    
    funnel.trackParamChange();
    
    debouncedTrack('calc_param_change', {
      period: normalizedState.period,
      baseSize: normalizedState.patientBase,
      branches: normalizedState.branches,
      whatsappNumbers: normalizedState.whatsappNumbers,
      mmLevel: normalizedState.marketingLevel,
      supportLevel: normalizedState.techSupport
    });
  };

  const handleSubmit = () => {
    funnel.trackSubmit();
    track('calc_submitted', {
      monthly: 0, // Будет рассчитано в StickyCalculation
      total: 0,
      discountPercent: 0
    });
  };

  const handleSavePDF = () => {
    funnel.trackPDFClick();
    track('calc_saved_pdf', {
      monthly: 0,
      total: 0
    });
  };

  const handleRequestQuote = (payload: any) => {
    funnel.trackEmailClick();
    track('calc_request_quote_email', {
      email: payload.email,
      monthly: 0,
      total: 0
    });
    alert('КП отправим в ближайшее время');
  };


  return (
    <Layout>
      <div className="min-h-screen">
        <Header />
        
        <div id="features">
          <Banner
            imageSrc="/images/Group_9206.png.webp"
            imageAlt="Zabota 2.0 — интерфейсы на ноутбуке и смартфоне"
            onLearnMore={() => {
              // Скролл к блоку "Калькулятор" с учетом высоты шапки
              const el = document.getElementById("pricing");
              if (el) {
                const headerHeight = 80; // примерная высота шапки
                const elementPosition = el.offsetTop - headerHeight;
                window.scrollTo({
                  top: elementPosition,
                  behavior: "smooth"
                });
              }
            }}
          />
        </div>

      {/* Основной калькулятор с приоритетными блоками */}
      <div id="pricing" className="container" style={{ marginTop: '60px' }}>
        <div className="grid-main">
          {/* Левая часть - приоритетные блоки и параметры */}
          <div className="order-2 lg:order-1">
            {/* База пациентов и Период подписки - вверху в одну строку */}
            <div className="sliders-row">
              <div id="patient-base-section">
                <PatientBaseSection 
                  state={state} 
                  onParamChange={handleParamChange} 
                />
              </div>
              <PeriodSection 
                state={state} 
                onParamChange={handleParamChange} 
              />
            </div>

            {/* Уровень ММ - сразу после базы и периода */}
            <MMLevelsSection 
              state={state} 
              onLevelChange={(level) => handleParamChange('marketingLevel', level)} 
            />

            {/* Остальные параметры */}
            <CalculatorParams state={state} onParamChange={handleParamChange} />
          </div>
          
          {/* Правая часть - sticky расчет */}
          <aside className="calc-sticky order-1 lg:order-2">
            <StickyCalculation
              state={state}
              onParamChange={handleParamChange}
              onSubmit={handleSubmit}
              onSavePDF={handleSavePDF}
              onRequestQuote={handleRequestQuote}
            />
          </aside>
        </div>
      </div>

      {/* Модуль в подарок - скрыт */}
      {false && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-6 text-center">
              <h3 className="text-2xl font-bold mb-4">Модуль в подарок</h3>
              <p className="text-white/80 mb-4">
                Выберите один модуль бесплатно (NPS, Reputation, Cloud). 
                Срок: 3 месяца для Advanced/Premium/Expert.
              </p>
              <select
                value={selectedGiftModule}
                onChange={(e) => {
                  setSelectedGiftModule(e.target.value);
                  track('gift_module_selected', { module: e.target.value });
                }}
                className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-blue-400"
              >
                <option value="">Выбрать модуль</option>
                <option value="nps">NPS</option>
                <option value="reputation">Reputation</option>
                <option value="cloud">Cloud</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Мини-FAQ - ОТКЛЮЧЕН */}
      {false && (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {[
              {
                question: "Почему такая цена?",
                answer: "Цена складывается из компонентов: база, филиалы, доп. номера WhatsApp, уровень мед. маркетинга, техподдержка. Скидки: период (до −20%) + сеть (−5% с 2 филиалов)."
              },
              {
                question: "Как считаются квоты?",
                answer: "Анти‑спам квоты ограничивают отправки по каналам: WhatsApp/SMS/Email — дневные и недельные лимиты. Это защищает доставляемость и рейтинг отправителя."
              },
              {
                question: "Можно протестировать?",
                answer: "Да. Демо‑доступ и Telegram‑бот Zabota.Reputation на 3 месяца — в подарок на тарифах Advanced/Premium/Expert."
              }
            ].map((faq, index) => (
              <div key={index} className="glass-card">
                <button
                  onClick={() => {
                    const isOpening = openFaqItem !== index;
                    setOpenFaqItem(openFaqItem === index ? null : index);
                    if (isOpening) {
                      track('faq_open', { question: faq.question });
                    }
                    track('faq_toggle', { question: faq.question });
                  }}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <span className={`text-xl transition-transform ${openFaqItem === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaqItem === index && (
                  <div className="px-6 pb-6">
                    <p className="text-white/80">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Комплектация тарифов - ОТКЛЮЧЕН */}
      {false && (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Комплектация тарифов</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Base</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Базовые сценарии коммуникаций</li>
                <li>• Помощь по запросу</li>
                <li>• Отчетность раз в квартал</li>
              </ul>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Advanced</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Расширенный набор сценариев</li>
                <li>• Персональные рекомендации</li>
                <li>• Ежемесячная аналитика</li>
                <li>• Быстрый запуск новых идей</li>
              </ul>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Максимум сценариев</li>
                <li>• Регулярный аудит</li>
                <li>• Индивидуальные планы развития</li>
                <li>• Приоритетная очередь задач</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Лимиты и анти-спам квоты - скрыт */}
      {false && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Лимиты и анти‑спам квоты</h2>
            <div className="glass-card p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-3">WhatsApp</h3>
                  <ul className="space-y-1 text-sm text-white/80">
                    <li>• Дневной лимит: 1000 сообщений</li>
                    <li>• Недельный лимит: 5000 сообщений</li>
                    <li>• Анти-спам фильтры</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3">SMS</h3>
                  <ul className="space-y-1 text-sm text-white/80">
                    <li>• Дневной лимит: 500 сообщений</li>
                    <li>• Недельный лимит: 2000 сообщений</li>
                    <li>• Проверка на спам</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3">Email</h3>
                  <ul className="space-y-1 text-sm text-white/80">
                    <li>• Дневной лимит: 2000 писем</li>
                    <li>• Недельный лимит: 10000 писем</li>
                    <li>• Автоматическая доставка</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Эффекты и кейсы - ОТКЛЮЧЕН */}
      {false && (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Эффекты и кейсы</h2>
          <div className="glass-card p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-3 text-green-400">+20–25% рост доходов клиники</h3>
                <p className="text-white/80 text-sm">
                  За счёт возврата спящих и повышения доходимости
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">В 3–5 раз больше положительных отзывов</h3>
                <p className="text-white/80 text-sm">
                  Через NPS и маршрутизацию на карты
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-orange-400">+14–20% конверсия в повторный приём</h3>
                <p className="text-white/80 text-sm">
                  Благодаря персональным сценариям
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-purple-400">Окупаемость 3–4 месяца</h3>
                <p className="text-white/80 text-sm">
                  На базе действующих кейсов
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Секция кейсов клиентов */}
      <div id="cases">
        <CasesSection />
      </div>

      {/* Секция интеграций */}
      <div id="integrations">
        <IntegrationsSection />
      </div>

      {/* Секция FAQ */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Секция демо */}
      <div id="contacts">
        <DemoSection 
          onSubmit={(payload) => {
            console.log('Demo form submitted:', payload);
            // Здесь можно добавить отправку данных на сервер
          }}
          policyUrl="/privacy-policy"
        />
      </div>

      {/* Футер */}
      <footer className="footer">
        {/* Верхняя часть - контакты */}
        <div className="footer-top">
          <div className="footer-container">
            <div className="footer-contacts">
              <div className="phone">8 800 555 38 62</div>
              <a href="mailto:info@zabota.tech" className="email-link">info@zabota.tech</a>
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

        {/* Нижняя часть - юридическая информация */}
        <div className="footer-bottom">
          <div className="footer-container">
            <div className="footer-left">
              <div className="company-info">
                <div>ООО «Медицина»</div>
                <div>ИНН: 7721479230</div>
              </div>
            </div>
            <div className="footer-center">
              <div>Является оператором персональных данных</div>
              <div>под регистрационным номером: 77-17-005444</div>
              <div>
                <a href="https://zabota.tech/terms_of_use" target="_blank" rel="noopener noreferrer" className="footer-link">
                  Правила использования сервиса ZABOTA 2.0
                </a>
              </div>
            </div>
            <div className="footer-right">
              <div>
                <a href="https://zabota.tech/#:~:text=%D0%AE%D1%80%D0%B8%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%0A%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F" target="_blank" rel="noopener noreferrer" className="footer-link">
                  Юридическая информация
                </a>
              </div>
              <div>
                <a href="https://zabota.tech/privacypolicy" target="_blank" rel="noopener noreferrer" className="footer-link">
                  Политика обработки персональных данных
                </a>
              </div>
            </div>
          </div>
        </div>

      </footer>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={(payload) => {
          track('calc_apply_submitted', payload);
        }}
        calcData={{
          months: state.period,
          baseSize: state.patientBase,
          branches: state.branches,
          whatsappNumbers: state.whatsappNumbers,
          mmLevel: state.marketingLevel,
          supportLevel: state.techSupport,
          monthly: 0, // Будет рассчитано в StickyCalculation
          total: 0,
          discountPercent: 0,
          breakdown: {}
        }}
      />

      </div>
    </Layout>
  );
};

export default App;
