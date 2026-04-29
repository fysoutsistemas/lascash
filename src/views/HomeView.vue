<template>
  <div 
    id="home" 
    class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen"
  >
    <Header
      @aoMudarVisibilidade="atualizarVisibilidade"
    />
    <main class="flex-1 p-4 space-y-6 pb-20">
      <section class="bg-surface-container-low rounded-xl p-6">
        <div class="flex justify-between items-end mb-4">
          <div>
            <h3 class="font-headline font-bold text-lg text-on-surface">
              Progresso do Orçamento
            </h3>
            <p class="text-sm text-on-surface-variant">
              Você gastou {{ progresso.percentualGasto }}% do orçamento
            </p>
          </div>
          <div class="relative group">
            <span class="text-2xl font-headline font-black text-primary">
              {{ progresso.percentualGasto }}%
            </span>
          </div>
        </div>
        <Progressbar 
          :show-value="false" 
          :value="progresso.percentualGasto" 
          style="height: 12px; border-radius: 10px"
        >
        </Progressbar>
        <div 
          class="flex justify-between mt-4 text-[10px] font-bold 
                 uppercase tracking-widest text-on-surface-variant"
        >
          <span>
            Gasto: {{ isOcultar ? '********' : CurrencyUtil.toBRL(progresso.totalGasto) }}
          </span>
          <span>
            Restante: {{ isOcultar ? '********' : CurrencyUtil.toBRL(progresso.totalRestante) }}
          </span>
        </div>
      </section>

      <section class="flex gap-4">
        <Button
          unstyled 
          class="flex-1 h-24 bg-surface-container-low rounded-2xl flex 
                 flex-col items-center justify-center gap-2 hover:bg-surface-container 
                 transition-colors active:scale-95 duration-200 group hover:cursor-pointer"
          @click="toNovoOrcamento()"       
        >
          <div 
            class="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center 
                   justify-center text-green-700 group-hover:bg-[#10b981] 
                   group-hover:text-white transition-all"
          >
            <span class="material-symbols-outlined">
              add
            </span>
          </div>
          <span class="font-label text-sm font-semibold text-on-surface">
            Novo Orçamento
          </span>
        </Button>
        <Button
          unstyled
          class="flex-1 h-24 bg-surface-container-low rounded-2xl flex flex-col 
                 items-center justify-center gap-2 hover:bg-surface-container 
                 transition-colors active:scale-95 duration-200 group hover:cursor-pointer"
          @click="toAtualizarOrcamento()"       
        >
          <div 
            class="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center 
                   justify-center text-green-700 group-hover:bg-[#10b981] 
                   group-hover:text-white transition-all"
          >
            <span class="material-symbols-outlined">
              edit
            </span>
          </div>
          <span class="font-label text-sm font-semibold text-on-surface">
            Alterar Orçamento
          </span>
        </Button>
      </section>

      <section>
        <div class="bg-[#10b981]/10 border-l-4 border-[#10b981] rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2 text-on-primary-container">
            <span class="material-symbols-outlined text-lg">
              info
            </span>
            <span class="font-bold text-sm">
              Você sabia?
            </span>
          </div>
          <div class="space-y-2 text-on-surface-variant text-sm leading-relaxed text-justify">
            <p>
              Criar um novo limite de orçamento 
              <b>arquiva</b> 
              automaticamente as transações atuais para o orçamento anterior.
            </p>
            <p>Atualizar o limite atual recalcula instantaneamente todas as porcentagens do seu painel.</p>
          </div>  
        </div>
      </section>

      <section>
        <Button 
          unstyled
          class="w-full py-5 px-6 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#10b981]/80
                 text-white flex items-center justify-between shadow-lg shadow-primary-container/20 
                 active:scale-[0.98] transition-transform hover:cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span class="material-symbols-outlined">
                person_add
              </span>
            </div>
            <div class="text-left">
              <p class="font-headline font-bold text-lg leading-tight">
                Convidar Familiar
              </p>
              <p class="text-white/80 text-xs">
                Adicione dependentes em segundos
              </p>
            </div>
          </div>
          <span class="material-symbols-outlined">
            chevron_right
          </span>
        </Button>
      </section>      
    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePerfilStore } from '@/composables/usePerfilStore';
import OrcamentoClient from '@/client/OrcamentoClient';
import ProgressoDoOrcamento from '@/dto/ProgressoDoOrcamento';
import CurrencyUtil from '@/util/CurrencyUtil';

const orcamentoClient = new OrcamentoClient();

const router = useRouter();

const perfilStore = usePerfilStore();

const { getOcultarValores } = perfilStore;

const progresso = ref<ProgressoDoOrcamento>(new ProgressoDoOrcamento());

const isOcultar = ref<boolean>(true);

onMounted(() => {

  isOcultar.value = getOcultarValores();
  
  console.log('Home: ', getOcultarValores());

  orcamentoClient.buscarProgresso()
    .then((progressoEncontrado: ProgressoDoOrcamento) => {
      progresso.value = progressoEncontrado;
    });

});

const atualizarVisibilidade = (isOcultarValores: boolean) => {
  isOcultar.value = isOcultarValores;
}

const toNovoOrcamento = () => {
  router.push({
    name: "orcamento",
    params: {
      modo: 'inclusao'
    }
  });
}

const toAtualizarOrcamento = () => {
  router.push({
    name: "orcamento",
    params: {
      modo: 'atualizacao'
    }
  });
}
</script>

<style lang="css" scoped>
.text-on-surface {
  color: #191c1e;
}

.text-on-surface-variant {
  color: #3c4a42;
}

.text-on-primary-container {
  color: #03442e;
}

.bg-surface-container {
  background: #eceef0;
}

.bg-surface-container-low {
  background: #f2f4f6;
}

.bg-surface-container-lowest {
  background: #ffffff;
}

.bg-secondary-container {
  background: #b7ebce;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.bg-primary-container {
  background: #10b981;
}
</style>