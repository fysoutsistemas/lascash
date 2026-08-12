<template>
  <div
    id="painel-compra"
    class="flex flex-col w-full max-w-md mx-auto bg-slate-50 shadow-xl min-h-screen"
  >
    <header class="p-4 bg-white border-b border-slate-100 flex flex-col gap-3.5 sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <Button 
          rounded 
          text 
          class="!w-[34px] !h-[34px] !text-emerald-600" 
          aria-label="Voltar"
          icon="pi pi-arrow-left"
          @click="redirectToListagem()"
        />
        <div class="flex-1 min-w-0 text-center">
          <h1 class="text-[19px] font-extrabold text-emerald-600 truncate">
            {{ lista ? lista.nome : '' }}
          </h1>
          <p class="mt-0.5 text-[12.5px] text-slate-500">
            {{ 
              lista && lista.status == 'ENCERRADA' 
              ? 'Resumo da compra encerrada' 
              : 'Confirme os itens no carrinho' 
            }}
          </p>
        </div>
        <span 
          class="text-[11px] font-extrabold px-2.5 py-[5px]  
                 rounded-full uppercase tracking-wide shrink-0" 
          :class="STATUS_CHIP[lista.status]"
        >
          {{ lista.status }}
        </span>
      </div>
      <div class="flex gap-2">
        <div class="flex-1 bg-emerald-50 rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Estimado
          </span>
          <strong class="text-[13px] font-extrabold text-emerald-700">
            {{ CurrencyUtil.toBRL(lista.totalEstimado) }}
          </strong>
        </div>
        <div class="flex-1 bg-slate-100 rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Compra
          </span>
          <strong class="text-[13px] font-extrabold text-slate-800">
            {{ CurrencyUtil.toBRL(lista.totalDaCompra) }}
          </strong>
        </div>
        <div 
          class="flex-1 rounded-xl px-3 py-2.5 flex flex-col gap-0.5" 
          :class="lista.difDeTotais < 0 ? 'bg-red-50' : 'bg-emerald-50'"
        >
          <span 
            class="text-[10px] font-bold uppercase tracking-wider" 
            :class="lista.difDeTotais < 0 ? 'text-red-600' : 'text-emerald-600'"
          >
            Diferença
          </span>
          <strong 
            class="text-[13px] font-extrabold" 
            :class="lista.difDeTotais < 0 ? 'text-red-600' : 'text-emerald-600'"
          >
            {{ CurrencyUtil.toBRL(lista.difDeTotais) }}
          </strong>
        </div>
      </div>
    </header>
    <main class="flex-1 p-4 flex flex-col gap-4 pb-[104px]">
      <div 
        v-if="lista && lista.status == 'ENCERRADA'" 
        class="flex items-center gap-2.5 bg-slate-100 border-[1.5px] 
               border-slate-200 rounded-xl px-3.5 py-3"
      >      
        <i class="pi pi-lock text-slate-500"></i>
        <span class="text-[13px] font-bold text-slate-600">
          Compra encerrada — somente visualização.
        </span>
      </div>
      <div 
        v-for="it in lista.itens" :key="it.produto.id"
        class="rounded-2xl p-3 border-[1.5px] flex flex-col gap-3"
        :class="it.flagNoCarrinho == 'S'
                ? 'bg-emerald-50 border-emerald-300' 
                : 'bg-white border-slate-100'"
      >
        <div class="flex gap-3 items-center">

          <button 
            @click="aoSelecionarFoto(it.produto as Produto)"
            :style="it.produto.foto ? { backgroundImage: 'url(' + it.produto.foto + ')' } : {}" 
            class="w-[58px] h-[58px] rounded-xl bg-slate-100 bg-cover bg-center 
                   flex items-center justify-center text-slate-400 active:scale-95 
                   transition shrink-0 overflow-hidden"
            :disabled="!it.produto.foto"       
          >
            <i v-if="!it.produto.foto" class="pi pi-camera text-3xl"></i>
          </button>

          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <strong class="text-[14.5px] font-bold text-slate-800 leading-tight truncate">
              {{ it.produto.descricao }}
            </strong>
            <span 
              class="text-[11px] font-extrabold px-2.5 py-[3px] rounded-full self-start" 
              :style="{
                'background-color': it.produto.categoria.cor
              }"
            >
              {{ it.produto.categoria.nome }}
            </span>
          </div>
        </div>

        <div 
          class="flex gap-2.5 items-end" 
          :class="lista && lista.status == 'ENCERRADA' ? 'opacity-60 pointer-events-none' : ''"
        >
          <div class="flex-1 flex flex-col gap-1.5">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
              Preço Unit.
            </label>
            <money3 
              id="valor"
              v-model="it.preco" 
              v-bind="mascara" 
              class="p-inputtext p-component p-inputtext-sm text-[12px]
                     p-inputfield-sm w-full !py-2 h-[38px] rounded-[10px]"
              :disabled="lista && lista.status == 'ENCERRADA' || it.flagNoCarrinho == 'S'"
              @blur="calcularSubtotalDo(it as ItemDaLista)"
            >
            </money3>            
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
              Qtd
            </label>
            <div 
              class="flex items-center border-[1.5px] border-slate-200 
                     rounded-[10px] overflow-hidden bg-slate-50 h-[38px]"
            >
              <button
                @click="atualizarQtdeDo(it as ItemDaLista, -1)" 
                class="w-5 h-[33px] flex items-center justify-center text-[13px] 
                       font-extrabold text-emerald-600 active:scale-90 transition"
                :disabled="lista && lista.status == 'ENCERRADA' || it.flagNoCarrinho == 'S'"       
              >
                −
              </button>
              <span 
                class="min-w-[20px] text-center text-[12px] font-extrabold text-slate-800"
              >
                {{ it.qtde }}
              </span>
              <button 
                @click="atualizarQtdeDo(it as ItemDaLista, 1)" 
                class="w-5 h-[33px] flex items-center justify-center text-[13px] 
                       font-extrabold text-emerald-600 active:scale-90 transition"
                :disabled="lista && lista.status == 'ENCERRADA' || it.flagNoCarrinho == 'S'"       
              >
                +
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
              No Carrinho
            </label>
            <div class="flex border-[1.5px] border-slate-200 rounded-[10px] overflow-hidden">
              <button 
                @click="atualizarFlag(it as ItemDaLista)" 
                class="text-[10px] font-extrabold px-4 py-2.5 transition" 
                :class="it.flagNoCarrinho == 'S' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 text-slate-500'"
              >
                Sim
              </button>
              <button 
                @click="atualizarFlag(it as ItemDaLista)" 
                class="text-[10px] font-extrabold px-4 py-2.5 
                       border-l-[1.5px] border-slate-200 transition" 
                :class="it.flagNoCarrinho == 'N' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-slate-100 text-slate-500'"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="produtoDaVisualizacao" 
        @click="produtoDaVisualizacao = null" 
        class="fixed inset-0 z-[80] bg-slate-950/85 flex items-center justify-center p-6"
      >
        <div 
          @click.stop 
          class="bg-white rounded-[18px] p-3.5 max-w-full 
                 flex flex-col gap-3 shadow-2xl"
        >
          <strong class="text-[15px] font-extrabold text-slate-800 text-center">
            {{ produtoDaVisualizacao.descricao }}
          </strong>
          <img 
            :src="produtoDaVisualizacao.foto" 
            class="max-w-full max-h-[58vh] rounded-xl block" 
          />
          <div class="flex gap-2">                
            <button 
              @click="produtoDaVisualizacao = null" 
              class="flex-1 bg-slate-100 rounded-[10px] py-2.5 text-[13px] 
                     font-extrabold text-slate-600 active:scale-95 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </main>
    <footer 
      class="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3.5 
             flex items-center gap-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]"
    >
      <Button 
        @click="encerrar()"
        class="!justify-center !bg-gradient-to-br !from-emerald-500 !to-emerald-600 
               !border-0 !rounded-xl !px-5 !py-3 !text-white !font-extrabold w-full"
        :icon="lista.status == 'ENCERRADA' ? 'pi pi-exclamation-triangle' : 'pi pi-check'"
        :label="lista.status == 'ENCERRADA' ? 'Compra Encerrada' : 'Encerrar Compra'"
        :disabled="lista.status == 'ENCERRADA'"
      />
    </footer>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { plainToInstance } from 'class-transformer';
