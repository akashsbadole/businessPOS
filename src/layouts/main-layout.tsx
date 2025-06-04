import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
  Button,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../contexts/auth-context";
import { useSubscription } from "../contexts/subscription-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { subscription, daysRemaining } = useSubscription();
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/", icon: "lucide:layout-dashboard" },
    { name: "POS", path: "/pos", icon: "lucide:shopping-cart" },
    { name: "Inventory", path: "/inventory", icon: "lucide:package" },
    { name: "Customers", path: "/customers", icon: "lucide:users" },
    { name: "Suppliers", path: "/suppliers", icon: "lucide:truck" },
    {
      name: "Purchase Orders",
      path: "/purchase-orders",
      icon: "lucide:clipboard-list",
    },
    { name: "Reports", path: "/reports", icon: "lucide:bar-chart" },
    {
      name: "Business Settings",
      path: "/business-settings",
      icon: "lucide:building",
    },
    { name: "Settings", path: "/settings", icon: "lucide:settings" },
    { name: "Status", path: "/status", icon: "lucide:activity" },
  ];

  // Debug: Log current location
  React.useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-content2">
      <Navbar isBordered maxWidth="2xl">
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <Icon
              icon="lucide:shopping-bag"
              className="text-primary text-2xl"
            />
            <p className="font-bold text-inherit">businessPOS</p>
          </div>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navItems.map((item) => (
            <NavbarItem
              key={item.path}
              isActive={location.pathname === item.path}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "text-primary font-medium"
                    : "text-default-600 hover:text-primary"
                }`}
                onClick={() => console.log(`Navigating to: ${item.path}`)}
              >
                <Icon icon={item.icon} className="text-lg" />
                <span>{item.name}</span>
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {/* Subscription Status */}
          {subscription && daysRemaining <= 7 && (
            <Badge
              content={daysRemaining}
              color={daysRemaining <= 3 ? "danger" : "warning"}
              shape="circle"
            >
              <Button
                isIconOnly
                variant="light"
                radius="full"
                title={`Subscription expires in ${daysRemaining} days`}
              >
                <Icon
                  icon="lucide:calendar-clock"
                  className={
                    daysRemaining <= 3 ? "text-danger" : "text-warning"
                  }
                />
              </Button>
            </Badge>
          )}

          {isOffline && (
            <Badge
              content=""
              color="danger"
              shape="circle"
              className="offline-indicator"
            >
              <Button isIconOnly variant="light" radius="full">
                <Icon icon="lucide:wifi-off" className="text-danger" />
              </Button>
            </Badge>
          )}

          {/* Payment Tracker Button */}
          <Button
            isIconOnly
            variant="light"
            radius="full"
            title="Payment Tracker - View pending payments"
            onPress={() => {
              // This will be handled by the POS page
              const event = new CustomEvent("openPaymentTracker");
              window.dispatchEvent(event);
            }}
          >
            <Icon icon="lucide:credit-card" className="text-warning" />
          </Button>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="Raj Kumar"
                size="sm"
                src="https://img.heroui.chat/image/avatar?w=150&h=150&u=1"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              onAction={(key) => {
                if (key === "logout") {
                  logout();
                }
              }}
            >
              <DropdownItem key="profile" className="h-20 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
                <p className="text-sm text-default-500 capitalize">
                  {user?.role}
                </p>
                {subscription && (
                  <p className="text-xs text-primary">
                    {subscription.planType.charAt(0).toUpperCase() +
                      subscription.planType.slice(1)}{" "}
                    Plan
                    {daysRemaining <= 30 && ` • ${daysRemaining} days left`}
                  </p>
                )}
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="help">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto px-4 py-4 max-w-7xl">{children}</main>
    </div>
  );
};
