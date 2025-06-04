import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface CameraBarcodeScanner {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}

export const CameraBarcodeScanner: React.FC<CameraBarcodeScanner> = ({
  isOpen,
  onOpenChange,
  onScan,
  onError,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(
    null
  );
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = React.useState<string>("");
  const [lastScan, setLastScan] = React.useState<string>("");
  const [scanHistory, setScanHistory] = React.useState<string[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const scanIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Initialize camera and get devices
  React.useEffect(() => {
    if (isOpen) {
      initializeCamera();
      // Listen for hardware barcode scanner input
      setupHardwareBarcodeListener();
    } else {
      stopScanning();
      removeHardwareBarcodeListener();
    }

    return () => {
      stopScanning();
      removeHardwareBarcodeListener();
    };
  }, [isOpen]);

  const initializeCamera = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Prefer back camera
      });
      setHasPermission(true);

      // Get available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }

      // Stop the initial stream
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Camera initialization failed:", error);
      setHasPermission(false);
      onError?.("Camera access denied or not available");
    }
  };

  const startScanning = async () => {
    if (!selectedDevice) return;

    try {
      const constraints = {
        video: {
          deviceId: selectedDevice,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment",
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);

        // Start scanning for barcodes
        scanIntervalRef.current = setInterval(() => {
          scanForBarcode();
        }, 500); // Scan every 500ms
      }
    } catch (error) {
      console.error("Failed to start camera:", error);
      onError?.("Failed to start camera");
    }
  };

  const stopScanning = () => {
    setIsScanning(false);

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const scanForBarcode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for barcode detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Simple barcode detection simulation
    // In a real implementation, you would use a library like QuaggaJS or ZXing
    const detectedBarcode = simulateBarcodeDetection(imageData);

    if (detectedBarcode && detectedBarcode !== lastScan) {
      setLastScan(detectedBarcode);
      setScanHistory((prev) => [detectedBarcode, ...prev.slice(0, 4)]); // Keep last 5 scans
      onScan(detectedBarcode);

      // Visual feedback
      playBeepSound();
      flashScreen();
    }
  };

  // Simulate barcode detection (replace with actual barcode library)
  const simulateBarcodeDetection = (imageData: ImageData): string | null => {
    // This is a simulation - in real implementation, use QuaggaJS or similar
    // For demo purposes, we'll generate a random barcode when certain conditions are met
    const data = imageData.data;
    let darkPixels = 0;

    // Count dark pixels in center region
    const centerX = imageData.width / 2;
    const centerY = imageData.height / 2;
    const regionSize = 100;

    for (let y = centerY - regionSize / 2; y < centerY + regionSize / 2; y++) {
      for (
        let x = centerX - regionSize / 2;
        x < centerX + regionSize / 2;
        x++
      ) {
        const index = (y * imageData.width + x) * 4;
        const brightness =
          (data[index] + data[index + 1] + data[index + 2]) / 3;
        if (brightness < 128) darkPixels++;
      }
    }

    // If enough dark pixels detected, simulate barcode detection
    if (darkPixels > regionSize * regionSize * 0.3) {
      return `${Math.floor(Math.random() * 9000000000000) + 1000000000000}`; // 13-digit barcode
    }

    return null;
  };

  const playBeepSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const flashScreen = () => {
    if (videoRef.current) {
      videoRef.current.style.filter = "brightness(2)";
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.style.filter = "none";
        }
      }, 200);
    }
  };

  const switchCamera = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    if (isScanning) {
      stopScanning();
      setTimeout(() => startScanning(), 100);
    }
  };

  // Hardware barcode scanner support
  const hardwareBarcodeBuffer = React.useRef("");
  const hardwareBarcodeTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const setupHardwareBarcodeListener = () => {
    document.addEventListener("keydown", handleHardwareBarcodeInput);
  };

  const removeHardwareBarcodeListener = () => {
    document.removeEventListener("keydown", handleHardwareBarcodeInput);
    if (hardwareBarcodeTimeout.current) {
      clearTimeout(hardwareBarcodeTimeout.current);
    }
  };

  const handleHardwareBarcodeInput = (event: KeyboardEvent) => {
    // Hardware barcode scanners typically send data very quickly
    // and end with Enter key
    if (event.key === "Enter") {
      if (hardwareBarcodeBuffer.current.length > 3) {
        const barcode = hardwareBarcodeBuffer.current;
        setLastScan(barcode);
        setScanHistory((prev) => [barcode, ...prev.slice(0, 4)]);
        onScan(barcode);
        playBeepSound();
        flashScreen();
      }
      hardwareBarcodeBuffer.current = "";
      return;
    }

    // Only accept alphanumeric characters for barcode
    if (/^[a-zA-Z0-9]$/.test(event.key)) {
      hardwareBarcodeBuffer.current += event.key;

      // Clear buffer after 100ms of inactivity (hardware scanners are fast)
      if (hardwareBarcodeTimeout.current) {
        clearTimeout(hardwareBarcodeTimeout.current);
      }
      hardwareBarcodeTimeout.current = setTimeout(() => {
        hardwareBarcodeBuffer.current = "";
      }, 100);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:camera" />
              <span>Barcode Scanner</span>
              <Chip size="sm" color="primary" variant="flat">
                Camera + Hardware
              </Chip>
            </ModalHeader>

            <ModalBody>
              {hasPermission === false ? (
                <Card>
                  <CardBody className="text-center">
                    <Icon
                      icon="lucide:camera-off"
                      className="text-4xl text-red-500 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">
                      Camera Access Required
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Please allow camera access to scan barcodes.
                    </p>
                    <Button color="primary" onPress={initializeCamera}>
                      Grant Camera Access
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Camera Controls */}
                  <div className="flex gap-2">
                    {devices.length > 1 && (
                      <select
                        value={selectedDevice}
                        onChange={(e) => switchCamera(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        {devices.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label ||
                              `Camera ${device.deviceId.slice(0, 8)}`}
                          </option>
                        ))}
                      </select>
                    )}

                    <Button
                      color={isScanning ? "danger" : "primary"}
                      onPress={isScanning ? stopScanning : startScanning}
                      startContent={
                        <Icon
                          icon={isScanning ? "lucide:square" : "lucide:play"}
                        />
                      }
                    >
                      {isScanning ? "Stop" : "Start"} Scanning
                    </Button>
                  </div>

                  {/* Camera View */}
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full h-64 bg-black rounded-lg object-cover"
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanning Overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-32 border-2 border-red-500 border-dashed rounded-lg">
                          <div className="w-full h-full border border-red-300 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    )}

                    {/* Status Indicator */}
                    <div className="absolute top-2 right-2">
                      <Chip
                        color={isScanning ? "success" : "default"}
                        variant="flat"
                        size="sm"
                      >
                        {isScanning ? "Scanning..." : "Ready"}
                      </Chip>
                    </div>
                  </div>

                  {/* Last Scan Result */}
                  {lastScan && (
                    <Card>
                      <CardBody>
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="lucide:check-circle"
                            className="text-green-500"
                          />
                          <div>
                            <p className="text-sm font-medium">Last Scanned:</p>
                            <p className="text-lg font-mono">{lastScan}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Scan History */}
                  {scanHistory.length > 0 && (
                    <Card>
                      <CardBody>
                        <h4 className="text-sm font-semibold mb-2">
                          Recent Scans:
                        </h4>
                        <div className="space-y-1">
                          {scanHistory.map((barcode, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                            >
                              <span className="font-mono">{barcode}</span>
                              <Button
                                size="sm"
                                variant="flat"
                                onPress={() => onScan(barcode)}
                              >
                                Use
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Instructions */}
                  <Card>
                    <CardBody>
                      <h4 className="text-sm font-semibold mb-2">
                        Instructions:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Point camera at barcode</li>
                        <li>• Keep barcode within the red frame</li>
                        <li>• Ensure good lighting</li>
                        <li>• Hold steady for best results</li>
                      </ul>
                    </CardBody>
                  </Card>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
