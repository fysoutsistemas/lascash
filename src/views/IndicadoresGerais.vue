<template>
  <div
    id="painel-indicadores"
    class="flex flex-col w-full max-w-md mx-auto bg-slate-50 shadow-xl min-h-screen"
  >
    <header class="flex items-center gap-3 p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <Button 
        rounded 
        text 
        class="!w-[34px] !h-[34px] !text-emerald-600" 
        aria-label="Voltar"
        icon="pi pi-arrow-left"
        @click="voltar()"
      />
      <div class="flex-1 text-center">
        <h1 class="text-[19px] font-extrabold text-emerald-600">Indicadores</h1>
        <p class="mt-0.5 text-[12.5px] text-slate-500">
          {{ DateUtil.converterMesEmDesc(mes) + ' de ' + ano }}
        </p>
      </div>
      <span class="w-9 h-9 flex items-center justify-center text-emerald-600">
        <i class="pi pi-chart-bar text-3xl"></i>
      </span>
    </header>

    <!-- INICIO: Painel de filtros ano/mes -->
    <div class="bg-white border-b border-slate-100 px-4 pt-3 pb-3.5 flex flex-col gap-2.5">
      <div class="flex items-center gap-2">
        <span class="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider min-w-[30px]">Ano</span>
        <div class="flex gap-2 overflow-x-auto">
          <button
            @click="buscarIndicadoresPor(ano, mes)"
            class="rounded-full border-[1.5px] px-4 py-1.5 text-[12.5px] 
                   font-extrabold shrink-0 active:scale-95 transition
                   bg-emerald-500 border-emerald-500 text-white"
          >
            {{ ano }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span         
          class="text-[10.5px] font-extrabold text-slate-400 
                 uppercase tracking-wider min-w-[30px]"
        >
          Mês
        </span>
        <div class="flex gap-1.5 overflow-x-auto pb-0.5">
          <button 
            v-for="mesOrdinal in 11" :key="mesOrdinal" 
            @click="buscarIndicadoresPor(ano, mesOrdinal)"
            class="rounded-full border-[1.5px] px-3 py-1.5 text-xs 
                   font-extrabold shrink-0 active:scale-95 transition"
            :class="mes === mesOrdinal 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                    : 'bg-white border-slate-200 text-slate-400'"
          >
            {{ DateUtil.converterMesEmDesc(mesOrdinal).substring(0, 3) }}
          </button>
        </div>
      </div>
    </div>
    <!-- TERMINO: Painel de filtros ano/mes -->

    <main class="flex-1 p-4 flex flex-col gap-[18px] mb-20">

      <!-- INICIO: Painel de navegação entre orcamentos -->
      <section
        class="bg-white border-[1.5px] border-slate-100 rounded-[18px] p-[18px] f
               lex flex-col gap-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-start justify-between gap-2.5">
          <span class="flex items-center gap-2">
            <span 
              class="w-[30px] h-[30px] rounded-[9px] bg-emerald-100 flex 
                     items-center justify-center text-emerald-600">              
              <i class="pi pi-wallet" style="font-size: 1.2rem"></i>
            </span>
            <span class="flex flex-col gap-px">              
              <strong class="text-[13.5px] font-extrabold text-slate-800">
                Orçamento
              </strong>
              <span 
                class="text-[11px] text-slate-400 font-semibold"
              >
                Desde 
                {{ DateUtil.formatarData(resumoGeralDeOrc.dataDeInicio) }} 
                · 
                {{ resumoGeralDeOrc.diasDecorridos }} 
                dias
              </span>
            </span>
          </span>
          <span 
            class="text-[10px] font-extrabold px-2.5 py-1 shrink-0
                   rounded-full uppercase tracking-wider"
            :class="resumoGeralDeOrc.dataDeTermino 
                    ? 'bg-slate-200 text-slate-600'
                    : 'bg-emerald-100 text-emerald-700'"
          >
            {{ resumoGeralDeOrc.dataDeTermino ? 'Encerrado' : 'Em andamento' }}
          </span>
        </div>
        
        <div 
          class="flex items-center justify-between gap-2.5 
                 bg-slate-50 rounded-[10px] px-2 py-[7px] mb-3"
        >
          <Button 
            unstyled
            @click="aoRetornarResumo" 
            :class="isPodeRecuar ? 'opacity-100' : 'opacity-35'"
            class="w-7 h-7 rounded-lg bg-white text-emerald-600 flex items-center 
                   justify-center shadow-sm active:scale-90 transition" 
            aria-label="Orçamento anterior"
            :disabled="!isPodeRecuar"
          >            
            <i class="pi pi-chevron-left"></i>
          </Button>
          <span class="flex flex-col items-center gap-px">
            <span class="text-[11.5px] font-extrabold text-slate-500">
              {{ `Orçamento ${indexCurr + 1} de ${indicadores.resumosGeraisDeOrc.length}` }}
            </span>
            <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
              Últimos 12 criados
            </span>
          </span>
          <Button 
            unstyled
            @click="aoAvancarResumo" 
            :class="isPodeAvancar ? 'opacity-100' : 'opacity-35'"
            class="w-7 h-7 rounded-lg bg-white text-emerald-600 flex items-center 
                   justify-center shadow-sm active:scale-90 transition" 
            aria-label="Próximo orçamento"
            :disabled="!isPodeAvancar"
          >          
            <i class="pi pi-chevron-right"></i>
          </Button>
        </div>

        <div 
          class="rounded-[10px] px-3 py-2.5 flex flex-col gap-0.5 border-l-4"
          :style="{ 
            background: getEstiloDoDiagnostico().background, 
            borderLeftColor: getEstiloDoDiagnostico().corDaBorda 
          }"
        >
          <strong 
            class="text-xs font-extrabold" 
            :style="{ color: getEstiloDoDiagnostico().corDoTexto }">
              {{ resumoGeralDeOrc.diagnostico.resumo }}
          </strong>
          <span 
            class="text-[11.5px] font-semibold leading-snug text-pretty" 
            :style="{ color: getEstiloDoDiagnostico().corDoTexto }"
          >
            {{ resumoGeralDeOrc.diagnostico.detalhamento }}
          </span>
        </div>

        <div class="flex items-end justify-between gap-3 mt-3">
          <span class="flex flex-col gap-0.5">
            <span class="text-[10px] font-extrabold text-slate-400 
                          uppercase tracking-wider"
            >
              {{ getTituloDoSaldo() }}
            </span>
            <strong 
              class="text-[26px] font-extrabold leading-none" 
              :class="resumoGeralDeOrc.diagnostico.status === 'ESTOUROU' 
                      ? 'text-red-600' 
                      : 'text-emerald-700'"
            >
              {{ 
                resumoGeralDeOrc.totalDisponivel > 0 
                ? CurrencyUtil.toBRL(resumoGeralDeOrc.totalDisponivel) 
                : CurrencyUtil.toBRL(resumoGeralDeOrc.totalDisponivel * -1) 
              }}
            </strong>
          </span>
          <span class="flex flex-col gap-0.5 items-end">
            <span 
              class="text-[10px] font-extrabold text-slate-400 
                     uppercase tracking-wider"
            >
              Teto
            </span>
            <strong class="text-[15px] font-extrabold text-slate-800">
              {{ CurrencyUtil.toBRL(resumoGeralDeOrc.limite) }}
            </strong>
          </span>
        </div>

        <div class="h-[9px] bg-slate-100 rounded-full overflow-hidden mt-3">
          <div 
            class="h-full rounded-full" 
            :style="{ 
              width: resumoGeralDeOrc.percGasto + '%', 
              background: getEstiloDoDiagnostico().corDaBorda 
            }"
          >
          </div>
        </div>

        <div class="flex justify-between text-[11px] font-bold text-slate-500 mt-2">
          <span>
            Já gastei {{ CurrencyUtil.toBRL(resumoGeralDeOrc.totalGasto) }}
          </span>
          <span>{{ resumoGeralDeOrc.percGasto }}% do teto</span>
        </div>

        <div class="flex gap-3 mt-4">
          <span class="flex-1 bg-slate-50 rounded-xl p-3 flex flex-col gap-0.5">
            <span 
              class="text-[10px] font-extrabold text-slate-400 
                     uppercase tracking-wider"
            >
              Ritmo
            </span>
            <strong class="text-[15px] font-extrabold text-slate-800 leading-tight">
              {{ CurrencyUtil.toBRL(resumoGeralDeOrc.mediaDeGastoDia) }}
            </strong>
            <span class="text-[10.5px] text-slate-400 font-semibold">por dia</span>
          </span>
          <span 
            class="flex-[1.35] rounded-xl p-3 flex flex-col gap-0.5"
            :class="resumoGeralDeOrc.diagnostico.status === 'ESTOUROU' 
                    ? 'bg-red-50' 
                    : (resumoGeralDeOrc.diagnostico.status === 'NO_LIMITE' 
                       ? 'bg-amber-50' 
                       : 'bg-emerald-50'
                      )"
          >
            <span 
              class="text-[10px] font-extrabold text-slate-500 
                     uppercase tracking-wider"
            >
              {{ resumoGeralDeOrc.dataDeTermino ? 'Durou' : 'Ainda dura' }}
            </span>
            <strong 
              class="text-[15px] font-extrabold leading-tight" 
              :class="resumoGeralDeOrc.diagnostico.status === 'ESTOUROU' 
                      ? 'text-red-600' 
                      : (resumoGeralDeOrc.diagnostico.status === 'NO_LIMITE' 
                         ? 'text-amber-700' 
                         : 'text-emerald-700'
                        )"
            >
              {{ getTituloDaDuracaoDeGastos() }}
            </strong>
            <span class="text-[10.5px] text-slate-500 font-semibold leading-snug">
              {{ getDescDeDuracaoDeGastos() }}
            </span>
          </span>
        </div>

      </section>
      <!-- TERMINO: Painel de navegação entre orcamentos -->

      <!-- INICIO: Listagem de gastos do orcamento por categoria -->
      <section 
        class="bg-white border-[1.5px] border-slate-100 rounded-[18px] 
               shadow-[0_3px_12px_rgba(15,23,42,0.05)]
               p-[18px] flex flex-col gap-3.5"
      >
        <div class="flex items-center justify-between gap-2.5">
          <strong class="text-[13.5px] font-extrabold text-slate-800">
            Onde meu dinheiro foi
          </strong>
          <span 
            class="text-[10px] font-extrabold text-emerald-600 bg-emerald-100 
                   px-2.5 py-1 rounded-full uppercase tracking-wider"
          >
            Neste orçamento
          </span>
        </div>
        <p 
          v-if="!indicadores.gastosOrcPorCategs.length" 
          class="text-[13px] text-slate-400 font-semibold text-center py-2"
        >
          Nenhum gasto lançado neste orçamento.
        </p>
        <div class="flex flex-col gap-3.5">
          <div 
            v-for="gasto in gastosOrcPorCategs" :key="gasto.idDaCategoria" 
            class="flex flex-col gap-[7px]"
          >
            <div class="flex items-center gap-2">
              <span 
                class="w-[11px] h-[11px] rounded shrink-0" 
                :style="{ background: gasto.corDaCategoria }"
              >
              </span>
              <span 
                class="flex-1 text-[12.5px] font-extrabold 
                       text-slate-600 truncate"
              >
                {{ gasto.nomeDaCategoria }}
              </span>
              <span 
                class="text-[11px] font-extrabold px-2 py-[3px] rounded-full" 
                :style="{ 
                  color: gasto.corDaCategoria, 
                  background: gasto.corDaCategoria + '1A' 
                }"
              >
                {{ gasto.percGastoDoOrc + '%' }}
              </span>
              <strong 
                class="text-[13px] font-extrabold text-slate-800 
                       min-w-[76px] text-right"
              >
                {{ CurrencyUtil.toBRL(gasto.totalGasto) }}
              </strong>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full" 
                :style="{ 
                  width: gasto.percGastoDoOrc + '%', 
                  background: gasto.corDaCategoria
                }"
              >
              </div>
            </div>
            <div class="flex justify-between text-[10.5px] font-bold">
              <span class="text-slate-400">
                {{ 
                  gasto.limite == 0 
                  ? 'Sem limite' 
                  : 'Limite ' + CurrencyUtil.toBRL(gasto.limite) 
                }}
              </span>
              <span :style="{ color: gasto.corDaCategoria }">
                {{ gasto.percGastoDaCateg > 0 ? gasto.percGastoDaCateg + '% do limite' : '--'}}
              </span>
            </div>
          </div>
        </div>
      </section>
      <!-- TERMINO: Listagem de gastos do orcamento por categoria -->

      <!-- INICIO: Painel de categoria com maior gasto do orcamento -->
      <section 
        v-if="gastosOrcPorCategs.length > 0" 
        class="rounded-2xl p-4 flex items-center gap-3" 
        :style="{ background: maiorGasto.corDaCategoria + '1A' }"
      >
        <span 
          class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0" 
          :style="{ color: maiorGasto.corDaCategoria }"
        >
          <i class="pi pi-chart-line" style="font-size: 1.8rem"></i>
        </span>
        <span class="flex-1 flex flex-col gap-0.5">
          <span class="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider">
            Maior peso no orçamento
          </span>
          <strong class="text-[15px] font-extrabold text-slate-800">
            {{ maiorGasto.nomeDaCategoria }}
          </strong>
          <span class="text-xs text-slate-600 font-semibold">
            {{ 
              CurrencyUtil.toBRL(maiorGasto.totalGasto) }} 
              · 
              {{ maiorGasto.percGastoDoOrc }}%
              do gasto deste orçamento
          </span>
        </span>
      </section>
      <!-- TERMINO: Painel de categoria com maior gasto do orcamento -->

      <!-- INICIO: Painel de economia nas compras -->
      <section 
        v-if="economiaEmCompras"
        class="bg-white border-[1.5px] border-slate-100 rounded-[18px] p-[18px] 
               flex flex-col gap-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-center gap-2">
          <span 
            class="w-[30px] h-[30px] rounded-[9px] bg-emerald-100 flex 
                   items-center justify-center text-emerald-600"
          >
            <i class="pi pi-tag" style="font-size: 0.9rem"></i>
          </span>
          <strong class="text-[13.5px] font-extrabold text-slate-800">
            Economia nas compras
          </strong>
        </div>
        <div 
          class="rounded-[14px] p-3.5 flex items-center justify-between gap-2.5" 
          :class="economiaEmCompras.totalEconomizado >= 0 
                  ? 'bg-emerald-50' 
                  : 'bg-red-50'"
        >
          <span class="flex flex-col gap-0.5">
            <strong 
              class="text-[26px] font-extrabold leading-none" 
              :class="economiaEmCompras.totalEconomizado >= 0 
                      ? 'text-emerald-700' 
                      : 'text-red-600'"
            > 
              {{ 
                economiaEmCompras.totalEconomizado >= 0 
                ? CurrencyUtil.toBRL(economiaEmCompras.totalEconomizado) 
                : CurrencyUtil.toBRL(economiaEmCompras.totalEconomizado * -1) 
              }}
            </strong>
            <span class="text-[11.5px] text-slate-500 font-semibold">
              {{ 
                economiaEmCompras.totalEconomizado > 0 
                ? 'Você pagou menos do que tinha estimado' 
                : 'Você pagou mais do que tinha estimado' 
              }}
            </span>
          </span>
          <span 
            class="text-sm font-extrabold bg-white px-3 py-1.5 rounded-full" 
            :class="economiaEmCompras.totalEconomizado >= 0 
                    ? 'text-emerald-700' 
                    : 'text-red-600'"
          >
            {{ 
              economiaEmCompras.totalEconomizado >= 0
              ? economiaEmCompras.percEconomizado 
              : economiaEmCompras.percEconomizado * -1
            }}%
          </span>
        </div>
        <div class="flex gap-2.5">
          <span class="flex-1 bg-slate-50 rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Estimado
            </span>
            <strong class="text-[14.5px] font-extrabold text-emerald-600">
              {{ CurrencyUtil.toBRL(economiaEmCompras.totalEstimado) }}
            </strong>
          </span>
          <span class="flex-1 bg-slate-50 rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Pago
            </span>
            <strong class="text-[14.5px] font-extrabold text-slate-800">
              {{ CurrencyUtil.toBRL(economiaEmCompras.totalComprado) }}
            </strong>
          </span>
        </div>
      </section>
      <!-- TERMINO: Painel de economia nas compras -->

      <!-- INICIO: Painel de numero do mes -->
      <section 
        v-if="resumoGeralDeCompras && resumoGeralDeCompras.qtdeDeCompras > 0"
        class="bg-white border-[1.5px] border-slate-100 rounded-[18px] p-[18px] 
               flex flex-col gap-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.05)]"
      >
        <strong class="text-[13.5px] font-extrabold text-slate-800">
          Números do mês
        </strong>
        <div class="flex gap-2.5">
          <span 
            class="flex-1 flex flex-col items-center gap-1 
                   bg-slate-50 rounded-xl px-2 py-3.5"
          >
            <strong class="text-xl font-extrabold text-slate-800 leading-none">
              {{ resumoGeralDeCompras.qtdeDeCompras }}
            </strong>
            <span 
              class="text-[10px] font-bold text-slate-400 
                     uppercase tracking-wide text-center"
            >
              Compras
            </span>
          </span>
          <span 
            class="flex-1 flex flex-col items-center gap-1 
                   bg-slate-50 rounded-xl px-2 py-3.5"
          >
            <strong class="text-xl font-extrabold text-slate-800 leading-none">
              {{ resumoGeralDeCompras.qtdeDeItens }}
            </strong>
            <span 
              class="text-[10px] font-bold text-slate-400 
                     uppercase tracking-wide text-center"
            >
              Itens
            </span>
          </span>
          <span 
            class="flex-[1.3] flex flex-col items-center g
                   ap-1 bg-slate-50 rounded-xl px-2 py-3.5"
          >
            <strong class="text-[15px] font-extrabold text-emerald-600 leading-tight">
              {{ CurrencyUtil.toBRL(resumoGeralDeCompras.mediaDeCompra) }}
            </strong>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide text-center">
              Média/compra
            </span>
          </span>
        </div>
      </section>
      <!-- TERMINO: Painel de numero do mes -->
      
      <section 
        class="bg-white border-[1.5px] border-slate-100 rounded-[18px] p-[18px] 
               flex flex-col gap-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-center justify-between gap-2.5">
          <strong class="text-[13.5px] font-extrabold text-slate-800">
            Produtos que mais pesaram
          </strong>
          <span 
            class="text-[10px] font-extrabold text-emerald-600 bg-emerald-100 
                   px-2.5 py-1 rounded-full uppercase tracking-wider"
          >
            Top 5
          </span>
        </div>
        <p 
          v-if="maioresGastosDeProd.length == 0" 
          class="text-[13px] text-slate-400 font-semibold text-center py-2"
        >
          Nenhum produto comprado neste período.
        </p>
        <div class="flex flex-col">
          <div 
            v-for="(gasto, i) in maioresGastosDeProd" :key="gasto.idDoProduto" 
            class="flex items-center gap-2.5 py-2.5 border-b border-slate-50"
          >
            <span 
              class="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center 
                     justify-center text-[11.5px] font-extrabold shrink-0"
            >
              {{ i + 1 }}
            </span>
            <span class="flex-1 min-w-0 flex flex-col gap-1">
              <strong class="text-[13px] font-bold text-slate-800 truncate">
                {{ gasto.descricaoDoProd }}
              </strong>
              <span class="flex items-center gap-2">
                <span 
                  class="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-slate-800"
                  :style="{ 
                    background: gasto.corDaCategoria
                  }"
                >
                  {{ gasto.nomeDaCategoria }}
                </span>
                <span class="text-[11px] text-slate-400 font-bold">
                  {{ gasto.qtdeComprada }} un
                </span>
              </span>
            </span>
            <strong 
              class="text-[13px] font-extrabold text-right
                     text-emerald-600 min-w-[70px]"
            >
              {{ CurrencyUtil.toBRL(gasto.totalComprado) }}
            </strong>
          </div>
        </div>
      </section>

    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import DateUtil from '@/util/DateUtil';
