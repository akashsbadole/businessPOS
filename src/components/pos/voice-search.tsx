import React from "react";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { NetworkStatus } from "../common/network-status";

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onProductFound?: (product: any, quantity?: number) => void;
  products?: any[];
  language?: string;
  isActive?: boolean;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onResult,
  onProductFound,
  products = [],
  language = "en-IN",
}) => {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [lastAction, setLastAction] = React.useState("");
  const [isSupported, setIsSupported] = React.useState(false);
  const [confidence, setConfidence] = React.useState(0);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript) {
          const searchText = finalTranscript.trim();
          onResult(searchText);

          // Process voice command for product search
          const result = processProductVoiceCommand(
            searchText,
            products,
            onProductFound
          );
          if (result) {
            setLastAction(result);
            // Clear the action message after 3 seconds
            setTimeout(() => setLastAction(""), 3000);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);

        // Handle specific errors
        switch (event.error) {
          case "network":
            setTranscript(
              "🌐 Network Error: Voice recognition needs internet. You can still search products manually by typing."
            );
            setLastAction("Try typing product names instead");
            // Auto-clear after 5 seconds
            setTimeout(() => {
              setTranscript("");
              setLastAction("");
            }, 5000);
            break;
          case "no-speech":
            setTranscript("No speech detected. Please try again.");
            break;
          case "audio-capture":
            setTranscript(
              "Microphone not accessible. Please check permissions."
            );
            break;
          case "not-allowed":
            setTranscript(
              "Microphone permission denied. Please allow microphone access in your browser settings."
            );
            break;
          case "service-not-allowed":
            setTranscript(
              "Speech recognition service not allowed. Please use HTTPS or localhost."
            );
            break;
          case "bad-grammar":
            setTranscript(
              "Speech recognition grammar error. Please try again."
            );
            break;
          case "language-not-supported":
            setTranscript(
              "Selected language not supported. Please try English or Hindi."
            );
            break;
          default:
            setTranscript(
              `Speech recognition error: ${event.error}. Please try again.`
            );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onResult]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        // Check if we're on HTTPS or localhost
        const isSecure =
          window.location.protocol === "https:" ||
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        if (!isSecure) {
          console.error("Voice recognition requires HTTPS or localhost");
          return;
        }

        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        // Provide user-friendly error message
        if (error.message && error.message.includes("network")) {
          console.error(
            "Network error: Please check your internet connection and try again"
          );
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md">
        <CardBody className="text-center">
          <Icon
            icon="lucide:mic-off"
            className="text-4xl text-gray-400 mx-auto mb-2"
          />
          <p className="text-sm text-gray-600">
            Voice search is not supported in this browser.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Try using Chrome, Edge, or Safari for voice features.
          </p>
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">
              💡 Voice Search Requirements:
            </p>
            <ul className="text-xs text-blue-600 mt-1 text-left space-y-1">
              <li>• HTTPS connection or localhost</li>
              <li>• Microphone permissions</li>
              <li>• Active internet connection</li>
              <li>• Modern browser (Chrome/Edge/Safari)</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Network Status */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Voice Search</span>
        <NetworkStatus showLabel={true} />
      </div>

      {/* Voice Control Button */}
      <Button
        color={isListening ? "danger" : "primary"}
        variant={isListening ? "solid" : "flat"}
        onPress={toggleListening}
        startContent={
          <Icon
            icon={isListening ? "lucide:mic" : "lucide:mic-off"}
            className={isListening ? "animate-pulse" : ""}
          />
        }
        className="w-full"
      >
        {isListening ? "Stop Listening" : "Start Voice Search"}
      </Button>

      {/* Voice Status */}
      {isListening && (
        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon icon="lucide:mic" className="text-red-500 animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1 bg-red-500 rounded-full animate-pulse`}
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Transcript Display */}
      {transcript && (
        <Card>
          <CardBody>
            <div className="flex items-start gap-2">
              <Icon
                icon="lucide:message-circle"
                className="text-blue-500 mt-1"
              />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Voice Input:</p>
                <p className="text-sm text-gray-700">{transcript}</p>
                {confidence > 0 && (
                  <div className="mt-2">
                    <Chip
                      size="sm"
                      color={
                        confidence > 0.8
                          ? "success"
                          : confidence > 0.6
                          ? "warning"
                          : "danger"
                      }
                      variant="flat"
                    >
                      Confidence: {Math.round(confidence * 100)}%
                    </Chip>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Action Feedback */}
      {lastAction && (
        <Card className="mt-3">
          <CardBody className="py-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:check-circle" className="text-green-500" />
              <p className="text-sm text-green-700">{lastAction}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Voice Commands Help */}
      <Card>
        <CardBody>
          <h4 className="text-sm font-semibold mb-2">
            Voice Commands (English/Hindi):
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>
              • <strong>Product Search & Add:</strong>
            </p>
            <p className="ml-4">- "Rice" / "Chawal" - Add 1 rice to cart</p>
            <p className="ml-4">- "2 milk chahiye" - Add 2 milk to cart</p>
            <p className="ml-4">- "Add 3 bread" - Add 3 bread to cart</p>
            <p>
              • <strong>Other Commands:</strong>
            </p>
            <p className="ml-4">- "Show total" - Display bill total</p>
            <p className="ml-4">- "Print receipt" - Print invoice</p>
            <p className="ml-4">- "New bill" - Start new transaction</p>
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <p className="text-blue-700 text-xs font-medium">
                🎯 Voice Search for Products:
              </p>
              <p className="text-blue-600 text-xs">
                Just say the product name in English or Hindi, and it will be
                automatically added to your cart!
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Supported: chawal, doodh, cheeni, tel, chai, etc.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Product-specific voice command processor for POS
export const processProductVoiceCommand = (
  text: string,
  products: any[],
  onProductFound?: (product: any, quantity?: number) => void
) => {
  if (!products || products.length === 0 || !onProductFound) return;

  const lowerText = text.toLowerCase().trim();

  // Common product name corrections (Hindi to English)
  const productCorrections: Record<string, string> = {
    chawal: "rice",
    doodh: "milk",
    cheeni: "sugar",
    tel: "oil",
    "double roti": "bread",
    chai: "tea",
    namak: "salt",
    atta: "flour",
    dal: "lentils",
    pyaz: "onion",
    aloo: "potato",
    sabun: "soap",
    shampoo: "shampoo",
    biscuit: "biscuit",
    coffee: "coffee",
    paani: "water",
    juice: "juice",
  };

  // Extract quantity and product name patterns
  const quantityPatterns = [
    /(\d+)\s+(.+?)(?:\s+(?:please|chahiye|daal do|add karo|lao))?$/,
    /(.+?)\s+(\d+)\s*(?:piece|pieces|kg|gram|liter|bottle)?$/,
    /add\s+(\d+)\s+(.+)/,
    /(.+?)\s+(\d+)\s+chahiye/,
    /(\d+)\s+(.+?)\s+chahiye/,
  ];

  // Try to extract quantity and product name
  for (const pattern of quantityPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      let quantity = 1;
      let productName = "";

      // Check if first group is number or product name
      if (!isNaN(parseInt(match[1]))) {
        quantity = parseInt(match[1]);
        productName = match[2];
      } else {
        productName = match[1];
        quantity = parseInt(match[2]) || 1;
      }

      // Clean product name
      productName = productName
        .replace(
          /\b(please|now|to cart|chahiye|daal do|add karo|lao|dikhao|search|find)\b/g,
          ""
        )
        .trim();

      // Convert Hindi product names
      for (const [hindi, english] of Object.entries(productCorrections)) {
        if (productName.includes(hindi)) {
          productName = productName.replace(hindi, english);
        }
      }

      // Search for product
      const foundProduct = findProduct(productName, products);
      if (foundProduct) {
        onProductFound(foundProduct, quantity);
        return `Adding ${quantity} ${foundProduct.name} to cart`;
      }
    }
  }

  // Simple product search without quantity
  let searchTerm = lowerText
    .replace(/\b(search|find|show|dikhao|lao|chahiye|add)\b/g, "")
    .trim();

  // Convert Hindi product names
  for (const [hindi, english] of Object.entries(productCorrections)) {
    if (searchTerm.includes(hindi)) {
      searchTerm = searchTerm.replace(hindi, english);
    }
  }

  // Search for product
  const foundProduct = findProduct(searchTerm, products);
  if (foundProduct) {
    onProductFound(foundProduct, 1);
    return `Adding ${foundProduct.name} to cart`;
  }

  return `Product "${searchTerm}" not found`;
};

// Helper function to find product by name
const findProduct = (searchTerm: string, products: any[]) => {
  if (!searchTerm || !products) return null;

  // Exact match first
  let found = products.find(
    (p) => p.name.toLowerCase() === searchTerm.toLowerCase()
  );

  if (found) return found;

  // Partial match
  found = products.find(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      searchTerm.toLowerCase().includes(p.name.toLowerCase())
  );

  if (found) return found;

  // Fuzzy match for common variations
  found = products.find((p) => {
    const productWords = p.name.toLowerCase().split(" ");
    const searchWords = searchTerm.toLowerCase().split(" ");

    return searchWords.some((searchWord) =>
      productWords.some(
        (productWord) =>
          productWord.includes(searchWord) || searchWord.includes(productWord)
      )
    );
  });

  return found;
};

// Voice command processor with enhanced Hindi support
export const processVoiceCommand = (
  text: string,
  actions: {
    searchProduct: (query: string) => void;
    addCustomer: (name: string) => void;
    showTotal: () => void;
    printReceipt: () => void;
    newBill: () => void;
    addToCart: (productName: string, quantity?: number) => void;
  }
) => {
  const lowerText = text.toLowerCase().trim();

  // Enhanced search commands with Hindi support
  if (
    lowerText.startsWith("search for") ||
    lowerText.startsWith("find") ||
    lowerText.includes("dikhao") ||
    lowerText.includes("lao")
  ) {
    const query = lowerText
      .replace(/^(search for|find)\s+/, "")
      .replace(/\b(dikhao|lao)\b/g, "")
      .trim();
    actions.searchProduct(query);
    return `Searching for "${query}"`;
  }

  // Common product name corrections (Hindi to English)
  const productCorrections: Record<string, string> = {
    chawal: "rice",
    doodh: "milk",
    cheeni: "sugar",
    tel: "oil",
    "double roti": "bread",
    chai: "tea",
    namak: "salt",
    atta: "flour",
    dal: "lentils",
    pyaz: "onion",
    aloo: "potato",
  };

  // Check for Hindi product names and convert
  for (const [hindi, english] of Object.entries(productCorrections)) {
    if (lowerText.includes(hindi)) {
      actions.searchProduct(english);
      return `Searching for "${english}" (${hindi})`;
    }
  }

  // Add customer commands with Hindi support
  if (lowerText.startsWith("add customer") || lowerText.includes("grahak")) {
    const name = lowerText
      .replace(/^add customer\s+/, "")
      .replace(/\bgrahak\b/g, "")
      .trim();
    actions.addCustomer(name);
    return `Adding customer "${name}"`;
  }

  // Enhanced quantity and product patterns
  const quantityPatterns = [
    /(\d+)\s+(.+?)\s+(chahiye|daal do|add karo)/,
    /(\d+)\s+(.+?)\s+to cart/,
    /add\s+(\d+)\s+(.+)/,
    /(\d+)\s+(.+)/,
  ];

  for (const pattern of quantityPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const quantity = parseInt(match[1]);
      let productName = match[2]
        .replace(/\b(please|now|to cart|chahiye|daal do|add karo)\b/g, "")
        .trim();

      // Convert Hindi product names
      for (const [hindi, english] of Object.entries(productCorrections)) {
        if (productName.includes(hindi)) {
          productName = productName.replace(hindi, english);
        }
      }

      if (productName && quantity > 0) {
        actions.addToCart(productName, quantity);
        return `Adding ${quantity} ${productName} to cart`;
      }
    }
  }

  // Add to cart commands
  if (
    lowerText.includes("add") &&
    (lowerText.includes("to cart") || lowerText.includes("cart"))
  ) {
    const productMatch = lowerText.match(/add\s+(.+?)\s+to cart/);
    const quantityMatch = lowerText.match(/(\d+)\s+(.+)/);

    if (productMatch) {
      actions.addToCart(productMatch[1]);
      return `Adding "${productMatch[1]}" to cart`;
    } else if (quantityMatch) {
      actions.addToCart(quantityMatch[2], parseInt(quantityMatch[1]));
      return `Adding ${quantityMatch[1]} "${quantityMatch[2]}" to cart`;
    }
  }

  // Utility commands
  if (lowerText.includes("total") || lowerText.includes("bill amount")) {
    actions.showTotal();
    return "Showing bill total";
  }

  if (lowerText.includes("print") || lowerText.includes("receipt")) {
    actions.printReceipt();
    return "Printing receipt";
  }

  if (lowerText.includes("new bill") || lowerText.includes("clear cart")) {
    actions.newBill();
    return "Starting new bill";
  }

  // Default: treat as product search
  actions.searchProduct(text);
  return `Searching for "${text}"`;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult:
      | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
      | null;
    onerror:
      | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
      | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}
