import React, { useState } from 'react';
import './MobileApplicationForm.css';
import { track } from '../../../utils/analytics';

interface FormData {
  // Шаг 1: Контакты
  name: string;
  phone: string;
  email: string;
  // Шаг 2: Клиника
  clinic: string;
  mis: string;
  // Шаг 3: База
  baseSize: string;
  consent: boolean;
}

interface MobileApplicationFormProps {
  onSubmit?: (data: FormData) => Promise<void> | void;
  policyUrl?: string;
}

/**
 * Многошаговая форма заявки для мобильных
 * 3 шага: Контакты → Клиника → База
 * С валидацией, масками и экраном успеха
 */
const MobileApplicationForm: React.FC<MobileApplicationFormProps> = ({ 
  onSubmit,
  policyUrl = 'https://zabota.tech/personal',
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    clinic: '',
    mis: '',
    baseSize: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const totalSteps = 3;

  // Валидация
  const validateField = (field: keyof FormData, value: string | boolean): string => {
    switch (field) {
      case 'name':
        if (typeof value === 'string' && value.trim().length < 2) {
          return 'Имя должно содержать минимум 2 символа';
        }
        return '';
      
      case 'phone':
        const phoneDigits = typeof value === 'string' ? value.replace(/\D/g, '') : '';
        if (phoneDigits.length < 11) {
          return 'Введите корректный номер телефона';
        }
        return '';
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string' && !emailRegex.test(value)) {
          return 'Введите корректный email';
        }
        return '';
      
      case 'clinic':
        if (typeof value === 'string' && value.trim().length < 2) {
          return 'Введите название клиники';
        }
        return '';
      
      case 'mis':
        if (typeof value === 'string' && value.trim().length < 2) {
          return 'Выберите или введите МИС';
        }
        return '';
      
      case 'baseSize':
        const size = typeof value === 'string' ? parseInt(value, 10) : 0;
        if (isNaN(size) || size < 100) {
          return 'Минимум 100 пациентов';
        }
        if (size > 10000000) {
          return 'Максимум 10 000 000';
        }
        return '';
      
      case 'consent':
        if (!value) {
          return 'Необходимо согласие на обработку ПДн';
        }
        return '';
      
      default:
        return '';
    }
  };

  // Маска для телефона
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    
    let formatted = '+7';
    if (digits.length > 1) {
      formatted += ' (' + digits.substring(1, 4);
    }
    if (digits.length >= 4) {
      formatted += ') ' + digits.substring(4, 7);
    }
    if (digits.length >= 7) {
      formatted += '-' + digits.substring(7, 9);
    }
    if (digits.length >= 9) {
      formatted += '-' + digits.substring(9, 11);
    }
    return formatted;
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    let processedValue = value;
    
    // Применить маску для телефона
    if (field === 'phone' && typeof value === 'string') {
      processedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Валидация при изменении (только если поле уже было touched)
    if (touched[field]) {
      const error = validateField(field, processedValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Проверка валидности текущего шага
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !validateField('name', formData.name) &&
          !validateField('phone', formData.phone) &&
          !validateField('email', formData.email) &&
          formData.name.trim().length >= 2 &&
          formData.phone.replace(/\D/g, '').length === 11 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );
      case 2:
        return (
          !validateField('clinic', formData.clinic) &&
          !validateField('mis', formData.mis) &&
          formData.clinic.trim().length >= 2 &&
          formData.mis.trim().length >= 2
        );
      case 3:
        return (
          !validateField('baseSize', formData.baseSize) &&
          !validateField('consent', formData.consent) &&
          parseInt(formData.baseSize, 10) >= 100 &&
          formData.consent === true
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    // Пометить все поля текущего шага как touched
    const fieldsInStep = getFieldsForStep(currentStep);
    const newTouched = { ...touched };
    const newErrors = { ...errors };
    
    fieldsInStep.forEach(field => {
      newTouched[field] = true;
      newErrors[field] = validateField(field, formData[field]);
    });
    
    setTouched(newTouched);
    setErrors(newErrors);

    if (isStepValid(currentStep)) {
      track('application_form_step', { step: currentStep, action: 'next' });
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    track('application_form_step', { step: currentStep, action: 'back' });
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Финальная валидация
    const fieldsInStep = getFieldsForStep(currentStep);
    const newTouched = { ...touched };
    const newErrors = { ...errors };
    
    fieldsInStep.forEach(field => {
      newTouched[field] = true;
      newErrors[field] = validateField(field, formData[field]);
    });
    
    setTouched(newTouched);
    setErrors(newErrors);

    if (!isStepValid(currentStep)) return;

    try {
      setStatus('sending');
      track('application_form_submit', {
        name: formData.name,
        clinic: formData.clinic,
        mis: formData.mis,
        baseSize: formData.baseSize,
      });

      if (onSubmit) {
        await onSubmit(formData);
      }

      setStatus('success');
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      track('application_form_error', { error: String(error) });
    }
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ['name', 'phone', 'email'];
      case 2:
        return ['clinic', 'mis'];
      case 3:
        return ['baseSize', 'consent'];
      default:
        return [];
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      phone: '',
      email: '',
      clinic: '',
      mis: '',
      baseSize: '',
      consent: false,
    });
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  // Экран успеха
  if (status === 'success') {
    return (
      <div className="mobile-form-success">
        <div className="mobile-form-success__icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#25D366" strokeWidth="4"/>
            <path d="M20 32l8 8 16-16" stroke="#25D366" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="mobile-form-success__title">Заявка отправлена!</h3>
        <p className="mobile-form-success__text">
          Спасибо, {formData.name}! Мы свяжемся с вами в течение 1 рабочего дня.
        </p>
        <div className="mobile-form-success__details">
          <div className="mobile-form-success__detail">
            <span className="mobile-form-success__detail-label">Ваш телефон:</span>
            <span className="mobile-form-success__detail-value">{formData.phone}</span>
          </div>
          <div className="mobile-form-success__detail">
            <span className="mobile-form-success__detail-label">Email:</span>
            <span className="mobile-form-success__detail-value">{formData.email}</span>
          </div>
        </div>
        <button
          className="mobile-form-success__reset"
          onClick={handleReset}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <div className="mobile-application-form">
      {/* Прогресс-индикатор */}
      <div className="mobile-form__progress">
        <div className="mobile-form__progress-bar">
          <div 
            className="mobile-form__progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mobile-form__progress-text">
          Шаг {currentStep} из {totalSteps}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mobile-form">
        {/* Шаг 1: Контакты */}
        {currentStep === 1 && (
          <div className="mobile-form__step">
            <h3 className="mobile-form__step-title">Ваши контакты</h3>
            
            <div className="mobile-form__field">
              <label className="mobile-form__label">
                Имя *
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Иван Иванов"
                  className={`mobile-form__input ${errors.name && touched.name ? 'mobile-form__input--error' : ''}`}
                />
              </label>
              {errors.name && touched.name && (
                <div className="mobile-form__error">{errors.name}</div>
              )}
            </div>

            <div className="mobile-form__field">
              <label className="mobile-form__label">
                Телефон *
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+7 (___) ___-__-__"
                  className={`mobile-form__input ${errors.phone && touched.phone ? 'mobile-form__input--error' : ''}`}
                />
              </label>
              {errors.phone && touched.phone && (
                <div className="mobile-form__error">{errors.phone}</div>
              )}
            </div>

            <div className="mobile-form__field">
              <label className="mobile-form__label">
                Email *
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="example@clinic.ru"
                  className={`mobile-form__input ${errors.email && touched.email ? 'mobile-form__input--error' : ''}`}
                />
              </label>
              {errors.email && touched.email && (
                <div className="mobile-form__error">{errors.email}</div>
              )}
            </div>
          </div>
        )}

        {/* Шаг 2: Клиника */}
        {currentStep === 2 && (
          <div className="mobile-form__step">
            <h3 className="mobile-form__step-title">О вашей клинике</h3>
            
            <div className="mobile-form__field">
              <label className="mobile-form__label">
                Название клиники *
                <input
                  type="text"
                  value={formData.clinic}
                  onChange={(e) => handleChange('clinic', e.target.value)}
                  onBlur={() => handleBlur('clinic')}
                  placeholder="Стоматология Smile"
                  className={`mobile-form__input ${errors.clinic && touched.clinic ? 'mobile-form__input--error' : ''}`}
                />
              </label>
              {errors.clinic && touched.clinic && (
                <div className="mobile-form__error">{errors.clinic}</div>
              )}
            </div>

            <div className="mobile-form__field">
              <label className="mobile-form__label">
                МИС (какую используете) *
                <input
                  type="text"
                  value={formData.mis}
                  onChange={(e) => handleChange('mis', e.target.value)}
                  onBlur={() => handleBlur('mis')}
                  placeholder="Dental Pro, iStom, 1С и др."
                  className={`mobile-form__input ${errors.mis && touched.mis ? 'mobile-form__input--error' : ''}`}
                  list="mis-suggestions"
                />
              </label>
              <datalist id="mis-suggestions">
                <option value="1С:Медицина Стоматология" />
                <option value="APDent" />
                <option value="D4W" />
                <option value="Dental Pro" />
                <option value="iDent" />
                <option value="iStom" />
                <option value="MedODS" />
                <option value="StomPro" />
                <option value="Другая" />
              </datalist>
              {errors.mis && touched.mis && (
                <div className="mobile-form__error">{errors.mis}</div>
              )}
            </div>
          </div>
        )}

        {/* Шаг 3: База */}
        {currentStep === 3 && (
          <div className="mobile-form__step">
            <h3 className="mobile-form__step-title">Размер базы пациентов</h3>
            
            <div className="mobile-form__field">
              <label className="mobile-form__label">
                Количество пациентов *
                <input
                  type="number"
                  value={formData.baseSize}
                  onChange={(e) => handleChange('baseSize', e.target.value)}
                  onBlur={() => handleBlur('baseSize')}
                  placeholder="Например: 12000"
                  min="100"
                  max="10000000"
                  className={`mobile-form__input ${errors.baseSize && touched.baseSize ? 'mobile-form__input--error' : ''}`}
                />
              </label>
              <div className="mobile-form__hint">
                Примерное количество пациентов в вашей базе
              </div>
              {errors.baseSize && touched.baseSize && (
                <div className="mobile-form__error">{errors.baseSize}</div>
              )}
            </div>

            <div className="mobile-form__field mobile-form__field--checkbox">
              <label className="mobile-form__checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => handleChange('consent', e.target.checked)}
                  onBlur={() => handleBlur('consent')}
                  className="mobile-form__checkbox"
                />
                <span className="mobile-form__checkbox-text">
                  Согласен на обработку{' '}
                  <a 
                    href={policyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mobile-form__link"
                  >
                    персональных данных
                  </a>
                </span>
              </label>
              {errors.consent && touched.consent && (
                <div className="mobile-form__error">{errors.consent}</div>
              )}
            </div>
          </div>
        )}

        {/* Навигация */}
        <div className="mobile-form__navigation">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="mobile-form__btn mobile-form__btn--secondary"
            >
              Назад
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="mobile-form__btn mobile-form__btn--primary"
            >
              Далее
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isStepValid(currentStep) || status === 'sending'}
              className="mobile-form__btn mobile-form__btn--primary"
            >
              {status === 'sending' ? 'Отправка...' : 'Отправить заявку'}
            </button>
          )}
        </div>

        {status === 'error' && (
          <div className="mobile-form__error-message">
            Произошла ошибка. Попробуйте ещё раз или свяжитесь с нами по телефону.
          </div>
        )}
      </form>
    </div>
  );
};

export default MobileApplicationForm;

