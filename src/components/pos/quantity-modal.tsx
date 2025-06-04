import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface QuantityModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentQuantity: number;
  productName: string;
  onQuantityChange: (newQuantity: number) => void;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({
  isOpen,
  onOpenChange,
  currentQuantity,
  productName,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = React.useState(currentQuantity.toString());

  React.useEffect(() => {
    if (isOpen) {
      setQuantity(currentQuantity.toString());
    }
  }, [isOpen, currentQuantity]);

  const handleSubmit = () => {
    const newQuantity = parseFloat(quantity);
    if (newQuantity > 0) {
      onQuantityChange(newQuantity);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const incrementQuantity = () => {
    const newQuantity = parseFloat(quantity) + 1;
    setQuantity(newQuantity.toString());
  };

  const decrementQuantity = () => {
    const newQuantity = Math.max(1, parseFloat(quantity) - 1);
    setQuantity(newQuantity.toString());
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:hash" />
              <span>Change Quantity</span>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Product:</p>
                  <p className="font-medium">{productName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Quantity: {currentQuantity}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      variant="flat"
                      onPress={decrementQuantity}
                      isDisabled={parseFloat(quantity) <= 1}
                    >
                      <Icon icon="lucide:minus" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onValueChange={setQuantity}
                      onKeyDown={handleKeyDown}
                      min="1"
                      step="0.1"
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      isIconOnly
                      variant="flat"
                      onPress={incrementQuantity}
                    >
                      <Icon icon="lucide:plus" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setQuantity("1")}
                  >
                    1
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setQuantity("2")}
                  >
                    2
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setQuantity("5")}
                  >
                    5
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setQuantity("10")}
                  >
                    10
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setQuantity("0.5")}
                  >
                    0.5
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setQuantity("0.25")}
                  >
                    0.25
                  </Button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={!quantity || parseFloat(quantity) <= 0}
              >
                Update Quantity
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
