import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Divider,
  Chip,
  Link,
  Image,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { SubscriptionService } from "../../services/subscription-service";
import { PaymentRequest } from "../../types/subscription";

interface PaymentPageProps {
  selectedPlan: "basic" | "premium" | "enterprise";
  onPaymentSuccess: (paymentRequest: PaymentRequest) => void;
  onBack: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  selectedPlan,
  onPaymentSuccess,
  onBack,
}) => {
  const [duration, setDuration] = useState<"monthly" | "yearly">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "paypal">("upi");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const plans = SubscriptionService.getSubscriptionPlans();
  const plan = plans.find((p) => p.type === selectedPlan)!;
  const contactInfo = SubscriptionService.getContactInfo();

  const amount = duration === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  const savings =
    duration === "yearly" ? plan.monthlyPrice * 12 - plan.yearlyPrice : 0;
  const reference = `POS_${selectedPlan.toUpperCase()}_${Date.now()}`;

  const upiDetails = SubscriptionService.getUPIPaymentDetails(
    amount,
    reference
  );

  const handleUPIPayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !upiTransactionId) {
      alert("Please fill all required fields and transaction ID");
      return;
    }

    setIsProcessing(true);

    const paymentRequest: PaymentRequest = {
      planType: selectedPlan,
      duration,
      email: customerInfo.email,
      name: customerInfo.name,
      paymentMethod: "upi",
      transactionId: upiTransactionId,
      amount,
      currency: "INR",
    };

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(paymentRequest);
    }, 2000);
  };

  const handlePayPalPayment = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert("Please fill all required fields");
      return;
    }

    setIsProcessing(true);

    // In a real implementation, you would integrate with PayPal SDK
    // For demo, we'll simulate a successful payment
    const paymentRequest: PaymentRequest = {
      planType: selectedPlan,
      duration,
      email: customerInfo.email,
      name: customerInfo.name,
      paymentMethod: "paypal",
      transactionId: `PP_${Date.now()}`,
      amount: Math.round(amount / 83), // Convert INR to USD (approximate)
      currency: "USD",
    };

    // Simulate PayPal processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(paymentRequest);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button isIconOnly variant="light" onPress={onBack}>
            <Icon icon="lucide:arrow-left" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
            <p className="text-default-600">
              Secure payment for BusinessPOS {plan.name}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Order Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <span className="font-medium">{plan.name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Billing</span>
                  <span className="font-medium capitalize">{duration}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Savings</span>
                    <span className="font-medium">
                      ₹{savings.toLocaleString()}
                    </span>
                  </div>
                )}

                <Divider />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{amount.toLocaleString()}</span>
                </div>

                <div className="text-xs text-default-500 space-y-1">
                  <p>• Instant activation after payment</p>
                  <p>• 30-day money-back guarantee</p>
                  <p>• 24/7 customer support</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-semibold">Payment Details</h3>
                  <Select
                    size="sm"
                    selectedKeys={[duration]}
                    onSelectionChange={(keys) =>
                      setDuration(Array.from(keys)[0] as "monthly" | "yearly")
                    }
                    className="w-32"
                  >
                    <SelectItem key="monthly">Monthly</SelectItem>
                    <SelectItem key="yearly">Yearly</SelectItem>
                  </Select>
                </div>
              </CardHeader>

              <CardBody>
                {/* Customer Information */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium">Customer Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={customerInfo.name}
                      onValueChange={(value) =>
                        setCustomerInfo((prev) => ({ ...prev, name: value }))
                      }
                      isRequired
                    />
                    <Input
                      label="Email Address"
                      placeholder="Enter your email"
                      type="email"
                      value={customerInfo.email}
                      onValueChange={(value) =>
                        setCustomerInfo((prev) => ({ ...prev, email: value }))
                      }
                      isRequired
                    />
                    <Input
                      label="Phone Number"
                      placeholder="Enter your phone"
                      value={customerInfo.phone}
                      onValueChange={(value) =>
                        setCustomerInfo((prev) => ({ ...prev, phone: value }))
                      }
                    />
                    <Input
                      label="Company Name"
                      placeholder="Enter company name (optional)"
                      value={customerInfo.company}
                      onValueChange={(value) =>
                        setCustomerInfo((prev) => ({ ...prev, company: value }))
                      }
                    />
                  </div>
                </div>

                <Divider className="my-6" />

                {/* Payment Methods */}
                <Tabs
                  selectedKey={paymentMethod}
                  onSelectionChange={(key) =>
                    setPaymentMethod(key as "upi" | "paypal")
                  }
                  className="w-full"
                >
                  <Tab
                    key="upi"
                    title={
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="simple-icons:googlepay"
                          className="text-lg"
                        />
                        <span>UPI Payment</span>
                      </div>
                    }
                  >
                    <div className="space-y-4 mt-4">
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Pay via UPI</h5>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>UPI ID:</strong> {upiDetails.upiId}
                          </p>
                          <p>
                            <strong>Amount:</strong> ₹{amount.toLocaleString()}
                          </p>
                          <p>
                            <strong>Reference:</strong> {reference}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button
                          color="primary"
                          variant="bordered"
                          onPress={onOpen}
                          startContent={<Icon icon="lucide:qr-code" />}
                        >
                          Show QR Code
                        </Button>
                      </div>

                      <Input
                        label="UPI Transaction ID"
                        placeholder="Enter transaction ID after payment"
                        value={upiTransactionId}
                        onValueChange={setUpiTransactionId}
                        description="Complete the UPI payment and enter the transaction ID here"
                        isRequired
                      />

                      <Button
                        color="primary"
                        size="lg"
                        className="w-full"
                        onPress={handleUPIPayment}
                        isLoading={isProcessing}
                        isDisabled={
                          !customerInfo.name ||
                          !customerInfo.email ||
                          !upiTransactionId
                        }
                      >
                        {isProcessing ? "Processing..." : "Confirm UPI Payment"}
                      </Button>
                    </div>
                  </Tab>

                  <Tab
                    key="paypal"
                    title={
                      <div className="flex items-center gap-2">
                        <Icon icon="simple-icons:paypal" className="text-lg" />
                        <span>PayPal</span>
                      </div>
                    }
                  >
                    <div className="space-y-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Pay with PayPal</h5>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Amount:</strong> ${Math.round(amount / 83)}{" "}
                            USD
                          </p>
                          <p>
                            <strong>Secure payment via PayPal</strong>
                          </p>
                          <p>
                            You'll be redirected to PayPal to complete the
                            payment
                          </p>
                        </div>
                      </div>

                      <Button
                        color="primary"
                        size="lg"
                        className="w-full"
                        onPress={handlePayPalPayment}
                        isLoading={isProcessing}
                        isDisabled={!customerInfo.name || !customerInfo.email}
                        startContent={<Icon icon="simple-icons:paypal" />}
                      >
                        {isProcessing ? "Processing..." : "Pay with PayPal"}
                      </Button>
                    </div>
                  </Tab>
                </Tabs>

                {/* Contact Support */}
                <div className="mt-6 p-4 bg-default-50 rounded-lg">
                  <h5 className="font-medium mb-2">Need Help?</h5>
                  <p className="text-sm text-default-600 mb-2">
                    Contact our support team for assistance with payment
                  </p>
                  <div className="flex gap-4 text-sm">
                    <Link
                      href={`mailto:${contactInfo.email}`}
                      className="text-primary"
                    >
                      <Icon icon="lucide:mail" className="inline mr-1" />
                      Email
                    </Link>
                    <Link
                      href={`https://wa.me/${contactInfo.whatsapp.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      className="text-success"
                    >
                      <Icon
                        icon="lucide:message-circle"
                        className="inline mr-1"
                      />
                      WhatsApp
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* QR Code Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalContent>
            <ModalHeader>UPI QR Code</ModalHeader>
            <ModalBody className="text-center">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  {/* QR Code placeholder - in production, use a QR code library */}
                  <div className="w-48 h-48 bg-default-100 flex items-center justify-center rounded border-2 border-dashed border-default-300">
                    <div className="text-center">
                      <Icon
                        icon="lucide:qr-code"
                        className="text-4xl text-default-400 mb-2"
                      />
                      <p className="text-xs text-default-500">QR Code</p>
                      <p className="text-xs text-default-400">Scan to pay</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>UPI ID:</strong> {upiDetails.upiId}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{amount.toLocaleString()}
                  </p>
                  <p>
                    <strong>Reference:</strong> {reference}
                  </p>
                </div>
                <div className="text-xs text-default-500">
                  <p>Scan this QR code with any UPI app to make payment</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
