import React from "react";
import { Button, Card, CardBody, Chip, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface NativeVoiceSearchProps {
  onResult: (text: string) => void;
  onProductFound?: (product: any, quantity?: number) => void;
  products?: any[];
  language?: string;
}

// Native Web Speech API implementation as fallback
export const NativeVoiceSearch: React.FC<NativeVoiceSearchProps> = ({
  onResult,
  onProductFound,
  products = [],
  language = "en-IN",
}) => {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [lastAction, setLastAction] = React.useState("");
  const [isSupported, setIsSupported] = React.useState(false);
  const [manualSearch, setManualSearch] = React.useState("");
  const [showManualSearch, setShowManualSearch] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [retryCount, setRetryCount] = React.useState(0);
  const recognitionRef = React.useRef<any>(null);

  // Monitor network status
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastAction("🌐 Connection restored! Voice search is now available.");
      setTimeout(() => setLastAction(""), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastAction("🌐 Connection lost. Please use manual search.");
      setShowManualSearch(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  React.useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      console.log("🎤 Native Speech Recognition available");

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("🎤 Speech recognition started");
        setIsListening(true);
        setTranscript("");
        setLastAction("Listening... Speak now!");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript) {
          console.log("🎤 Final transcript:", finalTranscript);
          onResult(finalTranscript);

          // Process the voice command
          processVoiceCommand(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error("🎤 Speech recognition error:", event.error);
        setIsListening(false);

        switch (event.error) {
          case "network":
            setRetryCount((prev) => prev + 1);
            if (retryCount < 2) {
              setLastAction(
                `🌐 Network error (attempt ${
                  retryCount + 1
                }/3). Retrying in 3 seconds...`
              );
              setTimeout(() => {
                if (isOnline && !isListening) {
                  console.log("🔄 Auto-retrying speech recognition...");
                  startListening();
                }
              }, 3000);
            } else {
              setLastAction(
                "🌐 Network error persists. Please use manual search or check your connection."
              );
              setShowManualSearch(true);
              setRetryCount(0); // Reset for next time
            }
            break;
          case "no-speech":
            setLastAction(
              "🔇 No speech detected. Please speak clearly and try again."
            );
            // Auto-retry after a short delay
            setTimeout(() => {
              if (!isListening) {
                setLastAction(
                  "🎤 Ready to listen again. Click the microphone button."
                );
              }
            }, 3000);
            break;
          case "audio-capture":
            setLastAction(
              "🎤 Microphone not accessible. Please check permissions and try again."
            );
            setShowManualSearch(true);
            break;
          case "not-allowed":
            setLastAction(
              "❌ Microphone permission denied. Please allow microphone access in browser settings."
            );
            setShowManualSearch(true);
            break;
          case "service-not-allowed":
            setLastAction(
              "🔒 Speech service not allowed. Please use HTTPS or enable speech recognition."
            );
            setShowManualSearch(true);
            break;
          case "bad-grammar":
            setLastAction("🔄 Speech recognition error. Please try again.");
            break;
          case "language-not-supported":
            setLastAction("🌐 Language not supported. Switching to English...");
            // Try with English
            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.lang = "en-US";
                setLastAction("🔄 Switched to English. Try speaking again.");
              }
            }, 1000);
            break;
          default:
            setLastAction(
              `⚠️ Speech error: ${event.error}. Using manual search instead.`
            );
            setShowManualSearch(true);
        }

        setTimeout(() => {
          if (lastAction.includes("error") || lastAction.includes("Network")) {
            setLastAction("");
          }
        }, 8000);
      };

      recognition.onend = () => {
        console.log("🎤 Speech recognition ended");
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("🎤 Speech Recognition not supported");
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const processVoiceCommand = (text: string) => {
    if (!products || products.length === 0 || !onProductFound) {
      setLastAction("No products available");
      return;
    }

    const lowerText = text.toLowerCase().trim();
    console.log("🎤 Processing command:", lowerText);

    // Simple product matching
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
    const foundProduct = products.find(
      (p) =>
        p.name.toLowerCase().includes(productName) ||
        productName.includes(p.name.toLowerCase())
    );

    if (foundProduct) {
      onProductFound(foundProduct, quantity);
      setLastAction(`✅ Added ${quantity} ${foundProduct.name} to cart`);
      console.log("✅ Product found and added:", foundProduct.name);
    } else {
      setLastAction(`❌ Product "${productName}" not found`);
      console.log("❌ Product not found:", productName);
    }

    setTimeout(() => setLastAction(""), 5000);
  };

  const startListening = async () => {
    if (!isSupported) {
      setLastAction("❌ Speech recognition not supported in this browser");
      setShowManualSearch(true);
      return;
    }

    // Check network connectivity
    if (!navigator.onLine) {
      setLastAction("🌐 No internet connection. Please use manual search.");
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
        "🔒 Voice search requires HTTPS. Please use manual search."
      );
      setShowManualSearch(true);
      return;
    }

    try {
      // Request microphone permission with timeout
      const stream = (await Promise.race([
        navigator.mediaDevices.getUserMedia({ audio: true }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Microphone timeout")), 5000)
        ),
      ])) as MediaStream;

      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop());

      // Start speech recognition
      if (recognitionRef.current) {
        setLastAction("🎤 Starting speech recognition...");
        recognitionRef.current.start();
      }
    } catch (error: any) {
      console.error("🎤 Microphone error:", error);

      if (error.name === "NotAllowedError") {
        setLastAction(
          "❌ Microphone permission denied. Please allow microphone access and try again."
        );
      } else if (error.name === "NotFoundError") {
        setLastAction(
          "🎤 No microphone found. Please connect a microphone and try again."
        );
      } else if (error.message === "Microphone timeout") {
        setLastAction("⏱️ Microphone access timeout. Please try again.");
      } else {
        setLastAction("⚠️ Microphone error. Please use manual search.");
      }

      setShowManualSearch(true);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleManualSearch = (searchText: string) => {
    if (!searchText.trim()) return;
    processVoiceCommand(searchText.trim());
    setManualSearch("");
  };

  const testConnection = async () => {
    try {
      setLastAction("🔍 Testing connection...");
      const response = await fetch("https://www.google.com/favicon.ico", {
        mode: "no-cors",
        cache: "no-cache",
      });
      setLastAction("✅ Connection test successful!");
      setIsOnline(true);
      setTimeout(() => setLastAction(""), 2000);
    } catch (error) {
      setLastAction("❌ Connection test failed. Please check your internet.");
      setIsOnline(false);
      setTimeout(() => setLastAction(""), 3000);
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
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
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">🎤 Native Voice Search</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            onPress={() => setShowManualSearch(!showManualSearch)}
            startContent={<Icon icon="lucide:keyboard" />}
          >
            Type
          </Button>
          <div className="flex gap-2">
            <Chip
              size="sm"
              color={isOnline ? "success" : "danger"}
              variant="flat"
            >
              {isOnline ? "🌐 Online" : "🌐 Offline"}
            </Chip>
            <Chip
              size="sm"
              color={isSupported ? "success" : "danger"}
              variant="flat"
            >
              {isSupported ? "🎤 Ready" : "❌ Not Supported"}
            </Chip>
          </div>
        </div>
      </div>

      {/* Voice Control Buttons */}
      <div className="flex gap-2">
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
          className="flex-1"
          size="lg"
          isDisabled={!isSupported || (!isOnline && !showManualSearch)}
        >
          {isListening ? "🔴 Stop" : "🎤 Voice Search"}
        </Button>

        {/* Retry Button - show when there are network issues */}
        {(!isOnline || retryCount > 0) && (
          <Button
            color="secondary"
            variant="flat"
            onPress={() => {
              setRetryCount(0);
              if (isOnline) {
                startListening();
              } else {
                setLastAction(
                  "🌐 Please check your internet connection and try again."
                );
              }
            }}
            startContent={<Icon icon="lucide:refresh-cw" />}
            size="lg"
            isDisabled={isListening}
          >
            Retry
          </Button>
        )}
      </div>

      {/* Manual Search */}
      {showManualSearch && (
        <Input
          placeholder="Type: add milk, add 2 biscuits, chawal"
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
              onPress={() => handleManualSearch(manualSearch)}
              isDisabled={!manualSearch.trim()}
            >
              <Icon icon="lucide:search" />
            </Button>
          }
        />
      )}

      {/* Transcript */}
      {transcript && (
        <Card>
          <CardBody>
            <p className="text-sm font-medium">Voice Input:</p>
            <p className="text-sm text-gray-700">{transcript}</p>
          </CardBody>
        </Card>
      )}

      {/* Status */}
      {lastAction && (
        <Card>
          <CardBody className="py-2">
            <p className="text-sm">{lastAction}</p>
          </CardBody>
        </Card>
      )}

      {/* Help */}
      <Card>
        <CardBody>
          <h4 className="text-sm font-semibold mb-2">Voice Commands:</h4>
          <div className="text-xs space-y-1">
            <p>• "Add milk" → Adds 1 milk</p>
            <p>• "Add 2 milk" → Adds 2 milk</p>
            <p>• "Chawal" → Adds 1 rice</p>
            <p>• "2 biscuits" → Adds 2 biscuits</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
