export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  vue: {
    compilerOptions: {

    }
  },
  pinia: {
    plugins: ['pinia-plugin-persistedsdate'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api',
    },
  },
})