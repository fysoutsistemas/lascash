<template>
  <div
    id="painel-listagem"
    class="flex flex-col w-full max-w-md mx-auto bg-slate-50 shadow-xl min-h-screen"
  >
    <header class="flex items-center gap-3 p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <Button 
        rounded 
        text 
        class="!w-[34px] !h-[34px] !text-emerald-600" 
        aria-label="Voltar"
        icon="pi pi-arrow-left"
        @click="redirectToPainel()"
      />
      <div class="flex-1 text-center">
        <h1 class="text-[19px] font-extrabold text-emerald-600">
          Listas Criadas
        </h1>
        <p class="mt-0.5 text-[12.5px] text-slate-500">
          {{ listasCriadas.length + ' listas criadas'}}
        </p>
      </div>
      <span class="w-9 h-9 flex items-center justify-center text-emerald-600">
        <i class="pi pi-list text-3xl"></i>
      </span>
    </header>
    <main class="flex-1 p-4 flex flex-col gap-4 pb-[104px]">

      <div class="flex gap-2 overflow-x-auto pb-0.5">
        <button 
          v-for="f in filtros" :key="f.status" 
          @click="atualizarListagemPor(f)"
          class="flex items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-[7px] 
                 text-[10px] font-bold whitespace-nowrap shrink-0 active:scale-95 transition"
          :class="f.status == filtro?.status 
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                  : 'bg-white border-slate-200 text-slate-500'"
        >
          {{ f.status }} 
          <span class="text-[11px] font-extrabold opacity-75">
            {{ f.qtde }}
          </span>
        </button>
      </div>

      <div 
        v-if="!listasCriadas.length" 
        class="bg-white border-[1.5px] border-dashed border-slate-200 rounded-2xl 
               px-5 py-9 flex flex-col items-center gap-2 text-center"
      >
        <span 
          class="w-12 h-12 rounded-[14px] bg-slate-100 text-slate-400 
                 flex items-center justify-center"
        >          
          <i class="pi pi-folder" style="font-size: 2rem"></i>
        </span>
        <p class="text-[13.5px] text-slate-500 font-semibold">
          Nenhuma lista encontrada.
        </p>
      </div>
      
      <div 
        v-for="lista in listasCriadas" 
        :key="lista.id"
        class="bg-white border-[1.5px] border-slate-100 rounded-2xl p-4 text-left w-full 
               flex flex-col gap-3 shadow-[0_3px_12px_rgba(15,23,42,0.05)] 
               active:scale-[0.99] transition cursor-pointer"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col gap-0.5 min-w-0">
            <strong class="text-base font-extrabold text-slate-800 leading-tight">
              {{ lista.nome }}
            </strong>
            <span class="text-[12.5px] text-slate-400">
              {{ lista.qtde }} {{ lista.qtde === 1 ? 'item' : 'itens' }}
            </span>
          </div>
          <span 
            class="text-[11px] font-extrabold px-2.5 py-[5px] 
                   rounded-full uppercase tracking-wide shrink-0" 
            :class="STATUS_CLASS[lista.status]"
          >
            {{ lista.status }}
          </span>
        </div>
        <div class="flex items-center gap-[18px] border-t border-slate-100 pt-3">
          <span class="flex flex-col gap-px">
            <span 
              class="text-[10.5px] font-bold text-slate-400 
                     uppercase tracking-wider"
            >
              Estimado
            </span>
            <strong class="text-base font-extrabold text-emerald-600">
              {{ CurrencyUtil.toBRL(lista.totalEstimado) }}
            </strong>
          </span>
          <span class="flex flex-col gap-px">
            <span 
              class="text-[10.5px] font-bold text-slate-400 
                     uppercase tracking-wider"
            >
              Compra
            </span>
            <strong class="text-base font-extrabold text-slate-800">
              {{ CurrencyUtil.toBRL(lista.totalDaCompra) }}
            </strong>
          </span>
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button 
            class="flex items-center gap-1.5 text-[12.5px] font-bold text-red-500             
                   bg-red-50 rounded-[9px] px-3 py-2 active:scale-95 transition"
            @click="remover(lista as ListaDeCompra)"       
          >            
            <i class="pi pi-trash"></i> Excluir
          </button>
          <button 
            v-if="lista.status == 'NOVA'"
            class="flex items-center gap-1.5 text-[12.5px] font-bold text-amber-700 
                   bg-amber-100 rounded-[9px] px-3 py-2 active:scale-95 transition"
            @click="redirectToEdicao(lista as ListaDeCompra)"       
          >            
            <i class="pi pi-pencil"></i> Editar
          </button>
          <button 
            class="flex items-center gap-1.5 text-[12.5px] font-bold text-emerald-700 
                   bg-emerald-100 rounded-[9px] px-3.5 py-2 active:scale-95 transition"
          >
            Abrir <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </div>
      <button 
        v-if="isPossuiMaisItens()" 
        @click="carregarMais()" 
        class="mt-1 w-full flex items-center justify-center gap-2 bg-white border-[1.5px] 
               border-emerald-300 rounded-xl py-3.5 text-sm font-extrabold text-emerald-700 
               active:scale-[0.98] transition"
      >
        <i class="pi pi-chevron-down text-slate-400" style="font-size: 1.5rem"></i> Carregar Mais
      </button>
    </main>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm, useToast } from 'primevue';
