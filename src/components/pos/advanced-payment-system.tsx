import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Input,
  Tabs,
  Tab,
  Chip,
  Divider,
  Select,
  SelectItem,
  Progress,
  Image,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: "upi" | "card" | "wallet" | "cash" | "credit";
  processingFee?: number;
  enabled: boolean;
}

interface SplitPayment {
  id: string;
  method: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
}

interface AdvancedPaymentSystemProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  onPaymentComplete: (paymentData: any) => void;
}

export const AdvancedPaymentSystem: React.FC<AdvancedPaymentSystemProps> = ({
  isOpen,
  onOpenChange,
  totalAmount,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState("cash");
  const [splitPayments, setSplitPayments] = React.useState<SplitPayment[]>([]);
  const [isSplitMode, setIsSplitMode] = React.useState(false);
  const [amountReceived, setAmountReceived] = React.useState(totalAmount);
  const [processingPayment, setProcessingPayment] = React.useState(false);

  // Payment methods configuration
  const paymentMethods: PaymentMethod[] = [
    { id: "cash", name: "Cash", icon: "lucide:banknote", type: "cash", enabled: true },
    { id: "upi", name: "UPI", icon: "lucide:smartphone", type: "upi", enabled: true },
    { id: "phonepe", name: "PhonePe", icon: "simple-icons:phonepe", type: "upi", enabled: true },
    { id: "googlepay", name: "Google Pay", icon: "simple-icons:googlepay", type: "upi", enabled: true },
    { id: "paytm", name: "Paytm", icon: "simple-icons:paytm", type: "upi", enabled: true },
    { id: "card", name: "Card", icon: "lucide:credit-card", type: "card", processingFee: 2, enabled: true },
    { id: "wallet", name: "Digital Wallet", icon: "lucide:wallet", type: "wallet", enabled: true },
    { id: "credit", name: "Credit Sale", icon: "lucide:clock", type: "credit", enabled: true },
  ];

  // UPI Apps
  const upiApps = [
    { id: "phonepe", name: "PhonePe", icon: "simple-icons:phonepe", color: "#5f259f" },
    { id: "googlepay", name: "GPay", icon: "simple-icons:googlepay", color: "#4285f4" },
    { id: "paytm", name: "Paytm", icon: "simple-icons:paytm", color: "#00baf2" },
    { id: "bhim", name: "BHIM", icon: "lucide:smartphone", color: "#ff6b35" },
  ];

  const calculateFinalAmount = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    const processingFee = method?.processingFee ? (totalAmount * method.processingFee / 100) : 0;
    return totalAmount + processingFee;
  };

  const addSplitPayment = () => {
    const newSplit: SplitPayment = {
      id: Date.now().toString(),
      method: selectedMethod,
      amount: 0,
      status: "pending",
    };
    setSplitPayments([...splitPayments, newSplit]);
  };

  const updateSplitPayment = (id: string, updates: Partial<SplitPayment>) => {
    setSplitPayments(prev => 
      prev.map(split => split.id === id ? { ...split, ...updates } : split)
    );
  };

  const removeSplitPayment = (id: string) => {
    setSplitPayments(prev => prev.filter(split => split.id !== id));
  };

  const getTotalSplitAmount = () => {
    return splitPayments.reduce((sum, split) => sum + split.amount, 0);
  };

  const processPayment = async () => {
    setProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: selectedMethod,
        amount: isSplitMode ? getTotalSplitAmount() : amountReceived,
        totalAmount: calculateFinalAmount(),
        splitPayments: isSplitMode ? splitPayments : undefined,
        timestamp: new Date(),
        transactionId: `TXN${Date.now()}`,
        status: "completed",
      };

      onPaymentComplete(paymentData);
      onOpenChange(false);
    } catch (error) {
      console.error("Payment processing failed:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const generateUPIQR = () => {
    const amount = calculateFinalAmount();
    return `upi://pay?pa=merchant@upi&pn=BusinessPOS&am=${amount}&cu=INR&tn=Payment`;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:credit-card" />
              <span>Advanced Payment System</span>
              <Chip color="primary" variant="flat">
                ₹{totalAmount.toFixed(2)}
              </Chip>
            </ModalHeader>
            
            <ModalBody>
              <div className="space-y-6">
                {/* Payment Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={!isSplitMode ? "solid" : "flat"}
                    color="primary"
                    onPress={() => setIsSplitMode(false)}
                    startContent={<Icon icon="lucide:credit-card" />}
                  >
                    Single Payment
                  </Button>
                  <Button
                    variant={isSplitMode ? "solid" : "flat"}
                    color="secondary"
                    onPress={() => setIsSplitMode(true)}
                    startContent={<Icon icon="lucide:split" />}
                  >
                    Split Payment
                  </Button>
                </div>

                {!isSplitMode ? (
                  /* Single Payment Mode */
                  <Tabs selectedKey={selectedMethod} onSelectionChange={(key) => setSelectedMethod(key as string)}>
                    {/* Cash Payment */}
                    <Tab key="cash" title={
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:banknote" />
                        <span>Cash</span>
                      </div>
                    }>
                      <div className="space-y-4">
                        <Input
                          label="Amount Received"
                          type="number"
                          value={amountReceived.toString()}
                          onValueChange={(value) => setAmountReceived(parseFloat(value) || 0)}
                          startContent="₹"
                          endContent={
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => setAmountReceived(totalAmount)}
                            >
                              Exact
                            </Button>
                          }
                        />
                        
                        {/* Quick Amount Buttons */}
                        <div className="grid grid-cols-6 gap-2">
                          {[500, 200, 100, 50, 20, 10].map((denomination) => (
                            <Button
                              key={denomination}
                              variant="flat"
                              size="sm"
                              onPress={() => setAmountReceived(amountReceived + denomination)}
                            >
                              +₹{denomination}
                            </Button>
                          ))}
                        </div>

                        <Card>
                          <CardBody>
                            <div className="flex justify-between">
                              <span>Change to Return:</span>
                              <span className="font-bold text-green-600">
                                ₹{Math.max(0, amountReceived - totalAmount).toFixed(2)}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </Tab>

                    {/* UPI Payment */}
                    <Tab key="upi" title={
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:smartphone" />
                        <span>UPI</span>
                      </div>
                    }>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">UPI Apps</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {upiApps.map((app) => (
                                <Button
                                  key={app.id}
                                  variant="flat"
                                  size="sm"
                                  startContent={<Icon icon={app.icon} />}
                                  style={{ color: app.color }}
                                >
                                  {app.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">QR Code</h4>
                            <Card>
                              <CardBody className="text-center">
                                <Icon icon="lucide:qr-code" className="text-6xl mx-auto mb-2" />
                                <p className="text-xs text-gray-600">
                                  Scan to pay ₹{calculateFinalAmount().toFixed(2)}
                                </p>
                                <Button size="sm" variant="flat" className="mt-2">
                                  Generate QR
                                </Button>
                              </CardBody>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Tab>

                    {/* Card Payment */}
                    <Tab key="card" title={
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:credit-card" />
                        <span>Card</span>
                      </div>
                    }>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="flat" startContent={<Icon icon="lucide:credit-card" />}>
                            Chip & PIN
                          </Button>
                          <Button variant="flat" startContent={<Icon icon="lucide:contactless" />}>
                            Contactless
                          </Button>
                        </div>
                        
                        <Card>
                          <CardBody>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Amount:</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-orange-600">
                                <span>Processing Fee (2%):</span>
                                <span>₹{(totalAmount * 0.02).toFixed(2)}</span>
                              </div>
                              <Divider />
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>₹{calculateFinalAmount().toFixed(2)}</span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </Tab>

                    {/* Credit Sale */}
                    <Tab key="credit" title={
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:clock" />
                        <span>Credit</span>
                      </div>
                    }>
                      <div className="space-y-4">
                        <Select label="Customer" placeholder="Select customer for credit sale">
                          <SelectItem key="customer1">John Doe</SelectItem>
                          <SelectItem key="customer2">Jane Smith</SelectItem>
                        </Select>
                        
                        <Input
                          label="Credit Limit"
                          value="₹50,000"
                          isReadOnly
                          description="Available credit limit"
                        />
                        
                        <Input
                          label="Due Date"
                          type="date"
                          defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                ) : (
                  /* Split Payment Mode */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Split Payment</h3>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={addSplitPayment}
                        startContent={<Icon icon="lucide:plus" />}
                      >
                        Add Payment
                      </Button>
                    </div>

                    {splitPayments.map((split) => (
                      <Card key={split.id}>
                        <CardBody>
                          <div className="flex gap-4 items-end">
                            <Select
                              label="Method"
                              selectedKeys={[split.method]}
                              onSelectionChange={(keys) => 
                                updateSplitPayment(split.id, { method: Array.from(keys)[0] as string })
                              }
                              className="flex-1"
                            >
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.id}>{method.name}</SelectItem>
                              ))}
                            </Select>
                            <Input
                              label="Amount"
                              type="number"
                              value={split.amount.toString()}
                              onValueChange={(value) => 
                                updateSplitPayment(split.id, { amount: parseFloat(value) || 0 })
                              }
                              startContent="₹"
                              className="flex-1"
                            />
                            <Button
                              isIconOnly
                              color="danger"
                              variant="flat"
                              onPress={() => removeSplitPayment(split.id)}
                            >
                              <Icon icon="lucide:trash" />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}

                    <Card>
                      <CardBody>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Split Total:</span>
                            <span>₹{getTotalSplitAmount().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Remaining:</span>
                            <span className={getTotalSplitAmount() > totalAmount ? "text-red-500" : "text-green-500"}>
                              ₹{(totalAmount - getTotalSplitAmount()).toFixed(2)}
                            </span>
                          </div>
                          <Progress 
                            value={(getTotalSplitAmount() / totalAmount) * 100} 
                            color={getTotalSplitAmount() >= totalAmount ? "success" : "primary"}
                            className="mt-2"
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={processPayment}
                isLoading={processingPayment}
                startContent={<Icon icon="lucide:check" />}
                isDisabled={isSplitMode && getTotalSplitAmount() !== totalAmount}
              >
                {processingPayment ? "Processing..." : "Complete Payment"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
