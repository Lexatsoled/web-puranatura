import { useState } from 'react';

/**
 * Hook personalizado para manejar localStorage con React
 * @param key - Clave del localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [value, setValue] - Estado y función para actualizarlo
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar nuestro valor
  // Pasar la función de estado inicial a useState para que la lógica se ejecute una sola vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Obtener del localStorage local por clave
      const item = window.localStorage.getItem(key);
      // Analizar JSON almacenado o si ninguno devuelve initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error también devolver initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Devolver una versión envuelta de la función setter de useState que...
  // ... persiste el nuevo valor en localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Guardar estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Una implementación más avanzada manejaría el caso de error
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
