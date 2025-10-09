// import React from 'react';
import './IntegrationsSection.css';

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

    </section>
  );
}
