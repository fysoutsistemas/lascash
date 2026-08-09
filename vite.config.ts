import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    //allowedHosts: ['larcash', '.com.br'],
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      //Configuração do proxy em: 
      // https://medium.com/@tanitoluwaadenuga/if-youve-ever-fought-a-cors-error-read-this-eb4326c3fc17
      "/api": {
        //target: "https://liked-emma-ministries-potentially.trycloudflare.com ",
        target: "http://192.168.100.55:9070",
        //target: "https://larcash-api.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({ 
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: 'index.html'
      },
      manifest: {
        name: "LaRca$h",
        short_name: "LaRca$h",
        description: "Gestor de orçamento familiar",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            "src": "/web-app-manifest-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/web-app-manifest-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
          }
        ]        
      },
      workbox: {
        globPatterns: ["**/*.{**/*.{js,css,html,ico,png,svg,woff2}}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) => request.method === 'GET' && url.pathname.startsWith('/api/'),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    tailwindcss(),
    //Documentação em: https://www.npmjs.com/package/unplugin-vue-components
    Components({
      dirs: [ //Configuracao dos diretorios onde ficam os componentes .vue para import automatico
        'src/components',
        'src/views',
        'src/layouts'
      ],
      resolvers: [
        PrimeVueResolver(),        
      ]
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@views': resolve(__dirname, 'src/views'),
      '@composables': resolve(__dirname, 'src/composables')      
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'ui-vendor': ['primevue']
        }
      }
    }
  }
})