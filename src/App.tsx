import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "@heroui/react";

// Layouts
import { MainLayout } from "./layouts/main-layout";

// Pages
import { POSPage } from "./pages/pos";
import { InventoryPage } from "./pages/inventory";
import { CustomersPage } from "./pages/customers";
import { ReportsPage } from "./pages/reports";
import { SettingsPage } from "./pages/settings";
import { LoginPage } from "./pages/login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <ToastProvider />
      <MainLayout>
        <Switch>
          <Route exact path="/" component={POSPage} />
          <Route path="/inventory" component={InventoryPage} />
          <Route path="/customers" component={CustomersPage} />
          <Route path="/reports" component={ReportsPage} />
          <Route path="/settings" component={SettingsPage} />
        </Switch>
      </MainLayout>
    </Router>
  );
}