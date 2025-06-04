import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface FeatureCategory {
  name: string;
  icon: string;
  features: Feature[];
  completionRate: number;
}

interface Feature {
  name: string;
  status: "implemented" | "partial" | "missing" | "planned";
  description: string;
  priority: "high" | "medium" | "low";
  components?: string[];
}

export const FeatureStatus: React.FC = () => {
  const featureCategories: FeatureCategory[] = [
    {
      name: "Core Transaction Features",
      icon: "lucide:shopping-cart",
      completionRate: 95,
      features: [
        {
          name: "Multi-Payment Support",
          status: "implemented",
          description: "UPI, Cash, Cards, Digital Wallets with QR codes",
          priority: "high",
          components: ["UPI Payment", "Enhanced Payment Modal", "Payment Methods"]
        },
        {
          name: "Voice Commands",
          status: "implemented",
          description: "Voice-to-text product search and commands",
          priority: "high",
          components: ["Voice Search", "Speech Recognition"]
        },
        {
          name: "Camera Barcode Scanner",
          status: "implemented",
          description: "Real-time camera barcode scanning",
          priority: "high",
          components: ["Camera Scanner", "Barcode Detection"]
        },
        {
          name: "Smart Calculator",
          status: "implemented",
          description: "Contextual calculations with expressions",
          priority: "medium",
          components: ["Smart Calculator", "Expression Parser"]
        },
        {
          name: "Receipt Generation",
          status: "implemented",
          description: "PDF receipts with thermal printing support",
          priority: "high",
          components: ["Invoice Generator", "PDF Export"]
        }
      ]
    },
    {
      name: "Inventory Management",
      icon: "lucide:package",
      completionRate: 90,
      features: [
        {
          name: "Real-time Stock Tracking",
          status: "implemented",
          description: "Live inventory updates with low stock alerts",
          priority: "high",
          components: ["Stock Management", "Inventory Sync"]
        },
        {
          name: "Barcode Management",
          status: "implemented",
          description: "Barcode generation and mapping system",
          priority: "high",
          components: ["Barcode Service", "Product Catalog"]
        },
        {
          name: "Purchase Orders",
          status: "implemented",
          description: "Complete purchase order management",
          priority: "medium",
          components: ["PO Management", "Supplier Integration"]
        },
        {
          name: "CSV Import/Export",
          status: "partial",
          description: "Bulk inventory operations via CSV",
          priority: "medium",
          components: ["CSV Handler", "Data Import"]
        }
      ]
    },
    {
      name: "Customer Management",
      icon: "lucide:users",
      completionRate: 85,
      features: [
        {
          name: "Customer Database",
          status: "implemented",
          description: "Complete customer profiles with history",
          priority: "high",
          components: ["Customer Service", "Profile Management"]
        },
        {
          name: "Loyalty Program",
          status: "implemented",
          description: "Points system with tier management",
          priority: "medium",
          components: ["Loyalty System", "Points Tracking"]
        },
        {
          name: "Credit Sales Management",
          status: "implemented",
          description: "Credit tracking with payment reminders",
          priority: "high",
          components: ["Credit Sales", "Payment Tracking"]
        },
        {
          name: "WhatsApp Integration",
          status: "implemented",
          description: "Receipt sharing via WhatsApp",
          priority: "medium",
          components: ["WhatsApp Service", "Message Templates"]
        }
      ]
    },
    {
      name: "Business Intelligence",
      icon: "lucide:bar-chart",
      completionRate: 80,
      features: [
        {
          name: "Real-time Dashboard",
          status: "implemented",
          description: "Live business metrics and KPIs",
          priority: "high",
          components: ["Dashboard", "Analytics Charts"]
        },
        {
          name: "Sales Reports",
          status: "implemented",
          description: "Comprehensive sales analytics",
          priority: "high",
          components: ["Report Generator", "Data Export"]
        },
        {
          name: "Financial Reports",
          status: "implemented",
          description: "P&L, cash flow, expense tracking",
          priority: "high",
          components: ["Financial Service", "Report Templates"]
        },
        {
          name: "CSV Export",
          status: "implemented",
          description: "Export data in multiple formats",
          priority: "medium",
          components: ["Export Service", "Data Formatting"]
        }
      ]
    },
    {
      name: "Tax Compliance",
      icon: "lucide:file-text",
      completionRate: 90,
      features: [
        {
          name: "GST Integration",
          status: "implemented",
          description: "CGST, SGST, IGST calculations",
          priority: "high",
          components: ["GST Calculator", "Tax Service"]
        },
        {
          name: "HSN Code Management",
          status: "implemented",
          description: "Product-wise HSN tracking",
          priority: "high",
          components: ["HSN Service", "Product Management"]
        },
        {
          name: "GSTR Reports",
          status: "implemented",
          description: "GSTR-1, GSTR-3B ready exports",
          priority: "high",
          components: ["GSTR Generator", "Compliance Reports"]
        }
      ]
    },
    {
      name: "Staff Management",
      icon: "lucide:user-check",
      completionRate: 85,
      features: [
        {
          name: "User Role Management",
          status: "implemented",
          description: "Role-based access control",
          priority: "high",
          components: ["Staff Management", "Permission System"]
        },
        {
          name: "Performance Tracking",
          status: "implemented",
          description: "Individual staff performance metrics",
          priority: "medium",
          components: ["Performance Analytics", "Staff Reports"]
        },
        {
          name: "Attendance Tracking",
          status: "partial",
          description: "Login/logout time tracking",
          priority: "low",
          components: ["Attendance Service", "Time Tracking"]
        }
      ]
    },
    {
      name: "Technology Features",
      icon: "lucide:settings",
      completionRate: 75,
      features: [
        {
          name: "Offline Capability",
          status: "implemented",
          description: "IndexedDB with sync functionality",
          priority: "high",
          components: ["Offline Manager", "Data Sync"]
        },
        {
          name: "Multilingual Support",
          status: "implemented",
          description: "8 languages with RTL support",
          priority: "medium",
          components: ["i18n Service", "Language Provider"]
        },
        {
          name: "Database Flexibility",
          status: "implemented",
          description: "Turso SQLite with local fallback",
          priority: "high",
          components: ["Database Factory", "Multiple Adapters"]
        },
        {
          name: "Hardware Integration",
          status: "partial",
          description: "Thermal printer and cash drawer",
          priority: "medium",
          components: ["Hardware Service", "Printer Integration"]
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented": return "success";
      case "partial": return "warning";
      case "missing": return "danger";
      case "planned": return "primary";
      default: return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const overallCompletion = Math.round(
    featureCategories.reduce((sum, cat) => sum + cat.completionRate, 0) / featureCategories.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">POS System Feature Status</h1>
        <p className="text-gray-600 mb-4">
          Comprehensive overview of implemented features and capabilities
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{overallCompletion}%</div>
            <div className="text-sm text-gray-600">Overall Completion</div>
          </div>
          <Progress 
            value={overallCompletion} 
            color="success" 
            className="w-64"
            size="lg"
          />
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureCategories.map((category) => (
          <Card key={category.name}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon icon={category.icon} className="text-xl" />
                <div className="flex-1">
                  <h3 className="font-semibold">{category.name}</h3>
                  <Progress 
                    value={category.completionRate} 
                    color={category.completionRate >= 80 ? "success" : "warning"}
                    className="mt-1"
                    size="sm"
                  />
                </div>
                <Chip color="primary" variant="flat" size="sm">
                  {category.completionRate}%
                </Chip>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Detailed Feature List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Detailed Feature Breakdown</h2>
        </CardHeader>
        <CardBody>
          <Accordion variant="splitted">
            {featureCategories.map((category) => (
              <AccordionItem
                key={category.name}
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon={category.icon} />
                    <span>{category.name}</span>
                    <Chip color="primary" variant="flat" size="sm">
                      {category.features.filter(f => f.status === "implemented").length}/
                      {category.features.length}
                    </Chip>
                  </div>
                }
              >
                <div className="space-y-3">
                  {category.features.map((feature) => (
                    <div key={feature.name} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Chip 
                            color={getPriorityColor(feature.priority)} 
                            variant="flat" 
                            size="sm"
                          >
                            {feature.priority}
                          </Chip>
                          <Chip 
                            color={getStatusColor(feature.status)} 
                            variant="flat" 
                            size="sm"
                          >
                            {feature.status}
                          </Chip>
                        </div>
                      </div>
                      {feature.components && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {feature.components.map((component) => (
                            <Chip key={component} variant="bordered" size="sm">
                              {component}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {featureCategories.reduce((sum, cat) => 
                sum + cat.features.filter(f => f.status === "implemented").length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Implemented</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {featureCategories.reduce((sum, cat) => 
                sum + cat.features.filter(f => f.status === "partial").length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Partial</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {featureCategories.reduce((sum, cat) => 
                sum + cat.features.filter(f => f.status === "missing").length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Missing</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {featureCategories.reduce((sum, cat) => 
                sum + cat.features.filter(f => f.status === "planned").length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Planned</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
