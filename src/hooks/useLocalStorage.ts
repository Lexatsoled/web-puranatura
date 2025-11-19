import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar nuestro valor
  // Pasa una función inicial al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Obtener del localStorage por key
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o si no existe devolver el initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error devolver el initialValue
      console.error(`Error al recuperar ${key} del localStorage:`, error);
      return initialValue;
    }
  });

  // Retorna una versión envuelta de la función useState setter que persiste
  // el nuevo valor en localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar el estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
