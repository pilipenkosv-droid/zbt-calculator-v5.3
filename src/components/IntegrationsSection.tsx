import React from 'react';

const vendors = [
  'МИС Инфоклиника', 'Medwork', 'Медиалог', 'Клиника+',
  '1С:Медицина', 'SQNS', 'BASIS', 'Доктор CRM',
  'SimpleMed', 'AnyClinic', 'ДентаСофт', 'ОМС/ДМС CRM'
];

const channels = ['SMS', 'WhatsApp*', 'Telegram', 'Email', 'Push'];

export default function IntegrationsSection() {
  return (
    <section aria-labelledby="integrations-title" className="integrations">
      <div className="header">
        <h2 id="integrations-title">Интеграции</h2>
        <p className="subtitle">130+ МИС и CRM. Каналы: SMS, WhatsApp*, Telegram, Email, Push.</p>
      </div>

      <div className="badges" role="list">
        {vendors.map((v) => (
          <span key={v} role="listitem" className="badge" aria-label={v}>{v}</span>
        ))}
      </div>

      <div className="facts">
        <div className="fact">
          <strong>Запуск от 7 дней</strong>
          <p>Доступы → синхронизация → тест → пилот.</p>
        </div>
        <div className="fact">
          <strong>130+ интеграций</strong>
          <p>Готовые коннекторы и опыт внедрений.</p>
        </div>
        <div className="fact">
          <strong>Персональный специалист</strong>
          <p>Сопровождение на всех этапах.</p>
        </div>
      </div>

      <div className="channels" aria-label="Поддерживаемые каналы">
        {channels.map((c) => (
          <span key={c} className="chip">{c}</span>
        ))}
      </div>

      <ol className="steps" aria-label="Как подключаемся">
        <li>Настраиваем обмен с вашей МИС/CRM.</li>
        <li>Подключаем каналы и сценарии: напоминания, подтверждения, реактивацию.</li>
        <li>Тестируем, запускаем пилот и выходим в прод.</li>
      </ol>

      <p className="note">*Принадлежит компании Meta, которая признана экстремистской организацией и запрещена в РФ.</p>

      <style jsx>{`
        .integrations { 
          padding: 48px 24px; 
          background: #ffffff !important; 
          color: var(--fg, #1a1a1a); 
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header { 
          max-width: 900px; 
          margin: 0 auto 32px; 
          text-align: center; 
        }
        
        .integrations .header h2 {
          font-family: 'Navigo', 'Inter', sans-serif;
          font-size: 36px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #1a1a1a !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .subtitle { 
          color: var(--muted, #666666); 
          font-size: 16px;
          margin: 0;
        }
        
        .badges { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 12px; 
          justify-content: center; 
          margin-bottom: 40px;
        }
        
        .badge { 
          border: 1px solid var(--border, #e5e5e5); 
          border-radius: 20px; 
          padding: 8px 16px; 
          background: #ffffff !important;
          color: var(--fg, #1a1a1a);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .badge:hover {
          border-color: var(--brand, #FF6A00);
          color: var(--brand, #FF6A00);
          transform: translateY(-1px);
        }
        
        .facts { 
          display: grid; 
          gap: 20px; 
          grid-template-columns: 1fr; 
          margin: 40px auto; 
          max-width: 900px; 
        }
        
        @media (min-width: 700px) { 
          .facts { 
            grid-template-columns: 1fr 1fr 1fr; 
          } 
        }
        
        .fact { 
          border: 1px solid var(--border, #e5e5e5); 
          border-radius: 16px; 
          padding: 24px; 
          background: #ffffff !important;
          text-align: center;
          transition: box-shadow 0.2s ease;
        }
        
        .fact:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        
        .fact strong {
          display: block;
          font-family: 'Navigo', 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--fg, #1a1a1a);
          margin-bottom: 8px;
        }
        
        .fact p {
          margin: 0;
          color: var(--muted, #666666);
          font-size: 14px;
          line-height: 1.5;
        }
        
        .channels { 
          display: flex; 
          gap: 12px; 
          justify-content: center; 
          flex-wrap: wrap; 
          margin: 32px 0; 
        }
        
        .chip { 
          background: var(--chip-bg, #f8f9fa); 
          color: var(--chip-fg, #1a1a1a); 
          border: 1px solid var(--border, #e5e5e5); 
          border-radius: 12px; 
          padding: 8px 16px; 
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .chip:hover {
          background: var(--brand, #FF6A00);
          color: #ffffff;
          border-color: var(--brand, #FF6A00);
        }
        
        .steps { 
          max-width: 900px; 
          margin: 32px auto; 
          color: var(--fg, #1a1a1a); 
          padding: 0;
          list-style: none;
          counter-reset: step-counter;
        }
        
        .steps li {
          counter-increment: step-counter;
          position: relative;
          padding: 16px 0 16px 60px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border, #e5e5e5);
          font-size: 15px;
          line-height: 1.6;
        }
        
        .steps li:last-child {
          border-bottom: none;
        }
        
        .steps li::before {
          content: counter(step-counter);
          position: absolute;
          left: 0;
          top: 16px;
          width: 32px;
          height: 32px;
          background: var(--brand, #FF6A00);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }
        
        .note { 
          text-align: center; 
          color: var(--muted, #666666); 
          margin-top: 32px; 
          font-size: 13px;
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
