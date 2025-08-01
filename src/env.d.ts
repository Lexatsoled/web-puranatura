/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_ENABLE_BLOG: string;
  readonly VITE_ENABLE_SHOP: string;
  readonly VITE_ENABLE_TESTIMONIALS: string;
  readonly VITE_GA_TRACKING_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
