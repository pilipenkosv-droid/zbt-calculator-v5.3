import './IntegrationsSection.css';
import IntegrationsMarquee from './IntegrationsMarquee';

export default function IntegrationsSection() {
  return (
    <section aria-labelledby="integrations-title" className="integrations">
        <div className="header">
          <h2 id="integrations-title">
            <span style={{ fontSize: '70px' }}>35+</span> интеграций
          </h2>
          <p className="subtitle">Подключение к МИС и сервисам, которые вы используете каждый день.</p>
        </div>

      {/* Новый анимированный маркиз с логотипами */}
      <IntegrationsMarquee />


    </section>
  );
}
