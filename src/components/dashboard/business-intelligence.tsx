import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface BusinessMetrics {
  todaySales: number;
  todayProfit: number;
  todayTransactions: number;
  todayCustomers: number;
  topProducts: Array<{ name: string; sales: number; profit: number }>;
  paymentMethods: Array<{ method: string; amount: number; percentage: number }>;
  hourlyData: Array<{ hour: number; sales: number; customers: number }>;
  staffPerformance: Array<{ name: string; sales: number; transactions: number }>;
}

export const BusinessIntelligence: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("today");
  const [metrics, setMetrics] = React.useState<BusinessMetrics>({
    todaySales: 45250,
    todayProfit: 12680,
    todayTransactions: 127,
    todayCustomers: 89,
    topProducts: [
      { name: "Rice (1kg)", sales: 8500, profit: 1200 },
      { name: "Milk (1L)", sales: 6200, profit: 800 },
      { name: "Sugar (1kg)", sales: 4800, profit: 600 },
      { name: "Oil (1L)", sales: 3200, profit: 450 },
      { name: "Tea (250g)", sales: 2800, profit: 380 },
    ],
    paymentMethods: [
      { method: "UPI", amount: 22500, percentage: 49.7 },
      { method: "Cash", amount: 15200, percentage: 33.6 },
      { method: "Card", amount: 5800, percentage: 12.8 },
      { method: "Credit", amount: 1750, percentage: 3.9 },
    ],
    hourlyData: [
      { hour: 9, sales: 2500, customers: 8 },
      { hour: 10, sales: 4200, customers: 12 },
      { hour: 11, sales: 6800, customers: 18 },
      { hour: 12, sales: 8500, customers: 22 },
      { hour: 13, sales: 5200, customers: 15 },
      { hour: 14, sales: 3800, customers: 11 },
      { hour: 15, sales: 4500, customers: 14 },
      { hour: 16, sales: 6200, customers: 19 },
      { hour: 17, sales: 7500, customers: 25 },
    ],
    staffPerformance: [
      { name: "Rajesh Kumar", sales: 18500, transactions: 45 },
      { name: "Priya Sharma", sales: 15200, transactions: 38 },
      { name: "Amit Singh", sales: 11550, transactions: 44 },
    ],
  });

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getMaxHourlySales = () => Math.max(...metrics.hourlyData.map(d => d.sales));

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Intelligence</h2>
        <Select
          selectedKeys={[selectedPeriod]}
          onSelectionChange={(keys) => setSelectedPeriod(Array.from(keys)[0] as string)}
          className="w-48"
          size="sm"
        >
          <SelectItem key="today">Today</SelectItem>
          <SelectItem key="week">This Week</SelectItem>
          <SelectItem key="month">This Month</SelectItem>
          <SelectItem key="quarter">This Quarter</SelectItem>
          <SelectItem key="year">This Year</SelectItem>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon icon="lucide:trending-up" className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.todaySales)}
                </p>
                <p className="text-xs text-green-500">+12.5% from yesterday</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon icon="lucide:dollar-sign" className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Profit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(metrics.todayProfit)}
                </p>
                <p className="text-xs text-blue-500">28% margin</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icon icon="lucide:shopping-cart" className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.todayTransactions}
                </p>
                <p className="text-xs text-purple-500">Avg: ₹356 per bill</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icon icon="lucide:users" className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.todayCustomers}
                </p>
                <p className="text-xs text-orange-500">70% returning</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:trending-up" />
              <span className="font-semibold">Top Selling Products</span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {metrics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Chip size="sm" color="primary" variant="flat">
                      #{index + 1}
                    </Chip>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-600">
                        Profit: {formatCurrency(product.profit)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(product.sales)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:credit-card" />
              <span className="font-semibold">Payment Methods</span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {metrics.paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{method.method}</span>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(method.amount)}</p>
                      <p className="text-xs text-gray-600">{method.percentage}%</p>
                    </div>
                  </div>
                  <Progress 
                    value={method.percentage} 
                    color={index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "warning" : "secondary"}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Hourly Sales Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:bar-chart" />
            <span className="font-semibold">Hourly Sales Pattern</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="grid grid-cols-9 gap-2">
              {metrics.hourlyData.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <div 
                      className="bg-blue-500 rounded-t mx-auto"
                      style={{ 
                        height: `${(data.sales / getMaxHourlySales()) * 100}px`,
                        width: '20px',
                        minHeight: '10px'
                      }}
                    />
                  </div>
                  <p className="text-xs font-medium">{data.hour}:00</p>
                  <p className="text-xs text-gray-600">{formatCurrency(data.sales)}</p>
                  <p className="text-xs text-gray-500">{data.customers} customers</p>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:users" />
            <span className="font-semibold">Staff Performance</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {metrics.staffPerformance.map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{staff.name}</p>
                    <p className="text-sm text-gray-600">{staff.transactions} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(staff.sales)}</p>
                  <p className="text-xs text-gray-600">
                    Avg: {formatCurrency(Math.round(staff.sales / staff.transactions))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:download" />
            <span className="font-semibold">Export Reports</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="flat" startContent={<Icon icon="lucide:file-text" />}>
              Sales Report (PDF)
            </Button>
            <Button variant="flat" startContent={<Icon icon="lucide:table" />}>
              Data Export (CSV)
            </Button>
            <Button variant="flat" startContent={<Icon icon="lucide:pie-chart" />}>
              Analytics (Excel)
            </Button>
            <Button variant="flat" startContent={<Icon icon="lucide:share" />}>
              Share Report
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
