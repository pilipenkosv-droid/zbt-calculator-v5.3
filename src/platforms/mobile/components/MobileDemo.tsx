import React from 'react';
import './MobileDemo.css';
import MobileApplicationForm from './MobileApplicationForm';

interface MobileDemoProps {
  onSubmit?: (data: any) => Promise<void> | void;
  policyUrl?: string;
}

/**
 * Мобильная версия секции Demo/Контакты
 * С многошаговой формой заявки
 */
const MobileDemo: React.FC<MobileDemoProps> = ({ onSubmit, policyUrl }) => {
  return (
    <section className="mobile-demo section">
      <div className="container">
        <h2 className="mobile-demo__title">Получите демо-доступ</h2>
        <p className="mobile-demo__subtitle">
          Заполните форму и мы свяжемся с вами в течение 1 рабочего дня
        </p>

        {/* Преимущества демо */}
        <div className="mobile-demo__benefits">
          <div className="mobile-demo__benefit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12l2 2 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Полный функционал на 7 дней</span>
          </div>
          <div className="mobile-demo__benefit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12l2 2 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Персональная консультация</span>
          </div>
          <div className="mobile-demo__benefit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12l2 2 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Помощь в настройке МИС</span>
          </div>
        </div>

        {/* Форма заявки */}
        <MobileApplicationForm onSubmit={onSubmit} policyUrl={policyUrl} />

        {/* Дополнительные контакты */}
        <div className="mobile-demo__contacts">
          <p className="mobile-demo__contacts-text">Или свяжитесь с нами напрямую:</p>
          <div className="mobile-demo__contacts-links">
            <a href="tel:88005553862" className="mobile-demo__contact-link">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.3 14.9c-1.5 0-3-.3-4.4-.8-.4-.2-.9 0-1.2.3l-2.7 2.7c-3.5-1.8-6.4-4.6-8.2-8.2L4.6 6.2c.3-.3.4-.8.3-1.2-.5-1.4-.8-2.9-.8-4.4 0-.6-.4-1-1-1H1c-.6 0-1 .4-1 1 0 10.5 8.5 19 19 19 .6 0 1-.4 1-1v-2.1c0-.6-.4-1-1-1z" fill="currentColor"/>
              </svg>
              <span>8 800 555 38 62</span>
            </a>
            <a href="mailto:info@zabota.tech" className="mobile-demo__contact-link">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18 4H2C.9 4 0 4.9 0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              <span>info@zabota.tech</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileDemo;

