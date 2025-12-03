import { useEffect } from 'react';

// Escucha pulsaciones de teclado y delega la tecla al callback
const useKeyPress = (handler: (key: string, event: KeyboardEvent) => void) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => handler(event.key, event);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handler]);
};

export default useKeyPress;
