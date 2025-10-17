import React, { useState, useEffect, useRef } from 'react';
import { track } from '../utils/analytics';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: any) => void;
  calcData?: {
    months: number;
    baseSize: number;
    branches: number;
    whatsappNumbers: number;
    mmLevel: string;
    supportLevel: string;
    monthly: number;
    total: number;
    discountPercent: number;
    breakdown: any;
  };
}

const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, onSubmit, calcData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    clinic: '',
    phone: '',
    email: '',
    mis: ''
  });
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});
  const fullNameRef = useRef<HTMLInputElement>(null);

  // Нормализация телефона: +7XXXXXXXXXX
  const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    // Если начинается с 8 — переведём в 7
    const tail = digits.startsWith('8') ? digits.slice(1) : digits.startsWith('7') ? digits.slice(1) : digits;
    return '+7 ' + tail.replace(/(\d{3})(\d{3})(\d{2})(\d{2})?/, (_, a, b, c, d) => [a, b, c, d].filter(Boolean).join(' '));
  };

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    // +7 и 10 цифр хвоста
    const tail = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits;
    return tail.length === 10;
  };

  const isValidEmail = (value: string) => {
    if (!value) return true; // необязательное
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Валидация формы
  useEffect(() => {
    const okName = formData.fullName.trim().length >= 2;
    const okClinic = formData.clinic.trim().length >= 2;
    const okPhone = isValidPhone(formData.phone);
    const okEmail = isValidEmail(formData.email);
    const okMis = !!formData.mis;

    const newErrors = {
      fullName: !okName,
      clinic: !okClinic,
      phone: !okPhone,
      email: !okEmail,
      mis: !okMis
    };

    setErrors(newErrors);
    setIsValid(okName && okClinic && okPhone && okEmail && okMis);
  }, [formData]);

  useEffect(() => {
    if (isOpen && fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Нормализация номера телефона
      const normalized = normalizePhone(value);
      setFormData(prev => ({ ...prev, [name]: normalized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const payload = {
      contact: {
        fullName: formData.fullName.trim(),
        clinic: formData.clinic.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        mis: formData.mis
      },
      calc: calcData || {
        months: 9,
        baseSize: 35000,
        branches: 1,
        whatsappNumbers: 0,
        mmLevel: 'Advanced',
        supportLevel: 'weekday',
        monthly: 51800,
        total: 396270,
        discountPercent: 15,
        breakdown: { mm: 29900, base: 11830, branches: 5070, whatsapp: 0, support: 5000 }
      },
      timestamp: new Date().toISOString(),
      source: 'calculator_apply'
    };
    
    // Трекинг
    track('apply_submit', payload);
    
    // Отправка данных (если функция передана)
    if (onSubmit) {
      onSubmit(payload);
    }
    
    // Имитация успеха: закрыть и показать короткий тост
    onClose();
    showToast('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
    
    // Сброс формы
    setFormData({
      fullName: '',
      clinic: '',
      phone: '',
      email: '',
      mis: ''
    });
  };

  const handleClose = () => {
    track('modal_close', { type: 'apply_contact' });
    onClose();
  };

  // Простой toast
  const showToast = (text: string) => {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.bottom = '24px';
    el.style.transform = 'translateX(-50%)';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '12px';
    el.style.backdropFilter = 'blur(10px)';
    el.style.background = 'rgba(255,255,255,0.12)';
    el.style.border = '1px solid rgba(255,255,255,0.18)';
    el.style.color = 'var(--text)';
    el.style.zIndex = '1001';
    document.body.appendChild(el);
    setTimeout(() => { 
      el.remove(); 
      track('toast_show', { type: 'apply_success' }); 
    }, 2500);
  };

  // Обработка клавиши Escape и блокировка скролла
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Блокируем скролл
      track('modal_open', { type: 'apply_contact' });
    } else {
      document.body.style.overflow = ''; // Разблокируем скролл
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Разблокируем скролл при размонтировании
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      id="applyModal"
      className={`modal ${!isOpen ? 'hidden' : ''}`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="apply-modal-title"
    >
      <div className="modal-backdrop" onClick={handleClose}></div>
      <div className="modal-card" role="document">
        <div className="modal-header">
          <h3 id="apply-modal-title" className="modal-title">Заявка на подключение</h3>
          <button 
            id="closeApply" 
            className="modal-close" 
            aria-label="Закрыть"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>
        
        <form id="applyForm" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="fullName">Имя Фамилия</label>
            <input 
              id="fullName" 
              name="fullName" 
              type="text" 
              placeholder="Иван Иванов" 
              value={formData.fullName}
              onChange={handleInputChange}
              ref={fullNameRef}
              className={errors.fullName ? 'error' : ''}
              required 
            />
            <div className="field-note">Как к вам обращаться</div>
          </div>

          <div className="form-row">
            <label htmlFor="clinic">Название клиники</label>
            <input 
              id="clinic" 
              name="clinic" 
              type="text" 
              placeholder="Клиника «Здоровье+»" 
              value={formData.clinic}
              onChange={handleInputChange}
              className={errors.clinic ? 'error' : ''}
              required 
            />
            <div className="field-note">Юр. лицо или бренд</div>
          </div>

          <div className="form-row">
            <label htmlFor="phone">Номер телефона</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              inputMode="tel" 
              placeholder="+7 ___ ___‑__‑__" 
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              required 
            />
            <div className="field-note">Формат: +7 и 10 цифр</div>
          </div>

          <div className="form-row">
            <label htmlFor="email">Email (необязательно)</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="name@clinic.ru" 
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            <div className="field-note">Для отправки КП и счёта</div>
          </div>

          <div className="form-row">
            <label htmlFor="mis">Медицинская ИС (МИС)</label>
            <select 
              id="mis" 
              name="mis" 
              value={formData.mis}
              onChange={handleInputChange}
              className={errors.mis ? 'error' : ''}
              required
            >
              <option value="" disabled>Выберите МИС</option>
              <option value="Dental4Windows">Dental4Windows</option>
              <option value="ИНФОДЕНТ">ИНФОДЕНТ</option>
              <option value="IDENT">IDENT</option>
              <option value="DENTAL PRO">DENTAL PRO</option>
              <option value="ИНФОКЛИНИКА">ИНФОКЛИНИКА</option>
              <option value="Дент (ООО АП-DENT)">Дент (ООО АП-DENT)</option>
              <option value="1С: Стоматология">1С: Стоматология</option>
              <option value="STOMX">STOMX</option>
              <option value="UNIVERSE SOFT">UNIVERSE SOFT</option>
              <option value="АДЕНТА">АДЕНТА</option>
              <option value="STOMPRO">STOMPRO</option>
              <option value="RENOVATIO">RENOVATIO</option>
              <option value="МЕДИАЛОГ">МЕДИАЛОГ</option>
              <option value="КЛИНИКА ОНЛАЙН">КЛИНИКА ОНЛАЙН</option>
              <option value="ISTOM">ISTOM</option>
              <option value="ФЕНИКС">ФЕНИКС</option>
              <option value="MEDODS">MEDODS</option>
              <option value="Другое">Другое</option>
            </select>
            <div className="field-note">Укажете, если интеграция уже есть</div>
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              id="submitApply" 
              className="btn btn-primary" 
              disabled={!isValid}
            >
              Отправить
            </button>
            <button 
              type="button" 
              id="cancelApply" 
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
