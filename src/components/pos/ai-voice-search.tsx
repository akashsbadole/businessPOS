import React from "react";
import { Button, Card, CardBody, Chip, Progress, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { aiSpeechService } from "../../services/ai-speech-service";

interface AIVoiceSearchProps {
  onResult: (text: string) => void;
  onProductFound?: (product: any, quantity?: number) => void;
  products?: any[];
  language?: string;
}

export const AIVoiceSearch: React.FC<AIVoiceSearchProps> = ({
  onResult,
  onProductFound,
  products = [],
  language = "en-IN",
}) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [lastResult, setLastResult] = React.useState("");
  const [lastAction, setLastAction] = React.useState("");
  const [confidence, setConfidence] = React.useState(0);
  const [processingStage, setProcessingStage] = React.useState("");
  const [aiStatus, setAiStatus] = React.useState(aiSpeechService.getStatus());
  
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  React.useEffect(() => {
    // Update AI status
    setAiStatus(aiSpeechService.getStatus());
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setLastAction("🎤 Starting microphone...");
      
      const mediaRecorder = await aiSpeechService.startRecording();
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudio(audioBlob);
        } catch (error) {
          console.error('Processing error:', error);
          setLastAction(`❌ Processing failed: ${error}`);
          setIsProcessing(false);
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      setLastAction("🎤 Listening... Speak now!");
      
    } catch (error) {
      console.error('Recording error:', error);
      setLastAction(`❌ Recording failed: ${error}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setLastAction("🔄 Processing speech...");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setProcessingStage("Converting speech to text...");
      
      const result = await aiSpeechService.recognizeSpeech(audioBlob, {
        products,
        currentCart: [] // You can pass current cart items here
      });

      setLastResult(result.originalText);
      setConfidence(result.action.confidence);
      setProcessingStage("AI processing complete!");

      // Handle the AI result
      if (result.action.type === 'add_product' && result.action.product && onProductFound) {
        // Find the product in the available products
        const foundProduct = products.find(p => 
          p.name.toLowerCase().includes(result.action.product!.toLowerCase()) ||
          result.action.product!.toLowerCase().includes(p.name.toLowerCase())
        );

        if (foundProduct) {
          onProductFound(foundProduct, result.action.quantity || 1);
          setLastAction(`✅ Added ${result.action.quantity || 1} ${foundProduct.name} to cart`);
        } else {
          setLastAction(`❌ Product "${result.action.product}" not found`);
        }
      } else {
        onResult(result.processedText);
        setLastAction(`📝 Processed: "${result.processedText}"`);
      }

      // Show AI insights
      if (result.entities.length > 0) {
        const entityInfo = result.entities.map(e => `${e.type}: ${e.value}`).join(', ');
        setTimeout(() => {
          setLastAction(`🤖 AI detected: ${entityInfo}`);
        }, 2000);
      }

    } catch (error) {
      console.error('AI processing error:', error);
      setLastAction(`❌ AI processing failed: ${error}`);
    } finally {
      setIsProcessing(false);
      setProcessingStage("");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const testAIFeatures = async () => {
    const testCommands = [
      "add 2 milk",
      "chawal chahiye",
      "get biscuits",
      "3 bread please"
    ];
    
    const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
    setLastAction(`🧪 Testing AI with: "${randomCommand}"`);
    setIsProcessing(true);
    setProcessingStage("Testing AI processing...");

    try {
      const result = await aiSpeechService.processWithAI(randomCommand, { products });
      setLastResult(randomCommand);
      setConfidence(result.action.confidence);
      
      if (result.action.type === 'add_product' && result.action.product && onProductFound) {
        const foundProduct = products.find(p => 
          p.name.toLowerCase().includes(result.action.product!.toLowerCase()) ||
          result.action.product!.toLowerCase().includes(p.name.toLowerCase())
        );

        if (foundProduct) {
          onProductFound(foundProduct, result.action.quantity || 1);
          setLastAction(`✅ AI Test: Added ${result.action.quantity || 1} ${foundProduct.name}`);
        } else {
          setLastAction(`❌ AI Test: Product "${result.action.product}" not found`);
        }
      }
    } catch (error) {
      setLastAction(`❌ AI Test failed: ${error}`);
    } finally {
      setIsProcessing(false);
      setProcessingStage("");
    }
  };

  if (!aiStatus.available) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="text-center space-y-4">
            <Icon icon="lucide:brain" className="text-4xl text-gray-400 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-600">AI Features Not Available</h3>
            <p className="text-sm text-gray-500">
              Please configure your Google Gemini API key to enable AI-powered speech recognition.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                Add <code>VITE_GOOGLE_GEMINI_API_KEY</code> to your .env file
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Status */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Chip size="sm" color="success" variant="flat">
            🤖 AI Enabled
          </Chip>
          <Chip size="sm" color="primary" variant="flat">
            Gemini Flash 2.0
          </Chip>
        </div>
        <Chip size="sm" color={products.length > 0 ? "success" : "warning"} variant="flat">
          {products.length} Products
        </Chip>
      </div>

      {/* Voice Control */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            color={isRecording ? "danger" : "primary"}
            variant={isRecording ? "solid" : "flat"}
            onPress={toggleRecording}
            isDisabled={isProcessing}
            startContent={
              <Icon
                icon={isRecording ? "lucide:mic" : "lucide:mic-off"}
                className={isRecording ? "animate-pulse" : ""}
              />
            }
            className="flex-1"
            size="lg"
          >
            {isRecording ? "🔴 Stop Recording" : "🎤 Start AI Voice Search"}
          </Button>

          <Button
            color="secondary"
            variant="flat"
            onPress={testAIFeatures}
            isDisabled={isRecording || isProcessing}
            startContent={<Icon icon="lucide:brain" />}
            size="lg"
          >
            Test AI
          </Button>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress
              size="sm"
              isIndeterminate
              color="primary"
              className="w-full"
            />
            <p className="text-xs text-center text-gray-600">{processingStage}</p>
          </div>
        )}
      </div>

      <Divider />

      {/* Results */}
      <div className="space-y-3">
        {lastResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">Speech Recognized:</h4>
            <p className="text-sm text-blue-700">"{lastResult}"</p>
            {confidence > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-blue-600">
                  <span>AI Confidence</span>
                  <span>{Math.round(confidence * 100)}%</span>
                </div>
                <Progress
                  size="sm"
                  value={confidence * 100}
                  color={confidence > 0.8 ? "success" : confidence > 0.6 ? "warning" : "danger"}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}

        {lastAction && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">{lastAction}</p>
          </div>
        )}
      </div>

      {/* AI Features Info */}
      <Card>
        <CardBody className="py-3">
          <h4 className="text-sm font-semibold mb-2">🤖 AI Features:</h4>
          <div className="text-xs space-y-1 text-gray-600">
            <p>• Intelligent speech-to-text with Google Speech API</p>
            <p>• Context-aware command understanding</p>
            <p>• Hindi to English translation</p>
            <p>• Smart product matching and quantity detection</p>
            <p>• Intent recognition and entity extraction</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
