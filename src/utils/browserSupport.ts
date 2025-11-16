/**
 * Utilidades para detección de soporte del navegador y polyfills.
 * Propósito: Detectar características del navegador y cargar polyfills cuando sea necesario.
 * Lógica: Proporciona funciones de detección y carga automática de polyfills para compatibilidad.
 * Entradas: Ninguna (funciones de detección).
 * Salidas: Objetos con información de soporte del navegador.
 * Dependencias: APIs del navegador (window, navigator, document).
 * Efectos secundarios: Carga scripts externos para polyfills.
 */

/**
 * Interfaz que define el soporte de características del navegador.
 * Propósito: Estructurar la información de soporte de diferentes APIs y características.
 * Lógica: Lista todas las características detectables con valores booleanos.
 * Entradas: Ninguna (es una interfaz de tipos).
 * Salidas: Ninguna (es una interfaz de tipos).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export interface BrowserSupport {
  webp: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  webAnimations: boolean;
  cssGrid: boolean;
  cssCustomProperties: boolean;
  fetch: boolean;
  promises: boolean;
  asyncAwait: boolean;
  es6Modules: boolean;
  serviceWorker: boolean;
  webGL: boolean;
  touchEvents: boolean;
  passiveEvents: boolean;
}

/**
 * Funciones de detección de características del navegador.
 * Propósito: Detectar soporte de diferentes APIs y características del navegador.
 * Lógica: Cada función prueba la existencia o funcionalidad de una característica específica.
 * Entradas: Ninguna.
 * Salidas: Boolean o Promise<boolean> indicando soporte.
 * Dependencias: APIs del navegador.
 * Efectos secundarios: Crean elementos temporales en el DOM para pruebas.
 */

/**
 * Detecta soporte para formato de imagen WebP.
 * Propósito: Verificar si el navegador puede renderizar imágenes WebP.
 * Lógica: Crea una imagen con datos WebP y verifica si se carga correctamente.
 * Entradas: Ninguna.
 * Salidas: Promise<boolean> con resultado de la detección.
 * Dependencias: Image API.
 * Efectos secundarios: Crea un elemento Image temporal.
 */
const detectWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Detecta soporte para IntersectionObserver API.
 * Propósito: Verificar si el navegador soporta observación de intersecciones de elementos.
 * Lógica: Verifica existencia de la API y sus propiedades requeridas.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: window.IntersectionObserver.
 * Efectos secundarios: Ninguno.
 */
const detectIntersectionObserver = (): boolean => {
  return (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  );
};

/**
 * Detecta soporte para ResizeObserver API.
 * Propósito: Verificar si el navegador puede observar cambios de tamaño de elementos.
 * Lógica: Verifica existencia de ResizeObserver en window.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: window.ResizeObserver.
 * Efectos secundarios: Ninguno.
 */
const detectResizeObserver = (): boolean => {
  return 'ResizeObserver' in window;
};

/**
 * Detecta soporte para Web Animations API.
 * Propósito: Verificar si el navegador soporta animaciones web nativas.
 * Lógica: Verifica método animate en elementos DOM.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: document.createElement.
 * Efectos secundarios: Crea un elemento div temporal.
 */
const detectWebAnimations = (): boolean => {
  return 'animate' in document.createElement('div');
};

/**
 * Detecta soporte para CSS Grid.
 * Propósito: Verificar si el navegador soporta layout CSS Grid.
 * Lógica: Verifica propiedad grid en estilos de elemento.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: document.createElement.
 * Efectos secundarios: Crea un elemento div temporal.
 */
const detectCSSGrid = (): boolean => {
  const element = document.createElement('div');
  return typeof element.style.grid === 'string';
};

/**
 * Detecta soporte para CSS Custom Properties (variables CSS).
 * Propósito: Verificar si el navegador soporta variables CSS.
 * Lógica: Intenta setear y obtener una propiedad CSS personalizada.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: document.createElement.
 * Efectos secundarios: Crea un elemento div temporal.
 */
