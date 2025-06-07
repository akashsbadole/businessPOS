import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePWA } from "./pwa-provider";

interface PWAInstallButtonProps {
  variant?: "solid" | "flat" | "light" | "ghost";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "flat",
  size = "sm",
  showText = false,
  className = "",
}) => {
  const { isInstallable, isInstalled, installPWA } = usePWA();

  // Don't show if not installable or already installed
  if (!isInstallable || isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    try {
      const success = await installPWA();
      if (success) {
        console.log('PWA installed successfully');
      }
    } catch (error) {
      console.error('Failed to install PWA:', error);
    }
  };

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onPress={handleInstall}
      startContent={<Icon icon="lucide:download" />}
      className={className}
    >
      {showText ? "Install App" : undefined}
    </Button>
  );

  if (showText) {
    return buttonContent;
  }

  return (
    <Tooltip content="Install Smart POS as an app">
      {buttonContent}
    </Tooltip>
  );
};
