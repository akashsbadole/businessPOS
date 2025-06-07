import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "@heroui/react";

// Import database store
import { useDatabaseStore } from "./stores/database-store";

// Import Turso test (will auto-run in development)
import "./test-turso";

// Import console utilities for warning suppression
import { suppressKnownWarnings } from "./utils/console-utils";

// Import development helpers
import "./utils/dev-helpers";

// Suppress known third-party warnings in development
if (import.meta.env.NODE_ENV === "development") {
  suppressKnownWarnings();
}

// Auth Context
import { AuthProvider, useAuth } from "./contexts/auth-context";

// Subscription Context
import {
  SubscriptionProvider,
  useSubscription,
} from "./contexts/subscription-context";

// PWA Provider
import { PWAContextProvider } from "./components/pwa/pwa-provider";

// Layouts
import { MainLayout } from "./layouts/main-layout";

// Pages
import { POSPage } from "./pages/pos";
import { InventoryPage } from "./pages/inventory";
import { CustomersPage } from "./pages/customers";
import { ReportsPage } from "./pages/reports";
import { SettingsPage } from "./pages/settings";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { SuppliersPage } from "./pages/suppliers";
import { PurchaseOrdersPage } from "./pages/purchase-orders";
import { StatusPage } from "./pages/status";
import { BusinessSettingsPage } from "./pages/business-settings";
import { SubscriptionPage } from "./pages/subscription";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    isSubscribed,
    isLoading: subscriptionLoading,
    validation,
  } = useSubscription();

  // Initialize database
  const {
    initializeDB,
    isInitialized,
    isLoading: dbLoading,
    error: dbError,
  } = useDatabaseStore();

  React.useEffect(() => {
    initializeDB();
  }, [initializeDB]);

  // Show database error if any
  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Database Error
          </h1>
          <p className="text-gray-600 mb-4">{dbError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || subscriptionLoading || (dbLoading && !isInitialized)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading BusinessPOS...</p>
          {dbLoading && (
            <p className="text-sm text-gray-600">Initializing database...</p>
          )}
        </div>
      </div>
    );
  }

  // Check subscription first (before authentication)
  if (!isSubscribed || validation?.redirectToPayment) {
    return <SubscriptionPage />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <MainLayout>
      <Switch>
        <Route exact path="/">
          <DashboardPage />
        </Route>
        <Route path="/pos">
          <POSPage />
        </Route>
        <Route path="/inventory">
          <InventoryPage />
        </Route>
        <Route path="/customers">
          <CustomersPage />
        </Route>
        <Route path="/suppliers">
          <SuppliersPage />
        </Route>
        <Route path="/purchase-orders">
          <PurchaseOrdersPage />
        </Route>
        <Route path="/business-settings">
          <BusinessSettingsPage />
        </Route>
        <Route path="/reports">
          <ReportsPage />
        </Route>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route path="/status">
          <StatusPage />
        </Route>
      </Switch>
    </MainLayout>
  );
};

export default function App() {
  // Debug: Log when app loads
  React.useEffect(() => {
    console.log("App loaded successfully");
  }, []);

  return (
    <Router>
      <ToastProvider />
      <PWAContextProvider>
        <SubscriptionProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </SubscriptionProvider>
      </PWAContextProvider>
    </Router>
  );
}
