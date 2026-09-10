import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from 'vue-router';

export const useNavigationStore = defineStore('menu-selecionado', () => {  

  interface ItemDeMenu {
    icone: string;
    label: string;
    rota: string;
    isAtivo: boolean;
    isVisivel: boolean;
  }

  const router = useRouter();

  const items = ref<ItemDeMenu[]>([
    { 
      icone: 'pi-home', 
      label: 'INÍCIO',  
      rota: '/', 
      isAtivo: false, 
      isVisivel: true 
    },
    { 
      icone: 'pi-shopping-cart', 
      label: 'COMPRAS',  
      rota: '/painel-compras', 
      isAtivo: false, 
      isVisivel: true 
    },
    { 
      icone: 'pi-receipt', 
      label: 'DESPESAS',  
      rota: '/despesas', 
      isAtivo: false, 
      isVisivel: true 
    },
    { 
      icone: 'pi-chart-bar', 
      label: 'INDICADORES',  
      rota: '/indicadores/gerais', 
      isAtivo: false, 
      isVisivel: true 
    }
  ]);

  const itemSelecionado = ref<ItemDeMenu>(items.value[0]);

  const redirecionar = (itemSelecionado: ItemDeMenu) => {

    items.value.forEach(item => {
      
      if (item.label === itemSelecionado.label){
        item.isAtivo = true;
      }else{
        item.isAtivo = false;
      }

    });

    router.push(itemSelecionado.rota);

  }

  const resetarNavegacao = () => {
    items.value.forEach(item => {
      item.isAtivo = false;
    });  
    items.value[0].isAtivo = true;
  }

  return { 
    items, 
    itemSelecionado, 
    redirecionar,
    resetarNavegacao 
  }

});