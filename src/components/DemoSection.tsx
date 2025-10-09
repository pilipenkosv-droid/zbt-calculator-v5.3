import React, { useState, useRef, useEffect } from 'react';
import './DemoSection.css';

type DemoSectionProps = {
  onSubmit?: (payload: Record<string, string | number | boolean>) => Promise<void> | void;
  policyUrl?: string;
};

export default function DemoSection({ onSubmit, policyUrl = '#' }: DemoSectionProps) {
  const demoRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    clinic: '',
    mis: '',
    baseSize: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const validatePhone = (v: string) => {
    const digits = v.replace(/[^\d+]/g, '');
    return /^(\+7|8)\d{10}$/.test(digits);
  };
  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / documentHeight, 1);
      setScrollProgress(progress);
      
      // Обновляем CSS переменную
      if (demoRef.current) {
        demoRef.current.style.setProperty('--scroll-progress', progress.toString());
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для инициализации

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const canSubmit =
    form.name.trim().length >= 2 &&
    validatePhone(form.phone) &&
    validateEmail(form.email) &&
    form.clinic.trim().length >= 2 &&
    form.mis.trim().length >= 2 &&
    /^\d{1,7}$/.test(form.baseSize) &&
    form.consent;

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setStatus('sending');
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        clinic: form.clinic.trim(),
        mis: form.mis.trim(),
        baseSize: Number(form.baseSize),
        consent: form.consent,
        ts: new Date().toISOString(),
      };
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        console.log('Demo payload', payload);
      }
      setStatus('ok');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section 
      ref={demoRef}
      aria-labelledby="demo-title" 
      className="demo"
      data-scroll-progress={scrollProgress}
    >
      {/* Декоративные фигуры */}
      <div className="decorativeShapes">
        <div className="roundedSquare1"></div>
        <div className="roundedSquare2"></div>
        <div className="roundedSquare3"></div>
        <div className="star1"></div>
        <div className="star2"></div>
        <div className="star3"></div>
      </div>

      <div className="demo-form-container">
        <div className="header">
          <h2 id="demo-title">Оставьте заявку на демо</h2>
          <p className="subtitle">Демо с вашим расчётом: доходимость, повторные визиты, ROI.</p>
        </div>

        <form className="demo-form" onSubmit={handleSubmit} noValidate>
          <div className="demo-form-grid">
            <div className="demo-form-field">
              <label htmlFor="demo-name">Имя</label>
              <input
                id="demo-name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Иван"
                required
                aria-describedby={form.name.length > 0 && form.name.trim().length < 2 ? 'name-error' : undefined}
              />
              {form.name.length > 0 && form.name.trim().length < 2 && (
                <span id="name-error" className="hint">Минимум 2 символа</span>
              )}
            </div>

            <div className="demo-form-field">
              <label htmlFor="demo-phone">Телефон</label>
              <input
                id="demo-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+7 999 123-45-67"
                required
                aria-describedby={!validatePhone(form.phone) && form.phone.length > 0 ? 'phone-error' : undefined}
              />
              {!validatePhone(form.phone) && form.phone.length > 0 && (
                <span id="phone-error" className="hint">Формат: +7XXXXXXXXXX или 8XXXXXXXXXX</span>
              )}
            </div>

            <div className="demo-form-field">
              <label htmlFor="demo-email">Email</label>
              <input
                id="demo-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@clinic.ru"
                required
                aria-describedby={!validateEmail(form.email) && form.email.length > 0 ? 'email-error' : undefined}
              />
              {!validateEmail(form.email) && form.email.length > 0 && (
                <span id="email-error" className="hint">Проверьте формат email</span>
              )}
            </div>

            <div className="demo-form-field">
              <label htmlFor="demo-clinic">Клиника</label>
              <input
                id="demo-clinic"
                type="text"
                value={form.clinic}
                onChange={(e) => handleChange('clinic', e.target.value)}
                placeholder="ООО «Здоровье+»"
                required
                aria-describedby={form.clinic.length > 0 && form.clinic.trim().length < 2 ? 'clinic-error' : undefined}
              />
              {form.clinic.length > 0 && form.clinic.trim().length < 2 && (
                <span id="clinic-error" className="hint">Минимум 2 символа</span>
              )}
            </div>

            <div className="demo-form-field">
              <label htmlFor="demo-mis">Медицинская ИС (МИС)</label>
              <input
                id="demo-mis"
                type="text"
                value={form.mis}
                onChange={(e) => handleChange('mis', e.target.value)}
                placeholder="Например: МИС Инфоклиника, 1С:Медицина, Medwork"
                required
                aria-describedby={form.mis.length > 0 && form.mis.trim().length < 2 ? 'mis-error' : undefined}
              />
              {form.mis.length > 0 && form.mis.trim().length < 2 && (
                <span id="mis-error" className="hint">Минимум 2 символа</span>
              )}
            </div>

            <div className="demo-form-field">
              <label htmlFor="demo-base-size">Размер базы пациентов</label>
              <input
                id="demo-base-size"
                type="number"
                inputMode="numeric"
                value={form.baseSize}
                onChange={(e) => handleChange('baseSize', e.target.value)}
                placeholder="Напр. 12000"
                required
                min={1}
                max={9999999}
                aria-describedby={form.baseSize.length > 0 && !/^\d{1,7}$/.test(form.baseSize) ? 'base-error' : undefined}
              />
              {form.baseSize.length > 0 && !/^\d{1,7}$/.test(form.baseSize) && (
                <span id="base-error" className="hint">Введите число от 1 до 9,999,999</span>
              )}
            </div>
          </div>

          <div className="demo-form-actions">
            <label className="demo-form-consent">
              <input
                id="demo-consent"
                type="checkbox"
                checked={form.consent}
                onChange={(e) => handleChange('consent', e.target.checked)}
                required
                aria-required="true"
                aria-describedby="consent-error"
              />
              <span>Согласен(на) на обработку персональных данных</span>
              {!form.consent && (
                <span id="consent-error" className="demo-form-consent-note">Обязательно для отправки</span>
              )}
            </label>

            <button 
              className="demo-form-submit"
              type="submit" 
              disabled={!canSubmit || status === 'sending'}
              aria-describedby={status === 'ok' ? 'success-message' : status === 'error' ? 'error-message' : undefined}
            >
              {status === 'sending' ? 'Отправляем…' : 'Получить демо с расчётом'}
            </button>
            {status === 'ok' && <span id="success-message" className="ok">Спасибо! Свяжемся в ближайшее время.</span>}
            {status === 'error' && <span id="error-message" className="err">Ошибка отправки. Попробуйте ещё раз.</span>}
          </div>

          <p className="demo-form-note">
            Нажимая кнопку, вы подтверждаете согласие на{' '}
            <a href={policyUrl} target="_blank" rel="noopener noreferrer">обработку персональных данных</a>
            {' '}и получение информационных сообщений.
          </p>
        </form>
      </div>
    </section>
  );
}