/**
 * Utilidades para manejo de encoding y prevención de mojibake
 * Propósito: Detectar, prevenir y corregir problemas de codificación de caracteres
 * Lógica: Normalización de texto, detección de patrones mojibake, corrección automática
 * Entradas: Strings con posible corrupción de encoding
 * Salidas: Strings normalizados y limpios
 * Dependencias: Ninguna (utilidades nativas)
 * Efectos secundarios: Logging de advertencias cuando se detecta mojibake
 */

/**
 * Mapa de correcciones comunes de mojibake español
 * Propósito: Convertir caracteres corruptos a su forma correcta
 * Lógica: Mapeo directo de secuencias mojibake a caracteres UTF-8 correctos
 */
const MOJIBAKE_MAP: Record<string, string> = {
  // Vocales con tilde minúsculas (formato hexadecimal para evitar problemas)
  '\u00C3\u00A1': 'á', // Ã¡ -> á
  '\u00C3\u00A9': 'é', // Ã© -> é
  '\u00C3\u00AD': 'í', // Ã­ -> í
  '\u00C3\u00B3': 'ó', // Ã³ -> ó
  '\u00C3\u00BA': 'ú', // Ãº -> ú
  
  // Vocales con tilde mayúsculas
  '\u00C3\u0081': 'Á', // Á corrupto -> Á
  '\u00C3\u0089': 'É', // É corrupto -> É
  '\u00C3\u008D': 'Í', // Í corrupto -> Í
  '\u00C3\u0093': 'Ó', // Ó corrupto -> Ó
  '\u00C3\u009A': 'Ú', // Ú corrupto -> Ú
  
  // Ñ
  '\u00C3\u00B1': 'ñ', // Ã± -> ñ
  '\u00C3\u0091': 'Ñ', // Ñ corrupto -> Ñ
  
  // Signos de puntuación español
  '\u00C2\u00BF': '¿', // Â¿ -> ¿
  '\u00C2\u00A1': '¡', // Â¡ -> ¡
  
  // Comillas y guiones (formato hexadecimal)
  '\u00E2\u0080\u009C': '"', // Comilla doble izquierda
  '\u00E2\u0080\u009D': '"', // Comilla doble derecha
  '\u00E2\u0080\u0098': "'", // Comilla simple izquierda
  '\u00E2\u0080\u0099': "'", // Comilla simple derecha
  '\u00E2\u0080\u0094': '—', // Em dash
  '\u00E2\u0080\u0093': '–', // En dash
  
  // Otros caracteres especiales
  '\u00C3\u00BC': 'ü',
  '\u00C3\u00B6': 'ö',
  '\u00C3\u00A4': 'ä',
  '\u00C3\u00AB': 'ë',
  '\u00C3\u00AF': 'ï',
  
  // Mayúsculas con diéresis
  '\u00C3\u009C': 'Ü',
  '\u00C3\u0096': 'Ö',
  '\u00C3\u0084': 'Ä',
  
  // Símbolos monetarios y otros
  '\u00E2\u0082\u00AC': '€', // Euro
  '\u00C2\u00B0': '°', // Grado
  '\u00C2\u00AE': '®', // Registered
  '\u00C2\u00A9': '©', // Copyright
  '\u00E2\u0084\u00A2': '™', // Trademark
  
  // Espacios especiales
  '\u00C2\u00A0': ' ', // Non-breaking space corrupto
};

/**
 * Normaliza texto con posible mojibake
 * Propósito: Corregir caracteres especiales corruptos automáticamente
 * Lógica: Aplica mapa de correcciones + normalización Unicode NFC
 * Entradas: text (string) - Texto potencialmente corrupto (ej: "Ã¡ngel")
 * Salidas: string - Texto corregido y normalizado (ej: "ángel")
 * Dependencias: MOJIBAKE_MAP (constante con mapeo de correcciones)
 * Efectos secundarios: Ninguno (función pura)
 * 
 * Ejemplo de uso:
 *   normalizeText("Â¿CÃ³mo estÃ¡s?") → "¿Cómo estás?"
 *   normalizeText("EspaÃ±a") → "España"
 * 
 * Casos especiales:
 *   - Si text es null/undefined, retorna el valor sin modificar
 *   - Si text no es string, retorna el valor sin modificar
 *   - Si no hay mojibake, solo aplica normalización Unicode estándar
 */
