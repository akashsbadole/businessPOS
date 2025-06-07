import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App.tsx";
import "./index.css";
import { autoRegisterPWA } from "./utils/pwa-registration";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="text-foreground bg-background">
        <App />
      </main>
    </HeroUIProvider>
  </React.StrictMode>
);

// Register PWA
autoRegisterPWA({
  onInstalled: () => {
    console.log("🎉 Smart POS installed successfully!");
  },
  onUpdateAvailable: () => {
    console.log("📱 App update available");
  },
  onOfflineReady: () => {
    console.log("🔄 App ready to work offline");
  },
  onError: (error) => {
    console.error("❌ PWA registration error:", error);
  },
});
