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
  Select,
  SelectItem,
  Chip,
  Progress,
  Image,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface UPIPaymentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  amount: number;
  onPaymentSuccess: (transactionId: string, method: string) => void;
  onPaymentFailure: (error: string) => void;
}

interface UPIApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  deepLink: string;
  isInstalled?: boolean;
}

export const UPIPayment: React.FC<UPIPaymentProps> = ({
  isOpen,
  onOpenChange,
  amount,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [selectedUPIApp, setSelectedUPIApp] = React.useState<string>("");
  const [upiId, setUpiId] = React.useState("");
  const [paymentStatus, setPaymentStatus] = React.useState<"idle" | "processing" | "success" | "failed">("idle");
  const [transactionId, setTransactionId] = React.useState("");
  const [qrCode, setQrCode] = React.useState("");

  const upiApps: UPIApp[] = [
    {
      id: "phonepe",
      name: "PhonePe",
      icon: "simple-icons:phonepe",
      color: "#5f259f",
      deepLink: "phonepe://",
      isInstalled: true,
    },
    {
      id: "paytm",
      name: "Paytm",
      icon: "simple-icons:paytm",
      color: "#00baf2",
      deepLink: "paytmmp://",
      isInstalled: true,
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: "simple-icons:googlepay",
      color: "#4285f4",
      deepLink: "tez://",
      isInstalled: true,
    },
    {
      id: "bhim",
      name: "BHIM",
      icon: "simple-icons:bhim",
      color: "#ff6b35",
      deepLink: "bhim://",
      isInstalled: false,
    },
    {
      id: "amazonpay",
      name: "Amazon Pay",
      icon: "simple-icons:amazon",
      color: "#ff9900",
      deepLink: "amazonpay://",
      isInstalled: false,
    },
    {
      id: "mobikwik",
      name: "MobiKwik",
      icon: "simple-icons:mobikwik",
      color: "#d32f2f",
      deepLink: "mobikwik://",
      isInstalled: false,
    },
  ];

  const merchantUPI = "merchant@paytm"; // Replace with actual merchant UPI ID
  const merchantName = "BusinessPOS Store";

  React.useEffect(() => {
    if (isOpen && amount > 0) {
      generateQRCode();
    }
  }, [isOpen, amount]);

  const generateQRCode = () => {
    // Generate UPI QR code URL
    const upiUrl = `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for Invoice #${Date.now()}`)}`;
    
    // Generate QR code using a QR code service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    setQrCode(qrCodeUrl);
  };

  const handleUPIAppPayment = (app: UPIApp) => {
    setSelectedUPIApp(app.id);
    setPaymentStatus("processing");

    // Generate UPI deep link
    const upiUrl = `${app.deepLink}pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment via ${app.name}`)}`;

    try {
      // Try to open the UPI app
      window.open(upiUrl, '_blank');
      
      // Simulate payment processing
      setTimeout(() => {
        // In real implementation, you would check payment status via API
        const mockTransactionId = `TXN${Date.now()}`;
        setTransactionId(mockTransactionId);
        setPaymentStatus("success");
        onPaymentSuccess(mockTransactionId, `UPI-${app.name}`);
      }, 3000);
    } catch (error) {
      setPaymentStatus("failed");
      onPaymentFailure(`Failed to open ${app.name}`);
    }
  };

  const handleManualUPIPayment = () => {
    if (!upiId) {
      onPaymentFailure("Please enter a valid UPI ID");
      return;
    }

    setPaymentStatus("processing");

    // Simulate manual UPI payment
    setTimeout(() => {
      const mockTransactionId = `TXN${Date.now()}`;
      setTransactionId(mockTransactionId);
      setPaymentStatus("success");
      onPaymentSuccess(mockTransactionId, `UPI-Manual-${upiId}`);
    }, 2000);
  };

  const resetPayment = () => {
    setPaymentStatus("idle");
    setSelectedUPIApp("");
    setTransactionId("");
    setUpiId("");
  };

  const handleClose = () => {
    resetPayment();
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="simple-icons:upi" className="text-2xl text-orange-600" />
              <span>UPI Payment</span>
              <Chip color="primary" variant="flat" size="sm">
                ₹{amount.toFixed(2)}
              </Chip>
            </ModalHeader>
            
            <ModalBody>
              {paymentStatus === "idle" && (
                <div className="space-y-6">
                  {/* QR Code Payment */}
                  <Card>
                    <CardBody className="text-center">
                      <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
                      {qrCode && (
                        <div className="flex justify-center mb-4">
                          <Image
                            src={qrCode}
                            alt="UPI QR Code"
                            width={200}
                            height={200}
                            className="border rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-sm text-gray-600">
                        Scan this QR code with any UPI app to pay ₹{amount.toFixed(2)}
                      </p>
                    </CardBody>
                  </Card>

                  {/* UPI Apps */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pay with UPI Apps</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {upiApps.map((app) => (
                        <Card
                          key={app.id}
                          isPressable
                          onPress={() => handleUPIAppPayment(app)}
                          className={`relative ${!app.isInstalled ? 'opacity-50' : ''}`}
                        >
                          <CardBody className="text-center p-4">
                            <Icon
                              icon={app.icon}
                              className="text-3xl mx-auto mb-2"
                              style={{ color: app.color }}
                            />
                            <p className="text-sm font-medium">{app.name}</p>
                            {!app.isInstalled && (
                              <Chip size="sm" color="warning" variant="flat" className="mt-1">
                                Not Installed
                              </Chip>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Manual UPI ID */}
                  <Card>
                    <CardBody>
                      <h3 className="text-lg font-semibold mb-4">Pay with UPI ID</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter UPI ID (e.g., 9876543210@paytm)"
                          value={upiId}
                          onValueChange={setUpiId}
                          startContent={<Icon icon="lucide:at-sign" />}
                          className="flex-1"
                        />
                        <Button
                          color="primary"
                          onPress={handleManualUPIPayment}
                          isDisabled={!upiId}
                        >
                          Pay
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {paymentStatus === "processing" && (
                <div className="text-center space-y-4">
                  <Icon icon="lucide:loader-2" className="text-6xl text-primary animate-spin mx-auto" />
                  <h3 className="text-xl font-semibold">Processing Payment</h3>
                  <p className="text-gray-600">
                    {selectedUPIApp 
                      ? `Opening ${upiApps.find(app => app.id === selectedUPIApp)?.name}...`
                      : "Processing your UPI payment..."
                    }
                  </p>
                  <Progress isIndeterminate color="primary" className="w-full" />
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="text-center space-y-4">
                  <Icon icon="lucide:check-circle" className="text-6xl text-green-600 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-600">Payment Successful!</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">Amount: ₹{amount.toFixed(2)}</p>
                    <p className="text-gray-600">Transaction ID: {transactionId}</p>
                    <p className="text-gray-600">
                      Method: {selectedUPIApp 
                        ? upiApps.find(app => app.id === selectedUPIApp)?.name 
                        : "UPI"
                      }
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="text-center space-y-4">
                  <Icon icon="lucide:x-circle" className="text-6xl text-red-600 mx-auto" />
                  <h3 className="text-xl font-semibold text-red-600">Payment Failed</h3>
                  <p className="text-gray-600">
                    There was an issue processing your payment. Please try again.
                  </p>
                  <Button color="primary" onPress={resetPayment}>
                    Try Again
                  </Button>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              {paymentStatus === "idle" && (
                <Button variant="flat" onPress={handleClose}>
                  Cancel
                </Button>
              )}
              
              {paymentStatus === "processing" && (
                <Button variant="flat" onPress={resetPayment}>
                  Cancel Payment
                </Button>
              )}
              
              {(paymentStatus === "success" || paymentStatus === "failed") && (
                <Button color="primary" onPress={handleClose}>
                  Close
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
