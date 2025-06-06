/**
 * AI-Powered Speech-to-Text Service using Google Gemini Flash 2.0
 * Provides intelligent speech recognition with context awareness
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

interface SpeechRecognitionConfig {
  language: string;
  enableProfanityFilter: boolean;
  enableWordTimeOffsets: boolean;
  enableAutomaticPunctuation: boolean;
  model: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
  words?: Array<{
    word: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
}

interface AIProcessingResult {
  originalText: string;
  processedText: string;
  intent: string;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  action: {
    type: "add_product" | "search_product" | "quantity_change" | "unknown";
    product?: string;
    quantity?: number;
    confidence: number;
  };
}

export class AISpeechService {
  private apiKey: string;
  private genAI: GoogleGenerativeAI | null = null;
  private speechEndpoint: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || "";
    this.speechEndpoint = "https://speech.googleapis.com/v1/speech:recognize";

    if (!this.apiKey) {
      console.warn(
        "Google Gemini API key not found. AI features will be limited."
      );
    } else {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.isInitialized = true;
        console.log("🤖 AI Speech Service initialized with Gemini Flash 2.0");
      } catch (error) {
        console.error("Failed to initialize Google Generative AI:", error);
      }
    }
  }

  /**
   * Convert audio to text using Google Speech-to-Text API
   */
  async speechToText(
    audioBlob: Blob,
    config?: Partial<SpeechRecognitionConfig>
  ): Promise<SpeechRecognitionResult> {
    if (!this.isInitialized) {
      throw new Error(
        "AI Speech Service not initialized. Please check your API key."
      );
    }

    try {
      // Convert blob to base64
      const audioBase64 = await this.blobToBase64(audioBlob);

      const requestBody = {
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode: config?.language || "en-IN",
          enableAutomaticPunctuation:
            config?.enableAutomaticPunctuation ?? true,
          enableWordTimeOffsets: config?.enableWordTimeOffsets ?? true,
          model: config?.model || "latest_long",
          useEnhanced: true,
          ...config,
        },
        audio: {
          content: audioBase64.split(",")[1], // Remove data:audio/webm;base64, prefix
        },
      };

      const response = await fetch(
        `${this.speechEndpoint}?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Speech API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return {
          transcript: "",
          confidence: 0,
          alternatives: [],
        };
      }

      const result = data.results[0];
      const alternative = result.alternatives[0];

      return {
        transcript: alternative.transcript || "",
        confidence: alternative.confidence || 0,
        alternatives: result.alternatives || [],
        words: alternative.words || [],
      };
    } catch (error) {
      console.error("Speech-to-text error:", error);
      throw new Error(`Failed to convert speech to text: ${error}`);
    }
  }

  /**
   * Process text using Gemini AI for intelligent command understanding
   */
  async processWithAI(
    text: string,
    context?: { products?: any[]; currentCart?: any[] }
  ): Promise<AIProcessingResult> {
    if (!this.isInitialized || !this.genAI) {
      // Fallback to basic processing without AI
      return this.basicTextProcessing(text, context);
    }

    try {
      const prompt = this.buildPrompt(text, context);

      // Use Gemini Flash 2.0 model
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      if (!aiResponse) {
        return this.basicTextProcessing(text, context);
      }

      return this.parseAIResponse(text, aiResponse);
    } catch (error) {
      console.error("AI processing error:", error);
      // Fallback to basic processing
      return this.basicTextProcessing(text, context);
    }
  }

  /**
   * Record audio from microphone
   */
  async startRecording(): Promise<MediaRecorder> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      return mediaRecorder;
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw new Error("Microphone access denied or not available");
    }
  }

  /**
   * Complete speech recognition pipeline
   */
  async recognizeSpeech(
    audioBlob: Blob,
    context?: { products?: any[]; currentCart?: any[] }
  ): Promise<AIProcessingResult> {
    try {
      // Step 1: Convert speech to text
      const speechResult = await this.speechToText(audioBlob);

      if (!speechResult.transcript) {
        throw new Error("No speech detected");
      }

      // Step 2: Process with AI for intelligent understanding
      const aiResult = await this.processWithAI(
        speechResult.transcript,
        context
      );

      return {
        ...aiResult,
        originalText: speechResult.transcript,
      };
    } catch (error) {
      console.error("Speech recognition pipeline error:", error);
      throw error;
    }
  }

  // Helper methods
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private buildPrompt(
    text: string,
    context?: { products?: any[]; currentCart?: any[] }
  ): string {
    const availableProducts =
      context?.products?.map((p) => p.name).join(", ") ||
      "milk, bread, rice, biscuits, oil, sugar";

    return `
You are an AI assistant for a Point of Sale (POS) system. Analyze the following voice command and extract the intent and entities.

Voice Command: "${text}"

Available Products: ${availableProducts}

Please respond in JSON format with the following structure:
{
  "intent": "add_product|search_product|quantity_change|unknown",
  "entities": [
    {
      "type": "product|quantity|action",
      "value": "extracted_value",
      "confidence": 0.0-1.0
    }
  ],
  "action": {
    "type": "add_product|search_product|quantity_change|unknown",
    "product": "product_name_if_found",
    "quantity": number_if_specified,
    "confidence": 0.0-1.0
  },
  "processedText": "cleaned_and_normalized_text"
}

Rules:
1. Detect Hindi words and convert to English (chawal->rice, doodh->milk, etc.)
2. Extract quantities from numbers or words (two, three, etc.)
3. Handle commands like "add", "search", "find", "get"
4. Match products even with partial names
5. Default quantity is 1 if not specified
6. Be confident in your analysis

Respond only with valid JSON.
`;
  }

  private parseAIResponse(
    originalText: string,
    aiResponse: string
  ): AIProcessingResult {
    try {
      const parsed = JSON.parse(aiResponse);
      return {
        originalText,
        processedText: parsed.processedText || originalText,
        intent: parsed.intent || "unknown",
        entities: parsed.entities || [],
        action: parsed.action || { type: "unknown", confidence: 0 },
      };
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return this.basicTextProcessing(originalText);
    }
  }

  private basicTextProcessing(
    text: string,
    context?: { products?: any[] }
  ): AIProcessingResult {
    const lowerText = text.toLowerCase().trim();

    // Basic product name corrections
    const corrections: Record<string, string> = {
      chawal: "rice",
      doodh: "milk",
      cheeni: "sugar",
      tel: "oil",
      chai: "tea",
      namak: "salt",
    };

    let processedText = lowerText;
    for (const [hindi, english] of Object.entries(corrections)) {
      processedText = processedText.replace(new RegExp(hindi, "g"), english);
    }

    // Extract quantity
    const quantityMatch = processedText.match(
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/
    );
    const quantity = quantityMatch ? this.wordToNumber(quantityMatch[1]) : 1;

    // Extract product
    const addMatch = processedText.match(
      /(?:add|get|find|search)\s+(?:\d+\s+)?(.+)/
    );
    const productName = addMatch
      ? addMatch[1]
      : processedText.replace(/\d+/, "").trim();

    return {
      originalText: text,
      processedText,
      intent: addMatch ? "add_product" : "search_product",
      entities: [
        { type: "product", value: productName, confidence: 0.8 },
        { type: "quantity", value: quantity.toString(), confidence: 0.9 },
      ],
      action: {
        type: "add_product",
        product: productName,
        quantity,
        confidence: 0.7,
      },
    };
  }

  private wordToNumber(word: string): number {
    const numbers: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };
    return numbers[word] || parseInt(word) || 1;
  }

  // Public utility methods
  isAvailable(): boolean {
    return this.isInitialized;
  }

  getStatus(): { available: boolean; apiKey: boolean; features: string[] } {
    return {
      available: this.isInitialized,
      apiKey: !!this.apiKey,
      features: this.isInitialized
        ? [
            "speech-to-text",
            "ai-processing",
            "intent-recognition",
            "entity-extraction",
          ]
        : ["basic-processing"],
    };
  }
}

// Export singleton instance
export const aiSpeechService = new AISpeechService();
