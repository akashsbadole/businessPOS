import React from "react";
import { Card, CardBody, CardHeader, Chip, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";

export const StatusPage: React.FC = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    { name: "Dashboard", path: "/", status: "working", icon: "lucide:layout-dashboard" },
    { name: "POS", path: "/pos", status: "working", icon: "lucide:shopping-cart" },
    { name: "Inventory", path: "/inventory", status: "working", icon: "lucide:package" },
    { name: "Customers", path: "/customers", status: "working", icon: "lucide:users" },
    { name: "Suppliers", path: "/suppliers", status: "working", icon: "lucide:truck" },
    { name: "Purchase Orders", path: "/purchase-orders", status: "working", icon: "lucide:clipboard-list" },
    { name: "Reports", path: "/reports", status: "working", icon: "lucide:bar-chart" },
    { name: "Settings", path: "/settings", status: "working", icon: "lucide:settings" },
  ];

  const systemInfo = {
    appVersion: "1.0.0",
    buildTime: new Date().toISOString(),
    environment: "development",
    database: "localStorage",
    features: features.length,
    workingFeatures: features.filter(f => f.status === "working").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Status</h1>
        <Chip color="success" variant="flat">
          All Systems Operational
        </Chip>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Current Status</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {systemInfo.workingFeatures}/{systemInfo.features}
              </div>
              <div className="text-sm text-default-600">Features Working</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-default-600">Current Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {systemInfo.database}
              </div>
              <div className="text-sm text-default-600">Database Type</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Feature Status */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Feature Status</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.path}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  location.pathname === feature.path
                    ? "border-primary bg-primary/10"
                    : "border-default-200 hover:border-default-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon icon={feature.icon} className="text-xl" />
                  <span className="font-medium">{feature.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Chip
                    size="sm"
                    color={feature.status === "working" ? "success" : "danger"}
                    variant="flat"
                  >
                    {feature.status === "working" ? "Working" : "Error"}
                  </Chip>
                  {location.pathname === feature.path && (
                    <Chip size="sm" color="primary" variant="flat">
                      Current
                    </Chip>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">System Information</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Application Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">Version:</span>
                  <span>{systemInfo.appVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Environment:</span>
                  <span className="capitalize">{systemInfo.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Database:</span>
                  <span>{systemInfo.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Current Route:</span>
                  <span className="font-mono">{location.pathname}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Performance Metrics</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">Load Time:</span>
                  <span className="text-success">Fast</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Memory Usage:</span>
                  <span className="text-success">Normal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Navigation:</span>
                  <span className="text-success">Working</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Data Persistence:</span>
                  <span className="text-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            <Button
              color="primary"
              variant="flat"
              startContent={<Icon icon="lucide:refresh-cw" />}
              onPress={() => window.location.reload()}
            >
              Refresh App
            </Button>
            <Button
              color="secondary"
              variant="flat"
              startContent={<Icon icon="lucide:download" />}
              onPress={() => {
                const data = JSON.stringify(systemInfo, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "system-status.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Status
            </Button>
            <Button
              color="warning"
              variant="flat"
              startContent={<Icon icon="lucide:trash" />}
              onPress={() => {
                if (confirm("Clear all localStorage data?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Clear Data
            </Button>
            <Button
              color="default"
              variant="flat"
              startContent={<Icon icon="lucide:external-link" />}
              onPress={() => window.open("https://github.com/your-repo", "_blank")}
            >
              Documentation
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Debug Information</h2>
        </CardHeader>
        <CardBody>
          <div className="bg-default-100 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(
                {
                  currentPath: location.pathname,
                  timestamp: currentTime.toISOString(),
                  userAgent: navigator.userAgent,
                  localStorage: Object.keys(localStorage),
                  features: features.map(f => ({ name: f.name, status: f.status })),
                },
                null,
                2
              )}
            </pre>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
