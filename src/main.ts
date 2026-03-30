import 'reflect-metadata';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { Money3Component } from 'v-money3';

// PrimeVue
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Localização
import { ptBR } from './locales/pt-br';

// Estilos
import 'primeicons/primeicons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';

// Theme composable
import { useTheme } from './composables/useTheme';

const app = createApp(App);

// Router
app.use(router);

// Inicializar tema
const { temaAtual } = useTheme();

// PrimeVue com tema dinâmico e localização
app.use(PrimeVue, {
  theme: {
    preset: temaAtual.value,
    options: {
      prefix: 'p',
      darkModeSelector: false,
      cssLayer: {
        name: 'primevue',
        order: 'app-styles, primevue-styles, another-css-library'
      }
    }
  },
  locale: ptBR
})
.use(ConfirmationService)
.use(ToastService)
.use(createPinia())
.component('money3', Money3Component);

app.mount('#app');