const detectCSSCustomProperties = (): boolean => {
  const element = document.createElement('div');
  element.style.setProperty('--test', 'value');
  return element.style.getPropertyValue('--test') === 'value';
};

/**
 * Detecta soporte para Fetch API.
 * Propósito: Verificar si el navegador soporta la API Fetch para peticiones HTTP.
 * Lógica: Verifica existencia de fetch en window.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: window.fetch.
 * Efectos secundarios: Ninguno.
 */
const detectFetch = (): boolean => {
  return 'fetch' in window;
};

/**
 * Detecta soporte para Promises.
 * Propósito: Verificar si el navegador soporta el objeto Promise.
 * Lógica: Verifica existencia de Promise en window.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: window.Promise.
 * Efectos secundarios: Ninguno.
 */
const detectPromises = (): boolean => {
  return 'Promise' in window;
};

/**
 * Detecta soporte para async/await.
 * Propósito: Verificar si el navegador soporta sintaxis async/await.
 * Lógica: Intenta crear una función async usando Function constructor.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: Function constructor.
 * Efectos secundarios: Ninguno.
 */
const detectAsyncAwait = (): boolean => {
  try {
    new Function('async () => {}')();
    return true;
  } catch {
    return false;
  }
};

/**
 * Detecta soporte para ES6 Modules.
 * Propósito: Verificar si el navegador soporta módulos ES6.
 * Lógica: Verifica atributo noModule en elementos script.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: document.createElement.
 * Efectos secundarios: Crea un elemento script temporal.
 */
const detectES6Modules = (): boolean => {
  return 'noModule' in document.createElement('script');
};

/**
 * Detecta soporte para Service Workers.
 * Propósito: Verificar si el navegador soporta service workers.
 * Lógica: Verifica existencia de serviceWorker en navigator.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: navigator.serviceWorker.
 * Efectos secundarios: Ninguno.
 */
const detectServiceWorker = (): boolean => {
  return 'serviceWorker' in navigator;
};

/**
 * Detecta soporte para WebGL.
 * Propósito: Verificar si el navegador soporta renderizado WebGL.
 * Lógica: Intenta crear un contexto WebGL en un canvas.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: document.createElement, WebGLRenderingContext.
 * Efectos secundarios: Crea un elemento canvas temporal.
 */
const detectWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

/**
 * Detecta soporte para eventos táctiles.
 * Propósito: Verificar si el dispositivo soporta eventos de toque.
 * Lógica: Verifica existencia de ontouchstart en window.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: window.ontouchstart.
 * Efectos secundarios: Ninguno.
 */
const detectTouchEvents = (): boolean => {
  return 'ontouchstart' in window;
};

/**
 * Detecta soporte para eventos pasivos.
 * Propósito: Verificar si el navegador soporta la opción passive en event listeners.
 * Lógica: Intenta definir una propiedad passive y capturar el getter.
 * Entradas: Ninguna.
 * Salidas: boolean indicando soporte.
 * Dependencias: window.addEventListener, Object.defineProperty.
 * Efectos secundarios: Agrega y remueve un event listener de prueba.
 */
const detectPassiveEvents = (): boolean => {
  let passiveSupported = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        passiveSupported = true;
        return false;
      },
    });
    const noop = () => {};
    window.addEventListener('test', noop, options as AddEventListenerOptions);
    window.removeEventListener('test', noop, options as AddEventListenerOptions);
  } catch {
    // ignore
  }
  return passiveSupported;
};

/**
 * Funciones para cargar polyfills cuando las características no están soportadas.
 * Propósito: Cargar automáticamente polyfills desde CDN para características faltantes.
 * Lógica: Crea elementos script dinámicamente y espera su carga.
 * Entradas: Ninguna.
 * Salidas: Promise<void> que se resuelve cuando el polyfill se carga.
 * Dependencias: document.createElement, polyfill.io CDN.
 * Efectos secundarios: Agrega scripts al head del documento.
 */

