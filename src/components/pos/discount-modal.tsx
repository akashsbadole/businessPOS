import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface DiscountModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentDiscount: number;
  productName?: string;
  productPrice: number;
  onDiscountChange: (discount: number, type: "percentage" | "fixed") => void;
  type: "item" | "bill";
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onOpenChange,
  currentDiscount,
  productName,
  productPrice,
  onDiscountChange,
  type,
}) => {
  const [discountValue, setDiscountValue] = React.useState("0");
  const [discountType, setDiscountType] = React.useState<"percentage" | "fixed">("percentage");

  React.useEffect(() => {
    if (isOpen) {
      setDiscountValue(currentDiscount.toString());
    }
  }, [isOpen, currentDiscount]);

  const handleSubmit = () => {
    const discount = parseFloat(discountValue) || 0;
    if (discount >= 0) {
      onDiscountChange(discount, discountType);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const calculateDiscountAmount = () => {
    const discount = parseFloat(discountValue) || 0;
    if (discountType === "percentage") {
      return (productPrice * discount) / 100;
    }
    return discount;
  };

  const calculateFinalPrice = () => {
    return productPrice - calculateDiscountAmount();
  };

  const quickDiscounts = [
    { label: "5%", value: 5, type: "percentage" as const },
    { label: "10%", value: 10, type: "percentage" as const },
    { label: "15%", value: 15, type: "percentage" as const },
    { label: "20%", value: 20, type: "percentage" as const },
    { label: "25%", value: 25, type: "percentage" as const },
    { label: "50%", value: 50, type: "percentage" as const },
  ];

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:percent" />
              <span>{type === "item" ? "Item Discount" : "Bill Discount"}</span>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {productName && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product:</p>
                    <p className="font-medium">{productName}</p>
                    <p className="text-sm text-gray-600">Price: ₹{productPrice.toFixed(2)}</p>
                  </div>
                )}

                <Tabs
                  selectedKey={discountType}
                  onSelectionChange={(key) => setDiscountType(key as "percentage" | "fixed")}
                >
                  <Tab key="percentage" title="Percentage (%)">
                    <div className="space-y-3">
                      <Input
                        type="number"
                        label="Discount Percentage"
                        value={discountValue}
                        onValueChange={setDiscountValue}
                        onKeyDown={handleKeyDown}
                        endContent="%"
                        min="0"
                        max="100"
                        autoFocus
                      />
                      
                      <div className="grid grid-cols-3 gap-2">
                        {quickDiscounts.map((discount) => (
                          <Button
                            key={discount.label}
                            size="sm"
                            variant="flat"
                            onPress={() => {
                              setDiscountValue(discount.value.toString());
                              setDiscountType(discount.type);
                            }}
                          >
                            {discount.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab key="fixed" title="Fixed Amount (₹)">
                    <div className="space-y-3">
                      <Input
                        type="number"
                        label="Discount Amount"
                        value={discountValue}
                        onValueChange={setDiscountValue}
                        onKeyDown={handleKeyDown}
                        startContent="₹"
                        min="0"
                        max={productPrice.toString()}
                        autoFocus
                      />
                      
                      <div className="grid grid-cols-3 gap-2">
                        {[10, 20, 50, 100, 200, 500].map((amount) => (
                          <Button
                            key={amount}
                            size="sm"
                            variant="flat"
                            onPress={() => setDiscountValue(amount.toString())}
                            isDisabled={amount > productPrice}
                          >
                            ₹{amount}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Tab>
                </Tabs>

                {/* Discount Preview */}
                <Card>
                  <CardBody>
                    <h4 className="font-semibold mb-2">Discount Preview</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span>₹{productPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Discount ({discountType === "percentage" ? `${discountValue}%` : `₹${discountValue}`}):</span>
                        <span>-₹{calculateDiscountAmount().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Final Price:</span>
                        <span>₹{calculateFinalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={!discountValue || parseFloat(discountValue) < 0}
              >
                Apply Discount
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
