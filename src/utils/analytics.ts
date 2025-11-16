interface GAItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity?: number;
}

/**
 * Inicializa Google Analytics 4
 * @param measurementId ID de medición de GA4 (formato: G-XXXXXXXXXX)
 */
export function initGA4(measurementId: string) {
  // Cargar script gtag.js
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Inicializar dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Función gtag
  if (!window.gtag) {
    window.gtag = function(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }

  // Configuración inicial
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // Control manual de page views
  });
}

/**
 * Registra una vista de página
 * @param path Ruta de la página
 */
export function trackPageView(path: string) {
  if (!window.gtag) {
    console.warn('Google Analytics no inicializado');
    return;
  }
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Registra un evento personalizado
 * @param name Nombre del evento
 * @param params Parámetros del evento
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!window.gtag) {
    console.warn('Google Analytics no inicializado');
    return;
  }
  
  window.gtag('event', name, params);
}

/**
 * Eventos comunes de e-commerce
 */
export const ecommerceEvents = {
  /**
   * Usuario ve un producto
   */
  viewItem: (productId: number, productName: string, price: number, category: string) => {
    trackEvent('view_item', {
      currency: 'EUR',
      value: price,
      items: [{
        item_id: productId.toString(),
        item_name: productName,
        item_category: category,
        price: price,
      }],
    });
  },

  /**
   * Usuario añade producto al carrito
   */
  addToCart: (productId: number, productName: string, price: number, quantity: number) => {
    trackEvent('add_to_cart', {
      currency: 'EUR',
      value: price * quantity,
      items: [{
        item_id: productId.toString(),
        item_name: productName,
        price: price,
        quantity: quantity,
      }],
    });
  },

  /**
   * Usuario inicia checkout
   */
  beginCheckout: (value: number, items: GAItem[]) => {
    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: value,
      items: items,
    });
  },

  /**
   * Compra completada
   */
  purchase: (transactionId: string, value: number, items: GAItem[]) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      currency: 'EUR',
      value: value,
      items: items,
    });
  },
};
