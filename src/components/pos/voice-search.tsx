import React from "react";
import { Button, Card, CardBody, Chip, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// Initialize speech recognition on module load
if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
  console.log("🎤 Speech Recognition API available");
} else if (typeof window !== "undefined" && "SpeechRecognition" in window) {
  console.log("🎤 Speech Recognition API available");
} else {
  console.warn("🎤 Speech Recognition API not available");
}

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
  const [lastAction, setLastAction] = React.useState("");
  const [manualSearch, setManualSearch] = React.useState("");
  const [showManualSearch, setShowManualSearch] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Use react-speech-recognition for more reliable speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    clearTranscriptOnListen: true,
  });

  // Initialize speech recognition
  React.useEffect(() => {
    const initializeSpeechRecognition = async () => {
      console.log("🎤 Initializing speech recognition...");
      console.log("🎤 Browser support:", browserSupportsSpeechRecognition);
      console.log("🎤 Microphone available:", isMicrophoneAvailable);
      console.log("🎤 Language:", language);
      console.log("🎤 Products available:", products.length);

      if (browserSupportsSpeechRecognition) {
        setIsInitialized(true);
        setLastAction(
          "Voice search ready! Click the microphone button to start."
        );
        setTimeout(() => setLastAction(""), 3000);
      } else {
        setLastAction("Speech recognition not supported in this browser");
        setShowManualSearch(true);
      }
    };

    initializeSpeechRecognition();
  }, [
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    language,
    products.length,
  ]);

  // Process voice commands when transcript changes
  React.useEffect(() => {
    if (transcript && transcript.trim()) {
      console.log("🎤 Voice transcript received:", transcript);
      onResult(transcript);

      // Process voice command for product search
      const actionResult = processProductVoiceCommand(
        transcript,
        products,
        onProductFound
      );
      if (actionResult) {
        setLastAction(actionResult);
        // Clear the action message after 5 seconds
        setTimeout(() => setLastAction(""), 5000);
      }
    }
  }, [transcript, products, onResult, onProductFound]);

  const startListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      setLastAction("Speech recognition not supported in this browser");
      setShowManualSearch(true);
      return;
    }

    // Check for HTTPS or localhost
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isSecure) {
      setLastAction(
        "Voice search requires HTTPS connection. Please use HTTPS or localhost."
      );
      setShowManualSearch(true);
      return;
    }

    try {
      // Request microphone permission explicitly
      await navigator.mediaDevices.getUserMedia({ audio: true });

      resetTranscript();
      setLastAction(""); // Clear any previous error messages

      SpeechRecognition.startListening({
        continuous: false,
        language: language,
      });

      console.log("🎤 Started listening with language:", language);
    } catch (error) {
      console.error("🎤 Microphone access error:", error);
      setLastAction(
        "Microphone access denied. Please allow microphone permissions and try again."
      );
      setShowManualSearch(true);
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleManualSearch = (searchText: string) => {
    if (!searchText.trim()) return;

    // Process manual search the same way as voice search
    const result = processProductVoiceCommand(
      searchText.trim(),
      products,
      onProductFound
    );

    if (result) {
      setLastAction(result);
      setManualSearch(""); // Clear the input
      setTimeout(() => setLastAction(""), 3000);
    } else {
      setLastAction(`Product "${searchText}" not found`);
      setTimeout(() => setLastAction(""), 3000);
    }
  };

  if (!browserSupportsSpeechRecognition) {
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Product Search</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            onPress={() => setShowManualSearch(!showManualSearch)}
            startContent={<Icon icon="lucide:keyboard" />}
          >
            Type
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={() => {
              console.log("🎤 Debug Info:");
              console.log("Browser support:", browserSupportsSpeechRecognition);
              console.log("Microphone available:", isMicrophoneAvailable);
              console.log("Currently listening:", listening);
              console.log("Current transcript:", transcript);
              console.log("Products count:", products.length);
              setLastAction(
                `Debug: Support=${browserSupportsSpeechRecognition}, Mic=${isMicrophoneAvailable}, Listening=${listening}`
              );
            }}
            startContent={<Icon icon="lucide:bug" />}
          >
            Debug
          </Button>
          <Chip
            size="sm"
            color={navigator.onLine ? "success" : "danger"}
            variant="flat"
          >
            {navigator.onLine ? "Online" : "Offline"}
          </Chip>
        </div>
      </div>

      {/* Voice Control Button */}
      <Button
        color={listening ? "danger" : "primary"}
        variant={listening ? "solid" : "flat"}
        onPress={toggleListening}
        startContent={
          <Icon
            icon={listening ? "lucide:mic" : "lucide:mic-off"}
            className={listening ? "animate-pulse" : ""}
          />
        }
        className="w-full"
      >
        {listening ? "Stop Listening" : "Start Voice Search"}
      </Button>

      {/* Manual Search Input - Show when voice fails or user prefers typing */}
      {(showManualSearch || !browserSupportsSpeechRecognition) && (
        <div className="mt-3">
          <Input
            placeholder="Type product name (e.g., rice, chawal, 2 milk)"
            value={manualSearch}
            onValueChange={setManualSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManualSearch(manualSearch);
              }
            }}
            endContent={
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={() => handleManualSearch(manualSearch)}
                isDisabled={!manualSearch.trim()}
              >
                <Icon icon="lucide:search" />
              </Button>
            }
            startContent={<Icon icon="lucide:type" className="text-gray-400" />}
            label="Manual Product Search"
            description="Type product name or quantity + name (e.g., '2 milk')"
          />
        </div>
      )}

      {/* Voice Status */}
      {listening && (
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
              • <strong>ADD Commands (Recommended):</strong>
            </p>
            <p className="ml-4">- "Add milk" - Add 1 milk to cart</p>
            <p className="ml-4">- "Add 2 milk" - Add 2 milk to cart</p>
            <p className="ml-4">- "Add biscuits" - Add 1 biscuit to cart</p>
            <p className="ml-4">- "Add 3 bread" - Add 3 bread to cart</p>
            <p>
              • <strong>Simple Commands:</strong>
            </p>
            <p className="ml-4">- "Milk" - Add 1 milk to cart</p>
            <p className="ml-4">- "2 milk" - Add 2 milk to cart</p>
            <p className="ml-4">- "Chawal" - Add 1 rice to cart</p>
            <div className="mt-2 p-2 bg-green-50 rounded">
              <p className="text-green-700 text-xs font-medium">
                🎯 Best Practice: Use "Add" Commands
              </p>
              <p className="text-green-600 text-xs">
                <strong>✅ Say:</strong> "Add milk", "Add 2 biscuits"
              </p>
              <p className="text-green-600 text-xs">
                <strong>🌐 Hindi:</strong> chawal, doodh, cheeni, tel, chai
              </p>
              <p className="text-green-600 text-xs">
                <strong>⌨️ Backup:</strong> Use "Type" button if voice fails
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
  console.log("🎤 Processing voice command:", lowerText);

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
    biscuits: "biscuit",
    coffee: "coffee",
    paani: "water",
    juice: "juice",
  };

  // Enhanced patterns for "add" commands - prioritize these
  const addPatterns = [
    { pattern: /^add\s+(\d+)\s+(.+)$/, type: "add_quantity_product" }, // "add 2 milk"
    { pattern: /^add\s+(.+?)\s+(\d+)$/, type: "add_product_quantity" }, // "add milk 2"
    { pattern: /^add\s+(.+)$/, type: "add_product" }, // "add milk"
  ];

  // Check for "add" commands first
  for (const { pattern, type } of addPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      let quantity = 1;
      let productName = "";

      if (type === "add_quantity_product") {
        quantity = parseInt(match[1]);
        productName = match[2];
      } else if (type === "add_product_quantity") {
        productName = match[1];
        quantity = parseInt(match[2]) || 1;
      } else if (type === "add_product") {
        productName = match[1];
        quantity = 1;
      }

      // Clean product name
      productName = productName
        .replace(
          /\b(please|now|to cart|chahiye|daal do|add karo|lao|dikhao|search|find)\b/g,
          ""
        )
        .trim();

      console.log("🔍 Extracted:", { productName, quantity, type });

      // Convert Hindi product names
      for (const [hindi, english] of Object.entries(productCorrections)) {
        if (productName.includes(hindi)) {
          productName = productName.replace(hindi, english);
          console.log("🌐 Translated:", hindi, "→", english);
          break;
        }
      }

      // Search for product
      const foundProduct = findProduct(productName, products);
      if (foundProduct) {
        console.log("✅ Found product:", foundProduct.name);
        onProductFound(foundProduct, quantity);
        return `Adding ${quantity} ${foundProduct.name} to cart`;
      } else {
        console.log("❌ Product not found:", productName);
      }
    }
  }

  // Fallback patterns for other formats
  const fallbackPatterns = [
    { pattern: /^(\d+)\s+(.+)$/, type: "quantity_product" }, // "2 milk"
    { pattern: /^(.+?)\s+(\d+)$/, type: "product_quantity" }, // "milk 2"
    { pattern: /^(.+)$/, type: "product_only" }, // "milk"
  ];

  for (const { pattern, type } of fallbackPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      let quantity = 1;
      let productName = "";

      if (type === "quantity_product") {
        quantity = parseInt(match[1]);
        productName = match[2];
      } else if (type === "product_quantity") {
        productName = match[1];
        quantity = parseInt(match[2]) || 1;
      } else if (type === "product_only") {
        productName = match[1];
        quantity = 1;
      }

      // Clean product name
      productName = productName
        .replace(
          /\b(please|now|to cart|chahiye|daal do|add karo|lao|dikhao|search|find)\b/g,
          ""
        )
        .trim();

      console.log("🔍 Fallback extracted:", { productName, quantity, type });

      // Convert Hindi product names
      for (const [hindi, english] of Object.entries(productCorrections)) {
        if (productName.includes(hindi)) {
          productName = productName.replace(hindi, english);
          console.log("🌐 Translated:", hindi, "→", english);
          break;
        }
      }

      // Search for product
      const foundProduct = findProduct(productName, products);
      if (foundProduct) {
        console.log("✅ Found product:", foundProduct.name);
        onProductFound(foundProduct, quantity);
        return `Adding ${quantity} ${foundProduct.name} to cart`;
      }
    }
  }

  console.log("❌ No product found for:", lowerText);
  return `Product "${lowerText}" not found`;
};

