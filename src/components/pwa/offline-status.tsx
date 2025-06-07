import React from "react";
import { Chip, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export const OfflineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowOfflineMessage(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Status Indicator */}
      <Chip
        size="sm"
        color={isOnline ? "success" : "danger"}
        variant="flat"
        startContent={
          <Icon 
            icon={isOnline ? "lucide:wifi" : "lucide:wifi-off"} 
            className="w-3 h-3"
          />
        }
      >
        {isOnline ? "Online" : "Offline"}
      </Chip>

      {/* Offline Message */}
      {showOfflineMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="border-orange-200 bg-orange-50">
            <CardBody className="p-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:wifi-off" className="text-orange-600" />
                <span className="text-sm text-orange-800">
                  You're offline. Some features may be limited.
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
};

// Hook for online/offline status
export const useOnlineStatus = () => {
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

  return isOnline;
};