import IndicadoresGerais from '@/dto/IndicadoresGerais';
import IndicadoresGeraisClient from '@/client/IndicadoresGeraisClient';
import ResumoGeralDeOrc from '@/dto/ResumoGeralDeOrc';
import CurrencyUtil from '@/util/CurrencyUtil';
import GastoOrcPorCateg from '@/dto/GastoOrcPorCateg';
import EconomiaEmCompras from '@/dto/EconomiaEmCompras';
import ResumoGeralDeCompras from '@/dto/ResumoGeralDeCompras';
import MaiorGastoDeProduto from '@/dto/MaiorGastoDeProduto';

const router = useRouter();

const indicadoresClient = new IndicadoresGeraisClient();

const indicadores = ref<IndicadoresGerais>(new IndicadoresGerais());

const resumoGeralDeOrc = ref<ResumoGeralDeOrc>(new ResumoGeralDeOrc());

const gastosOrcPorCategs = ref<GastoOrcPorCateg[]>([]);

const maiorGasto = ref<GastoOrcPorCateg>(new GastoOrcPorCateg());

const economiaEmCompras = ref<EconomiaEmCompras | null>(new EconomiaEmCompras());

const resumoGeralDeCompras = ref<ResumoGeralDeCompras>(new ResumoGeralDeCompras());

