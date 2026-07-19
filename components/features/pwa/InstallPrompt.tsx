"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

export function InstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already installed/running in standalone mode
    const checkStandalone = () => {
      return window.matchMedia("(display-mode: standalone)").matches || 
             (window.navigator as any).standalone === true;
    };
    
    setIsStandalone(checkStandalone());
    
    if (checkStandalone()) return;

    // Detect iOS
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isSafari = isIOSDevice && webkit && !ua.match(/CriOS/i);
    
    if (isSafari) {
      setIsIOS(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const dismissPrompt = () => {
    setIsDismissed(true);
  };

  if (isStandalone || isDismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-bg-elevated border border-accent-primary/30 p-4 rounded-xl shadow-xl flex items-start gap-4">
        <div className="bg-accent-gradient p-2 rounded-lg text-bg-base shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-text-primary text-sm mb-1">Install KaryaFeed</h4>
          {isInstallable ? (
            <p className="text-xs text-text-secondary mb-3">
              Install aplikasi ini di layar utama Anda untuk akses lebih cepat dan pengalaman yang lebih baik.
            </p>
          ) : isIOS ? (
            <p className="text-xs text-text-secondary mb-3">
              Tap ikon <Share className="inline w-3 h-3 mx-1" /> di bawah lalu pilih <strong>Add to Home Screen</strong> untuk meng-install.
            </p>
          ) : null}
          
          {isInstallable && (
            <button 
              onClick={handleInstallClick}
              className="bg-accent-primary text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-accent-primary/90 transition-colors"
            >
              Install Sekarang
            </button>
          )}
        </div>
        <button 
          onClick={dismissPrompt}
          className="text-text-secondary hover:text-text-primary transition-colors p-1"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