export const normalizeText = (text: string): string => {
  // VALIDACIÓN 1: Verificar que el input sea válido
  // Por qué: Evitar errores al intentar procesar null/undefined/números
  if (!text || typeof text !== 'string') return text;
  
  // VARIABLE: normalized guardará el texto durante el proceso de corrección
  let normalized = text;
  
  // PASO 1: Aplicar todas las correcciones del mapa de mojibake
  // Por qué: Convertir cada secuencia corrupta (ej: "Ã¡") a su forma correcta ("á")
  // Cómo: Iterar sobre cada entrada del mapa y reemplazar globalmente (flag 'g')
  Object.entries(MOJIBAKE_MAP).forEach(([wrong, correct]) => {
    // EXPLICACIÓN: Object.entries convierte { 'Ã¡': 'á' } en [['Ã¡', 'á']]
    // new RegExp(wrong, 'g') crea regex para buscar TODAS las ocurrencias
    // normalized.replace reemplaza todas las coincidencias encontradas
    normalized = normalized.replace(new RegExp(wrong, 'g'), correct);
  });
  
  // PASO 2: Normalización Unicode NFC
  // Por qué: Asegurar consistencia en la representación de caracteres
  // Qué es NFC: Canonical Composition - agrupa caracteres base + diacríticos
  // Ejemplo: "é" puede ser U+00E9 (precomposed) o U+0065+U+0301 (e + ´)
  //          NFC convierte ambos a la forma precomposed para consistencia
  return normalized.normalize('NFC');
};

/**
 * Detecta si un texto contiene mojibake
 * Propósito: Identificar texto corrupto antes de mostrarlo o guardarlo
 * Lógica: Busca patrones comunes de mojibake usando expresiones regulares
 * Entradas: text (string) - Texto a analizar (ej: "Hola Ã¡ngel")
 * Salidas: boolean - true si contiene mojibake, false si está limpio
 * Dependencias: Ninguna
 * Efectos secundarios: Ninguno (función pura)
 * 
 * Ejemplo de uso:
 *   hasMojibake("Hola mundo") → false (texto limpio)
 *   hasMojibake("Â¿CÃ³mo?") → true (contiene mojibake)
 *   hasMojibake("España") → false (caracteres correctos)
 * 
 * ¿Qué es mojibake?
 *   Es cuando caracteres especiales se corrompen por problemas de encoding.
 *   Ejemplo: "á" se ve como "Ã¡", "ñ" se ve como "Ã±", "¿" se ve como "Â¿"
 */
export const hasMojibake = (text: string): boolean => {
  // VALIDACIÓN: Verificar que el input sea válido
  // Por qué: null/undefined/números no pueden tener mojibake
  if (!text || typeof text !== 'string') return false;
  
  // PATRONES: Expresiones regulares que detectan secuencias mojibake
  // Por qué usar Unicode escapes (\u00C3): Evitar que estos mismos caracteres
  // se corrompan en este archivo fuente
  const mojibakePatterns = [
    // PATRÓN 1: Vocales con tilde y ñ corruptas
    // Detecta: Ã¡, Ã©, Ã­, Ã³, Ãº, Ã±, Ñ corrupto
    // Ejemplo: "Ã¡ngel" contiene Ã¡ (á corrupta)
    /\u00C3[\u00A1\u00A9\u00AD\u00B3\u00BA\u00B1\u0091]/g,
    
    // PATRÓN 2: Signos de puntuación corruptos
    // Detecta: Â¿, Â¡, Â°, Â®, Â©, espacios non-breaking corruptos
    // Ejemplo: "Â¿Hola?" contiene Â¿ (¿ corrupto)
    /\u00C2[\u00BF\u00A1\u00B0\u00AE\u00A9\u00A0]/g,
    
    // PATRÓN 3: Comillas y guiones corruptos
    // Detecta: "", '', —, – (comillas tipográficas y guiones em/en)
    // Ejemplo: "â€œtextoâ€" contiene comillas corruptas
    /\u00E2\u0080[\u009C\u009D\u0098\u0099\u0093\u0094]/g,
    
    // PATRÓN 4: Otros caracteres especiales corruptos
    // Detecta: ü, ö, ä, ë, ï y sus variantes mayúsculas
    // Ejemplo: "MÃ¼nchen" contiene ü corrupta
    /\u00C3[\u00BC\u00B6\u00A4\u00AB\u00AF\u009C\u0096\u0084]/g,
  ];
  
  // VERIFICACIÓN: Comprobar si ALGUNO de los patrones encuentra una coincidencia
  // Por qué usar .some(): Retorna true al primer match, más eficiente que verificar todos
  // Cómo funciona: pattern.test(text) retorna true si encuentra el patrón en el texto
  return mojibakePatterns.some(pattern => pattern.test(text));
};

