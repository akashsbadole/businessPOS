import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Divider,
  Badge,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{
    name: string;
    path: string;
    icon: string;
    badge?: number;
  }>;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  subscription?: {
    planType: string;
    daysRemaining?: number;
  };
  onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  navItems,
  user,
  subscription,
  onLogout,
}) => {
  const location = useLocation();

  const handleNavClick = (path: string) => {
    onClose();
    // Small delay to allow drawer to close smoothly
    setTimeout(() => {
      window.location.href = path;
    }, 150);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="left"
      size="sm"
      classNames={{
        base: "data-[placement=left]:sm:m-2 data-[placement=left]:sm:rounded-medium",
        header: "border-b border-divider",
        body: "px-0",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Icon
                icon="lucide:shopping-bag"
                className="text-primary text-2xl"
              />
              <h2 className="text-xl font-bold text-primary">businessPOS</h2>
            </div>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="mt-3 p-3 bg-content2 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon icon="lucide:user" className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-default-500 capitalize">
                    {user.role}
                  </p>
                  {subscription && (
                    <Chip
                      size="sm"
                      color={subscription.daysRemaining && subscription.daysRemaining <= 7 ? "danger" : "primary"}
                      variant="flat"
                      className="mt-1"
                    >
                      {subscription.planType} Plan
                      {subscription.daysRemaining && subscription.daysRemaining <= 30 && 
                        ` • ${subscription.daysRemaining}d left`
                      }
                    </Chip>
                  )}
                </div>
              </div>
            </div>
          )}
        </DrawerHeader>

        <DrawerBody>
          <div className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "solid" : "light"}
                  color={isActive ? "primary" : "default"}
                  className={`justify-start h-12 px-4 ${
                    isActive ? "font-medium" : ""
                  }`}
                  startContent={
                    <Icon 
                      icon={item.icon} 
                      className={`text-lg ${isActive ? "text-white" : "text-default-600"}`} 
                    />
                  }
                  endContent={
                    item.badge ? (
                      <Badge
                        content={item.badge}
                        color="danger"
                        size="sm"
                        className="ml-auto"
                      />
                    ) : null
                  }
                  onPress={() => handleNavClick(item.path)}
                >
                  <span className={`flex-1 text-left ${isActive ? "text-white" : ""}`}>
                    {item.name}
                  </span>
                </Button>
              );
            })}
          </div>

          <Divider className="my-4" />

          {/* Quick Actions */}
          <div className="px-2 space-y-2">
            <p className="text-xs font-medium text-default-500 px-4 mb-2">
              QUICK ACTIONS
            </p>
            
            <Button
              variant="light"
              className="justify-start h-10 px-4"
              startContent={<Icon icon="lucide:help-circle" className="text-lg" />}
            >
              Help & Support
            </Button>
            
            <Button
              variant="light"
              className="justify-start h-10 px-4"
              startContent={<Icon icon="lucide:settings" className="text-lg" />}
              onPress={() => handleNavClick("/settings")}
            >
              Settings
            </Button>
            
            <Button
              variant="light"
              color="danger"
              className="justify-start h-10 px-4"
              startContent={<Icon icon="lucide:log-out" className="text-lg" />}
              onPress={() => {
                onClose();
                onLogout();
              }}
            >
              Sign Out
            </Button>
          </div>

          {/* App Info */}
          <div className="mt-auto px-4 py-4 border-t border-divider">
            <div className="flex items-center justify-between text-xs text-default-500">
              <span>Version 1.0.0</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