/**
 * Carga polyfill para IntersectionObserver.
 * Propósito: Proporcionar soporte para IntersectionObserver en navegadores antiguos.
 * Lógica: Carga script desde polyfill.io con feature específico.
 * Entradas: Ninguna.
 * Salidas: Promise que se resuelve al cargar el script.
 * Dependencias: polyfill.io, document.head.
 * Efectos secundarios: Agrega script al DOM.
 */
const loadIntersectionObserverPolyfill = (): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src =
      'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Continue even if polyfill fails
    document.head.appendChild(script);
  });
};

/**
 * Carga polyfill para ResizeObserver.
 * Propósito: Proporcionar soporte para ResizeObserver en navegadores antiguos.
 * Lógica: Carga script desde polyfill.io con feature específico.
 * Entradas: Ninguna.
 * Salidas: Promise que se resuelve al cargar el script.
 * Dependencias: polyfill.io, document.head.
 * Efectos secundarios: Agrega script al DOM.
 */
const loadResizeObserverPolyfill = (): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src =
      'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
};

/**
 * Carga polyfill para Fetch API.
 * Propósito: Proporcionar soporte para Fetch API en navegadores antiguos.
 * Lógica: Carga script desde polyfill.io con feature específico.
 * Entradas: Ninguna.
 * Salidas: Promise que se resuelve al cargar el script.
 * Dependencias: polyfill.io, document.head.
 * Efectos secundarios: Agrega script al DOM.
 */
const loadFetchPolyfill = (): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=fetch';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
};

/**
 * Carga polyfill para Promises.
 * Propósito: Proporcionar soporte para Promise API en navegadores muy antiguos.
 * Lógica: Carga script desde polyfill.io con feature específico.
 * Entradas: Ninguna.
 * Salidas: Promise que se resuelve al cargar el script.
 * Dependencias: polyfill.io, document.head.
 * Efectos secundarios: Agrega script al DOM.
 */
const loadPromisePolyfill = (): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=Promise';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
};

/**
 * Detección principal de soporte del navegador y carga de polyfills.
 * Propósito: Función principal que detecta todas las características del navegador.
 * Lógica: Ejecuta todas las funciones de detección y consolida resultados.
 * Entradas: Ninguna.
 * Salidas: Promise<BrowserSupport> con objeto completo de soporte.
 * Dependencias: Todas las funciones detect*.
 * Efectos secundarios: Ejecuta detecciones que pueden crear elementos DOM temporales.
 */

/**
 * Detecta el soporte completo del navegador para todas las características.
 * Propósito: Proporcionar un panorama completo del soporte del navegador actual.
 * Lógica: Ejecuta detección de WebP de forma asíncrona y el resto de forma síncrona.
 * Entradas: Ninguna.
 * Salidas: Promise que resuelve a BrowserSupport con todos los resultados.
 * Dependencias: detectWebP y todas las demás funciones de detección.
 * Efectos secundarios: Crea elementos temporales en el DOM para algunas detecciones.
 */
export const detectBrowserSupport = async (): Promise<BrowserSupport> => {
  const [webp] = await Promise.all([detectWebP()]);

  const support: BrowserSupport = {
    webp,
    intersectionObserver: detectIntersectionObserver(),
    resizeObserver: detectResizeObserver(),
    webAnimations: detectWebAnimations(),
    cssGrid: detectCSSGrid(),
    cssCustomProperties: detectCSSCustomProperties(),
    fetch: detectFetch(),
    promises: detectPromises(),
    asyncAwait: detectAsyncAwait(),
    es6Modules: detectES6Modules(),
    serviceWorker: detectServiceWorker(),
    webGL: detectWebGL(),
    touchEvents: detectTouchEvents(),
    passiveEvents: detectPassiveEvents(),
  };

  return support;
};