const maioresGastosDeProd = ref<MaiorGastoDeProduto[]>([]);

const indexCurr = ref<number>(0);

const hoje = ref<Date>(new Date());

const ano = ref<number>(hoje.value.getFullYear());

const mes = ref<number>(hoje.value.getMonth());

const isPodeRecuar = ref<boolean>(false);

const isPodeAvancar = ref<boolean>(false);

onMounted(() => {  
  buscarIndicadoresPor(ano.value, mes.value);
});

const buscarIndicadoresPor = (anoSelecionado: number, mesSelecionado: number) => {  
  
  ano.value = anoSelecionado;

  mes.value = mesSelecionado;

  indicadoresClient.buscarPor(anoSelecionado, mesSelecionado + 1)
    .then((indics: IndicadoresGerais) => {      

      indicadores.value = indics;
      
      indexCurr.value = indicadores.value.resumosGeraisDeOrc.length - 1;
      
      resumoGeralDeOrc.value = indicadores.value.resumosGeraisDeOrc[indexCurr.value];
      
      gastosOrcPorCategs.value = indicadores.value.gastosOrcPorCategs;
      
      if (gastosOrcPorCategs.value.length > 0){
        maiorGasto.value = gastosOrcPorCategs.value[0];
      }

      economiaEmCompras.value = indicadores.value.economiaEmCompras;

      resumoGeralDeCompras.value = indicadores.value.resumoGeralDeCompras;

      maioresGastosDeProd.value = indicadores.value.maioresGastosDeProd;

      isPodeAvancar.value = false;

      isPodeRecuar.value = true;

    });

}

