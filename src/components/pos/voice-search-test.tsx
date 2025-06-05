import React from "react";
import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface VoiceSearchTestProps {
  onProductFound?: (product: any, quantity?: number) => void;
  products?: any[];
}

export const VoiceSearchTest: React.FC<VoiceSearchTestProps> = ({
  onProductFound,
  products = [],
}) => {
  const [testResults, setTestResults] = React.useState<string[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const testCommands = [
    { command: "add milk", expected: "milk", quantity: 1 },
    { command: "add 2 biscuits", expected: "biscuit", quantity: 2 },
    { command: "add rice", expected: "rice", quantity: 1 },
    { command: "add 3 bread", expected: "bread", quantity: 3 },
    { command: "chawal", expected: "rice", quantity: 1 },
    { command: "doodh", expected: "milk", quantity: 1 },
    { command: "2 milk", expected: "milk", quantity: 2 },
    { command: "biscuit", expected: "biscuit", quantity: 1 },
  ];

  const processTestCommand = (command: string) => {
    console.log("🧪 Testing command:", command);
    
    const lowerText = command.toLowerCase().trim();
    
    // Product name corrections (Hindi to English)
    const productCorrections: Record<string, string> = {
      chawal: "rice",
      doodh: "milk",
      cheeni: "sugar",
      tel: "oil",
      chai: "tea",
      namak: "salt",
      biscuit: "biscuit",
      biscuits: "biscuit",
    };

    // Extract quantity and product
    let quantity = 1;
    let productName = lowerText;

    // Check for "add" commands
    const addMatch = lowerText.match(/^add\s+(?:(\d+)\s+)?(.+)$/);
    if (addMatch) {
      quantity = addMatch[1] ? parseInt(addMatch[1]) : 1;
      productName = addMatch[2];
    } else {
      // Check for quantity at start
      const quantityMatch = lowerText.match(/^(\d+)\s+(.+)$/);
      if (quantityMatch) {
        quantity = parseInt(quantityMatch[1]);
        productName = quantityMatch[2];
      }
    }

    // Clean product name
    productName = productName
      .replace(/\b(please|now|to cart|chahiye|add|karo|lao)\b/g, "")
      .trim();

    // Convert Hindi to English
    for (const [hindi, english] of Object.entries(productCorrections)) {
      if (productName.includes(hindi)) {
        productName = productName.replace(hindi, english);
        break;
      }
    }

    // Find product
    const foundProduct = products.find(p => 
      p.name.toLowerCase().includes(productName) ||
      productName.includes(p.name.toLowerCase())
    );

    if (foundProduct && onProductFound) {
      onProductFound(foundProduct, quantity);
      return `✅ SUCCESS: "${command}" → Added ${quantity} ${foundProduct.name}`;
    } else {
      return `❌ FAILED: "${command}" → Product "${productName}" not found`;
    }
  };

  const runSingleTest = (testCase: typeof testCommands[0]) => {
    const result = processTestCommand(testCase.command);
    setTestResults(prev => [...prev, result]);
    return result.includes("SUCCESS");
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    let passed = 0;
    let failed = 0;

    for (const testCase of testCommands) {
      const success = runSingleTest(testCase);
      if (success) passed++;
      else failed++;
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTestResults(prev => [
      ...prev,
      "",
      `📊 TEST SUMMARY: ${passed} passed, ${failed} failed out of ${testCommands.length} tests`
    ]);
    
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full">
      <CardBody>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">🧪 Voice Search Test Suite</h3>
            <Chip
              size="sm"
              color={products.length > 0 ? "success" : "warning"}
              variant="flat"
            >
              {products.length} Products Available
            </Chip>
          </div>

          {/* Test Controls */}
          <div className="flex gap-2">
            <Button
              color="primary"
              onPress={runAllTests}
              isLoading={isRunning}
              startContent={<Icon icon="lucide:play" />}
              className="flex-1"
            >
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
            
            <Button
              color="secondary"
              variant="flat"
              onPress={clearResults}
              startContent={<Icon icon="lucide:trash-2" />}
              isDisabled={isRunning || testResults.length === 0}
            >
              Clear
            </Button>
          </div>

          {/* Individual Test Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {testCommands.map((testCase, index) => (
              <Button
                key={index}
                size="sm"
                variant="flat"
                onPress={() => runSingleTest(testCase)}
                isDisabled={isRunning}
                className="text-left justify-start"
              >
                "{testCase.command}"
              </Button>
            ))}
          </div>

          <Divider />

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Test Results:</h4>
              <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`text-sm font-mono ${
                      result.includes("SUCCESS")
                        ? "text-green-600"
                        : result.includes("FAILED")
                        ? "text-red-600"
                        : result.includes("SUMMARY")
                        ? "text-blue-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {result || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help */}
          <Card>
            <CardBody className="py-3">
              <h4 className="text-sm font-semibold mb-2">Test Commands:</h4>
              <div className="text-xs space-y-1 text-gray-600">
                <p>• "add milk" → Should add 1 milk to cart</p>
                <p>• "add 2 biscuits" → Should add 2 biscuits to cart</p>
                <p>• "chawal" → Should add 1 rice to cart (Hindi)</p>
                <p>• "2 milk" → Should add 2 milk to cart</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};
