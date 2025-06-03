import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "@heroui/react";

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

  if (isLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
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
      <SubscriptionProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SubscriptionProvider>
    </Router>
  );
}
