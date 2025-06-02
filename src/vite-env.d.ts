/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_URL: string
  readonly VITE_TURSO_DATABASE_URL: string
  readonly VITE_TURSO_AUTH_TOKEN: string
  readonly VITE_LOCAL_DB_PATH: string
  readonly VITE_DEBUG: string
  readonly DB_TYPE: string
  readonly DB_PATH: string
  readonly DEFAULT_GST_RATE: string
  readonly DEFAULT_CGST_RATE: string
  readonly DEFAULT_SGST_RATE: string
  readonly DEFAULT_IGST_RATE: string
  readonly RECEIPT_WIDTH: string
  readonly BUSINESS_NAME: string
  readonly BUSINESS_ADDRESS: string
  readonly BUSINESS_CITY: string
  readonly BUSINESS_STATE: string
  readonly BUSINESS_PINCODE: string
  readonly BUSINESS_PHONE: string
  readonly BUSINESS_EMAIL: string
  readonly BUSINESS_GSTIN: string
  readonly AUTO_BACKUP: string
  readonly BACKUP_FREQUENCY: string
  readonly BACKUP_PATH: string
  readonly ENABLE_OFFLINE_MODE: string
  readonly ENABLE_MULTI_LANGUAGE: string
  readonly ENABLE_LOYALTY_PROGRAM: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
