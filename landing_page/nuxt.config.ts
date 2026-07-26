const appUrl = process.env.NUXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5173')

if (!appUrl) {
  throw new Error('NUXT_PUBLIC_APP_URL must be defined for a production build.')
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      appUrl
    }
  }
})