// Helper function to find product by name
const findProduct = (searchTerm: string, products: any[]) => {
  if (!searchTerm || !products) return null;

  console.log("🔍 Searching for product:", searchTerm);
  console.log(
    "📦 Available products:",
    products.map((p) => p.name)
  );

  // Exact match first
  let found = products.find(
    (p) => p.name.toLowerCase() === searchTerm.toLowerCase()
  );

  if (found) {
    console.log("✅ Exact match found:", found.name);
    return found;
  }

  // Partial match - product name contains search term
  found = products.find((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (found) {
    console.log("✅ Partial match found:", found.name);
    return found;
  }

  // Reverse partial match - search term contains product name
  found = products.find((p) =>
    searchTerm.toLowerCase().includes(p.name.toLowerCase())
  );

  if (found) {
    console.log("✅ Reverse partial match found:", found.name);
    return found;
  }

  // Word-based fuzzy match
  found = products.find((p) => {
    const productWords = p.name.toLowerCase().split(/\s+/);
    const searchWords = searchTerm.toLowerCase().split(/\s+/);

    return searchWords.some((searchWord) =>
      productWords.some(
        (productWord) =>
          productWord.includes(searchWord) ||
          searchWord.includes(productWord) ||
          productWord.startsWith(searchWord) ||
          searchWord.startsWith(productWord)
      )
    );
  });

  if (found) {
    console.log("✅ Fuzzy match found:", found.name);
    return found;
  }

  // Last resort: very loose matching
  found = products.find((p) => {
    const productName = p.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const searchName = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, "");

    return productName.includes(searchName) || searchName.includes(productName);
  });

  if (found) {
    console.log("✅ Loose match found:", found.name);
    return found;
  }

  console.log("❌ No match found for:", searchTerm);
  return null;
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
