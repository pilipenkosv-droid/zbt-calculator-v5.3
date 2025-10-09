import React, { useState, useRef, useEffect } from 'react';

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

      <div className="container">
        <div className="header">
          <h2 id="demo-title">Оставьте заявку на демо</h2>
          <p className="subtitle">Демо с вашим расчётом: доходимость, повторные визиты, ROI.</p>
        </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="grid">
          <label className="field">
            <span className="label">Имя</span>
            <input
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
          </label>

          <label className="field">
            <span className="label">Телефон</span>
            <input
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
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input
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
          </label>

          <label className="field">
            <span className="label">Клиника</span>
            <input
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
          </label>

          <label className="field">
            <span className="label">Медицинская ИС (МИС)</span>
            <input
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
          </label>

          <label className="field">
            <span className="label">Размер базы пациентов</span>
            <input
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
          </label>
        </div>

        <label className="consent">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => handleChange('consent', e.target.checked)}
            required
            aria-describedby="consent-error"
          />
          <span>Согласен(на) на обработку персональных данных</span>
          {!form.consent && (
            <span id="consent-error" className="hint">Обязательно для отправки</span>
          )}
        </label>

        <div className="actions">
          <button 
            type="submit" 
            disabled={!canSubmit || status === 'sending'}
            aria-describedby={status === 'ok' ? 'success-message' : status === 'error' ? 'error-message' : undefined}
          >
            {status === 'sending' ? 'Отправляем…' : 'Получить демо с расчётом'}
          </button>
          {status === 'ok' && <span id="success-message" className="ok">Спасибо! Свяжемся в ближайшее время.</span>}
          {status === 'error' && <span id="error-message" className="err">Ошибка отправки. Попробуйте ещё раз.</span>}
        </div>

        <p className="legal">
          Нажимая кнопку, вы подтверждаете согласие на{' '}
          <a href={policyUrl} target="_blank" rel="noopener noreferrer">обработку персональных данных</a>
          {' '}и получение информационных сообщений.
        </p>
      </form>
      </div>

      <style jsx>{`
        .demo { 
          position: relative;
          color: #FFFFFF;
          background: linear-gradient(135deg, #FF6A00 0%, #FF8C3A 50%, #FF6A00 100%);
          border-radius: 24px 24px 0 0; /* закругление только сверху */
          margin: 40px auto 0 auto; /* отступ сверху, без отступа снизу */
          max-width: 1200px;
          --scroll-progress: 0;
        }
        
        /* Контейнер для декоративных фигур */
        .decorativeShapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        
        /* Квадрат 1 с закругленными углами */
        .roundedSquare1 {
          position: absolute;
          top: 15%;
          right: 25%;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          transform: rotate(15deg);
          transition: transform 0.8s ease;
        }
        
        /* Квадрат 2 с закругленными углами */
        .roundedSquare2 {
          position: absolute;
          top: 45%;
          right: 15%;
          width: 35px;
          height: 35px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          transform: rotate(-20deg);
          transition: transform 0.8s ease;
        }
        
        /* Квадрат 3 с закругленными углами */
        .roundedSquare3 {
          position: absolute;
          bottom: 20%;
          right: 30%;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: 10px;
          transform: rotate(30deg);
          transition: transform 0.8s ease;
        }
        
        /* Звездочка 1 */
        .star1 {
          position: absolute;
          top: 25%;
          right: 50%;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.12);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transition: transform 0.8s ease;
        }
        
        /* Звездочка 2 */
        .star2 {
          position: absolute;
          top: 65%;
          right: 40%;
          width: 25px;
          height: 25px;
          background: rgba(255, 255, 255, 0.15);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transition: transform 0.8s ease;
        }
        
        /* Звездочка 3 */
        .star3 {
          position: absolute;
          top: 10%;
          right: 10%;
          width: 35px;
          height: 35px;
          background: rgba(255, 255, 255, 0.10);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transition: transform 0.8s ease;
        }
        
        /* Анимация фигур на основе скролла */
        .roundedSquare1 {
          animation: demoFloat1 7s ease-in-out infinite;
          transform: translate(
            calc(var(--scroll-progress, 0) * 40px),
            calc(var(--scroll-progress, 0) * -35px)
          ) rotate(calc(15deg + var(--scroll-progress, 0) * 50deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.2));
        }
        
        @keyframes demoFloat1 {
          0%, 100% { transform: translate(0px, 0px) rotate(15deg) scale(1); }
          50% { transform: translate(8px, -6px) rotate(25deg) scale(1.1); }
        }
        
        .roundedSquare2 {
          animation: demoFloat2 8s ease-in-out infinite;
          transform: translate(
            calc(var(--scroll-progress, 0) * -35px),
            calc(var(--scroll-progress, 0) * 40px)
          ) rotate(calc(-20deg + var(--scroll-progress, 0) * 50deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.3));
        }
        
        @keyframes demoFloat2 {
          0%, 100% { transform: translate(0px, 0px) rotate(-20deg) scale(1); }
          33% { transform: translate(-6px, 8px) rotate(-10deg) scale(1.15); }
          66% { transform: translate(4px, 5px) rotate(-30deg) scale(0.9); }
        }
        
        .roundedSquare3 {
          animation: demoFloat3 6s ease-in-out infinite;
          transform: translate(
            calc(var(--scroll-progress, 0) * 45px),
            calc(var(--scroll-progress, 0) * -30px)
          ) rotate(calc(30deg + var(--scroll-progress, 0) * 50deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.25));
        }
        
        @keyframes demoFloat3 {
          0%, 100% { transform: translate(0px, 0px) rotate(30deg) scale(1); }
          40% { transform: translate(10px, -5px) rotate(40deg) scale(1.08); }
          80% { transform: translate(-5px, -10px) rotate(20deg) scale(0.92); }
        }
        
        .star1 {
          animation: demoFloat4 5.5s ease-in-out infinite;
          transform: translate(
            calc(var(--scroll-progress, 0) * -40px),
            calc(var(--scroll-progress, 0) * 50px)
          ) rotate(calc(var(--scroll-progress, 0) * 270deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.4));
        }
        
        @keyframes demoFloat4 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          50% { transform: translate(-4px, 8px) rotate(180deg) scale(1.25); }
        }
        
        .star2 {
          animation: demoFloat5 8.5s ease-in-out infinite;
          transform: translate(
            calc(var(--scroll-progress, 0) * 35px),
            calc(var(--scroll-progress, 0) * -40px)
          ) rotate(calc(var(--scroll-progress, 0) * -150deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.35));
        }
        
        @keyframes demoFloat5 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          25% { transform: translate(6px, -4px) rotate(-90deg) scale(1.2); }
          75% { transform: translate(-2px, -6px) rotate(-180deg) scale(0.8); }
        }
        
        .star3 {
          animation: demoFloat6 7.5s ease-in-out infinite;
          transform: translate(
            calc(var(--scroll-progress, 0) * -45px),
            calc(var(--scroll-progress, 0) * -25px)
          ) rotate(calc(var(--scroll-progress, 0) * 360deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.5));
        }
        
        @keyframes demoFloat6 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          30% { transform: translate(-5px, -3px) rotate(120deg) scale(1.15); }
          70% { transform: translate(3px, -6px) rotate(240deg) scale(0.85); }
        }
        
        .container {
          position: relative;
          z-index: 2;
          padding: 48px 60px;
        }
        
        .header { 
          max-width: 900px; 
          margin: 0 auto 32px; 
          text-align: center; 
        }
        
        .header h2 {
          font-family: 'Navigo', 'Inter', sans-serif;
          font-size: 36px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #FFFFFF !important;
        }
        
        .subtitle { 
          color: #FFFFFF !important; 
          font-size: 16px;
          margin: 0;
          opacity: 0.9;
        }
        
        .form { 
          max-width: 900px; 
          margin: 0 auto; 
        }
        
        .grid { 
          display: grid; 
          gap: 20px; 
          grid-template-columns: 1fr; 
        }
        
        @media (min-width: 700px) { 
          .grid { 
            grid-template-columns: 1fr 1fr; 
          } 
        }
        
        .field { 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
        }
        
        .label { 
          color: #FFFFFF !important; 
          font-weight: 500;
          font-size: 14px;
        }
        
        input[type="text"], 
        input[type="tel"], 
        input[type="email"], 
        input[type="number"] {
          padding: 12px 16px; 
          border: 1px solid var(--border, #e5e5e5); 
          border-radius: 12px; 
          background: #ffffff !important;
          color: var(--fg, #1a1a1a);
          font-size: 15px;
          transition: border-color 0.2s ease;
        }
        
        input:focus {
          outline: none;
          border-color: var(--brand, #FF6A00);
          box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.1);
        }
        
        input:invalid {
          border-color: #dc2626;
        }
        
        .hint { 
          color: #dc2626; 
          font-size: 12px; 
          font-style: italic;
        }
        
        .consent { 
          margin: 24px 0; 
          display: flex; 
          flex-direction: column;
          gap: 8px;
        }
        
        .consent > div {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        
        .consent input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          accent-color: var(--brand, #FF6A00);
        }
        
        .consent span {
          font-size: 14px;
          line-height: 1.5;
          color: #FFFFFF !important;
        }
        
        .actions { 
          display: flex; 
          flex-direction: column;
          gap: 16px; 
          align-items: center;
          margin: 32px 0;
        }
        
        .actions button { 
          padding: 16px 32px; 
          font-weight: 600; 
          font-size: 16px;
          border: none;
          border-radius: 12px; 
          background: var(--brand, #FF6A00);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 280px;
        }
        
        .actions button:hover:not(:disabled) {
          background: var(--brand-press, #F55E00);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255, 106, 0, 0.3);
        }
        
        .actions button:disabled { 
          opacity: 0.6; 
          cursor: not-allowed; 
          transform: none;
          box-shadow: none;
        }
        
        .ok { 
          color: #16a34a; 
          font-weight: 500;
          text-align: center;
        }
        
        .err { 
          color: #dc2626; 
          font-weight: 500;
          text-align: center;
        }
        
        .legal { 
          margin-top: 24px; 
          color: #FFFFFF !important; 
          font-size: 13px; 
          text-align: center;
          line-height: 1.5;
          opacity: 0.8;
        }
        
        .legal a {
          color: #FFFFFF !important;
          text-decoration: underline;
        }
        
        .legal a:hover {
          text-decoration: none;
          opacity: 1;
        }
        
        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .container {
            padding: 32px 24px;
          }
          
          .actions button {
            min-width: 100%;
            padding: 14px 24px;
          }
          
          .consent {
            margin: 20px 0;
          }
          
          /* Адаптация декоративных фигур для мобильных */
          .roundedSquare1 {
            width: 35px;
            height: 35px;
            top: 10%;
            right: 20%;
            border-radius: 8px;
          }
          
          .roundedSquare2 {
            width: 25px;
            height: 25px;
            top: 50%;
            right: 10%;
            border-radius: 6px;
          }
          
          .roundedSquare3 {
            width: 30px;
            height: 30px;
            bottom: 15%;
            right: 25%;
            border-radius: 7px;
          }
          
          .star1 {
            width: 20px;
            height: 20px;
            top: 20%;
            right: 45%;
          }
          
          .star2 {
            width: 18px;
            height: 18px;
            top: 70%;
            right: 35%;
          }
          
          .star3 {
            width: 25px;
            height: 25px;
            top: 5%;
            right: 5%;
          }
          
          /* Уменьшенная анимация на мобильных */
          .roundedSquare1 {
            transform: translate(
              calc(var(--scroll-progress, 0) * 15px),
              calc(var(--scroll-progress, 0) * -12px)
            ) rotate(calc(15deg + var(--scroll-progress, 0) * 15deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.05));
          }
          
          .roundedSquare2 {
            transform: translate(
              calc(var(--scroll-progress, 0) * -12px),
              calc(var(--scroll-progress, 0) * 15px)
            ) rotate(calc(-20deg + var(--scroll-progress, 0) * 15deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.1));
          }
          
          .roundedSquare3 {
            transform: translate(
              calc(var(--scroll-progress, 0) * 18px),
              calc(var(--scroll-progress, 0) * -12px)
            ) rotate(calc(30deg + var(--scroll-progress, 0) * 15deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.08));
          }
          
          .star1 {
            transform: translate(
              calc(var(--scroll-progress, 0) * -15px),
              calc(var(--scroll-progress, 0) * 18px)
            ) rotate(calc(var(--scroll-progress, 0) * 90deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.15));
          }
          
          .star2 {
            transform: translate(
              calc(var(--scroll-progress, 0) * 12px),
              calc(var(--scroll-progress, 0) * -15px)
            ) rotate(calc(var(--scroll-progress, 0) * -45deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.12));
          }
          
          .star3 {
            transform: translate(
              calc(var(--scroll-progress, 0) * -18px),
              calc(var(--scroll-progress, 0) * -10px)
            ) rotate(calc(var(--scroll-progress, 0) * 135deg)) scale(calc(1 + var(--scroll-progress, 0) * 0.18));
          }
        }
      `}</style>
    </section>
  );
}
