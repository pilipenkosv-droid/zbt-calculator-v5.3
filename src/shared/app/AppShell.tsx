import React, { Suspense, lazy } from 'react';
import type { Platform } from '../types/platform';
import { usePlatform } from '../platform/usePlatform';

// Динамические импорты платформенных приложений
const MobileApp = lazy(() => import('../../platforms/mobile/MobileApp'));
const DesktopApp = lazy(() => import('../../platforms/desktop/DesktopApp'));

/**
 * Компонент загрузки
 */
const AppLoader: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#FFFFFF',
    color: '#1A1A1A',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #F3F4F6',
        borderTopColor: '#FF6A00',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <div style={{ fontSize: '14px', color: '#6B7280' }}>
        Загрузка...
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

/**
 * Интерфейс пропсов AppShell
 */
export interface AppShellProps {
  /** Принудительная платформа (для тестирования) */
  forcePlatform?: Platform;
}

/**
 * AppShell - точка композиции платформенных приложений
 * Определяет платформу и загружает соответствующую реализацию
 */
export const AppShell: React.FC<AppShellProps> = ({ forcePlatform }) => {
  const detection = usePlatform();
  const platform = forcePlatform || detection.platform;

  // Логирование для отладки
  React.useEffect(() => {
    console.log(`[AppShell] Platform detected: ${platform}`, {
      screenWidth: detection.screenWidth,
      isTouch: detection.isTouch,
      forced: !!forcePlatform
    });
  }, [platform, detection, forcePlatform]);

  return (
    <Suspense fallback={<AppLoader />}>
      {platform === 'mobile' ? (
        <MobileApp detection={detection} />
      ) : (
        <DesktopApp detection={detection} />
      )}
    </Suspense>
  );
};

export default AppShell;

