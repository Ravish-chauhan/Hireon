/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_TIMEOUT: string
    readonly VITE_NEWS_API_KEY: string
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly MODE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
