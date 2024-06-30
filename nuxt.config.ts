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
      id: '/',
      start_url: '/',
      display: 'standalone',
      background_color: '#230b9d',
      theme_color: '#230b9d',
      icons: [
        {
          src: '/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/apple-touch-icon-60x60.png',
          sizes: '60x60',
          type: 'image/png',
        },
        {
          src: '/icons/apple-touch-icon-76x76.png',
          sizes: '76x76',
          type: 'image/png',
        },
        {
          src: '/icons/apple-touch-icon-120x120.png',
          sizes: '120x120',
          type: 'image/png',
        },
        {
          src: '/icons/apple-touch-icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: '/icons/apple-touch-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: '/icons/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: '/icons/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: '/icons/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: '/icons/msapplication-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/icons/mstile-150x150.png',
          sizes: '150x150',
          type: 'image/png',
        },
        {
          src: '/icons/safari-pinned-tab.svg',
          sizes: '32x32',
          type: 'image/svg',
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
