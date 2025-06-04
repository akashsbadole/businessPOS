import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Progress,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface AnalyticsData {
  todaySales: number;
  yesterdaySales: number;
  weeklySales: number;
  monthlySales: number;
  totalTransactions: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
    profit: number;
  }>;
  salesByPaymentMethod: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
  hourlyData: Array<{
    hour: number;
    sales: number;
    transactions: number;
  }>;
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    averageSpend: number;
  };
  inventoryAlerts: Array<{
    product: string;
    currentStock: number;
    minStock: number;
    status: "low" | "out";
  }>;
}

interface BusinessAnalyticsProps {
  data: AnalyticsData;
  onExportReport: (type: string, period: string) => void;
}

export const BusinessAnalytics: React.FC<BusinessAnalyticsProps> = ({
  data,
  onExportReport,
}) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("today");
  const [selectedMetric, setSelectedMetric] = React.useState("sales");

  const periods = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
  ];

  const metrics = [
    { key: "sales", label: "Sales", icon: "lucide:trending-up" },
    { key: "profit", label: "Profit", icon: "lucide:dollar-sign" },
    { key: "customers", label: "Customers", icon: "lucide:users" },
    { key: "inventory", label: "Inventory", icon: "lucide:package" },
  ];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const salesGrowth = calculateGrowth(data.todaySales, data.yesterdaySales);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Analytics</h2>
        <div className="flex gap-4">
          <Select
            size="sm"
            selectedKeys={[selectedPeriod]}
            onSelectionChange={(keys) =>
              setSelectedPeriod(Array.from(keys)[0] as string)
            }
            className="w-40"
          >
            {periods.map((period) => (
              <SelectItem key={period.key}>{period.label}</SelectItem>
            ))}
          </Select>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="lucide:download" />}
            onPress={() => onExportReport("comprehensive", selectedPeriod)}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold">
                  ₹{data.todaySales.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon
                    icon={
                      salesGrowth >= 0
                        ? "lucide:trending-up"
                        : "lucide:trending-down"
                    }
                    className={`text-sm ${
                      salesGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      salesGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(salesGrowth).toFixed(1)}% vs yesterday
                  </span>
                </div>
              </div>
              <Icon
                icon="lucide:trending-up"
                className="text-3xl text-primary"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">{data.totalTransactions}</p>
                <p className="text-xs text-gray-500">
                  Avg: ₹{data.averageOrderValue.toFixed(0)}
                </p>
              </div>
              <Icon icon="lucide:receipt" className="text-3xl text-secondary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold">
                  {data.customerMetrics.totalCustomers}
                </p>
                <p className="text-xs text-green-600">
                  +{data.customerMetrics.newCustomers} new
                </p>
              </div>
              <Icon icon="lucide:users" className="text-3xl text-success" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-warning">
                  {data.inventoryAlerts.length}
                </p>
                <p className="text-xs text-gray-500">Needs attention</p>
              </div>
              <Icon
                icon="lucide:alert-triangle"
                className="text-3xl text-warning"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Top Selling Products</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {data.topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {product.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ₹{product.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      ₹{product.profit.toFixed(0)} profit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Payment Methods</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {data.salesByPaymentMethod.map((payment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{payment.method}</span>
                    <span>
                      ₹{payment.amount.toLocaleString()} ({payment.percentage}%)
                    </span>
                  </div>
                  <Progress value={payment.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Hourly Sales Pattern */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Sales Pattern (Today)</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-12 gap-2">
            {data.hourlyData.map((hour, index) => (
              <div key={index} className="text-center">
                <div
                  className="bg-primary rounded-t"
                  style={{
                    height: `${Math.max(
                      10,
                      (hour.sales /
                        Math.max(...data.hourlyData.map((h) => h.sales))) *
                        100
                    )}px`,
                  }}
                ></div>
                <p className="text-xs mt-1">{hour.hour}:00</p>
                <p className="text-xs text-gray-600">₹{hour.sales}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Inventory Alerts */}
      {data.inventoryAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Inventory Alerts</h3>
              <Chip color="warning" variant="flat">
                {data.inventoryAlerts.length} items
              </Chip>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Inventory alerts">
              <TableHeader>
                <TableColumn>PRODUCT</TableColumn>
                <TableColumn>CURRENT STOCK</TableColumn>
                <TableColumn>MIN STOCK</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTION</TableColumn>
              </TableHeader>
              <TableBody>
                {data.inventoryAlerts.map((alert, index) => (
                  <TableRow key={index}>
                    <TableCell>{alert.product}</TableCell>
                    <TableCell>{alert.currentStock}</TableCell>
                    <TableCell>{alert.minStock}</TableCell>
                    <TableCell>
                      <Chip
                        color={alert.status === "out" ? "danger" : "warning"}
                        variant="flat"
                        size="sm"
                      >
                        {alert.status === "out" ? "Out of Stock" : "Low Stock"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" color="primary" variant="flat">
                        Reorder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Reports</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:file-text" />}
              onPress={() => onExportReport("sales", selectedPeriod)}
            >
              Sales Report
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:users" />}
              onPress={() => onExportReport("customers", selectedPeriod)}
            >
              Customer Report
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:package" />}
              onPress={() => onExportReport("inventory", selectedPeriod)}
            >
              Inventory Report
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:indian-rupee" />}
              onPress={() => onExportReport("gst", selectedPeriod)}
            >
              GST Report
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
