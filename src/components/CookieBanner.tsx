import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      // Show if no decision has been made
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900 border-t border-gray-800 shadow-lg md:p-6 animate-slide-up">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-2">
            Respetamos tu privacidad
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia
            de usuario, analizar el tráfico del sitio y personalizar el
            contenido. Al hacer clic en "Aceptar", aceptas el uso de las cookies
            descritas en nuestra Política de Privacidad.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleDecline}
            className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 max-w-full justify-center"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 max-w-full justify-center"
          >
            Aceptar todas
          </button>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white md:hidden"
          aria-label="Cerrar banner de cookies"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
