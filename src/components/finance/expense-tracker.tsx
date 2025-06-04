import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  DatePicker,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  vendor: string;
  date: Date;
  receiptNumber?: string;
  notes?: string;
  isRecurring: boolean;
  gstAmount?: number;
  isGSTApplicable: boolean;
}

interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

interface ExpenseTrackerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  expenses: Expense[];
  categories: ExpenseCategory[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (id: string, expense: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  isOpen,
  onOpenChange,
  expenses,
  categories,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [formData, setFormData] = React.useState({
    category: "",
    description: "",
    amount: 0,
    paymentMethod: "cash",
    vendor: "",
    date: new Date(),
    receiptNumber: "",
    notes: "",
    isRecurring: false,
    gstAmount: 0,
    isGSTApplicable: false,
  });

  const paymentMethods = [
    { key: "cash", label: "Cash" },
    { key: "upi", label: "UPI" },
    { key: "card", label: "Credit/Debit Card" },
    { key: "netbanking", label: "Net Banking" },
    { key: "cheque", label: "Cheque" },
  ];

  const defaultCategories: ExpenseCategory[] = [
    { id: "rent", name: "Rent", icon: "lucide:home", isActive: true },
    { id: "utilities", name: "Utilities", icon: "lucide:zap", isActive: true },
    { id: "inventory", name: "Inventory Purchase", icon: "lucide:package", isActive: true },
    { id: "marketing", name: "Marketing", icon: "lucide:megaphone", isActive: true },
    { id: "transport", name: "Transport", icon: "lucide:truck", isActive: true },
    { id: "office", name: "Office Supplies", icon: "lucide:briefcase", isActive: true },
    { id: "maintenance", name: "Maintenance", icon: "lucide:wrench", isActive: true },
    { id: "professional", name: "Professional Services", icon: "lucide:user-tie", isActive: true },
    { id: "insurance", name: "Insurance", icon: "lucide:shield", isActive: true },
    { id: "other", name: "Other", icon: "lucide:more-horizontal", isActive: true },
  ];

  const allCategories = [...categories, ...defaultCategories];

  const handleSubmit = () => {
    if (editingExpense) {
      onUpdateExpense(editingExpense.id, formData);
      setEditingExpense(null);
    } else {
      onAddExpense(formData);
    }
    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      category: "",
      description: "",
      amount: 0,
      paymentMethod: "cash",
      vendor: "",
      date: new Date(),
      receiptNumber: "",
      notes: "",
      isRecurring: false,
      gstAmount: 0,
      isGSTApplicable: false,
    });
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
      vendor: expense.vendor,
      date: expense.date,
      receiptNumber: expense.receiptNumber || "",
      notes: expense.notes || "",
      isRecurring: expense.isRecurring,
      gstAmount: expense.gstAmount || 0,
      isGSTApplicable: expense.isGSTApplicable,
    });
    setEditingExpense(expense);
    setShowAddForm(true);
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return categoryTotals;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = allCategories.find(c => c.id === categoryId);
    return category?.icon || "lucide:circle";
  };

  const getCategoryName = (categoryId: string) => {
    const category = allCategories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:receipt" />
                <span>Expense Tracker</span>
              </div>
              <div className="flex items-center gap-4">
                <Chip color="primary" variant="flat">
                  Total: ₹{calculateTotalExpenses().toLocaleString()}
                </Chip>
                <Button
                  color="primary"
                  startContent={<Icon icon="lucide:plus" />}
                  onPress={() => setShowAddForm(true)}
                >
                  Add Expense
                </Button>
              </div>
            </ModalHeader>
            <ModalBody>
              {showAddForm ? (
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">
                      {editingExpense ? "Edit Expense" : "Add New Expense"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Category"
                        selectedKeys={[formData.category]}
                        onSelectionChange={(keys) => 
                          setFormData({...formData, category: Array.from(keys)[0] as string})
                        }
                        isRequired
                      >
                        {allCategories.map((category) => (
                          <SelectItem key={category.id} startContent={<Icon icon={category.icon} />}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Amount"
                        type="number"
                        value={formData.amount.toString()}
                        onValueChange={(value) => setFormData({...formData, amount: parseFloat(value) || 0})}
                        startContent="₹"
                        isRequired
                      />

                      <Input
                        label="Description"
                        value={formData.description}
                        onValueChange={(value) => setFormData({...formData, description: value})}
                        placeholder="Brief description of expense"
                        isRequired
                      />

                      <Input
                        label="Vendor/Supplier"
                        value={formData.vendor}
                        onValueChange={(value) => setFormData({...formData, vendor: value})}
                        placeholder="Vendor name"
                      />

                      <Select
                        label="Payment Method"
                        selectedKeys={[formData.paymentMethod]}
                        onSelectionChange={(keys) => 
                          setFormData({...formData, paymentMethod: Array.from(keys)[0] as string})
                        }
                      >
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.key}>{method.label}</SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Receipt Number"
                        value={formData.receiptNumber}
                        onValueChange={(value) => setFormData({...formData, receiptNumber: value})}
                        placeholder="Receipt/Bill number"
                      />

                      {formData.isGSTApplicable && (
                        <Input
                          label="GST Amount"
                          type="number"
                          value={formData.gstAmount.toString()}
                          onValueChange={(value) => setFormData({...formData, gstAmount: parseFloat(value) || 0})}
                          startContent="₹"
                        />
                      )}
                    </div>

                    <div className="mt-4">
                      <Textarea
                        label="Notes"
                        value={formData.notes}
                        onValueChange={(value) => setFormData({...formData, notes: value})}
                        placeholder="Additional notes"
                      />
                    </div>

                    <div className="flex gap-4 mt-4">
                      <Button
                        variant="flat"
                        onPress={() => {
                          setShowAddForm(false);
                          setEditingExpense(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        onPress={handleSubmit}
                        isDisabled={!formData.category || !formData.description || formData.amount <= 0}
                      >
                        {editingExpense ? "Update" : "Add"} Expense
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Category Summary */}
                  <Card>
                    <CardBody>
                      <h4 className="font-semibold mb-3">Expenses by Category</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(getExpensesByCategory()).map(([category, amount]) => (
                          <div key={category} className="text-center">
                            <Icon icon={getCategoryIcon(category)} className="text-2xl mx-auto mb-1" />
                            <p className="text-sm font-medium">{getCategoryName(category)}</p>
                            <p className="text-lg font-bold">₹{amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Expenses Table */}
                  <Table aria-label="Expenses table">
                    <TableHeader>
                      <TableColumn>DATE</TableColumn>
                      <TableColumn>CATEGORY</TableColumn>
                      <TableColumn>DESCRIPTION</TableColumn>
                      <TableColumn>VENDOR</TableColumn>
                      <TableColumn>AMOUNT</TableColumn>
                      <TableColumn>PAYMENT</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date.toLocaleDateString('en-IN')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon icon={getCategoryIcon(expense.category)} />
                              <span>{getCategoryName(expense.category)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{expense.vendor}</TableCell>
                          <TableCell className="font-bold">₹{expense.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip size="sm" variant="flat">
                              {expense.paymentMethod.toUpperCase()}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="flat"
                                isIconOnly
                                onPress={() => handleEdit(expense)}
                              >
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
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                startContent={<Icon icon="lucide:download" />}
              >
                Export Expenses
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
