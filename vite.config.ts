import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
  server: {
    allowedHosts: ['larcash', '.com.br'],
    proxy: {
      //Configuração do proxy em: 
      // https://medium.com/@tanitoluwaadenuga/if-youve-ever-fought-a-cors-error-read-this-eb4326c3fc17
      "/api": {
        target: "http://localhost:9070",
        //target: "https://larcash-api.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    vue(),
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