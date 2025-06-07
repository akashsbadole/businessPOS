import React from "react";
import { Button, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PWAInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  isOpen,
  onClose,
  onInstall,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:smartphone" className="text-2xl text-primary" />
            <span>Install Smart POS</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-600">
              Install Smart POS on your device for a better experience with:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:zap" className="text-yellow-500" />
                <span>Faster loading and better performance</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="lucide:wifi-off" className="text-blue-500" />
                <span>Works offline for essential features</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="lucide:home" className="text-green-500" />
                <span>Add to home screen for quick access</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="lucide:bell" className="text-purple-500" />
                <span>Push notifications for important updates</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="lucide:shield" className="text-red-500" />
                <span>Secure and always up-to-date</span>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardBody className="py-3">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:info" className="text-blue-600" />
                  <span className="text-sm text-blue-800">
                    This app works great on mobile devices and tablets for on-the-go sales.
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Maybe Later
          </Button>
          <Button 
            color="primary" 
            onPress={onInstall}
            startContent={<Icon icon="lucide:download" />}
          >
            Install App
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Hook for PWA installation
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return false;

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installPWA,
  };
};
