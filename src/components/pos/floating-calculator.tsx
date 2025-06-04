import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FloatingCalculatorProps {
  isVisible: boolean;
  onToggle: () => void;
  onResult?: (result: number) => void;
  position?: { x: number; y: number };
}

export const FloatingCalculator: React.FC<FloatingCalculatorProps> = ({
  isVisible,
  onToggle,
  onResult,
  position = { x: 20, y: 20 },
}) => {
  const [display, setDisplay] = React.useState("0");
  const [expression, setExpression] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = React.useState(position);

  const buttons = [
    ["C", "CE", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "=", "↵"],
  ];

  const quickCalcs = [
    { label: "GST+", calc: (val: number) => val * 1.18, color: "bg-blue-500" },
    { label: "GST-", calc: (val: number) => val / 1.18, color: "bg-blue-500" },
    { label: "10%", calc: (val: number) => val * 0.1, color: "bg-green-500" },
    { label: "20%", calc: (val: number) => val * 0.2, color: "bg-green-500" },
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
        case "↵":
          if (onResult) {
            onResult(parseFloat(display) || 0);
            onToggle();
          }
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
          if (!isNaN(Number(button))) {
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
      const result = Function(`"use strict"; return (${fullExpression.replace(/×/g, "*").replace(/÷/g, "/")})`)();
      
      if (isFinite(result)) {
        setDisplay(result.toString());
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
    } catch (error) {
      console.error("Quick calc error:", error);
      setDisplay("Error");
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setCurrentPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 select-none"
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <Card className="w-64 shadow-2xl border-2 border-primary/20">
        <CardBody className="p-2">
          {/* Header */}
          <div
            className="flex items-center justify-between p-2 bg-primary/10 rounded-md mb-2 cursor-grab"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <Icon icon="lucide:calculator" className="text-primary" />
              <span className="text-sm font-semibold">Calculator</span>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onToggle}
              className="min-w-6 h-6"
            >
              <Icon icon="lucide:x" className="text-xs" />
            </Button>
          </div>

          {/* Display */}
          <div className="mb-2">
            {expression && (
              <div className="text-xs text-gray-500 px-2 h-4">
                {expression}
              </div>
            )}
            <div className="text-right text-lg font-mono font-bold p-2 bg-gray-100 rounded border min-h-10 flex items-center justify-end">
              {display}
            </div>
          </div>

          {/* Quick Calculations */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            {quickCalcs.map((quick, index) => (
              <Button
                key={index}
                size="sm"
                variant="flat"
                onPress={() => handleQuickCalc(quick.calc)}
                className={`text-xs h-6 ${quick.color} text-white`}
              >
                {quick.label}
              </Button>
            ))}
          </div>

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {buttons.flat().map((button, index) => (
              <Button
                key={index}
                size="sm"
                variant={
                  ["C", "CE", "%", "÷", "×", "-", "+", "=", "↵"].includes(button)
                    ? "solid"
                    : "flat"
                }
                color={
                  button === "=" || button === "↵"
                    ? "primary"
                    : ["C", "CE"].includes(button)
                    ? "danger"
                    : ["÷", "×", "-", "+", "%"].includes(button)
                    ? "secondary"
                    : "default"
                }
                onPress={() => handleButtonPress(button)}
                className="h-8 text-sm font-semibold min-w-0"
              >
                {button}
              </Button>
            ))}
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 mt-2 text-center">
            Drag to move • ↵ to use result
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
