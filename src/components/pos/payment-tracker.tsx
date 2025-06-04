import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface PendingPayment {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  amountReceived: number;
  pendingAmount: number;
  paymentStatus: "partial" | "unpaid";
  date: Date;
  dueDate?: Date;
}

interface PaymentTrackerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pendingPayments: PendingPayment[];
  onCollectPayment: (paymentId: string, amount: number) => void;
  onMarkAsPaid: (paymentId: string) => void;
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({
  isOpen,
  onOpenChange,
  pendingPayments,
  onCollectPayment,
  onMarkAsPaid,
}) => {
  const [selectedPayment, setSelectedPayment] = React.useState<string | null>(null);
  const [collectAmount, setCollectAmount] = React.useState<number>(0);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const filteredPayments = React.useMemo(() => {
    if (filterStatus === "all") return pendingPayments;
    return pendingPayments.filter(payment => payment.paymentStatus === filterStatus);
  }, [pendingPayments, filterStatus]);

  const totalPendingAmount = React.useMemo(() => {
    return pendingPayments.reduce((sum, payment) => sum + payment.pendingAmount, 0);
  }, [pendingPayments]);

  const handleCollectPayment = () => {
    if (selectedPayment && collectAmount > 0) {
      onCollectPayment(selectedPayment, collectAmount);
      setSelectedPayment(null);
      setCollectAmount(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "partial":
        return "warning";
      case "unpaid":
        return "danger";
      default:
        return "default";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:credit-card" className="text-xl" />
                <span>Payment Tracker</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-600">Total Pending: </span>
                  <span className="font-bold text-red-600">
                    ₹{totalPendingAmount.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Count: </span>
                  <span className="font-bold">{pendingPayments.length}</span>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Filter Controls */}
                <div className="flex gap-4 items-center">
                  <Select
                    size="sm"
                    label="Filter by Status"
                    selectedKeys={[filterStatus]}
                    onSelectionChange={(keys) => setFilterStatus(Array.from(keys)[0] as string)}
                    className="w-48"
                  >
                    <SelectItem key="all">All Payments</SelectItem>
                    <SelectItem key="unpaid">Unpaid</SelectItem>
                    <SelectItem key="partial">Partial Paid</SelectItem>
                  </Select>
                  
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="lucide:refresh-cw" />}
                  >
                    Refresh
                  </Button>
                </div>

                {/* Payments Table */}
                <Table aria-label="Pending payments table">
                  <TableHeader>
                    <TableColumn>INVOICE</TableColumn>
                    <TableColumn>CUSTOMER</TableColumn>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>TOTAL</TableColumn>
                    <TableColumn>RECEIVED</TableColumn>
                    <TableColumn>PENDING</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-mono text-sm">
                            #{payment.invoiceNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{payment.customerName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(payment.date)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{payment.totalAmount.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-green-600 font-medium">
                            ₹{payment.amountReceived.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-red-600 font-medium">
                            ₹{payment.pendingAmount.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={getStatusColor(payment.paymentStatus)}
                            size="sm"
                            variant="flat"
                          >
                            {payment.paymentStatus.toUpperCase()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() => {
                                setSelectedPayment(payment.id);
                                setCollectAmount(payment.pendingAmount);
                              }}
                            >
                              Collect
                            </Button>
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              onPress={() => onMarkAsPaid(payment.id)}
                            >
                              Mark Paid
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredPayments.length === 0 && (
                  <div className="text-center py-8">
                    <Icon icon="lucide:check-circle" className="text-4xl text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No pending payments found</p>
                    <p className="text-sm text-gray-500">All payments are up to date!</p>
                  </div>
                )}

                {/* Collect Payment Modal */}
                {selectedPayment && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                      <h3 className="text-lg font-semibold mb-4">Collect Payment</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount to Collect
                          </label>
                          <Input
                            type="number"
                            value={collectAmount.toString()}
                            onValueChange={(value) => setCollectAmount(parseFloat(value) || 0)}
                            startContent="₹"
                            placeholder="Enter amount"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="flat"
                            onPress={() => {
                              setSelectedPayment(null);
                              setCollectAmount(0);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            onPress={handleCollectPayment}
                            isDisabled={collectAmount <= 0}
                          >
                            Collect Payment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                startContent={<Icon icon="lucide:download" />}
              >
                Export Report
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
