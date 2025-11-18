import React, { useState } from 'react';
import './MobileStickyPrice.css';
import { CalculatorState } from '../../../types';
import { calculatePrice } from '../../../lib/pricing';

interface MobileStickyPriceProps {
  state: CalculatorState;
  onRequestQuote?: () => void;
}

/**
 * Липкий блок стоимости для мобильных
 * Отображается внизу экрана с ключевой информацией
 */
const MobileStickyPrice: React.FC<MobileStickyPriceProps> = ({ state, onRequestQuote }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'total'>('monthly');
  const [isExpanded, setIsExpanded] = useState(false);
  const [userClosedManually, setUserClosedManually] = useState(false);
  const isFirstRender = React.useRef(true);
  
  // Состояние для перетягивания
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const pricing = calculatePrice(state);

  // Ежемесячная стоимость
  const monthly = pricing.monthlyPerBranch * state.branches + pricing.whatsapp;
  const monthlyPrice = Math.round(monthly).toLocaleString('ru-RU');
  const totalPrice = Math.round(pricing.total).toLocaleString('ru-RU');
  const implementationPrice = Math.round(pricing.implementation).toLocaleString('ru-RU');
  
  // Цена до скидки (помесячно)
  const originalMonthly = pricing.beforeDiscount 
    ? Math.round(pricing.beforeDiscount / state.period).toLocaleString('ru-RU')
    : null;
  
  // Общая скидка в процентах (с учетом капа 25%)
  const rawDiscountPercent = pricing.periodDiscount + pricing.networkDiscount;
  const effectiveDiscountPercent = Math.min(25, rawDiscountPercent);
  const discountPercent = Math.round(effectiveDiscountPercent);
  const hasDiscount = rawDiscountPercent > 0;

  const handleRequestQuote = () => {
    if (onRequestQuote) {
      onRequestQuote();
    } else {
      window.dispatchEvent(new CustomEvent('openApplyModal'));
    }
  };

  // Открыть блок при изменении параметров калькулятора
  // НО только если пользователь не закрыл его вручную
  // И только если это НЕ первый рендер
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (!userClosedManually) {
      setIsExpanded(true);
    }
  }, [state.period, state.patientBase, state.branches, state.whatsappNumbers, state.marketingLevel, state.techSupport, userClosedManually]);

  // Обработчик клика по ушку
  const handleToggle = () => {
    if (isDragging) return; // Игнорируем клик если был драг
    
    const newState = !isExpanded;
    setIsExpanded(newState);
    // Если пользователь закрывает блок вручную - запоминаем это
    if (!newState) {
      setUserClosedManually(true);
    } else {
      // Если открывает - сбрасываем флаг
      setUserClosedManually(false);
    }
  };

  // Обработчики для перетягивания
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    
    const touchY = e.touches[0].clientY;
    setCurrentY(touchY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    const threshold = 50; // Минимальное расстояние для срабатывания
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY < 0) {
        // Потянули вверх - открыть
        setIsExpanded(true);
        setUserClosedManually(false);
      } else {
        // Потянули вниз - закрыть
        setIsExpanded(false);
        setUserClosedManually(true);
      }
    }
    
    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  // Уведомляем другие компоненты об изменении состояния блока
  React.useEffect(() => {
    document.body.setAttribute('data-sticky-expanded', isExpanded ? 'true' : 'false');
  }, [isExpanded]);

  return (
    <>
      {/* Липкий блок внизу экрана */}
      <div className={`mobile-sticky-price ${isExpanded ? 'mobile-sticky-price--expanded' : ''}`}>
        {/* Ушко для клика и перетягивания */}
        <div 
          className="mobile-sticky-price__handle"
          onClick={handleToggle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mobile-sticky-price__handle-bar"></div>
        </div>
        
        <div className="mobile-sticky-price__container">
          {/* Основная информация */}
          <div className="mobile-sticky-price__main">
            <div className="mobile-sticky-price__price">
              {viewMode === 'monthly' ? (
                <>
                  <div className="mobile-sticky-price__amount">{monthlyPrice} ₽</div>
                  <div className="mobile-sticky-price__period">/мес</div>
                </>
              ) : (
                <>
                  <div className="mobile-sticky-price__amount">{totalPrice} ₽</div>
                  <div className="mobile-sticky-price__period">за {state.period} мес</div>
                </>
              )}
            </div>

            {/* Скидка */}
            {hasDiscount && (
              <div className="mobile-sticky-price__discount">
                Экономия {discountPercent}%
              </div>
            )}
          </div>

          {/* Кнопки действий */}
          <div className="mobile-sticky-price__actions">
            <button
              className="mobile-sticky-price__toggle"
              onClick={() => setViewMode(viewMode === 'monthly' ? 'total' : 'monthly')}
              aria-label="Переключить вид"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className="mobile-sticky-price__details-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              Детали
            </button>

            <button
              className="mobile-sticky-price__cta"
              onClick={handleRequestQuote}
            >
              Отправить заявку
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно с деталями */}
      {showDetails && (
        <>
          <div 
            className="mobile-sticky-price__overlay"
            onClick={() => setShowDetails(false)}
          />
          <div className="mobile-sticky-price__modal">
            <div className="mobile-sticky-price__modal-header">
              <h3>Детали расчёта</h3>
              <button
                className="mobile-sticky-price__modal-close"
                onClick={() => setShowDetails(false)}
                aria-label="Закрыть"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="mobile-sticky-price__modal-body">
              {/* Основные параметры */}
              <div className="mobile-sticky-price__detail-group">
                <h4>Параметры</h4>
                <div className="mobile-sticky-price__detail-item">
                  <span>База пациентов</span>
                  <span>{state.patientBase.toLocaleString('ru-RU')}</span>
                </div>
                <div className="mobile-sticky-price__detail-item">
                  <span>Период подписки</span>
                  <span>{state.period} мес</span>
                </div>
                <div className="mobile-sticky-price__detail-item">
                  <span>Филиалы</span>
                  <span>{state.branches}</span>
                </div>
                {state.whatsappNumbers > 0 && (
                  <div className="mobile-sticky-price__detail-item">
                    <span>Доп. номера WhatsApp</span>
                    <span>{state.whatsappNumbers}</span>
                  </div>
                )}
              </div>

              {/* Расчёт стоимости */}
              <div className="mobile-sticky-price__detail-group">
                <h4>Стоимость</h4>
                {originalMonthly && (
                  <div className="mobile-sticky-price__detail-item mobile-sticky-price__detail-item--strike">
                    <span>До скидки</span>
                    <span>{originalMonthly} ₽/мес</span>
                  </div>
                )}
                <div className="mobile-sticky-price__detail-item mobile-sticky-price__detail-item--primary">
                  <span>После скидки</span>
                  <span>{monthlyPrice} ₽/мес</span>
                </div>
                <div className="mobile-sticky-price__detail-item mobile-sticky-price__detail-item--total">
                  <span>Итого за {state.period} мес</span>
                  <span>{totalPrice} ₽</span>
                </div>
                <div className="mobile-sticky-price__detail-item">
                  <span>Стоимость внедрения</span>
                  <span>{implementationPrice} ₽</span>
                </div>
              </div>

              {/* Скидки */}
              {hasDiscount && (
                <div className="mobile-sticky-price__detail-group">
                  <h4>Скидки</h4>
                  <div className="mobile-sticky-price__detail-item">
                    <span>Общая скидка</span>
                    <span className="mobile-sticky-price__discount-badge">
                      {discountPercent}%
                    </span>
                  </div>
                  {pricing.periodDiscount > 0 && (
                    <div className="mobile-sticky-price__detail-note">
                      • Скидка за срок оплаты: {pricing.periodDiscount}%
                    </div>
                  )}
                  {state.branches >= 2 && pricing.networkDiscount > 0 && (
                    <div className="mobile-sticky-price__detail-note">
                      • Скидка за сеть клиник: {pricing.networkDiscount}%
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mobile-sticky-price__modal-footer">
              <button
                className="mobile-sticky-price__modal-cta"
                onClick={() => {
                  setShowDetails(false);
                  handleRequestQuote();
                }}
              >
                Отправить заявку
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileStickyPrice;

