import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal spanish translations used by component tests. Add keys as needed.
const resources = {
  es: {
    translation: {
      'products.inStock': 'En stock',
      'products.outOfStock': 'Agotado',
      'products.addToCart': 'Añadir',
      'products.addedToCart': 'Añadido al carrito',
      // Common UI labels used in header/actions tests
      'common.cart': 'Carrito',
      'common.search': 'Buscar',
      'common.menu': 'Menú',
  'nav.home': 'Inicio',
  'nav.shop': 'Tienda',
  'nav.products': 'Tienda',
  'nav.about': 'Sobre nosotros',
  'nav.services': 'Servicios',
  'nav.blog': 'Blog',
  'nav.synergisticSystems': 'Sistemas',
  'nav.testimonials': 'Testimonios',
  'nav.contact': 'Contacto',
  'nav.cart': 'Carrito',
  'common.cancel': 'Cancelar',
      'wishlist.label': 'Lista de deseos',
      'cart.inCart': '{{count}} en carrito',
      // add other frequently used keys here if tests expect them
    },
  },
};

// Initialize a lightweight i18n instance for tests only
i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false, // not needed for tests
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