const getDescDeDuracaoDeGastos = (): string => {

  let inicio = resumoGeralDeOrc.value.dataDeInicio;

  let termino = resumoGeralDeOrc.value.dataDeTermino;

  let terminoProjetado = resumoGeralDeOrc.value.dataDeTerminoProjetada;

  let diagnostico = resumoGeralDeOrc.value.diagnostico;

  if (termino){
    return "De " + DateUtil.formatarData(inicio) +  " a " + DateUtil.formatarData(termino) + ".";
  }else if (diagnostico.status === "ESTOUROU"){
    return "O gasto já passou do valor deste orçamento."
  }else{

    let mediaDeGastoDia = resumoGeralDeOrc.value.mediaDeGastoDia;

    if (mediaDeGastoDia == 0){
      return "Assim que houver gastos, mostramos a previsão aqui."
    }else if (terminoProjetado !== null){
      return "No ritmo de hoje, o saldo dura até " + DateUtil.formatarData(terminoProjetado) + ".";
    }else{
      return "";
    }

  }

}

const getTituloDaDuracaoDeGastos = (): string => {
  
  let diagnostico = resumoGeralDeOrc.value.diagnostico;

  let mediaDeGastoDia = resumoGeralDeOrc.value.mediaDeGastoDia;

  let termino = resumoGeralDeOrc.value.dataDeTermino;

  let diasRestantes = resumoGeralDeOrc.value.diasRestantes;

  let diasDecorridos = resumoGeralDeOrc.value.diasDecorridos;

  if (termino){
    if (diasDecorridos === 1){
      return "1 dia";
    }else{
      return diasDecorridos + " dias";
    }
  }if (diagnostico.status === "ESTOUROU"){
    return "Teto ultrapassado";
  }else if (mediaDeGastoDia === 0){
    return "Sem gastos ainda"
  }else{        

    if (diasRestantes === 1){
      return "1 dia";
    }else{
      return diasRestantes + " dias";
    }

  }  

}

