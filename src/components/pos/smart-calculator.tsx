import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface SmartCalculatorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onResult?: (result: number) => void;
  title?: string;
  initialValue?: number;
}

export const SmartCalculator: React.FC<SmartCalculatorProps> = ({
  isOpen,
  onOpenChange,
  onResult,
  title = "Calculator",
  initialValue = 0,
}) => {
  const [display, setDisplay] = React.useState(initialValue.toString());
  const [expression, setExpression] = React.useState("");
  const [lastResult, setLastResult] = React.useState<number | null>(null);

  // Calculator buttons layout
  const buttons = [
    ["C", "CE", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  // Quick calculation presets for Indian business
  const quickCalcs = [
    { label: "GST 18%", calc: (val: number) => val * 0.18 },
    { label: "GST 12%", calc: (val: number) => val * 0.12 },
    { label: "GST 5%", calc: (val: number) => val * 0.05 },
    { label: "Discount 10%", calc: (val: number) => val * 0.9 },
    { label: "Discount 20%", calc: (val: number) => val * 0.8 },
    { label: "Round Off", calc: (val: number) => Math.round(val) },
  ];

  const handleButtonPress = (button: string) => {
    try {
      switch (button) {
        case "C":
          setDisplay("0");
          setExpression("");
          break;
        case "CE":
          setDisplay("0");
          break;
        case "=":
          calculateResult();
          break;
        case "%":
          if (display !== "0") {
            const value = parseFloat(display) / 100;
            setDisplay(value.toString());
          }
          break;
        case "÷":
          appendToExpression("/");
          break;
        case "×":
          appendToExpression("*");
          break;
        case "+":
        case "-":
          appendToExpression(button);
          break;
        case ".":
          if (!display.includes(".")) {
            setDisplay(display + ".");
          }
          break;
        default:
          if (!isNaN(Number(button)) || button === "00") {
            if (display === "0") {
              setDisplay(button);
            } else {
              setDisplay(display + button);
            }
          }
          break;
      }
    } catch (error) {
      console.error("Calculator error:", error);
      setDisplay("Error");
    }
  };

  const appendToExpression = (operator: string) => {
    if (display !== "0") {
      setExpression(display + " " + operator + " ");
      setDisplay("0");
    }
  };

  const calculateResult = () => {
    try {
      const fullExpression = expression + display;
      // Safe evaluation using Function constructor (safer than eval)
      const result = Function(`"use strict"; return (${fullExpression.replace(/×/g, "*").replace(/÷/g, "/")})`)();
      
      if (isFinite(result)) {
        setDisplay(result.toString());
        setLastResult(result);
        setExpression("");
      } else {
        setDisplay("Error");
      }
    } catch (error) {
      console.error("Calculation error:", error);
      setDisplay("Error");
      setExpression("");
    }
  };

  const handleQuickCalc = (calc: (val: number) => number) => {
    try {
      const currentValue = parseFloat(display) || 0;
      const result = calc(currentValue);
      setDisplay(result.toFixed(2));
      setLastResult(result);
    } catch (error) {
      console.error("Quick calc error:", error);
      setDisplay("Error");
    }
  };

  const handleUseResult = () => {
    const result = parseFloat(display);
    if (isFinite(result) && onResult) {
      onResult(result);
      onOpenChange(false);
    }
  };

  // Smart input parsing (allows expressions like "100-10", "50*3")
  const handleSmartInput = (value: string) => {
    try {
      // Check if it's a simple expression
      if (/^[\d+\-*/.\s()]+$/.test(value)) {
        const result = Function(`"use strict"; return (${value})`)();
        if (isFinite(result)) {
          setDisplay(result.toString());
          return;
        }
      }
      setDisplay(value);
    } catch (error) {
      setDisplay(value);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:calculator" />
              <span>{title}</span>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Display */}
                <div className="space-y-2">
                  <Input
                    label="Smart Input (try: 100-10, 50*3)"
                    placeholder="Enter expression or number"
                    value={display}
                    onValueChange={handleSmartInput}
                    endContent={
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setDisplay("0")}
                      >
                        <Icon icon="lucide:x" />
                      </Button>
                    }
                  />
                  {expression && (
                    <div className="text-sm text-gray-500 px-2">
                      Expression: {expression}
                    </div>
                  )}
                  <div className="text-right text-2xl font-mono font-bold p-4 bg-gray-100 rounded">
                    {display}
                  </div>
                </div>

                {/* Quick Calculations */}
                <Card>
                  <CardBody>
                    <h4 className="text-sm font-semibold mb-2">Quick Calculations</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {quickCalcs.map((quick, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="flat"
                          onPress={() => handleQuickCalc(quick.calc)}
                          className="text-xs"
                        >
                          {quick.label}
                        </Button>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                <Divider />

                {/* Calculator Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {buttons.flat().map((button, index) => (
                    <Button
                      key={index}
                      variant={
                        ["C", "CE", "%", "÷", "×", "-", "+", "="].includes(button)
                          ? "solid"
                          : "flat"
                      }
                      color={
                        button === "="
                          ? "primary"
                          : ["C", "CE"].includes(button)
                          ? "danger"
                          : ["÷", "×", "-", "+", "%"].includes(button)
                          ? "secondary"
                          : "default"
                      }
                      onPress={() => handleButtonPress(button)}
                      className="h-12 text-lg font-semibold"
                    >
                      {button}
                    </Button>
                  ))}
                </div>

                {lastResult !== null && (
                  <div className="text-center text-sm text-gray-600">
                    Last Result: {lastResult.toFixed(2)}
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
                onPress={handleUseResult}
                startContent={<Icon icon="lucide:check" />}
              >
                Use Result
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
