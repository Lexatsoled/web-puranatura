export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'PuraNatura',
    description:
      import.meta.env.VITE_APP_DESCRIPTION ||
      'Terapias Naturales y Productos de Bienestar',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },
  features: {
    enableBlog: import.meta.env.VITE_ENABLE_BLOG === 'true',
    enableShop: import.meta.env.VITE_ENABLE_SHOP === 'true',
    enableTestimonials: import.meta.env.VITE_ENABLE_TESTIMONIALS === 'true',
  },
  api: {
    url: import.meta.env.VITE_API_URL,
    stripe: {
      publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    },
  },
  analytics: {
    gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
  },
} as const;

// Tipos de configuración
export type Config = typeof config;
export type AppConfig = Config['app'];
export type FeaturesConfig = Config['features'];
export type ApiConfig = Config['api'];
