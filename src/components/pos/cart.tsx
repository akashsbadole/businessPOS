import React from "react";
import { Card, CardBody, CardFooter, Button, Input, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CartItem } from "../../types/pos";
import { ReceiptPreview } from "./receipt-preview";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: (paymentMethod: string) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onCheckout
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPayment, setSelectedPayment] = React.useState("cash");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [showReceiptPreview, setShowReceiptPreview] = React.useState(false);
  const [invoiceNumber, setInvoiceNumber] = React.useState("");
  
  // Calculate subtotal, GST, and total
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;
  const discountAmount = (discount / 100) * subtotal;
  const total = subtotal + gstAmount - discountAmount;

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      onUpdateQuantity(id, quantity);
    }
  };

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const prefix = "INV";
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}-${date}-${random}`;
  };

  // Modify handleCheckout function
  const handleCheckout = () => {
    const newInvoiceNumber = generateInvoiceNumber();
    setInvoiceNumber(newInvoiceNumber);
    
    // Show receipt preview first
    setShowReceiptPreview(true);
    
    // The actual checkout will happen when the receipt is closed or printed
    // onCheckout(selectedPayment);
    // onClearCart();
  };

  const handleFinalCheckout = () => {
    onCheckout(selectedPayment);
    setShowReceiptPreview(false);
    // Don't clear cart here, it will be cleared by the parent component
  };

  const paymentMethods = [
    { key: "cash", label: "Cash", icon: "lucide:banknote" },
    { key: "upi", label: "UPI", icon: "logos:upi" },
    { key: "card", label: "Card", icon: "lucide:credit-card" },
    { key: "wallet", label: "Wallet", icon: "lucide:wallet" }
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardBody className="p-0 overflow-auto flex-grow">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Current Sale</h2>
          {items.length > 0 && (
            <Button 
              size="sm" 
              variant="light" 
              color="danger" 
              startContent={<Icon icon="lucide:trash-2" />}
              onPress={onClearCart}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="px-4 pb-2">
          <Input
            placeholder="Customer Phone (Optional)"
            startContent={<Icon icon="lucide:phone" />}
            value={customerPhone}
            onValueChange={setCustomerPhone}
            size="sm"
          />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-64">
            <Icon icon="lucide:shopping-cart" className="text-default-300 text-5xl mb-4" />
            <p className="text-default-500">No items in cart</p>
            <p className="text-tiny text-default-400 mt-1">Add products from the catalog</p>
          </div>
        ) : (
          <div className="px-2">
            {items.map((item) => (
              <div key={item.id} className="p-2 flex gap-3 group hover:bg-content2 rounded-md transition-colors">
                <div className="w-12 h-12 rounded-md bg-content2 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon icon="lucide:package" className="text-2xl text-default-400" />
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-default-900 truncate">{item.name}</p>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onPress={() => onRemoveItem(item.id)}
                    >
                      <Icon icon="lucide:x" size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-default-700">₹{item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        radius="full"
                        onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Icon icon="lucide:minus" size={14} />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        radius="full"
                        onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Icon icon="lucide:plus" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>

      <Divider />

      <CardFooter className="flex flex-col gap-4 pt-4">
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-default-600">Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <div className="flex items-center gap-1">
              <span className="text-default-600">GST (18%)</span>
              <Chip size="sm" variant="flat" color="primary">CGST 9% + SGST 9%</Chip>
            </div>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <div className="flex gap-2 items-center">
              <span className="text-default-600">Discount</span>
              <Input
                type="number"
                size="sm"
                placeholder="0%"
                value={discount.toString()}
                onValueChange={(value) => setDiscount(Number(value) || 0)}
                endContent="%"
                className="w-20"
              />
            </div>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
          
          <Divider className="my-2" />
          
          <div className="flex justify-between font-medium text-large">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <Button 
            color="primary" 
            className="flex-1"
            size="lg"
            onPress={onOpen}
            isDisabled={items.length === 0}
          >
            Checkout
          </Button>
        </div>
      </CardFooter>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Complete Payment</ModalHeader>
              <ModalBody>
                <p className="text-default-700 mb-2">Select payment method:</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method.key}
                      variant={selectedPayment === method.key ? "solid" : "bordered"}
                      color={selectedPayment === method.key ? "primary" : "default"}
                      className="h-16"
                      startContent={<Icon icon={method.icon} className="text-xl" />}
                      onPress={() => setSelectedPayment(method.key)}
                    >
                      {method.label}
                    </Button>
                  ))}
                </div>

                <div className="bg-content2 p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-default-600">Items</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-default-600">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-default-600">GST (18%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-default-600">Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedPayment === "cash" && (
                  <div className="mt-4">
                    <Input
                      label="Amount Received"
                      placeholder="Enter amount"
                      startContent="₹"
                      type="number"
                      defaultValue={total.toFixed(2)}
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      Change to return: ₹0.00
                    </p>
                  </div>
                )}

                {selectedPayment === "upi" && (
                  <div className="mt-4 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg mb-2">
                      <img 
                        src="https://img.heroui.chat/image/ai?w=150&h=150&u=qrcode" 
                        alt="UPI QR Code" 
                        className="w-32 h-32"
                      />
                    </div>
                    <p className="text-tiny text-default-500">
                      Scan with any UPI app to pay
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleCheckout}>
                  Complete Payment
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ReceiptPreview
        isOpen={showReceiptPreview}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleFinalCheckout();
          }
          setShowReceiptPreview(isOpen);
        }}
        items={items}
        subtotal={subtotal}
        gstAmount={gstAmount}
        discount={discountAmount}
        total={total}
        paymentMethod={selectedPayment}
        invoiceNumber={invoiceNumber}
      />
    </Card>
  );
};