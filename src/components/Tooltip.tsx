import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg transition-opacity duration-200 whitespace-normal leading-relaxed";
    
    const positionClasses = {
      top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
      right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
    };

    return `${baseClasses} ${positionClasses[position]}`;
  };

  const handleClick = () => {
    if (isMobile) {
      setIsVisible(true);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isMobile) {
    return (
      <>
        <div 
          ref={triggerRef}
          className={`relative inline-block cursor-pointer ${className}`}
          onClick={handleClick}
        >
          {children}
        </div>

        {/* Модальный лист для мобильных */}
        {isVisible && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={handleClose}
            />
            
            {/* Modal sheet */}
            <div className="relative bg-white rounded-t-xl p-6 w-full max-w-md mx-4 mb-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Подсказка</h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{content}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <>
          <style>{`
            .tooltip-content {
              color: #FFFFFF !important;
              background-color: #1F2937 !important;
            }
            .tooltip-content * {
              color: #FFFFFF !important;
            }
            .tooltip-arrow {
              background-color: #1F2937 !important;
            }
          `}</style>
          <div
            ref={tooltipRef}
            className={`${getTooltipClasses()} tooltip-content`}
            style={{
              color: '#FFFFFF',
              backgroundColor: '#1F2937',
              maxWidth: '280px',
              minWidth: '200px'
            }}
          >
            <span style={{ color: '#FFFFFF' }}>{content}</span>
            {/* Arrow */}
            <div 
              className={`tooltip-arrow absolute w-2 h-2 transform rotate-45 ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
                position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
                'right-full top-1/2 -translate-y-1/2 -mr-1'
              }`}
              style={{ backgroundColor: '#1F2937' }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Tooltip;
