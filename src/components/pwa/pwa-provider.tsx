import React from "react";
import { PWAInstallPrompt, usePWAInstall } from "./pwa-install-prompt";
import { PWAUpdateNotification, usePWAUpdate } from "./pwa-update-notification";
import { OfflineStatus } from "./offline-status";

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const { isInstallable, installPWA } = usePWAInstall();
  const { updateAvailable, updateApp, dismissUpdate } = usePWAUpdate();
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);

  // Show install prompt after a delay if app is installable
  React.useEffect(() => {
    if (isInstallable) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000); // Show after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowInstallPrompt(false);
    }
  };

  return (
    <>
      {children}
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt
        isOpen={showInstallPrompt}
        onClose={() => setShowInstallPrompt(false)}
        onInstall={handleInstall}
      />

      {/* PWA Update Notification */}
      <PWAUpdateNotification
        isVisible={updateAvailable}
        onUpdate={updateApp}
        onDismiss={dismissUpdate}
      />

      {/* Offline Status in top-right corner */}
      <div className="fixed top-4 right-4 z-40">
        <OfflineStatus />
      </div>
    </>
  );
};

// PWA Context for accessing PWA features throughout the app
interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  installPWA: () => Promise<boolean>;
  updateAvailable: boolean;
  updateApp: () => void;
  isOnline: boolean;
}

const PWAContext = React.createContext<PWAContextType | undefined>(undefined);

export const PWAContextProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const { updateAvailable, updateApp } = usePWAUpdate();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value: PWAContextType = {
    isInstallable,
    isInstalled,
    installPWA,
    updateAvailable,
    updateApp,
    isOnline,
  };

  return (
    <PWAContext.Provider value={value}>
      <PWAProvider>{children}</PWAProvider>
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = React.useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAContextProvider');
  }
  return context;
};
