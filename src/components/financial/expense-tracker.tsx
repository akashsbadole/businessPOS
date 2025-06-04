import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Textarea,
  useDisclosure,
  Pagination,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  vendor?: string;
  receipt?: string;
  status: "pending" | "approved" | "paid";
  addedBy: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
}

export const ExpenseTracker: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [expenses, setExpenses] = React.useState<Expense[]>([
    {
      id: "1",
      date: "2024-01-15",
      category: "Operating",
      description: "Monthly rent payment",
      amount: 25000,
      paymentMethod: "Bank Transfer",
      vendor: "Property Owner",
      status: "paid",
      addedBy: "Admin",
    },
    {
      id: "2",
      date: "2024-01-14",
      category: "Inventory",
      description: "Rice purchase from supplier",
      amount: 15000,
      paymentMethod: "Cash",
      vendor: "ABC Suppliers",
      status: "paid",
      addedBy: "Manager",
    },
    {
      id: "3",
      date: "2024-01-13",
      category: "Marketing",
      description: "Facebook advertising campaign",
      amount: 3500,
      paymentMethod: "Card",
      status: "pending",
      addedBy: "Marketing Team",
    },
  ]);

  const [categories] = React.useState<ExpenseCategory[]>([
    { id: "operating", name: "Operating Expenses", icon: "lucide:building", budget: 50000, spent: 35000 },
    { id: "inventory", name: "Inventory", icon: "lucide:package", budget: 100000, spent: 75000 },
    { id: "marketing", name: "Marketing", icon: "lucide:megaphone", budget: 15000, spent: 8500 },
    { id: "equipment", name: "Equipment", icon: "lucide:monitor", budget: 20000, spent: 5000 },
    { id: "utilities", name: "Utilities", icon: "lucide:zap", budget: 8000, spent: 6200 },
    { id: "staff", name: "Staff Salaries", icon: "lucide:users", budget: 80000, spent: 80000 },
  ]);

  const [newExpense, setNewExpense] = React.useState({
    category: "",
    description: "",
    amount: 0,
    paymentMethod: "",
    vendor: "",
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const rowsPerPage = 10;

  const filteredExpenses = React.useMemo(() => {
    if (selectedCategory === "all") return expenses;
    return expenses.filter(expense => expense.category.toLowerCase() === selectedCategory);
  }, [expenses, selectedCategory]);

  const paginatedExpenses = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredExpenses.slice(start, start + rowsPerPage);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "approved": return "primary";
      default: return "default";
    }
  };

  const handleAddExpense = () => {
    const expense: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: newExpense.category,
      description: newExpense.description,
      amount: newExpense.amount,
      paymentMethod: newExpense.paymentMethod,
      vendor: newExpense.vendor,
      status: "pending",
      addedBy: "Current User",
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      category: "",
      description: "",
      amount: 0,
      paymentMethod: "",
      vendor: "",
    });
    onOpenChange();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expense Tracker</h2>
        <Button
          color="primary"
          onPress={onOpen}
          startContent={<Icon icon="lucide:plus" />}
        >
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Icon icon="lucide:trending-down" className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(getTotalExpenses())}
                </p>
                <p className="text-xs text-red-500">This month</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icon icon="lucide:clock" className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">
                  {expenses.filter(e => e.status === "pending").length}
                </p>
                <p className="text-xs text-orange-500">Requires attention</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon icon="lucide:target" className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget Utilization</p>
                <p className="text-2xl font-bold text-blue-600">73%</p>
                <p className="text-xs text-blue-500">Of total budget</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Category Budget Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:pie-chart" />
            <span className="font-semibold">Category Budget Overview</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Icon icon={category.icon} className="text-xl" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent: {formatCurrency(category.spent)}</span>
                    <span>Budget: {formatCurrency(category.budget)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (category.spent / category.budget) > 0.9 
                          ? "bg-red-500" 
                          : (category.spent / category.budget) > 0.7 
                          ? "bg-orange-500" 
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min((category.spent / category.budget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {Math.round((category.spent / category.budget) * 100)}% utilized
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:list" />
              <span className="font-semibold">Recent Expenses</span>
            </div>
            <Select
              selectedKeys={[selectedCategory]}
              onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
              className="w-48"
              size="sm"
            >
              <SelectItem key="all">All Categories</SelectItem>
              <SelectItem key="operating">Operating</SelectItem>
              <SelectItem key="inventory">Inventory</SelectItem>
              <SelectItem key="marketing">Marketing</SelectItem>
              <SelectItem key="equipment">Equipment</SelectItem>
              <SelectItem key="utilities">Utilities</SelectItem>
              <SelectItem key="staff">Staff</SelectItem>
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          <Table
            bottomContent={
              totalPages > 1 ? (
                <div className="flex justify-center">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>DESCRIPTION</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      {expense.vendor && (
                        <p className="text-sm text-gray-600">{expense.vendor}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(expense.status)}
                      size="sm"
                      variant="flat"
                    >
                      {expense.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button isIconOnly size="sm" variant="light">
                        <Icon icon="lucide:eye" />
                      </Button>
                      <Button isIconOnly size="sm" variant="light">
                        <Icon icon="lucide:edit" />
                      </Button>
                      <Button isIconOnly size="sm" variant="light" color="danger">
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Expense</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    selectedKeys={newExpense.category ? [newExpense.category] : []}
                    onSelectionChange={(keys) =>
                      setNewExpense({ ...newExpense, category: Array.from(keys)[0] as string })
                    }
                    isRequired
                  >
                    <SelectItem key="Operating">Operating Expenses</SelectItem>
                    <SelectItem key="Inventory">Inventory</SelectItem>
                    <SelectItem key="Marketing">Marketing</SelectItem>
                    <SelectItem key="Equipment">Equipment</SelectItem>
                    <SelectItem key="Utilities">Utilities</SelectItem>
                    <SelectItem key="Staff">Staff Salaries</SelectItem>
                  </Select>

                  <Input
                    label="Amount"
                    type="number"
                    value={newExpense.amount.toString()}
                    onValueChange={(value) =>
                      setNewExpense({ ...newExpense, amount: parseFloat(value) || 0 })
                    }
                    startContent="₹"
                    isRequired
                  />

                  <Input
                    label="Vendor/Supplier"
                    value={newExpense.vendor}
                    onValueChange={(value) =>
                      setNewExpense({ ...newExpense, vendor: value })
                    }
                  />

                  <Select
                    label="Payment Method"
                    selectedKeys={newExpense.paymentMethod ? [newExpense.paymentMethod] : []}
                    onSelectionChange={(keys) =>
                      setNewExpense({ ...newExpense, paymentMethod: Array.from(keys)[0] as string })
                    }
                    isRequired
                  >
                    <SelectItem key="Cash">Cash</SelectItem>
                    <SelectItem key="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem key="Card">Card</SelectItem>
                    <SelectItem key="UPI">UPI</SelectItem>
                    <SelectItem key="Cheque">Cheque</SelectItem>
                  </Select>
                </div>

                <Textarea
                  label="Description"
                  value={newExpense.description}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, description: value })
                  }
                  placeholder="Enter expense description..."
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddExpense}>
                  Add Expense
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
