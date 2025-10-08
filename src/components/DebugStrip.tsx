import React from 'react';
import { CalculatorState } from '../types';
import { calculatePrice } from '../lib/pricing';
import { getActiveABTests } from '../utils/abTesting';

interface DebugStripProps {
  state: CalculatorState;
  currentStep?: string;
}

const DebugStrip: React.FC<DebugStripProps> = ({ state, currentStep }) => {
  const priceBreakdown = calculatePrice(state);
  const monthly = priceBreakdown.patientBase + priceBreakdown.branches + priceBreakdown.whatsapp + priceBreakdown.marketing + priceBreakdown.techSupport;
  const discountPercent = Math.round(priceBreakdown.periodDiscount + priceBreakdown.networkDiscount);
  const abTests = getActiveABTests();

  // Показываем только в dev режиме
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
        <span>period: {state.period}</span>
        <span>months: {state.period}</span>
        <span>baseSize: {state.patientBase}</span>
        <span>branches: {state.branches}</span>
        <span>whatsappNumbers: {state.whatsappNumbers}</span>
        <span>mmLevel: {state.marketingLevel}</span>
        <span>supportLevel: {state.techSupport}</span>
        <span>monthly: {monthly}</span>
        <span>total: {priceBreakdown.total}</span>
        <span>discountPercent: {discountPercent}%</span>
        <span className="text-yellow-400">ab: {abTests.periodTooltip}|{abTests.secondaryCTA}</span>
        <span className="text-green-400">funnel: {currentStep || 'view'}</span>
      </div>
    </div>
  );
};

export default DebugStrip;
