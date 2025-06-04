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
  Card,
  CardBody,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface PaymentMethod {
  id: string;
  name: string;
  type: "cash" | "upi" | "card" | "wallet" | "bnpl" | "bank_transfer";
  icon: string;
  charges?: number;
  chargeType?: "percentage" | "fixed";
  isActive: boolean;
}

interface EnhancedPaymentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  totalAmount: number;
  onPaymentComplete: (paymentData: any) => void;
}

export const EnhancedPaymentModal: React.FC<EnhancedPaymentModalProps> = ({
  isOpen,
  onOpenChange,
  totalAmount,
  onPaymentComplete,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>("cash");
  const [amountReceived, setAmountReceived] = React.useState<number>(totalAmount);
  const [splitPayments, setSplitPayments] = React.useState<any[]>([]);
  const [upiId, setUpiId] = React.useState("");
  const [cardDetails, setCardDetails] = React.useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Indian payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: "cash", name: "Cash", type: "cash", icon: "lucide:banknote", isActive: true },
    { id: "upi", name: "UPI", type: "upi", icon: "lucide:smartphone", isActive: true },
    { id: "paytm", name: "Paytm", type: "wallet", icon: "lucide:wallet", isActive: true },
    { id: "phonepe", name: "PhonePe", type: "wallet", icon: "lucide:phone", isActive: true },
    { id: "googlepay", name: "Google Pay", type: "wallet", icon: "lucide:smartphone", isActive: true },
    { id: "card", name: "Credit/Debit Card", type: "card", icon: "lucide:credit-card", charges: 2, chargeType: "percentage", isActive: true },
    { id: "netbanking", name: "Net Banking", type: "bank_transfer", icon: "lucide:building-2", charges: 5, chargeType: "fixed", isActive: true },
    { id: "bnpl", name: "Buy Now Pay Later", type: "bnpl", icon: "lucide:calendar-clock", isActive: true },
  ];

  // UPI apps popular in India
  const upiApps = [
    { id: "paytm", name: "Paytm", icon: "lucide:wallet" },
    { id: "phonepe", name: "PhonePe", icon: "lucide:phone" },
    { id: "googlepay", name: "Google Pay", icon: "lucide:smartphone" },
    { id: "bhim", name: "BHIM", icon: "lucide:shield" },
    { id: "amazonpay", name: "Amazon Pay", icon: "lucide:shopping-cart" },
  ];

  const calculateCharges = (method: PaymentMethod, amount: number) => {
    if (!method.charges) return 0;
    return method.chargeType === "percentage" 
      ? (amount * method.charges) / 100 
      : method.charges;
  };

  const calculateFinalAmount = () => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    const charges = method ? calculateCharges(method, totalAmount) : 0;
    return totalAmount + charges;
  };

  const handlePaymentComplete = () => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    const charges = method ? calculateCharges(method, totalAmount) : 0;
    const finalAmount = totalAmount + charges;

    const paymentData = {
      method: selectedPaymentMethod,
      methodName: method?.name,
      totalAmount,
      charges,
      finalAmount,
      amountReceived,
      change: Math.max(0, amountReceived - finalAmount),
      pendingAmount: Math.max(0, finalAmount - amountReceived),
      paymentStatus: amountReceived >= finalAmount ? "paid" : amountReceived > 0 ? "partial" : "unpaid",
      upiId: selectedPaymentMethod === "upi" ? upiId : undefined,
      cardDetails: selectedPaymentMethod === "card" ? cardDetails : undefined,
      splitPayments: splitPayments.length > 0 ? splitPayments : undefined,
      timestamp: new Date(),
    };

    onPaymentComplete(paymentData);
  };

  const addSplitPayment = () => {
    setSplitPayments([
      ...splitPayments,
      {
        id: Date.now(),
        method: selectedPaymentMethod,
        amount: 0,
      },
    ]);
  };

  const removeSplitPayment = (id: number) => {
    setSplitPayments(splitPayments.filter(p => p.id !== id));
  };

  const generateUPIQR = () => {
    // Generate UPI QR code data
    const upiString = `upi://pay?pa=${upiId}&pn=BusinessPOS&am=${calculateFinalAmount()}&cu=INR&tn=Payment for Invoice`;
    return upiString;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:credit-card" />
              <span>Payment Processing</span>
              <Chip color="primary" variant="flat">
                ₹{totalAmount.toFixed(2)}
              </Chip>
            </ModalHeader>
            <ModalBody>
              <Tabs selectedKey={selectedPaymentMethod} onSelectionChange={(key) => setSelectedPaymentMethod(key as string)}>
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
                    <div className="grid grid-cols-3 gap-2">
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
                    <Input
                      label="UPI ID"
                      placeholder="customer@paytm"
                      value={upiId}
                      onValueChange={setUpiId}
                      startContent="@"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Popular UPI Apps</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {upiApps.map((app) => (
                            <Button
                              key={app.id}
                              variant="flat"
                              size="sm"
                              startContent={<Icon icon={app.icon} />}
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
                            <Icon icon="lucide:qr-code" className="text-4xl mx-auto mb-2" />
                            <p className="text-xs text-gray-600">
                              QR Code for ₹{calculateFinalAmount().toFixed(2)}
                            </p>
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
                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onValueChange={(value) => setCardDetails({...cardDetails, number: value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry (MM/YY)"
                        placeholder="12/25"
                        value={cardDetails.expiry}
                        onValueChange={(value) => setCardDetails({...cardDetails, expiry: value})}
                      />
                      <Input
                        label="CVV"
                        placeholder="123"
                        type="password"
                        value={cardDetails.cvv}
                        onValueChange={(value) => setCardDetails({...cardDetails, cvv: value})}
                      />
                    </div>
                    <Input
                      label="Cardholder Name"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onValueChange={(value) => setCardDetails({...cardDetails, name: value})}
                    />
                    <Card>
                      <CardBody>
                        <div className="flex justify-between text-sm">
                          <span>Processing Fee (2%):</span>
                          <span>₹{(totalAmount * 0.02).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total Amount:</span>
                          <span>₹{(totalAmount * 1.02).toFixed(2)}</span>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                {/* Wallet Payments */}
                {["paytm", "phonepe", "googlepay"].map((wallet) => (
                  <Tab key={wallet} title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:wallet" />
                      <span>{wallet.charAt(0).toUpperCase() + wallet.slice(1)}</span>
                    </div>
                  }>
                    <div className="space-y-4 text-center">
                      <Icon icon="lucide:smartphone" className="text-6xl mx-auto text-primary" />
                      <h3 className="text-lg font-semibold">
                        Pay with {wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                      </h3>
                      <p className="text-gray-600">
                        Amount: ₹{totalAmount.toFixed(2)}
                      </p>
                      <Button color="primary" size="lg">
                        Open {wallet.charAt(0).toUpperCase() + wallet.slice(1)} App
                      </Button>
                    </div>
                  </Tab>
                ))}
              </Tabs>

              <Divider />

              {/* Payment Summary */}
              <Card>
                <CardBody>
                  <h4 className="font-semibold mb-2">Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    {calculateCharges(paymentMethods.find(m => m.id === selectedPaymentMethod)!, totalAmount) > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Processing Fee:</span>
                        <span>₹{calculateCharges(paymentMethods.find(m => m.id === selectedPaymentMethod)!, totalAmount).toFixed(2)}</span>
                      </div>
                    )}
                    <Divider />
                    <div className="flex justify-between font-bold">
                      <span>Final Amount:</span>
                      <span>₹{calculateFinalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handlePaymentComplete}
                startContent={<Icon icon="lucide:check" />}
              >
                Complete Payment
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
