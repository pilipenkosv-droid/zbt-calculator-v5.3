import React, { useState, useEffect, useRef } from 'react';
import { track } from '../utils/analytics';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [sendCalculation, setSendCalculation] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  useEffect(() => {
    setIsValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const payload = {
        email,
        params: {
          period: 12, // Будет передано из родительского компонента
          baseSize: 50000,
          branches: 1,
          whatsapp: 0,
          mmLevel: 'premium',
          support: 'weekdays'
        },
        breakdown: {}, // Будет передано из родительского компонента
        monthly: 0,
        total: 0,
        discountPercent: 0
      };
      
      track('calc_request_quote_email', payload);
      onSubmit(payload);
      setEmail('');
      setSendCalculation(true);
      onClose();
    }
  };

  const handleClose = () => {
    track('modal_close', { type: 'quote_email' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal" 
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <h3 id="modal-title" className="text-lg font-bold mb-4">Получить КП на email</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendCalculation"
              checked={sendCalculation}
              onChange={(e) => setSendCalculation(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="sendCalculation" className="text-sm text-white/80">
              Отправить расчёт и комплектацию
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary flex-1"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`btn flex-1 ${
                isValid 
                  ? 'btn-primary' 
                  : 'btn-secondary opacity-50 cursor-not-allowed'
              }`}
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
