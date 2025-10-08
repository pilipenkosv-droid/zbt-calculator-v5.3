import { useState, useEffect } from 'react';
import { track } from '../utils/analytics';

export type FunnelStep = 'view' | 'edit' | 'breakdown' | 'cta_pdf' | 'cta_email' | 'submit';

export function useFunnelTracking() {
  const [currentStep, setCurrentStep] = useState<FunnelStep>('view');
  const [stepCounters, setStepCounters] = useState<Record<FunnelStep, number>>({
    view: 0,
    edit: 0,
    breakdown: 0,
    cta_pdf: 0,
    cta_email: 0,
    submit: 0
  });

  // Отслеживание просмотра страницы
  useEffect(() => {
    const abVariant = localStorage.getItem('calc_ab_period_tooltip') || 'A';
    track('calc_viewed', { ab: abVariant });
    track('funnel_step', { step: 'view' });
    setStepCounters(prev => ({ ...prev, view: prev.view + 1 }));
  }, []);

  // Отслеживание изменений параметров
  const trackParamChange = () => {
    if (currentStep === 'view') {
      setCurrentStep('edit');
      track('funnel_step', { step: 'edit' });
    }
    setStepCounters(prev => ({ ...prev, edit: prev.edit + 1 }));
  };

  // Отслеживание просмотра разложения цены
  const trackBreakdownView = () => {
    if (currentStep === 'edit') {
      setCurrentStep('breakdown');
      track('funnel_step', { step: 'breakdown' });
    }
    setStepCounters(prev => ({ ...prev, breakdown: prev.breakdown + 1 }));
    track('calc_breakdown_view');
  };

  // Отслеживание клика по PDF
  const trackPDFClick = () => {
    if (currentStep === 'breakdown') {
      setCurrentStep('cta_pdf');
      track('funnel_step', { step: 'cta_pdf' });
    }
    setStepCounters(prev => ({ ...prev, cta_pdf: prev.cta_pdf + 1 }));
  };

  // Отслеживание клика по email
  const trackEmailClick = () => {
    if (currentStep === 'breakdown') {
      setCurrentStep('cta_email');
      track('funnel_step', { step: 'cta_email' });
    }
    setStepCounters(prev => ({ ...prev, cta_email: prev.cta_email + 1 }));
  };

  // Отслеживание отправки заявки
  const trackSubmit = () => {
    setCurrentStep('submit');
    setStepCounters(prev => ({ ...prev, submit: prev.submit + 1 }));
    track('funnel_step', { step: 'submit' });
    
    // Отправляем результат A/B теста
    const abVariant = localStorage.getItem('calc_ab_period_tooltip') || 'A';
    track('ab_result', { 
      variant: abVariant, 
      success: true, 
      steps: stepCounters 
    });
  };

  return {
    currentStep,
    stepCounters,
    trackParamChange,
    trackBreakdownView,
    trackPDFClick,
    trackEmailClick,
    trackSubmit
  };
}
