import './ClientsSection.css';
import ClientsMarquee from './ClientsMarquee';

export default function ClientsSection() {
  return (
    <section aria-labelledby="clients-title" className="clients-section">
      <div className="clients-header">
        <h2 id="clients-title">Наши клиенты</h2>
        <p className="clients-subtitle">
          Более 3500 медицинских организаций доверили нам свои коммуникации с пациентами
        </p>
      </div>

      {/* Анимированный маркиз с логотипами клиентов */}
      <ClientsMarquee />
    </section>
  );
}

