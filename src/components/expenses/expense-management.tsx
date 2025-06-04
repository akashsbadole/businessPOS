import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DatePicker,
  Textarea,
  Progress,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Expense {
  id: string;
  category: string;
  subcategory?: string;
  amount: number;
  description: string;
  date: Date;
  paymentMethod: string;
  vendor?: string;
  receipt?: string;
  isRecurring: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  tags: string[];
  status: "pending" | "paid" | "overdue";
  createdBy: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  spent: number;
  subcategories: string[];
}

interface ExpenseManagementProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (id: string, expense: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
  onExportExpenses: (period: string) => void;
}

export const ExpenseManagement: React.FC<ExpenseManagementProps> = ({
  expenses,
  categories,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onExportExpenses,
}) => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedPeriod, setSelectedPeriod] = React.useState("current_month");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const [newExpense, setNewExpense] = React.useState({
    category: "",
    subcategory: "",
    amount: 0,
    description: "",
    date: new Date(),
    paymentMethod: "cash",
    vendor: "",
    receipt: "",
    isRecurring: false,
    recurringFrequency: "monthly" as const,
    tags: [] as string[],
    status: "paid" as const,
    createdBy: "current_user",
  });

  // Filter expenses
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, selectedCategory]);

  // Calculate analytics
  const analytics = React.useMemo(() => {
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyExpenses = filteredExpenses
      .filter(expense => {
        const expenseMonth = expense.date.getMonth();
        const currentMonth = new Date().getMonth();
        return expenseMonth === currentMonth;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const categoryBreakdown = categories.map(category => {
      const categoryExpenses = filteredExpenses.filter(expense => expense.category === category.id);
      const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const budgetUsed = category.budget ? (spent / category.budget) * 100 : 0;
      
      return {
        ...category,
        spent,
        budgetUsed,
        expenseCount: categoryExpenses.length,
      };
    });

    const pendingExpenses = filteredExpenses.filter(expense => expense.status === "pending").length;
    const overdueExpenses = filteredExpenses.filter(expense => expense.status === "overdue").length;

    return {
      totalExpenses,
      monthlyExpenses,
      categoryBreakdown,
      pendingExpenses,
      overdueExpenses,
    };
  }, [filteredExpenses, categories]);

  const paymentMethods = [
    { key: "cash", label: "Cash" },
    { key: "card", label: "Card" },
    { key: "upi", label: "UPI" },
    { key: "bank_transfer", label: "Bank Transfer" },
    { key: "cheque", label: "Cheque" },
  ];

  const periods = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "current_month", label: "This Month" },
    { key: "last_month", label: "Last Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "overdue": return "danger";
      default: return "default";
    }
  };

  const handleAddExpense = () => {
    onAddExpense(newExpense);
    setNewExpense({
      category: "",
      subcategory: "",
      amount: 0,
      description: "",
      date: new Date(),
      paymentMethod: "cash",
      vendor: "",
      receipt: "",
      isRecurring: false,
      recurringFrequency: "monthly",
      tags: [],
      status: "paid",
      createdBy: "current_user",
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expense Management</h2>
        <div className="flex gap-2">
          <Select
            size="sm"
            selectedKeys={[selectedPeriod]}
            onSelectionChange={(keys) => setSelectedPeriod(Array.from(keys)[0] as string)}
            className="w-40"
          >
            {periods.map((period) => (
              <SelectItem key={period.key}>{period.label}</SelectItem>
            ))}
          </Select>
          <Button
            color="secondary"
            variant="flat"
            startContent={<Icon icon="lucide:download" />}
            onPress={() => onExportExpenses(selectedPeriod)}
          >
            Export
          </Button>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" />}
            onPress={() => setShowAddModal(true)}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold">₹{analytics.totalExpenses.toLocaleString()}</p>
              </div>
              <Icon icon="lucide:receipt" className="text-3xl text-red-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">₹{analytics.monthlyExpenses.toLocaleString()}</p>
              </div>
              <Icon icon="lucide:calendar" className="text-3xl text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{analytics.pendingExpenses}</p>
              </div>
              <Icon icon="lucide:clock" className="text-3xl text-yellow-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{analytics.overdueExpenses}</p>
              </div>
              <Icon icon="lucide:alert-triangle" className="text-3xl text-red-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Category Budget Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Category Budget Overview</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.categoryBreakdown.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon={category.icon} className="text-xl" style={{ color: category.color }} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent: ₹{category.spent.toLocaleString()}</span>
                    {category.budget && (
                      <span>Budget: ₹{category.budget.toLocaleString()}</span>
                    )}
                  </div>
                  {category.budget && (
                    <Progress
                      value={category.budgetUsed}
                      color={category.budgetUsed > 100 ? "danger" : category.budgetUsed > 80 ? "warning" : "success"}
                      className="h-2"
                    />
                  )}
                  <div className="text-xs text-gray-500">
                    {category.expenseCount} expenses
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search expenses..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" />}
          className="flex-1"
        />
        <Select
          placeholder="Filter by category"
          selectedKeys={[selectedCategory]}
          onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
          className="w-48"
        >
          <SelectItem key="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id}>{category.name}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardBody>
          <Table aria-label="Expenses table">
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>DESCRIPTION</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>PAYMENT METHOD</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date.toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      {expense.vendor && (
                        <div className="text-sm text-gray-500">{expense.vendor}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon 
                        icon={categories.find(cat => cat.id === expense.category)?.icon || "lucide:tag"} 
                        className="text-sm"
                      />
                      <span>{categories.find(cat => cat.id === expense.category)?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">₹{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip variant="flat" size="sm">
                      {paymentMethods.find(method => method.key === expense.paymentMethod)?.label}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(expense.status)} variant="flat" size="sm">
                      {expense.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="flat" isIconOnly>
                        <Icon icon="lucide:edit" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="flat" 
                        color="danger" 
                        isIconOnly
                        onPress={() => onDeleteExpense(expense.id)}
                      >
                        <Icon icon="lucide:trash" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add Expense Modal */}
      <Modal isOpen={showAddModal} onOpenChange={setShowAddModal} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Expense</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    selectedKeys={[newExpense.category]}
                    onSelectionChange={(keys) => 
                      setNewExpense({...newExpense, category: Array.from(keys)[0] as string})
                    }
                    isRequired
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.id}>{category.name}</SelectItem>
                    ))}
                  </Select>
                  
                  <Input
                    type="number"
                    label="Amount"
                    value={newExpense.amount.toString()}
                    onValueChange={(value) => setNewExpense({...newExpense, amount: parseFloat(value) || 0})}
                    startContent="₹"
                    isRequired
                  />
                  
                  <Input
                    label="Vendor/Supplier"
                    value={newExpense.vendor}
                    onValueChange={(value) => setNewExpense({...newExpense, vendor: value})}
                  />
                  
                  <Select
                    label="Payment Method"
                    selectedKeys={[newExpense.paymentMethod]}
                    onSelectionChange={(keys) => 
                      setNewExpense({...newExpense, paymentMethod: Array.from(keys)[0] as string})
                    }
                  >
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.key}>{method.label}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                <Textarea
                  label="Description"
                  value={newExpense.description}
                  onValueChange={(value) => setNewExpense({...newExpense, description: value})}
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleAddExpense}>Add Expense</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
