import { usePerfilStore } from '@/composables/usePerfilStore';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import ConfigDeContaView from '@/views/ConfigDeContaView.vue';
import DespesaView from '@/views/DespesasView.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import NovaContaView from '@/views/NovaContaView.vue';
import GerenciarOrcamentoView from '@/views/GerenciarOrcamentoView.vue';

const perfilStore = usePerfilStore();

const { isTokenValido } = perfilStore;

const routes: RouteRecordRaw[] = [

  {
    path: '/',
    component: HomeView,
    meta: {
      titulo: 'Home',
      authentication: {
        required: true
      }
    }
  },

  {
    path: '/despesas',
    component: DespesaView,
    meta: {
      titulo: 'Despesas',
      authentication: {
        required: true
      }
    }
  },

  {
    path: '/orcamento/:modo',    
    name: 'orcamento',
    component: GerenciarOrcamentoView,    
    props: true,
    meta: {
      titulo: 'Orçamento',
      authentication: {
        required: true
      }
    }
  },

  {
    path: '/config-conta',
    component: ConfigDeContaView,
    meta: {
      titulo: 'Configuração da Conta',
      authentication: {
        required: true
      }
    }
  },

  {
    path: '/login',
    component: LoginView,
    meta: {
      titulo: 'Login',
      authentication: {
        required: false
      }
    }
  },

  {
    path: '/nova-conta',
    component: NovaContaView,
    meta: {
      titulo: 'Nova Conta',
      authentication: {
        required: false
      }
    }
  },  
  
  {
    path: '/404',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      titulo: 'Página Não Encontrada',
      authentication: {
        required: false
      }
    }
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'catch-all',
    component: NotFoundView,
    meta: {
      authentication: {
        required: true
      }
    }
  }  

];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
});

const ROTAS_PUBLICAS: string[] = ['/login', '/nova-conta'];

const isRotaEncontradaPara = (to: RouteLocationNormalized) => {
  return to.matched.length > 0 && to.matched[0].name !== 'catch-all';
};

const isRotaPublica = (to: RouteLocationNormalized): boolean => {
  
  const path = to.path.toLowerCase();

  const isPublicPath = ROTAS_PUBLICAS.some(route => {
    return path === route || path === route + '/' || path.startsWith(route + '/');
  });

  const hasPublicMeta = to.meta?.authentication?.required === false;

  return isPublicPath || hasPublicMeta;

};

router.beforeEach(async (to, _from, next) => {

  try {

    if (isRotaPublica(to)) {

      const path = to.path.toLowerCase();
      
      if (path === '/nova-conta'){
        if (isTokenValido()){
          return next({ path: '/' });    
        }
      }

      return next();

    }

    if (isRotaEncontradaPara(to)){

      if (!isTokenValido()) {
        return next({ path: '/login' });
      }  

    }

    return next();

  } catch(error) {
    return next({ path: '/login' });
  }

});

router.beforeEach((to) => {

  if (to.meta.titulo) {
    document.title = `${to.meta.titulo} - LarCa$h`;
  }

});

export default router;