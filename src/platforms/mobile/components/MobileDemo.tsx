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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM5 5h1.5c.1.9.2 1.8.5 2.6L5.8 8.8C5.4 7.6 5.1 6.3 5 5zm14 14c-1.3-.1-2.6-.4-3.8-.8l1.2-1.2c.8.2 1.7.4 2.6.5V19z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
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

