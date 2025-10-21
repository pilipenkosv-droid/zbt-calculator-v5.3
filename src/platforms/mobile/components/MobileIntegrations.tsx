import React, { useState, useRef, useEffect } from 'react';
import './MobileIntegrations.css';
import { track } from '../../../utils/analytics';

type Integration = {
  id: string;
  title: string;
  logoSrc: string;
  alt: string;
  category: 'МИС' | 'Запись' | 'Другое';
  status?: 'ready' | 'connector';
};

const INTEGRATIONS: Integration[] = [
  { id: "1c-med-stom", title: "1С:Медицина Стоматология", logoSrc: "/logo mis/1c медицина стом.png", alt: "1С:Медицина Стоматология", category: "МИС", status: "ready" },
  { id: "apdent", title: "APDent", logoSrc: "/logo mis/apdent.png", alt: "APDent", category: "МИС", status: "ready" },
  { id: "d4w", title: "D4W", logoSrc: "/logo mis/d4w.png", alt: "D4W", category: "МИС", status: "ready" },
  { id: "dental-pro", title: "Dental Pro", logoSrc: "/logo mis/dental pro logo.jpg", alt: "Dental Pro", category: "МИС", status: "ready" },
  { id: "denta-pro", title: "Denta Pro", logoSrc: "/logo mis/denta pro.jpg", alt: "Denta Pro", category: "МИС", status: "ready" },
  { id: "ident", title: "iDent", logoSrc: "/logo mis/ident.png", alt: "iDent", category: "МИС", status: "ready" },
  { id: "infodent", title: "InfoDent", logoSrc: "/logo mis/infodent.png", alt: "InfoDent", category: "МИС", status: "ready" },
  { id: "istom", title: "iStom", logoSrc: "/logo mis/iStom.webp", alt: "iStom", category: "МИС", status: "ready" },
  { id: "medods", title: "MedODS", logoSrc: "/logo mis/medods.png", alt: "MedODS", category: "МИС", status: "ready" },
  { id: "renovatio", title: "Renovatio", logoSrc: "/logo mis/renovatio.png", alt: "Renovatio", category: "МИС", status: "ready" },
  { id: "sqns", title: "SQNS", logoSrc: "/logo mis/sqns.png", alt: "SQNS", category: "МИС", status: "ready" },
  { id: "stompro", title: "StomPro", logoSrc: "/logo mis/stompro.png", alt: "StomPro", category: "МИС", status: "ready" },
  { id: "stomx", title: "StomX", logoSrc: "/logo mis/stomx.png", alt: "StomX", category: "МИС", status: "ready" },
  { id: "universe-soft", title: "Universe Soft", logoSrc: "/logo mis/universe soft.png", alt: "Universe Soft", category: "МИС", status: "ready" },
  { id: "yclients", title: "YClients", logoSrc: "/logo mis/YClients.png", alt: "YClients", category: "Запись", status: "ready" },
  { id: "infoclinic-2", title: "МИС Инфоклиника", logoSrc: "/logo mis/инфоклиника 2.png", alt: "МИС Инфоклиника", category: "МИС", status: "ready" },
  { id: "klinika-online", title: "Клиника Онлайн", logoSrc: "/logo mis/клиника онлайн.png", alt: "Клиника Онлайн", category: "Запись", status: "ready" },
  { id: "medialog", title: "Медиалог", logoSrc: "/logo mis/медиалог.png", alt: "Медиалог", category: "МИС", status: "ready" },
];

type Category = 'Все' | 'МИС' | 'Запись' | 'Другое';

/**
 * Мобильная версия интеграций
 * Фильтры по категориям + карусель + lazy-load
 */
const MobileIntegrations: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = ['Все', 'МИС', 'Запись'];

  // Фильтрация
  const filteredIntegrations = INTEGRATIONS.filter(integration => {
    const matchesCategory = selectedCategory === 'Все' || integration.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      integration.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Отображаемые интеграции (с lazy-load)
  const visibleIntegrations = filteredIntegrations.slice(0, visibleCount);
  const hasMore = visibleIntegrations.length < filteredIntegrations.length;

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setVisibleCount(12); // Сбросить при смене категории
    track('integration_filter', { category });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12); // Сбросить при поиске
    track('integration_search', { query: e.target.value });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
    track('integration_load_more', { visibleCount: visibleCount + 12 });
  };

  const handleIntegrationClick = (integration: Integration) => {
    track('integration_click', { 
      integrationId: integration.id,
      integrationTitle: integration.title,
      category: integration.category,
    });
  };

  // Сброс счетчика при смене фильтров
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchQuery]);

  return (
    <section className="mobile-integrations section">
      <div className="container">
        <h2 className="mobile-integrations__title">
          <span className="mobile-integrations__count">35+</span> интеграций
        </h2>
        <p className="mobile-integrations__subtitle">
          Подключение к МИС и сервисам, которые вы используете каждый день
        </p>

        {/* Поиск */}
        <div className="mobile-integrations__search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mobile-integrations__search-icon">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск интеграции..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mobile-integrations__search-input"
          />
          {searchQuery && (
            <button
              className="mobile-integrations__search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Очистить поиск"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Фильтры по категориям */}
        <div className="mobile-integrations__filters" ref={scrollContainerRef}>
          {categories.map(category => (
            <button
              key={category}
              className={`mobile-integrations__filter ${selectedCategory === category ? 'mobile-integrations__filter--active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
              {category !== 'Все' && (
                <span className="mobile-integrations__filter-count">
                  {INTEGRATIONS.filter(i => i.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Результаты */}
        <div className="mobile-integrations__results">
          <div className="mobile-integrations__results-text">
            Найдено: {filteredIntegrations.length}
          </div>
        </div>

        {/* Сетка интеграций */}
        {visibleIntegrations.length > 0 ? (
          <>
            <div className="mobile-integrations__grid">
              {visibleIntegrations.map((integration) => (
                <button
                  key={integration.id}
                  className="mobile-integrations__item"
                  onClick={() => handleIntegrationClick(integration)}
                >
                  <div className="mobile-integrations__logo">
                    <img 
                      src={integration.logoSrc} 
                      alt={integration.alt}
                      loading="lazy"
                    />
                  </div>
                  <div className="mobile-integrations__name">{integration.title}</div>
                  {integration.status && (
                    <div className={`mobile-integrations__status mobile-integrations__status--${integration.status}`}>
                      {integration.status === 'ready' ? 'Готово' : 'Через API'}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Кнопка "Показать ещё" */}
            {hasMore && (
              <div className="mobile-integrations__load-more">
                <button
                  className="mobile-integrations__load-more-btn"
                  onClick={handleLoadMore}
                >
                  Показать ещё ({filteredIntegrations.length - visibleCount})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mobile-integrations__empty">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
              <path d="M28 28l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>Ничего не найдено</p>
            <button
              className="mobile-integrations__reset"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Все');
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        )}

        {/* Информация */}
        <div className="mobile-integrations__info">
          <p>
            Не нашли нужную систему?{' '}
            <button
              className="mobile-integrations__contact"
              onClick={() => window.dispatchEvent(new CustomEvent('openApplyModal'))}
            >
              Свяжитесь с нами
            </button>
            {' '}— мы поможем с интеграцией через API.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileIntegrations;

