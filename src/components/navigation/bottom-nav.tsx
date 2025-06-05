import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@heroui/react";
import { Icon } from "@iconify/react";

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className = "" }) => {
  const location = useLocation();

  const bottomNavItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: "lucide:layout-dashboard",
      activeIcon: "lucide:layout-dashboard"
    },
    { 
      name: "POS", 
      path: "/pos", 
      icon: "lucide:shopping-cart",
      activeIcon: "lucide:shopping-cart",
      badge: 0 // Will be updated with cart count
    },
    { 
      name: "Inventory", 
      path: "/inventory", 
      icon: "lucide:package",
      activeIcon: "lucide:package"
    },
    { 
      name: "Reports", 
      path: "/reports", 
      icon: "lucide:bar-chart",
      activeIcon: "lucide:bar-chart"
    },
    { 
      name: "More", 
      path: "/settings", 
      icon: "lucide:menu",
      activeIcon: "lucide:menu"
    },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-divider ${className}`}>
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 h-full px-1 transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-default-500 hover:text-default-700"
              }`}
            >
              <div className="relative">
                <Icon 
                  icon={isActive ? item.activeIcon : item.icon} 
                  className={`text-xl ${isActive ? "text-primary" : ""}`}
                />
                {item.badge && item.badge > 0 && (
                  <Badge
                    content={item.badge}
                    color="danger"
                    size="sm"
                    className="absolute -top-1 -right-1"
                  />
                )}
              </div>
              <span className={`text-xs mt-1 truncate max-w-full ${
                isActive ? "font-medium text-primary" : ""
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
