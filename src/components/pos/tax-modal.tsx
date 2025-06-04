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
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface TaxModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentTaxRate: number;
  billAmount: number;
  onTaxChange: (taxRate: number) => void;
}

export const TaxModal: React.FC<TaxModalProps> = ({
  isOpen,
  onOpenChange,
  currentTaxRate,
  billAmount,
  onTaxChange,
}) => {
  const [taxRate, setTaxRate] = React.useState(currentTaxRate.toString());
  const [selectedGSTType, setSelectedGSTType] = React.useState("cgst_sgst");

  React.useEffect(() => {
    if (isOpen) {
      setTaxRate(currentTaxRate.toString());
    }
  }, [isOpen, currentTaxRate]);

  const handleSubmit = () => {
    const rate = parseFloat(taxRate) || 0;
    if (rate >= 0) {
      onTaxChange(rate);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const calculateTaxAmount = () => {
    const rate = parseFloat(taxRate) || 0;
    return (billAmount * rate) / 100;
  };

  const calculateTotalAmount = () => {
    return billAmount + calculateTaxAmount();
  };

  const gstRates = [
    { value: "0", label: "0% - Exempt", description: "Exempt items" },
    { value: "5", label: "5% GST", description: "Essential items" },
    { value: "12", label: "12% GST", description: "Standard items" },
    { value: "18", label: "18% GST", description: "Most goods & services" },
    { value: "28", label: "28% GST", description: "Luxury items" },
  ];

  const splitGST = (rate: number) => {
    if (selectedGSTType === "igst") {
      return { cgst: 0, sgst: 0, igst: rate };
    } else {
      return { cgst: rate / 2, sgst: rate / 2, igst: 0 };
    }
  };

  const gstBreakdown = splitGST(parseFloat(taxRate) || 0);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:receipt" />
              <span>Bill Tax (GST)</span>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Bill Amount: ₹{billAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mb-2">Current Tax Rate: {currentTaxRate}%</p>
                </div>

                {/* GST Type Selection */}
                <Select
                  label="GST Type"
                  selectedKeys={[selectedGSTType]}
                  onSelectionChange={(keys) => setSelectedGSTType(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="cgst_sgst">CGST + SGST (Intrastate)</SelectItem>
                  <SelectItem key="igst">IGST (Interstate)</SelectItem>
                </Select>

                {/* Tax Rate Input */}
                <Input
                  type="number"
                  label="Tax Rate"
                  value={taxRate}
                  onValueChange={setTaxRate}
                  onKeyDown={handleKeyDown}
                  endContent="%"
                  min="0"
                  max="100"
                  step="0.1"
                  autoFocus
                />

                {/* Quick GST Rates */}
                <div>
                  <p className="text-sm font-medium mb-2">Quick GST Rates:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {gstRates.map((rate) => (
                      <Button
                        key={rate.value}
                        variant="flat"
                        className="justify-between h-auto p-3"
                        onPress={() => setTaxRate(rate.value)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{rate.label}</div>
                          <div className="text-xs text-gray-500">{rate.description}</div>
                        </div>
                        <Chip size="sm" variant="flat">
                          {rate.value}%
                        </Chip>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tax Breakdown */}
                <Card>
                  <CardBody>
                    <h4 className="font-semibold mb-2">Tax Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Taxable Amount:</span>
                        <span>₹{billAmount.toFixed(2)}</span>
                      </div>
                      
                      {selectedGSTType === "cgst_sgst" ? (
                        <>
                          <div className="flex justify-between">
                            <span>CGST ({gstBreakdown.cgst}%):</span>
                            <span>₹{((billAmount * gstBreakdown.cgst) / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST ({gstBreakdown.sgst}%):</span>
                            <span>₹{((billAmount * gstBreakdown.sgst) / 100).toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span>IGST ({gstBreakdown.igst}%):</span>
                          <span>₹{((billAmount * gstBreakdown.igst) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-bold text-green-600">
                        <span>Total Tax:</span>
                        <span>₹{calculateTaxAmount().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Grand Total:</span>
                        <span>₹{calculateTotalAmount().toFixed(2)}</span>
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
                isDisabled={!taxRate || parseFloat(taxRate) < 0}
              >
                Apply Tax
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
