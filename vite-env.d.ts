/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_PICA_API_KEY: string
  readonly VITE_EMAIL_SERVICE_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_WEBHOOK_URL: string
  readonly VITE_WHATSAPP_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}