/**
 * Carga los polyfills necesarios para características no soportadas.
 * Propósito: Cargar automáticamente polyfills para mejorar compatibilidad.
 * Lógica: Evalúa qué características faltan y carga los polyfills correspondientes.
 * Entradas: support (BrowserSupport) - resultado de detectBrowserSupport.
 * Salidas: Promise que se resuelve cuando todos los polyfills se cargan.
 * Dependencias: Funciones load*Polyfill.
 * Efectos secundarios: Agrega scripts externos al head del documento.
 */
export const loadPolyfills = async (support: BrowserSupport): Promise<void> => {
  const polyfillPromises: Promise<void>[] = [];

  if (!support.intersectionObserver) {
    polyfillPromises.push(loadIntersectionObserverPolyfill());
  }

  if (!support.resizeObserver) {
    polyfillPromises.push(loadResizeObserverPolyfill());
  }

  if (!support.fetch) {
    polyfillPromises.push(loadFetchPolyfill());
  }

  if (!support.promises) {
    polyfillPromises.push(loadPromisePolyfill());
  }

  await Promise.all(polyfillPromises);
};

/**
 * Obtiene información del user agent para debugging.
 * Propósito: Proporcionar información detallada del navegador para diagnóstico.
 * Lógica: Parsea el user agent string y extrae información del navegador y plataforma.
 * Entradas: Ninguna.
 * Salidas: Objeto con información completa del navegador y plataforma.
 * Dependencias: navigator.userAgent, navigator.platform, etc.
 * Efectos secundarios: Ninguno.
 */
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  const browser = {
    isChrome: /Chrome/.test(ua) && !/Edg/.test(ua),
    isFirefox: /Firefox/.test(ua),
    isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
    isEdge: /Edg/.test(ua),
    isIE: /MSIE|Trident/.test(ua),
    isMobile: /Mobile/.test(ua),
    version:
      ua.match(/(Chrome|Firefox|Safari|Edge|MSIE|Trident)\/(\d+)/)?.[2] ||
      'unknown',
  };

  return {
    userAgent: ua,
    browser,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
  };
};

/**
 * Detecta formatos de imagen soportados para fallbacks.
 * Propósito: Determinar qué formatos de imagen puede renderizar el navegador.
 * Lógica: Prueba cada formato creando una imagen con datos de prueba.
 * Entradas: Ninguna.
 * Salidas: Promise<string[]> con array de formatos soportados.
 * Dependencias: Image API, Promise.
 * Efectos secundarios: Crea elementos Image temporales.
 */
export const getSupportedImageFormats = async (): Promise<string[]> => {
  const formats = ['webp', 'avif', 'jpg', 'png'];
  const supported: string[] = [];

  for (const format of formats) {
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = `data:image/${format};base64,test`;
      });
      supported.push(format);
    } catch {
      // Format not supported
    }
  }

  return supported;
};

/**
 * Detecta soporte de características CSS para fallbacks.
 * Propósito: Proporcionar información sobre soporte CSS para aplicar fallbacks.
 * Lógica: Verifica existencia de propiedades CSS en elementos de prueba.
 * Entradas: Ninguna.
 * Salidas: Objeto con booleanos indicando soporte de cada característica CSS.
 * Dependencias: document.createElement, CSS.supports.
 * Efectos secundarios: Crea un elemento div temporal.
 */
export const getCSSSupport = () => {
  const element = document.createElement('div');
  const style = element.style;

  return {
    flexbox: 'flex' in style || 'msFlex' in style,
    grid: 'grid' in style,
    transform: 'transform' in style,
    transition: 'transition' in style,
    animation: 'animation' in style,
    backdropFilter:
      'backdropFilter' in style || 'webkitBackdropFilter' in style,
    customProperties: CSS && CSS.supports('color', 'var(--test)'),
  };
};