/**
 * Valida y corrige texto antes de guardar en base de datos o localStorage
 * Propósito: Asegurar que no se persista texto con encoding corrupto
 * Lógica: 1) Detecta mojibake, 2) Corrige si encuentra problemas, 3) Normaliza
 * Entradas: text (string) - Texto a validar antes de guardar
 * Salidas: string - Texto limpio, corregido y normalizado, listo para almacenar
 * Dependencias: hasMojibake (detección), normalizeText (corrección)
 * Efectos secundarios: console.warn cuando detecta y corrige mojibake
 * 
 * Ejemplo de uso:
 *   const userInput = "Â¿CÃ³mo estÃ¡s?"; // Input corrupto del usuario
 *   const clean = sanitizeForStorage(userInput);
 *   // clean = "¿Cómo estás?" (corregido)
 *   database.save({ description: clean }); // Guardar versión limpia
 * 
 * Flujo de ejecución:
 *   1. Validar input
 *   2. Detectar mojibake con hasMojibake()
 *   3. Si tiene mojibake → Corregir con normalizeText() + log warning
 *   4. Si NO tiene mojibake → Solo normalizar Unicode
 *   5. Retornar texto limpio
 * 
 * ¿Por qué es importante?
 *   - Previene corrupción permanente en base de datos
 *   - Mejora experiencia de usuario (evita ver caracteres raros)
 *   - Facilita búsquedas (texto normalizado es más fácil de buscar)
 */
export const sanitizeForStorage = (text: string): string => {
  // VALIDACIÓN: Verificar que el input sea válido
  // Por qué: null/undefined no necesitan sanitización
  if (!text || typeof text !== 'string') return text;
  
  // DETECCIÓN: Verificar si el texto contiene mojibake
  if (hasMojibake(text)) {
    // Eliminado console.warn para cumplimiento ultra-estricto
    // CORRECCIÓN: Aplicar normalizeText para limpiar el mojibake
    return normalizeText(text);
  }
  
  // CASO NORMAL: Texto limpio, solo aplicar normalización Unicode estándar
  // Por qué: Incluso sin mojibake, normalizar asegura consistencia
  // Ejemplo: "café" con é precomposed vs e+combining acute
  return text.normalize('NFC');
};

/**
 * Sanitiza todos los campos de texto de un objeto recursivamente
 * Propósito: Limpiar objetos completos antes de guardar (ej: formularios, API responses)
 * Lógica: Recorre el objeto en profundidad y sanitiza cada string encontrado
 * Entradas: obj (T) - Objeto con posibles strings corruptos
 * Salidas: T - Objeto idéntico pero con todos los strings sanitizados
 * Dependencias: sanitizeForStorage (para sanitizar cada string)
 * Efectos secundarios: console.warn por cada string con mojibake detectado
 * 
 * Ejemplo de uso:
 *   const formData = {
 *     name: "Ã¡ngel",
 *     address: {
 *       city: "MÃ©xico",
 *       country: "EspaÃ±a"
 *     },
 *     tags: ["tÃ©", "cafÃ©"]
 *   };
 *   const clean = sanitizeObject(formData);
 *   // clean = {
 *   //   name: "ángel",
 *   //   address: { city: "México", country: "España" },
 *   //   tags: ["té", "café"]
 *   // }
 * 
 * Casos que maneja:
 *   - Strings directos: "Ã¡ngel" → "ángel"
 *   - Arrays de strings: ["tÃ©", "cafÃ©"] → ["té", "café"]
 *   - Objetos anidados: { user: { name: "Ã¡ngel" } } → recursivo
 *   - Arrays de objetos: [{ name: "Ã¡ngel" }, ...] → recursivo
 *   - Valores no-string: números, booleans, null → sin cambios
 * 
 * ¿Cuándo usar?
 *   - Antes de guardar formularios en base de datos
 *   - Al recibir datos de APIs externas
 *   - Antes de almacenar en localStorage
 *   - Al importar datos desde archivos CSV/JSON
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  // VALIDACIÓN: Verificar que el input sea un objeto válido
  // Por qué: null no es objeto, undefined no es objeto, primitivos no son objetos
  if (!obj || typeof obj !== 'object') return obj;
  
  // COPIA: Crear copia superficial del objeto original
  // Por qué: No mutar el objeto original (inmutabilidad)
  // Nota: Usamos shallow copy porque sanitizaremos recursivamente
  const sanitized: Record<string, unknown> = { ...obj };
  
  // ITERACIÓN: Recorrer cada propiedad del objeto
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    // CASO 1: El valor es un string → Sanitizarlo directamente
    if (typeof value === 'string') {
      sanitized[key] = sanitizeForStorage(value);
    } 
    // CASO 2: El valor es un array → Procesar cada elemento
    else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => {
        // Si el item es string → sanitizar
        if (typeof item === 'string') {
          return sanitizeForStorage(item);
        }
        // Si el item es objeto → sanitizar recursivamente
        else if (typeof item === 'object' && item !== null) {
          return sanitizeObject(item as Record<string, unknown>);
        }
        // Si es otro tipo (número, boolean, etc.) → dejar sin cambios
        else {
          return item;
        }
      });
    } 
    // CASO 3: El valor es un objeto → Sanitizar recursivamente
    else if (typeof value === 'object' && value !== null) {
      // RECURSIÓN: Llamar a sanitizeObject en el objeto anidado
      // Por qué: Objetos pueden tener N niveles de profundidad
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    }
    // CASO 4: El valor es otro tipo (número, boolean, null, etc.) → No hacer nada
    // Por qué: Solo los strings pueden tener mojibake
  });
  
  // RETORNO: Devolver objeto sanitizado con el tipo original
  // Por qué el cast: TypeScript necesita saber que mantenemos el tipo T
  return sanitized as T;
};

/**
 * Hook personalizado para sanitizar formularios
 * Propósito: Integrar sanitización en React Hook Form
 * Lógica: Proporciona función de sanitización para usar en onSubmit
 * Entradas: Ninguna
 * Salidas: Objeto con funciones de sanitización
 * Dependencias: sanitizeObject, sanitizeForStorage, hasMojibake
 * Efectos secundarios: Ninguno
 */