import ListaDeCompraClient from '@/client/ListaDeCompraClient';
import ListaDeCompra from '@/dto/ListaDeCompra';
import CurrencyUtil from '@/util/CurrencyUtil';
import ResumoDaLista from '@/dto/ResumoDaLista';
import type { IPagina } from '@/util/PaginacaoUtil';

const router = useRouter();

const toast = useToast();

const confirmacao = useConfirm();

const listaClient = new ListaDeCompraClient();

const filtros = ref<ResumoDaLista[]>([]);

const filtro = ref<ResumoDaLista>();

const paginaDeResultados = ref<IPagina<ListaDeCompra>>();

const paginaAtual = ref<number>(0);

const listasCriadas = ref<ListaDeCompra[]>([]);

const STATUS_CLASS: any = {
  'NOVA': 'bg-sky-100 text-sky-700',
  'INICIADA': 'bg-amber-100 text-amber-700',
  'ENCERRADA': 'bg-slate-200 text-slate-600'
};

onMounted(() => {

  listaClient.listarResumos().then((resumos: ResumoDaLista[]) => {

    filtros.value = resumos;

    filtro.value = filtros.value[0];//TODAS
    
    listaClient.listarTodasPor(filtro.value.status, paginaAtual.value)
      .then((pagina: IPagina<ListaDeCompra>) => {
        paginaDeResultados.value = pagina;
        listasCriadas.value = pagina.listagem;
      });

  });

});

const remover = (listaSel: ListaDeCompra) => {

  confirmacao.require({    
    message: 'Deseja remover a lista selecionada?',
    header: 'Remoção',    
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      text: true
    },
    acceptProps: {
      label: 'Confirmar',
      text: true
    },
    accept: async () => {
      
      listaClient.inativarPor(listaSel.id)
        .then((listaRemovida: ListaDeCompra) => {

          listaClient.listarResumos().then((resumos: ResumoDaLista[]) => {
            
            filtros.value = resumos;

            let indice = listasCriadas.value.findIndex(lista => listaSel.id == lista.id);

            if (indice >= 0){
              listasCriadas.value.splice(indice, 1);
            }

            toast.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `A lista ${ listaRemovida.nome } removida com sucesso`,
              life: 3000,
            });

          });

        });
    }
  });

}

const atualizarListagemPor = (filtroSelecionado: ResumoDaLista) => {

  filtro.value = filtroSelecionado;

  paginaAtual.value = 0;
  
  listaClient.listarTodasPor(filtro.value.status, paginaAtual.value)
    .then((pagina: IPagina<ListaDeCompra>) => {
      paginaDeResultados.value = pagina;
      listasCriadas.value = pagina.listagem;
    });

}

const isPossuiMaisItens = (): boolean => {
  if (paginaDeResultados.value){
    return paginaDeResultados.value.paginaAtual < (paginaDeResultados.value.totalDePaginas - 1);
  }
  return false;
}

const carregarMais = () => {

  if (paginaDeResultados.value){

    if (paginaDeResultados.value.paginaAtual < (paginaDeResultados.value.totalDePaginas - 1)){

      paginaAtual.value++;

      listaClient.listarTodasPor(filtro.value?.status, paginaAtual.value)
        .then((pagina: IPagina<ListaDeCompra>) => {
          paginaDeResultados.value = pagina;
          listasCriadas.value.push(...pagina.listagem);
        });

    }

  }  

}

const redirectToEdicao = (listaSel: ListaDeCompra) => {
  router.push(`/lista-compra/montagem/${listaSel.id}`)
}

const redirectToPainel = () => {
  router.push("/painel-compras");
}
</script>