/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_PRICE_MONTHLY_SUBSCRIPTION: string;
  readonly VITE_PRICE_ONE_TIME_PURCHASE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 