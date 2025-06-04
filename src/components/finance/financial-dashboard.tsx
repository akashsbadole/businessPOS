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

interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  inventory: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

interface FinancialDashboardProps {
  period: string;
  onPeriodChange: (period: string) => void;
  onExportReport: (type: string) => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  period,
  onPeriodChange,
  onExportReport,
}) => {
  const [selectedView, setSelectedView] = React.useState("overview");

  // Sample financial data
  const financialData: FinancialData = {
    revenue: 1250000,
    expenses: 850000,
    profit: 400000,
    profitMargin: 32,
    cashFlow: 150000,
    accountsReceivable: 75000,
    accountsPayable: 45000,
    inventory: 320000,
  };

  const expenseCategories: ExpenseCategory[] = [
    { category: "Inventory", amount: 450000, percentage: 53, trend: "up" },
    { category: "Rent", amount: 120000, percentage: 14, trend: "stable" },
    { category: "Salaries", amount: 180000, percentage: 21, trend: "up" },
    { category: "Utilities", amount: 35000, percentage: 4, trend: "down" },
    { category: "Marketing", amount: 25000, percentage: 3, trend: "up" },
    { category: "Other", amount: 40000, percentage: 5, trend: "stable" },
  ];

  const periods = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
  ];

  const views = [
    { key: "overview", label: "Overview", icon: "lucide:pie-chart" },
    { key: "profit_loss", label: "P&L", icon: "lucide:trending-up" },
    { key: "cash_flow", label: "Cash Flow", icon: "lucide:banknote" },
    { key: "expenses", label: "Expenses", icon: "lucide:receipt" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "lucide:trending-up";
      case "down": return "lucide:trending-down";
      case "stable": return "lucide:minus";
      default: return "lucide:minus";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-red-600";
      case "down": return "text-green-600";
      case "stable": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Dashboard</h2>
        <div className="flex gap-2">
          <Select
            size="sm"
            selectedKeys={[period]}
            onSelectionChange={(keys) => onPeriodChange(Array.from(keys)[0] as string)}
            className="w-40"
          >
            {periods.map((p) => (
              <SelectItem key={p.key}>{p.label}</SelectItem>
            ))}
          </Select>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="lucide:download" />}
            onPress={() => onExportReport("financial")}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {views.map((view) => (
          <Button
            key={view.key}
            variant={selectedView === view.key ? "solid" : "flat"}
            color={selectedView === view.key ? "primary" : "default"}
            startContent={<Icon icon={view.icon} />}
            onPress={() => setSelectedView(view.key)}
            className="min-w-fit"
          >
            {view.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Revenue</p>
                <p className="text-2xl font-bold">₹{financialData.revenue.toLocaleString()}</p>
                <p className="text-sm text-green-100">+12% from last month</p>
              </div>
              <Icon icon="lucide:trending-up" className="text-3xl text-green-100" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Total Expenses</p>
                <p className="text-2xl font-bold">₹{financialData.expenses.toLocaleString()}</p>
                <p className="text-sm text-red-100">+8% from last month</p>
              </div>
              <Icon icon="lucide:trending-down" className="text-3xl text-red-100" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Net Profit</p>
                <p className="text-2xl font-bold">₹{financialData.profit.toLocaleString()}</p>
                <p className="text-sm text-blue-100">{financialData.profitMargin}% margin</p>
              </div>
              <Icon icon="lucide:dollar-sign" className="text-3xl text-blue-100" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Cash Flow</p>
                <p className="text-2xl font-bold">₹{financialData.cashFlow.toLocaleString()}</p>
                <p className="text-sm text-purple-100">Positive flow</p>
              </div>
              <Icon icon="lucide:banknote" className="text-3xl text-purple-100" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Profit Margin</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current</span>
                <span className="font-bold">{financialData.profitMargin}%</span>
              </div>
              <Progress value={financialData.profitMargin} className="h-2" color="success" />
              <div className="text-sm text-gray-600">
                Target: 35% | Industry Avg: 28%
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Accounts Receivable</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <div className="text-2xl font-bold">₹{financialData.accountsReceivable.toLocaleString()}</div>
              <div className="text-sm text-gray-600">
                Average collection: 15 days
              </div>
              <Chip color="warning" variant="flat" size="sm">
                3 overdue invoices
              </Chip>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Accounts Payable</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <div className="text-2xl font-bold">₹{financialData.accountsPayable.toLocaleString()}</div>
              <div className="text-sm text-gray-600">
                Average payment: 30 days
              </div>
              <Chip color="success" variant="flat" size="sm">
                All payments current
              </Chip>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Expense Breakdown</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Expense breakdown">
            <TableHeader>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>PERCENTAGE</TableColumn>
              <TableColumn>TREND</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {expenseCategories.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{expense.category}</TableCell>
                  <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={expense.percentage} className="w-20 h-2" />
                      <span>{expense.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${getTrendColor(expense.trend)}`}>
                      <Icon icon={getTrendIcon(expense.trend)} className="text-sm" />
                      <span className="text-sm capitalize">{expense.trend}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="flat">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:plus" />}
              onPress={() => onExportReport("expense")}
            >
              Add Expense
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:receipt" />}
              onPress={() => onExportReport("invoice")}
            >
              Create Invoice
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:file-text" />}
              onPress={() => onExportReport("profit_loss")}
            >
              P&L Report
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:calculator" />}
              onPress={() => onExportReport("tax")}
            >
              Tax Calculator
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