const getTituloDoSaldo = (): string => {

  if (resumoGeralDeOrc.value.diagnostico.status === "ESTOUROU"){
    return "Passou do teto em "
  }else if (resumoGeralDeOrc.value.dataDeTermino == null){
    return "Ainda disponível "
  }else{
    return "Sobrou ";
  }

}

const getEstiloDoDiagnostico = (): any => {
  if (resumoGeralDeOrc.value.diagnostico.status === 'ESTOUROU'){
    return {
      'background': '#fef2f2',
      'corDoTexto': '#b91c1c',
      'corDaBorda': '#dc2626'
    }
  }else if (resumoGeralDeOrc.value.diagnostico.status === 'NO_LIMITE'){
    return {
      'background': '#fef2f2',
      'corDoTexto': '#b45309',
      'corDaBorda': '#f59e0b'
    }
  }else{
    return {
      'background': '#ecfdf5',
      'corDoTexto': '#047857',
      'corDaBorda': '#10b981'
    }
  }
}

const aoRetornarResumo = async () => {

  if (indexCurr.value >= 1){
    
    indexCurr.value--;
    
    resumoGeralDeOrc.value = indicadores.value.resumosGeraisDeOrc[indexCurr.value];    
    
    isPodeAvancar.value = true;

    gastosOrcPorCategs.value = await indicadoresClient
        .listarGastosPor(resumoGeralDeOrc.value.idDoOrcamento);

    if (gastosOrcPorCategs.value.length > 0){
      maiorGasto.value = gastosOrcPorCategs.value[0];
    }

    economiaEmCompras.value = indicadores.value.economiaEmCompras;
    
    resumoGeralDeCompras.value = indicadores.value.resumoGeralDeCompras;

    maioresGastosDeProd.value = indicadores.value.maioresGastosDeProd;

  }

  isPodeRecuar.value = indexCurr.value > 0;

}

const aoAvancarResumo = async () => {

  if (indexCurr.value < indicadores.value.resumosGeraisDeOrc.length - 1){

    indexCurr.value++;

    resumoGeralDeOrc.value = indicadores.value.resumosGeraisDeOrc[indexCurr.value];

    isPodeRecuar.value = true;

    gastosOrcPorCategs.value = await indicadoresClient
        .listarGastosPor(resumoGeralDeOrc.value.idDoOrcamento);

    if (gastosOrcPorCategs.value.length > 0){
      maiorGasto.value = gastosOrcPorCategs.value[0];
    }    

    economiaEmCompras.value = indicadores.value.economiaEmCompras;

    resumoGeralDeCompras.value = indicadores.value.resumoGeralDeCompras;

    maioresGastosDeProd.value = indicadores.value.maioresGastosDeProd;

  }

  isPodeAvancar.value = indexCurr.value !== indicadores.value.resumosGeraisDeOrc.length - 1;  

}

const voltar = () => {
  router.push("/");
}

</script>