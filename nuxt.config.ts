// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/library-2.0/',
  },
  devtools: { enabled: true },
  ssr: false, // Keep this as false if you don't need server-side rendering
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  css: ['./assets/main.less'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Library 2.0',
      short_name: 'Library 2.0',
      lang: 'pl',
      start_url: '/', // Ensure this matches your app's base path
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4DBA87',
      icons: [
        {
          src: '/icon.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg}'], // Include other file types if needed
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'start-url',
          },
        },
        {
          urlPattern: /\/.*/, // Cache all other routes
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            networkTimeoutSeconds: 10,
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
})
