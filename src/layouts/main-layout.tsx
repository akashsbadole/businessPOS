import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, NavbarContent, NavbarItem, NavbarBrand, Button, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
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
    { name: "POS", path: "/", icon: "lucide:shopping-cart" },
    { name: "Inventory", path: "/inventory", icon: "lucide:package" },
    { name: "Customers", path: "/customers", icon: "lucide:users" },
    { name: "Reports", path: "/reports", icon: "lucide:bar-chart" },
    { name: "Settings", path: "/settings", icon: "lucide:settings" },
  ];

  return (
    <div className="min-h-screen bg-content2">
      <Navbar isBordered maxWidth="2xl">
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:shopping-bag" className="text-primary text-2xl" />
            <p className="font-bold text-inherit">VyaparPOS</p>
          </div>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.path} isActive={location.pathname === item.path}>
              <Link 
                to={item.path}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  location.pathname === item.path 
                    ? "text-primary font-medium" 
                    : "text-default-600 hover:text-primary"
                }`}
              >
                <Icon icon={item.icon} className="text-lg" />
                <span>{item.name}</span>
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {isOffline && (
            <Badge content="" color="danger" shape="circle" className="offline-indicator">
              <Button isIconOnly variant="light" radius="full">
                <Icon icon="lucide:wifi-off" className="text-danger" />
              </Button>
            </Badge>
          )}
          
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
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">raj@vyaparpos.com</p>
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

      <main className="container mx-auto px-4 py-4 max-w-7xl">
        {children}
      </main>
    </div>
  );
};