import { unformat } from 'v-money3';
import { useConfirm } from 'primevue';
import ListaDeCompraClient from '@/client/ListaDeCompraClient';
import ListaDeCompra from '@/dto/ListaDeCompra';
import CurrencyUtil from '@/util/CurrencyUtil';
import Produto from '@/dto/Produto';
import ItemDaLista from '@/dto/ItemDaLista';
import Swal from 'sweetalert2';
import ItemDoCarrinho from '@/dto/ItemDoCarrinho';

const router = useRouter();

const confirmacao = useConfirm();

const listaClient = new ListaDeCompraClient();

const mascara = ref({
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
  precision: 2,
  masked: true
});

const lista = ref<ListaDeCompra>(new ListaDeCompra());

const produtoDaVisualizacao = ref<Produto | null>(null);

const STATUS_CHIP: any = {
  'NOVA': 'bg-sky-100 text-sky-700',
  'INICIADA': 'bg-amber-100 text-amber-700',
  'ENCERRADA': 'bg-slate-200 text-slate-600'
};  

onMounted(async () => {
  lista.value = await listaClient.buscarPor(props.idDaLista);
});

//Declara uma propriedade numérica e opcional
//Será lido na montagem do componente
const props = defineProps<{
  idDaLista: number
}>();

const encerrar = () => {

  confirmacao.require({    
    message: 'Deseja realmente encerrar a compra?',
    header: 'Confirmação',    
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

      listaClient.encerrarListaPor(lista.value.id)
        .then(() => {
          lista.value.status = "ENCERRADA"
        });

    }
  });


}

