<template>
  <div 
    id="home" 
    class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen"
  >
    <Header/>
    <main class="flex-1 p-4 space-y-6 pb-20">
      <!-- Resumo do orçamento -->
      <section class="relative">
        <div 
          class="bg-surface-container-lowest rounded-xl p-8 shadow-md 
                 relative border border-slate-100 overflow-hidden"
        >
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48 flex items-center justify-center">
              <div 
                class="absolute inset-0 rounded-full bg-green-500"
                :style="{
                  background: `conic-gradient(
                    #10b981 0% ${progresso.percentualGasto}%, 
                    #eceef0 ${progresso.percentualGasto}% 100%)`,
                }"
              >
              </div>
              <div 
                class="absolute inset-4 rounded-full bg-surface-container-lowest 
                       flex flex-col items-center justify-center"
              >
                <span 
                  class="text-on-surface-variant font-label 
                         text-xs uppercase tracking-widest"
                >
                  Gasto
                </span>
                <span 
                  class="text-3xl font-extrabold text-primary font-display"
                >
                  {{ progresso.percentualGasto }}%
                </span>
              </div>
            </div>
            <div class="mt-8 text-center space-y-1">
              <h2 class="text-display-sm font-bold text-on-surface tracking-tight">
                {{ CurrencyUtil.toBRL(progresso.totalGasto) }}
              </h2>
              <p class="text-on-surface-variant text-sm">
                de um limite total de 
                <span class="font-semibold">
                  {{ CurrencyUtil.toBRL(progresso.totalOrcado) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <!-- Card de cadastro de orçamento -->
      <section 
        class="bg-surface-container-low rounded-xl p-6 
               shadow-ambient transition-all hover:scale-[1.01]"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-secondary-container/30 rounded-lg">
            <span class="material-symbols-outlined text-primary">
              account_balance_wallet
            </span>
          </div>
          <h3 class="font-headline font-bold text-lg text-on-surface truncate">
            Gerenciar Orçamento
          </h3>
        </div>
        <div class="space-y-4">
          <div class="relative">
            <label 
              class="block text-[14px] font-bold tracking-widest 
                     uppercase text-on-surface-variant mb-2 ml-1"
            >
              {{ props.modo == 'inclusao' ? 'Nova Meta Mensal' : 'Meta Mensal Atual'  }}
            </label>
            <div 
              class="flex items-center bg-surface-container-lowest rounded-xl px-4 py-3 
                     focus-within:ring-2 focus-within:ring-primary/20 transition-all"
            >
              <span class="text-on-surface-variant font-medium mr-2">R$</span>
              <money3
                id="limite"
                class="bg-surface-container-lowest border-none p-0 focus:ring-0 text-xl 
                       font-headline font-bold text-on-surface w-full"
                v-model="orcamento.limite"
                v-bind="mascara"
              />
            </div>
          </div>
          <Button 
            unstyled
            style="color: white"
            class="w-full py-4 bg-primary-container font-headline font-bold rounded-full 
                   transition-all active:scale-95 shadow-lg shadow-primary-container/20 
                   flex items-center justify-center gap-2 mt-10"
            @click="salvar()"       
          >
            {{ props.modo == 'inclusao' ? 'Criar' : 'Atualizar' }}
            <span class="material-symbols-outlined text-sm">
              {{ props.modo == 'inclusao' ? 'add_circle' : 'cached' }}               
            </span>
          </Button>
        </div>
      </section>
    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useConfirm, useToast } from 'primevue';
import Orcamento from '@/dto/Orcamento';
import ProgressoDoOrcamento from '@/dto/ProgressoDoOrcamento';
import OrcamentoClient from '@/client/OrcamentoClient';
import CurrencyUtil from '@/util/CurrencyUtil';
import { plainToInstance } from 'class-transformer';
import { unformat } from 'v-money3';

const confirmacao = useConfirm();

const toast = useToast();

const orcamentoClient = new OrcamentoClient();

const mascara = ref({
  decimal: ',',
  thousands: '.',  
  suffix: '',
  precision: 2,
  masked: true
});

const progresso = ref<ProgressoDoOrcamento>(new ProgressoDoOrcamento());

const orcamento = ref<Orcamento>(new Orcamento());

onMounted(() => {
  orcamentoClient.buscarProgresso()
    .then((progressoEncontrado: ProgressoDoOrcamento) => {

      progresso.value = progressoEncontrado;      
      
      if (props.modo === 'atualizacao'){
        orcamento.value.limite = CurrencyUtil.toBRL(progresso.value.totalOrcado);
      }

    });
});

const props = defineProps({
  modo: String
});

const salvar = () => {
  if (props.modo === 'inclusao'){
    confirmarAcao("Confirma o novo orçamento?", inserir);
  }else if (props.modo === 'atualizacao'){
    confirmarAcao("Confirma a atualização do orçamento?", atualizar);
  }
}

const showMsgDeSucesso = (msg: string) => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: msg,
    life: 4000,
  });
}

const inserir = () => {

  orcamento.value.limite = String(unformat(orcamento.value.limite, mascara.value));

  let novoOrcamento = plainToInstance(Orcamento, orcamento.value);
  
  orcamentoClient.inserir(novoOrcamento).then(() => {

    orcamentoClient.buscarProgresso()
      .then((progressoEncontrado: ProgressoDoOrcamento) => {        
        progresso.value = progressoEncontrado;
        orcamento.value = new Orcamento();
        showMsgDeSucesso("Novo orçamento criado!");
      });
    
  });
  
}

const atualizar = () => {

  let limite= Number(unformat(orcamento.value.limite, mascara.value));

  orcamentoClient.alterar(limite).then((orcamentoAtualizado: Orcamento) => {

    orcamentoClient.buscarProgresso()
      .then((progressoEncontrado: ProgressoDoOrcamento) => {        
        progresso.value = progressoEncontrado;
        orcamento.value = orcamentoAtualizado;
        showMsgDeSucesso("Orçamento atualizado!");
      });

  });

}

const confirmarAcao = (msg: string, callback: () => void) => {

  confirmacao.require({
    message: msg,
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
    accept: callback
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