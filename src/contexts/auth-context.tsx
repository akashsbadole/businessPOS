import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/pos";
import { UserService } from "../services/user-service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock users for demo - in production, this would come from your database
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@pos.com",
    role: "admin",
    status: "active",
    permissions: [
      "pos",
      "inventory",
      "customers",
      "reports",
      "settings",
      "users",
      "invoice_templates",
    ],
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@pos.com",
    role: "manager",
    status: "active",
    permissions: [
      "pos",
      "inventory",
      "customers",
      "reports",
      "invoice_templates",
    ],
  },
  {
    id: "3",
    name: "Cashier User",
    email: "cashier@pos.com",
    role: "cashier",
    status: "active",
    permissions: ["pos", "customers"],
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem("pos_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("pos_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Try database authentication first
      const authenticatedUser = await UserService.authenticateUser(
        email,
        password
      );

      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem("pos_user", JSON.stringify(authenticatedUser));
        setIsLoading(false);
        return true;
      }

      // Fallback to mock users for demo
      const foundUser = mockUsers.find((u) => u.email === email);
      if (foundUser && password === "password") {
        setUser(foundUser);
        localStorage.setItem("pos_user", JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Authentication error:", error);

      // Fallback to mock users if database fails
      const foundUser = mockUsers.find((u) => u.email === email);
      if (foundUser && password === "password") {
        setUser(foundUser);
        localStorage.setItem("pos_user", JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pos_user");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  const isManager = (): boolean => {
    return user?.role === "admin" || user?.role === "manager";
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    isAdmin,
    isManager,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