const atualizarQtdeDo = (itemSel: ItemDaLista, delta: number) => {

  if (isPrecoInformadoDo(itemSel)){    

    if (itemSel.qtde >= 1){
      itemSel.qtde += delta;      
    }
    
    itemSel.qtde = itemSel.qtde == 0 ? 1 : itemSel.qtde;

    calcularSubtotalDo(itemSel);

    calcularTotalDaCompra();

  }

}

const calcularSubtotalDo = (itemSel: ItemDaLista) => {
  itemSel.subtotal = toNumber(itemSel.preco) * itemSel.qtde;
}

const calcularTotalDaCompra = () => {
  
  lista.value.totalDaCompra = 0.0;
  
  lista.value.itens.forEach(item => {
    if (item.flagNoCarrinho == 'S'){
      lista.value.totalDaCompra += item.subtotal;    
    }
  });

  lista.value.difDeTotais = lista.value.totalEstimado - lista.value.totalDaCompra;

}

const atualizarFlag = (itemSel: ItemDaLista) => {

  if (isPrecoInformadoDo(itemSel)){
    
    let itemDoCarrinho = new ItemDoCarrinho(itemSel.produto.id, 
        itemSel.qtde, toNumber(itemSel.preco));

    if (itemSel.flagNoCarrinho == 'S'){

      listaClient.retirarDoCarrinhoPor(lista.value.id, itemSel.produto.id)
        .then(() => {

          itemSel.flagNoCarrinho = itemSel.flagNoCarrinho == 'S' ? 'N' : 'S';        

          let qtdeNoCarrinho = lista.value.itens.filter(it => it.flagNoCarrinho == 'S').length;

          lista.value.status = qtdeNoCarrinho == 0 ? "NOVA" : "INICIADA";

          calcularTotalDaCompra();

        });
      
    } else {

      listaClient.adicionarNoCarrinhoPor(lista.value.id, itemDoCarrinho)
        .then(() => {
          lista.value.status = "INICIADA";
          itemSel.flagNoCarrinho = itemSel.flagNoCarrinho == 'S' ? 'N' : 'S';        
          calcularTotalDaCompra();
        });

    }   

  }
  
}

const isPrecoInformadoDo = (itemSel: ItemDaLista): boolean => {
  
  if (toNumber(itemSel.preco) == 0){
    Swal.fire({
      icon: 'warning',
      title: 'Informe o preço',
      text: 'Defina o preço unitário antes de marcar o item como incluso no carrinho.',
      confirmButtonText: 'Entendi',
      buttonsStyling: false,
      customClass: { 
        popup: 'larcash-popup', 
        confirmButton: 'larcash-confirm' 
      }
    });
  }

  return toNumber(itemSel.preco) > 0;

}

const toNumber = (valor: number): number => {
  return Number(unformat(String(valor), mascara.value));
}

const aoSelecionarFoto = (produtoSelecionado: Produto) => {
  produtoDaVisualizacao.value = plainToInstance(Produto, produtoSelecionado);
}

const redirectToListagem = () => {
  router.push("/lista-compra/listagem");
}
</script>