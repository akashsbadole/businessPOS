import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PWAUpdateNotificationProps {
  isVisible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export const PWAUpdateNotification: React.FC<PWAUpdateNotificationProps> = ({
  isVisible,
  onUpdate,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-blue-200 bg-blue-50">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <Icon icon="lucide:download" className="text-blue-600 text-xl mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">
                App Update Available
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                A new version of Smart POS is available with improvements and bug fixes.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="primary"
                  onPress={onUpdate}
                  startContent={<Icon icon="lucide:refresh-cw" />}
                >
                  Update Now
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={onDismiss}
                >
                  Later
                </Button>
              </div>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onDismiss}
            >
              <Icon icon="lucide:x" />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Hook for PWA updates
export const usePWAUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration | null>(null);

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  const updateApp = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
  };

  return {
    updateAvailable,
    updateApp,
    dismissUpdate,
  };
};
