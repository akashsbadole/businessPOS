import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Progress,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDashboardStore } from "../../stores/dashboard-store";
import { DummyDataLoader } from "../../components/admin/dummy-data-loader";
import { formatCurrency } from "../../utils/currency";
import { BusinessIntelligence } from "../../components/dashboard/business-intelligence";

// Mock data for demonstration
const mockStats: DashboardStats = {
  todaySales: 15420.5,
  todayTransactions: 47,
  lowStockItems: 8,
  totalCustomers: 234,
  monthlyRevenue: 145670.25,
  topSellingProducts: [
    {
      product: {
        id: "1",
        name: "Tata Salt",
        price: 20,
        category: "grocery",
        stock: 50,
        hsn: "2501",
      },
      quantity: 45,
      revenue: 900,
    },
    {
      product: {
        id: "2",
        name: "Aashirvaad Atta",
        price: 250,
        category: "grocery",
        stock: 25,
        hsn: "1101",
      },
      quantity: 12,
      revenue: 3000,
    },
    {
      product: {
        id: "3",
        name: "Amul Butter",
        price: 50,
        category: "dairy",
        stock: 30,
        hsn: "0405",
      },
      quantity: 28,
      revenue: 1400,
    },
  ],
  recentTransactions: [],
};

const salesData = [
  { name: "Mon", sales: 2400, transactions: 12 },
  { name: "Tue", sales: 1398, transactions: 8 },
  { name: "Wed", sales: 9800, transactions: 24 },
  { name: "Thu", sales: 3908, transactions: 15 },
  { name: "Fri", sales: 4800, transactions: 18 },
  { name: "Sat", sales: 3800, transactions: 16 },
  { name: "Sun", sales: 4300, transactions: 14 },
];

// Ensure data is valid for charts
const validSalesData = salesData.filter(
  (item) =>
    item && typeof item.name === "string" && typeof item.sales === "number"
);

const categoryData = [
  { name: "Grocery", value: 45, color: "#0070f3" },
  { name: "Dairy", value: 25, color: "#7c3aed" },
  { name: "Snacks", value: 20, color: "#f59e0b" },
  { name: "Beverages", value: 10, color: "#10b981" },
];

