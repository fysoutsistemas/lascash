<template>
  <div
    id="paine-compras"
    class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen"
  >
    <Header/>
    <main class="flex flex-col gap-4 p-4 flex-1 pb-[125px]">
      <section class="flex gap-3">
        <button 
          class="flex-1 flex flex-col items-center gap-2.5 
                 bg-gray-100 rounded-2xl pt-[18px] pb-3.5 px-1.5 
                 active:scale-[0.96] transition"
          @click="redirectToProdutos()"       
        >
          <span class="w-[46px] h-[46px] rounded-xl bg-emerald-100 
                       flex items-center justify-center text-emerald-600"
          >
            <i class="pi pi-plus text-3xl"></i>
          </span>
          <span 
            class="text-xs font-bold text-gray-700 text-center leading-snug"
          >
            Criar Produtos
          </span>
        </button>
        <button 
          class="flex-1 flex flex-col items-center gap-2.5 bg-gray-100 
                 rounded-2xl pt-[18px] pb-3.5 px-1.5 active:scale-[0.96] transition"
          @click="redirectToMontagem()"
        >
          <span 
            class="w-[46px] h-[46px] rounded-xl bg-emerald-100 flex 
                   items-center justify-center text-emerald-600">            
            <i class="pi pi-list text-3xl"></i>
          </span>
          <span 
            class="text-xs font-bold text-gray-700 text-center leading-snug"
          >
            Montar Lista
          </span>
        </button>
        <button 
          class="flex-1 flex flex-col items-center gap-2.5 bg-gray-100 
                 rounded-2xl pt-[18px] pb-3.5 px-1.5 active:scale-[0.96] transition"
          @click="redirectToListagem()"       
        >
          <span 
            class="w-[46px] h-[46px] rounded-xl bg-emerald-100 flex 
                   items-center justify-center text-emerald-600"
          >
            <i class="pi pi-folder"></i>
          </span>
          <span 
            class="text-xs font-bold text-gray-700 text-center leading-snug"
          >
            Listas Criadas
          </span>
        </button>
      </section>

      <section 
        class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[18px] 
               p-[18px] flex flex-col gap-3 shadow-lg shadow-emerald-500/25"
      >
        <div class="flex items-center justify-between gap-2.5">
          <span class="flex items-center gap-2">
            <span 
              class="w-[30px] h-[30px] rounded-[9px] bg-white/20 
                     flex items-center justify-center text-white"
            >
              <i class="pi pi-shopping-cart"></i>
            </span>
            <strong class="text-[13.5px] font-extrabold text-white">
              Total Comprado
            </strong>
          </span>
          <span 
            class="text-[10px] font-extrabold text-white bg-white/20 
                   px-2.5 py-1 rounded-full uppercase tracking-wider"
          >
            30 dias
          </span>
        </div>
        <strong class="text-[30px] font-extrabold text-white leading-none">
          {{ CurrencyUtil.toBRL(dashboard.totalComprado) }}
        </strong>
        <span class="text-xs text-white/90 font-semibold">
          {{ 
            dashboard.totalDeListas === 1 
            ? '1 lista com compras' 
            : dashboard.totalDeListas + ' listas com compras' 
          }}
        </span>
      </section>

      <section 
        class="bg-white border-[1.5px] border-slate-100 rounded-[18px] p-[18px] 
               flex flex-col gap-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-center justify-between gap-2.5">
          <span class="flex items-center gap-2">
            <span 
              class="w-[30px] h-[30px] rounded-[9px] bg-emerald-100 
                     flex items-center justify-center text-emerald-600"
            >              
              <i class="pi pi-shopping-cart"></i>
            </span>
            <strong class="text-[13.5px] font-extrabold text-slate-800">
              Compras por Categoria
            </strong>
          </span>
          <span 
            class="text-[10px] font-extrabold text-emerald-600 bg-emerald-100 
                   px-2.5 py-1 rounded-full uppercase tracking-wider"
          >
            30 dias
          </span>
        </div>
        <p 
          v-if="!dashboard.resumosPorCateg.length" 
          class="text-[13px] text-slate-400 font-semibold text-center py-2"
        >
          Nenhuma compra registrada nos últimos {{ dashboard.periodoEmDias }} dias.
        </p>

        <div 
          v-if="dashboard.resumosPorCateg.length" 
          class="relative flex items-center justify-center"
        >
          <svg width="160" height="160" viewBox="0 0 150 150" class="-rotate-90">
            <circle 
              cx="72" 
              cy="72" 
              r="60" 
              fill="none" 
              stroke="#f1f5f9" 
              stroke-width="22" 
            />
            <circle 
              v-for="res in dashboard.resumosPorCateg" :key="res.nome" 
              cx="72" 
              cy="72" 
              r="60" 
              fill="none" 
              :stroke="res.cor" 
              stroke-width="22" 
              :stroke-dasharray="res.dasharray" 
              :stroke-dashoffset="res.dashoffset" 
            />
          </svg>
          <div class="absolute flex flex-col items-center gap-px">
            <span class="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest">
              Total
            </span>
            <strong class="text-base font-extrabold text-slate-800 leading-none">
              {{ CurrencyUtil.toBRL(dashboard.totalComprado) }}
            </strong>
            <span class="text-[10.5px] text-slate-400 font-semibold">
              {{ 
                dashboard.resumosPorCateg.length === 1 
                ? '1 categoria' 
                : dashboard.resumosPorCateg.length + ' categorias' 
              }}
            </span>
          </div>
        
        </div>

        
        <div class="flex flex-col">
          <div 
            v-for="res in dashboard.resumosPorCateg" :key="res.nome" 
            class="flex items-center gap-2.5 py-2.5 border-b border-slate-50"
          >
            <span 
              class="w-[11px] h-[11px] rounded shrink-0" 
              :style="{ background: res.cor }">
            </span>
            <span class="flex-1 text-[12.5px] font-bold text-slate-600 truncate">
              {{ res.nome }}
            </span>
            <span 
              class="text-[11px] font-extrabold px-2 py-[3px] 
                     rounded-full min-w-[40px] text-center" 
              :style="{ background: res.cor }"
            >
              {{ res.percentual + '%' }}
            </span>
            <strong class="text-[13px] font-extrabold text-slate-800 min-w-[74px] text-right">
              {{ CurrencyUtil.toBRL(res.total) }}
            </strong>
          </div>
        </div>

      </section>

      <section 
        class="bg-emerald-50 border-l-[5px] border-emerald-500 
               rounded-xl px-[18px] py-4 flex flex-col gap-2"
      >
        <div class="flex items-center gap-2">
          <span 
            class="w-5 h-5 rounded-full bg-emerald-900 text-white flex 
                   items-center justify-center text-xs font-extrabold"
          >
            i
          </span>
          <strong class="text-sm text-emerald-950">
            Você sabia?
          </strong>
        </div>
        <p class="text-[13.5px] leading-relaxed text-emerald-800 text-justify">
          Os produtos cadastrados ficam salvos no seu catálogo: ao montar uma nova lista, basta 
          <strong>selecionar e definir as quantidades</strong>.
        </p>
        <p class="text-[13.5px] leading-relaxed text-emerald-800 text-justify">
          Suas listas criadas podem ser reutilizadas a qualquer momento para repetir a compra do mês.
        </p>
      </section>

    </main>      
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ListaDeCompraClient from '@/client/ListaDeCompraClient';
import DashboardDeCompras from '@/dto/DashboardDeCompras';
import CurrencyUtil from '@/util/CurrencyUtil';
import ResumoDeComprasDaCateg from '@/dto/ResumoDeComprasDaCateg';

const router = useRouter();

const listaClient = new ListaDeCompraClient();

const dashboard = ref<DashboardDeCompras>(new DashboardDeCompras());

onMounted(() => {
  listaClient.buscarDashboard().then((dash: DashboardDeCompras) => {        
    dashboard.value = dash;
    plotarGrafico();
  });  
});  

const plotarGrafico = () => {

  const R = 52, CIRC = 2 * Math.PI * R;    

  let acc = 0;    

  dashboard.value.resumosPorCateg.forEach((res: ResumoDeComprasDaCateg) => {
    const seg = (res.percentual / 100) * CIRC;
    res.dasharray = seg.toFixed(2) + ' ' + (CIRC - seg).toFixed(2);//Calcula o tamanho do segmento
    res.dashoffset = (-acc).toFixed(2);
    acc += seg;      
  });

}

const redirectToProdutos = () => {
  router.push("/produtos");
}

const redirectToMontagem = () => {
  router.push("/lista-compra/montagem");
}

const redirectToListagem = () => {
  router.push("/lista-compra/listagem");
}
</script>