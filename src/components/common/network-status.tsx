import React, { useState, useEffect } from 'react';
import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface NetworkStatusProps {
  className?: string;
  showLabel?: boolean;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
  className = "", 
  showLabel = true 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection?.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection?.effectiveType || 'unknown');
      };
      
      connection?.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection?.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusColor = () => {
    if (!isOnline) return 'danger';
    if (connectionType === 'slow-2g' || connectionType === '2g') return 'warning';
    return 'success';
  };

  const getStatusIcon = () => {
    if (!isOnline) return 'lucide:wifi-off';
    if (connectionType === 'slow-2g' || connectionType === '2g') return 'lucide:wifi-low';
    return 'lucide:wifi';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (connectionType === 'slow-2g') return 'Slow Connection';
    if (connectionType === '2g') return '2G Connection';
    if (connectionType === '3g') return '3G Connection';
    if (connectionType === '4g') return '4G Connection';
    return 'Online';
  };

  return (
    <Chip
      color={getStatusColor()}
      variant="flat"
      size="sm"
      startContent={<Icon icon={getStatusIcon()} className="text-sm" />}
      className={className}
    >
      {showLabel && getStatusText()}
    </Chip>
  );
};

export default NetworkStatus;
