import { useEffect, useState } from 'react';
// import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWAUpdatePrompt - Component para notificar al usuario sobre actualizaciones de la PWA
 *
 * Características:
 * - Detecta automáticamente nuevas versiones
 * - Muestra toast notification elegante
 * - Permite al usuario actualizar manualmente
 * - Se auto-oculta después de la actualización
 *
 * Estrategia: autoUpdate con skipWaiting
 */
export const PWAUpdatePrompt = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  // Mock PWA update functionality - replace with actual useRegisterSW when PWA is properly configured
  const updateServiceWorker = async (reload?: boolean) => {
    if (reload) {
      window.location.reload();
    }
  };

  // Simulate PWA update detection
  useEffect(() => {
    const checkForUpdates = () => {
      // Mock update check - in real implementation this would be handled by useRegisterSW
    };

    checkForUpdates();
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    setShowUpdatePrompt(false);
    await updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    setNeedRefresh(false);
  };

  // Auto-hide after 30 seconds if user doesn't interact
  useEffect(() => {
    if (showUpdatePrompt) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [showUpdatePrompt]);

  if (!showUpdatePrompt && !needRefresh) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 animate-slide-up"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-white rounded-lg shadow-2xl border-2 border-green-500 max-w-md p-4 flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Nueva versión disponible
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Hay una actualización de Pureza Naturalis. Actualiza para obtener
            las últimas mejoras.
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Actualizar ahora
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Más tarde
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
          aria-label="Cerrar notificación"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * PWAInstallPrompt - Component para promover la instalación de la PWA
 *
 * Detecta si la app puede ser instalada y muestra un banner discreto
 * Solo aparece en dispositivos que soportan instalación PWA
 */
export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent default browser install prompt
      e.preventDefault();

      // Store the event for later use
      setDeferredPrompt(e as unknown as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    await deferredPrompt.userChoice;

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);

    // Remember user dismissed (don't show again for 7 days)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (Date.now() - dismissedTime < sevenDays) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  if (!showInstallPrompt) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-2xl max-w-md p-4 flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">
            Instala Pureza Naturalis
          </h3>
          <p className="text-xs opacity-90">
            Acceso rápido desde tu pantalla de inicio
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 bg-white text-green-600 text-xs font-medium rounded hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
          >
            Instalar
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-white text-xs font-medium rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for animations (add to index.css or global styles)
const styles = `
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-down {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
`;

// Inject styles (will be processed by bundler)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