export const DashboardPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const {
    stats,
    isLoading,
    lastUpdated,
    isExporting,
    loadDashboardData,
    refreshStats,
    exportSalesReport,
    exportTransactionReport,
    exportCustomerReport,
    exportInventoryReport,
  } = useDashboardStore();

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleExport = async (type: string, period?: string) => {
    try {
      switch (type) {
        case "sales":
          await exportSalesReport(period as any);
          break;
        case "transactions":
          await exportTransactionReport(period as any);
          break;
        case "customers":
          await exportCustomerReport();
          break;
        case "inventory":
          await exportInventoryReport();
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (isLoading && !stats.totalSales) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" label="Loading dashboard data..." />
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: "primary" | "success" | "warning" | "danger";
    trend?: { value: number; isPositive: boolean };
  }> = ({ title, value, icon, color, trend }) => (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-default-600 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <div
                className={`flex items-center mt-2 text-sm ${
                  trend.isPositive ? "text-success" : "text-danger"
                }`}
              >
                <Icon
                  icon={
                    trend.isPositive
                      ? "lucide:trending-up"
                      : "lucide:trending-down"
                  }
                  className="w-4 h-4 mr-1"
                />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon icon={icon} className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-default-600 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
          {lastUpdated && (
            <p className="text-sm text-default-500 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Icon icon="lucide:refresh-cw" />}
            onPress={refreshStats}
            isLoading={isLoading}
          >
            Refresh
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                startContent={<Icon icon="lucide:download" />}
                isLoading={isExporting}
              >
                Export Reports
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Export options">
              <DropdownItem
                key="sales-monthly"
                startContent={<Icon icon="lucide:trending-up" />}
                onPress={() => handleExport("sales", "monthly")}
              >
                Sales Report (Monthly)
              </DropdownItem>
              <DropdownItem
                key="sales-weekly"
                startContent={<Icon icon="lucide:trending-up" />}
                onPress={() => handleExport("sales", "weekly")}
              >
                Sales Report (Weekly)
              </DropdownItem>
              <DropdownItem
                key="sales-quarterly"
                startContent={<Icon icon="lucide:trending-up" />}
                onPress={() => handleExport("sales", "quarterly")}
              >
                Sales Report (Quarterly)
              </DropdownItem>
              <DropdownItem
                key="sales-semi-yearly"
                startContent={<Icon icon="lucide:trending-up" />}
                onPress={() => handleExport("sales", "semi-yearly")}
              >
                Sales Report (Semi-Yearly)
              </DropdownItem>
              <DropdownItem
                key="sales-yearly"
                startContent={<Icon icon="lucide:trending-up" />}
                onPress={() => handleExport("sales", "yearly")}
              >
                Sales Report (Yearly)
              </DropdownItem>
              <DropdownItem
                key="transactions"
                startContent={<Icon icon="lucide:receipt" />}
                onPress={() => handleExport("transactions", "monthly")}
              >
                Transaction Report
              </DropdownItem>
              <DropdownItem
                key="customers"
                startContent={<Icon icon="lucide:users" />}
                onPress={() => handleExport("customers")}
              >
                Customer Report
              </DropdownItem>
              <DropdownItem
                key="inventory"
                startContent={<Icon icon="lucide:package" />}
                onPress={() => handleExport("inventory")}
              >
                Inventory Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab
          key="overview"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:layout-dashboard" />
              <span>Overview</span>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex gap-3">
                  <Icon
                    icon="lucide:dollar-sign"
                    className="text-2xl text-green-500"
                  />
                  <div className="flex flex-col">
                    <p className="text-md">Total Sales</p>
                    <p className="text-small text-default-500">All Time</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-2xl font-bold">
                    ₹{stats.totalSales.toLocaleString()}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Today:</span>
                      <span>₹{stats.todaySales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>This Week:</span>
                      <span>₹{stats.weekSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>This Month:</span>
                      <span>₹{stats.monthSales.toLocaleString()}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-3">
                  <Icon
                    icon="lucide:shopping-cart"
                    className="text-2xl text-blue-500"
                  />
                  <div className="flex flex-col">
                    <p className="text-md">Transactions</p>
                    <p className="text-small text-default-500">Total</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-2xl font-bold">
                    {stats.totalTransactions}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-default-500">
                      Average: ₹
                      {stats.totalTransactions > 0
                        ? (stats.totalSales / stats.totalTransactions).toFixed(
                            2
                          )
                        : "0"}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-3">
                  <Icon
                    icon="lucide:users"
                    className="text-2xl text-purple-500"
                  />
                  <div className="flex flex-col">
                    <p className="text-md">Customers</p>
                    <p className="text-small text-default-500">Total</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-3">
                  <Icon
                    icon="lucide:package"
                    className="text-2xl text-orange-500"
                  />
                  <div className="flex flex-col">
                    <p className="text-md">Products</p>
                    <p className="text-small text-default-500">In Stock</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  {stats.lowStockProducts > 0 && (
                    <Chip size="sm" color="warning" className="mt-2">
                      {stats.lowStockProducts} Low Stock
                    </Chip>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">Sales Overview</h3>
                </CardHeader>
                <CardBody>
                  <div className="h-[300px] flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-default-600 mb-2">
                        Weekly Sales Trend
                      </h4>
                    </div>
                    <div className="flex-1 grid grid-cols-7 gap-2">
                      {validSalesData.map((day) => {
                        const maxSales = Math.max(
                          ...validSalesData.map((d) => d.sales)
                        );
                        const height = (day.sales / maxSales) * 100;
                        return (
                          <div
                            key={day.name}
                            className="flex flex-col items-center"
                          >
                            <div className="flex-1 flex items-end mb-2">
                              <div
                                className="w-8 bg-primary rounded-t-sm transition-all duration-300 hover:bg-primary-600"
                                style={{
                                  height: `${height}%`,
                                  minHeight: "4px",
                                }}
                                title={`${day.name}: ${formatCurrency(
                                  day.sales
                                )}`}
                              />
                            </div>
                            <div className="text-xs text-default-500 font-medium">
                              {day.name}
                            </div>
                            <div className="text-xs text-default-400">
                              {formatCurrency(day.sales)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-default-600">
                      <span>
                        Total:{" "}
                        {formatCurrency(
                          validSalesData.reduce(
                            (sum, day) => sum + day.sales,
                            0
                          )
                        )}
                      </span>
                      <span>
                        Avg:{" "}
                        {formatCurrency(
                          validSalesData.reduce(
                            (sum, day) => sum + day.sales,
                            0
                          ) / validSalesData.length
                        )}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">Sales by Category</h3>
                </CardHeader>
                <CardBody>
                  <div className="h-[300px] flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-default-600 mb-2">
                        Category Distribution
                      </h4>
                    </div>
                    <div className="flex-1 space-y-4">
                      {categoryData.map((category) => {
                        const total = categoryData.reduce(
                          (sum, cat) => sum + cat.value,
                          0
                        );
                        const percentage = (category.value / total) * 100;
                        return (
                          <div key={category.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-sm font-medium">
                                  {category.name}
                                </span>
                              </div>
                              <span className="text-sm text-default-600">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-default-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: category.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-default-200">
                      <div className="text-sm text-default-600">
                        Total Categories: {categoryData.length} • Total Value:{" "}
                        {categoryData.reduce((sum, cat) => sum + cat.value, 0)}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Products */}
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">
                    Top Selling Products
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {stats.topSellingProducts.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon
                              icon="lucide:package"
                              className="w-5 h-5 text-primary"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-default-600">
                              {item.quantity} units sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(item.revenue)}
                          </p>
                          <p className="text-sm text-default-600">
                            {formatCurrency(item.product.price)}/unit
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<Icon icon="lucide:plus" />}
                      className="h-16 flex-col"
                    >
                      <span>Add Product</span>
                    </Button>
                    <Button
                      color="success"
                      variant="flat"
                      startContent={<Icon icon="lucide:user-plus" />}
                      className="h-16 flex-col"
                    >
                      <span>New Customer</span>
                    </Button>
                    <Button
                      color="warning"
                      variant="flat"
                      startContent={<Icon icon="lucide:package-plus" />}
                      className="h-16 flex-col"
                    >
                      <span>Stock Update</span>
                    </Button>
                    <Button
                      color="secondary"
                      variant="flat"
                      startContent={<Icon icon="lucide:file-text" />}
                      className="h-16 flex-col"
                    >
                      <span>View Reports</span>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Admin Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DummyDataLoader />

              {/* Database Info */}
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">
                    Database Information
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="lucide:database"
                          className="w-5 h-5 text-primary"
                        />
                        <span className="font-medium">Products</span>
                      </div>
                      <Chip size="sm" color="primary" variant="flat">
                        {stats.topSellingProducts.length} items
                      </Chip>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="lucide:users"
                          className="w-5 h-5 text-success"
                        />
                        <span className="font-medium">Customers</span>
                      </div>
                      <Chip size="sm" color="success" variant="flat">
                        {stats.totalCustomers} registered
                      </Chip>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="lucide:receipt"
                          className="w-5 h-5 text-warning"
                        />
                        <span className="font-medium">Transactions</span>
                      </div>
                      <Chip size="sm" color="warning" variant="flat">
                        {stats.todayTransactions} today
                      </Chip>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="lucide:alert-triangle"
                          className="w-5 h-5 text-danger"
                        />
                        <span className="font-medium">Low Stock</span>
                      </div>
                      <Chip size="sm" color="danger" variant="flat">
                        {stats.lowStockItems} items
                      </Chip>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Alerts */}
            {stats.lowStockItems > 0 && (
              <Card className="border-warning">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="lucide:alert-triangle"
                      className="w-5 h-5 text-warning"
                    />
                    <div>
                      <p className="font-medium">Low Stock Alert</p>
                      <p className="text-sm text-default-600">
                        {stats.lowStockItems} products are running low on stock.
                        <Button
                          size="sm"
                          variant="light"
                          color="warning"
                          className="ml-2"
                        >
                          View Details
                        </Button>
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>

        <Tab
          key="business-intelligence"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:bar-chart-3" />
              <span>Business Intelligence</span>
            </div>
          }
        >
          <BusinessIntelligence />
        </Tab>
      </Tabs>
    </div>
  );
};
