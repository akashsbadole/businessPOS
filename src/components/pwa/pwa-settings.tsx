import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Switch,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePWA } from "./pwa-provider";

export const PWASettings: React.FC = () => {
  const { isInstallable, isInstalled, installPWA, updateAvailable, updateApp, isOnline } = usePWA();
  const [notifications, setNotifications] = React.useState(false);
  const [autoUpdate, setAutoUpdate] = React.useState(true);
  const [offlineMode, setOfflineMode] = React.useState(true);

  React.useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotifications(Notification.permission === 'granted');
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('pwa-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAutoUpdate(settings.autoUpdate ?? true);
      setOfflineMode(settings.offlineMode ?? true);
    }
  }, []);

  const saveSettings = (newSettings: any) => {
    const settings = {
      autoUpdate,
      offlineMode,
      ...newSettings,
    };
    localStorage.setItem('pwa-settings', JSON.stringify(settings));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
      
      if (permission === 'granted') {
        new Notification('Smart POS', {
          body: 'Notifications enabled! You\'ll receive updates about your business.',
          icon: '/pwa-192x192.png',
        });
      }
    }
  };

  const handleAutoUpdateChange = (enabled: boolean) => {
    setAutoUpdate(enabled);
    saveSettings({ autoUpdate: enabled });
  };

  const handleOfflineModeChange = (enabled: boolean) => {
    setOfflineMode(enabled);
    saveSettings({ offlineMode: enabled });
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      alert('Cache cleared successfully!');
    }
  };

  const getStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage ? Math.round(estimate.usage / 1024 / 1024) : 0,
        quota: estimate.quota ? Math.round(estimate.quota / 1024 / 1024) : 0,
      };
    }
    return { used: 0, quota: 0 };
  };

  const [storageInfo, setStorageInfo] = React.useState({ used: 0, quota: 0 });

  React.useEffect(() => {
    getStorageUsage().then(setStorageInfo);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">📱 PWA Settings</h2>
        <p className="text-gray-600">Manage Progressive Web App features and settings</p>
      </div>

      {/* Installation Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Installation Status</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon="lucide:smartphone" className="text-2xl text-blue-500" />
              <div>
                <p className="font-medium">App Installation</p>
                <p className="text-sm text-gray-600">
                  {isInstalled ? 'App is installed' : 'App is not installed'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Chip
                color={isInstalled ? "success" : isInstallable ? "warning" : "default"}
                variant="flat"
              >
                {isInstalled ? "Installed" : isInstallable ? "Installable" : "Not Available"}
              </Chip>
              {isInstallable && !isInstalled && (
                <Button
                  color="primary"
                  size="sm"
                  onPress={installPWA}
                  startContent={<Icon icon="lucide:download" />}
                >
                  Install
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon="lucide:wifi" className="text-2xl text-green-500" />
              <div>
                <p className="font-medium">Connection Status</p>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'Connected to internet' : 'Working offline'}
                </p>
              </div>
            </div>
            <Chip
              color={isOnline ? "success" : "warning"}
              variant="flat"
            >
              {isOnline ? "Online" : "Offline"}
            </Chip>
          </div>

          {updateAvailable && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:download" className="text-2xl text-blue-500" />
                <div>
                  <p className="font-medium">Update Available</p>
                  <p className="text-sm text-gray-600">A new version is ready to install</p>
                </div>
              </div>
              <Button
                color="primary"
                size="sm"
                onPress={updateApp}
                startContent={<Icon icon="lucide:refresh-cw" />}
              >
                Update Now
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* PWA Features */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">PWA Features</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-600">
                Receive updates about sales, inventory, and system alerts
              </p>
            </div>
            <Switch
              isSelected={notifications}
              onValueChange={requestNotificationPermission}
            />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Updates</p>
              <p className="text-sm text-gray-600">
                Automatically install app updates when available
              </p>
            </div>
            <Switch
              isSelected={autoUpdate}
              onValueChange={handleAutoUpdateChange}
            />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Offline Mode</p>
              <p className="text-sm text-gray-600">
                Enable offline functionality for essential features
              </p>
            </div>
            <Switch
              isSelected={offlineMode}
              onValueChange={handleOfflineModeChange}
            />
          </div>
        </CardBody>
      </Card>

      {/* Storage & Cache */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Storage & Cache</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Storage Usage</p>
              <p className="text-sm text-gray-600">
                {storageInfo.used} MB used of {storageInfo.quota} MB available
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {storageInfo.quota > 0 ? Math.round((storageInfo.used / storageInfo.quota) * 100) : 0}% used
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="flat"
              onPress={clearCache}
              startContent={<Icon icon="lucide:trash-2" />}
            >
              Clear Cache
            </Button>
            <Button
              variant="flat"
              onPress={() => getStorageUsage().then(setStorageInfo)}
              startContent={<Icon icon="lucide:refresh-cw" />}
            >
              Refresh Usage
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* PWA Info */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">About PWA</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Progressive Web App (PWA)</strong> features make Smart POS work like a native app:
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Install on home screen for quick access</li>
              <li>• Work offline with cached data</li>
              <li>• Receive push notifications</li>
              <li>• Automatic updates in background</li>
              <li>• Fast loading with service worker caching</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
