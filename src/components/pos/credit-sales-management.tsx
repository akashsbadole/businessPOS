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
  Progress,
  DatePicker,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface CreditSale {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  creditLimit: number;
  dueDate: Date;
  saleDate: Date;
  status: "pending" | "partial" | "overdue" | "paid";
  paymentTerms: string;
  notes?: string;
  installments?: CreditInstallment[];
}

interface CreditInstallment {
  id: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: "pending" | "paid" | "overdue";
}

interface CreditCustomer {
  id: string;
  name: string;
  phone: string;
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
  totalOutstanding: number;
  creditScore: number;
  paymentHistory: "excellent" | "good" | "fair" | "poor";
}

interface CreditSalesManagementProps {
  creditSales: CreditSale[];
  creditCustomers: CreditCustomer[];
  onAddCreditSale: (sale: Omit<CreditSale, 'id'>) => void;
  onRecordPayment: (saleId: string, amount: number, installmentId?: string) => void;
  onUpdateCreditLimit: (customerId: string, newLimit: number) => void;
  onSendReminder: (customerId: string, type: 'sms' | 'whatsapp') => void;
}

export const CreditSalesManagement: React.FC<CreditSalesManagementProps> = ({
  creditSales,
  creditCustomers,
  onAddCreditSale,
  onRecordPayment,
  onUpdateCreditLimit,
  onSendReminder,
}) => {
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState<CreditSale | null>(null);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Filter credit sales
  const filteredSales = React.useMemo(() => {
    return creditSales.filter(sale => {
      const matchesSearch = sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [creditSales, searchQuery, statusFilter]);

  // Calculate analytics
  const analytics = React.useMemo(() => {
    const totalOutstanding = creditSales.reduce((sum, sale) => sum + sale.pendingAmount, 0);
    const totalOverdue = creditSales
      .filter(sale => sale.status === "overdue")
      .reduce((sum, sale) => sum + sale.pendingAmount, 0);
    const totalCreditLimit = creditCustomers.reduce((sum, customer) => sum + customer.creditLimit, 0);
    const totalUsedCredit = creditCustomers.reduce((sum, customer) => sum + customer.usedCredit, 0);
    
    const overdueCount = creditSales.filter(sale => sale.status === "overdue").length;
    const dueTodayCount = creditSales.filter(sale => {
      const today = new Date();
      const dueDate = new Date(sale.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalOutstanding,
      totalOverdue,
      totalCreditLimit,
      totalUsedCredit,
      overdueCount,
      dueTodayCount,
      creditUtilization: totalCreditLimit > 0 ? (totalUsedCredit / totalCreditLimit) * 100 : 0,
    };
  }, [creditSales, creditCustomers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "partial": return "primary";
      case "overdue": return "danger";
      default: return "default";
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const handleRecordPayment = () => {
    if (!selectedSale || !paymentAmount) return;
    
    const amount = parseFloat(paymentAmount);
    if (amount > 0 && amount <= selectedSale.pendingAmount) {
      onRecordPayment(selectedSale.id, amount);
      setPaymentAmount("");
      setShowPaymentModal(false);
      setSelectedSale(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Credit Sales Management</h2>
        <div className="flex gap-2">
          <Button
            color="secondary"
            variant="flat"
            startContent={<Icon icon="lucide:bell" />}
          >
            Send Reminders
          </Button>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" />}
          >
            New Credit Sale
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(analytics.totalOutstanding)}
                </p>
              </div>
              <Icon icon="lucide:credit-card" className="text-3xl text-red-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(analytics.totalOverdue)}
                </p>
                <p className="text-xs text-gray-500">{analytics.overdueCount} invoices</p>
              </div>
              <Icon icon="lucide:alert-triangle" className="text-3xl text-orange-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Credit Utilization</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.creditUtilization.toFixed(1)}%
                </p>
                <Progress 
                  value={analytics.creditUtilization} 
                  color={analytics.creditUtilization > 80 ? "danger" : "primary"}
                  className="mt-1"
                />
              </div>
              <Icon icon="lucide:pie-chart" className="text-3xl text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Today</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.dueTodayCount}</p>
                <p className="text-xs text-gray-500">Payments due</p>
              </div>
              <Icon icon="lucide:calendar" className="text-3xl text-purple-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by customer or invoice..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" />}
          className="flex-1"
        />
        <Select
          placeholder="Filter by status"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
          className="w-48"
        >
          <SelectItem key="all">All Status</SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="partial">Partial</SelectItem>
          <SelectItem key="overdue">Overdue</SelectItem>
          <SelectItem key="paid">Paid</SelectItem>
        </Select>
      </div>

      {/* Credit Sales Table */}
      <Card>
        <CardBody>
          <Table aria-label="Credit sales table">
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>INVOICE</TableColumn>
              <TableColumn>TOTAL AMOUNT</TableColumn>
              <TableColumn>PAID</TableColumn>
              <TableColumn>PENDING</TableColumn>
              <TableColumn>DUE DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.customerName}</div>
                      <div className="text-sm text-gray-500">
                        Credit: {formatCurrency(sale.creditLimit)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(sale.saleDate).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(sale.totalAmount)}
                  </TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(sale.paidAmount)}
                  </TableCell>
                  <TableCell className="text-red-600 font-bold">
                    {formatCurrency(sale.pendingAmount)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(sale.dueDate).toLocaleDateString('en-IN')}</div>
                      {sale.status === "overdue" && (
                        <div className="text-xs text-red-600">
                          {getDaysOverdue(sale.dueDate)} days overdue
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(sale.status)} variant="flat" size="sm">
                      {sale.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        isIconOnly
                        onPress={() => {
                          setSelectedSale(sale);
                          setShowPaymentModal(true);
                        }}
                      >
                        <Icon icon="lucide:credit-card" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        isIconOnly
                        onPress={() => onSendReminder(sale.customerId, 'whatsapp')}
                      >
                        <Icon icon="lucide:message-circle" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                      >
                        <Icon icon="lucide:eye" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Payment Recording Modal */}
      <Modal isOpen={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Record Payment</ModalHeader>
              <ModalBody>
                {selectedSale && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer:</p>
                      <p className="font-medium">{selectedSale.customerName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Invoice:</p>
                      <p className="font-medium">{selectedSale.invoiceNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Pending Amount:</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(selectedSale.pendingAmount)}
                      </p>
                    </div>
                    
                    <Input
                      type="number"
                      label="Payment Amount"
                      value={paymentAmount}
                      onValueChange={setPaymentAmount}
                      startContent="₹"
                      max={selectedSale.pendingAmount}
                      isRequired
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleRecordPayment}>
                  Record Payment
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