export const useEncodingSanitizer = () => {
  return {
    /**
     * Sanitiza datos de formulario completos
     */
    sanitizeFormData: <T extends Record<string, unknown>>(formData: T): T => {
      return sanitizeObject(formData);
    },
    
    /**
     * Sanitiza un campo individual
     */
    sanitizeField: (value: string): string => {
      return sanitizeForStorage(value);
    },
    
    /**
     * Valida si un campo tiene mojibake
     */
    validateField: (value: string): { valid: boolean; message?: string } => {
      if (hasMojibake(value)) {
        return {
          valid: false,
          message: 'El texto contiene caracteres corruptos. Por favor, revisa el contenido.',
        };
      }
      return { valid: true };
    },
  };
};

/**
 * Detecta el encoding de un archivo
 * Propósito: Identificar si un archivo tiene BOM o encoding incorrecto
 * Lógica: Busca marcadores de BOM al inicio del contenido
 * Entradas: content (string) - Contenido del archivo
 * Salidas: Objeto con información de encoding
 * Dependencias: Ninguna
 * Efectos secundarios: Ninguno
 */
export const detectEncoding = (content: string): {
  hasBOM: boolean;
  encoding: 'UTF-8' | 'UTF-16' | 'unknown';
  needsFix: boolean;
} => {
  const bytes = new TextEncoder().encode(content);
  
  // Detectar BOM UTF-8 (EF BB BF)
  const hasUTF8BOM = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  
  // Detectar BOM UTF-16 (FF FE o FE FF)
  const hasUTF16BOM = 
    (bytes[0] === 0xff && bytes[1] === 0xfe) ||
    (bytes[0] === 0xfe && bytes[1] === 0xff);
  
  return {
    hasBOM: hasUTF8BOM || hasUTF16BOM,
    encoding: hasUTF8BOM ? 'UTF-8' : hasUTF16BOM ? 'UTF-16' : 'unknown',
    needsFix: hasUTF8BOM || hasUTF16BOM || hasMojibake(content),
  };
};

/**
 * Genera un reporte de problemas de encoding en un texto
 * Propósito: Diagnosticar problemas de encoding para debugging
 * Lógica: Identifica todos los caracteres problemáticos y su posición
 * Entradas: text (string) - Texto a analizar
 * Salidas: Array de problemas encontrados
 * Dependencias: hasMojibake
 * Efectos secundarios: Ninguno
 */
export const analyzeEncodingIssues = (
  text: string
): Array<{ position: number; char: string; suggestion: string }> => {
  if (!hasMojibake(text)) return [];
  
  const issues: Array<{ position: number; char: string; suggestion: string }> = [];
  
  Object.entries(MOJIBAKE_MAP).forEach(([wrong, correct]) => {
    let index = 0;
    while ((index = text.indexOf(wrong, index)) !== -1) {
      issues.push({
        position: index,
        char: wrong,
        suggestion: correct,
      });
      index += wrong.length;
    }
  });
  
  return issues.sort((a, b) => a.position - b.position);
};

/**
 * Valida que un string sea UTF-8 válido
 * Propósito: Verificar integridad de encoding antes de operaciones
 * Lógica: Intenta codificar y decodificar para detectar corrupción
 * Entradas: text (string) - Texto a validar
 * Salidas: boolean - true si es UTF-8 válido
 * Dependencias: Ninguna
 * Efectos secundarios: Ninguno
 */
export const isValidUTF8 = (text: string): boolean => {
  try {
    const encoded = new TextEncoder().encode(text);
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
    return decoded === text;
  } catch {
    return false;
  }
};
