<template>
  <div class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen">
    <header class="w-full top-0 sticky z-50 bg-white">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <button
          @click="redirectToMain()"
          class="text-emerald-900 hover:bg-emerald-50 transition-colors p-2 
                 rounded-full active:opacity-80 scale-95 transition-all"
        >
          <span class="material-symbols-outlined">
            arrow_back
          </span>
        </button>
        <div class="text-2xl font-black tracking-tight text-emerald-600">
          Editar Limites
        </div>
        <div class="w-10"></div>
      </div>
    </header>
    <main id="main-edicao" class="flex-1 space-y-6 pb-40 bg-surface">
      <Form 
        @submit="salvar"
      >

        <div class="px-6 pt-6 pb-5 max-w-lg mx-auto">
          <!-- Título da tela -->
          <div class="flex items-center">
            <div>
              <p class="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">
                Total do Orçamento
              </p>
              <h2 class="font-headline font-extrabold text-2xl tracking-tight text-on-surface">
                {{ CurrencyUtil.toBRL(progresso.totalOrcado) }}
              </h2>
            </div>
          </div> 
        </div>
        
        <div class="mx-5 bg-primary/5 p-5 rounded-2xl border border-primary/10 flex gap-4 items-start">
          <span class="material-symbols-outlined text-primary mt-0.5">
            wallet
          </span>
          <div class="space-y-1">
            <h4 class="font-bold text-sm text-primary">Limites das Categorias</h4>
            <p class="text-xs leading-relaxed text-on-surface-variant">
              Defina limites para cada grupo de gastos a partir do total do orçamento.
            </p>
          </div>
        </div>

        <div
          :key="categ.id"
          v-for="categ in categs"
        >
          <FormLimiteField             
            :id="String(categ.id)"
            :label="categ.nome"
            :cor="categ.cor"
            :icone="categ.icone"
            v-model:modelValue="categ.limite"
          />
        </div>

        <div class="mx-5">
          <Button
            class="w-full p-button-success !bg-emerald-500 !border-none 
                  hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold
                  rounded-full flex justify-center items-center"
            icon="pi pi-refresh" 
            label="Atualizar Limites"
            type="submit"
          />
        </div>

      </Form>
    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue';
import { unformat } from 'v-money3';
import { useRouter } from 'vue-router';
import { usePerfilStore } from '@/composables/usePerfilStore';
import CategoriaClient from '@/client/CategoriaClient';
import OrcamentoClient from '@/client/OrcamentoClient';
import Categoria from '@/dto/Categoria';
import NovoLimiteDaCategoria from '@/dto/NovoLimiteDaCategoria';
import ProgressoDoOrcamento from '@/dto/ProgressoDoOrcamento';
import CurrencyUtil from '@/util/CurrencyUtil';

const perfilStore = usePerfilStore();

const router = useRouter();

const toast = useToast();

const { atualizarCategsConfigs, isCategsConfiguradas } = perfilStore;

const mascara = ref({
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
  precision: 2,
  masked: true
});

const orcamentoClient = new OrcamentoClient();

const categoriaClient = new CategoriaClient();

const categs = ref<Categoria[]>([]);

const progresso = ref<ProgressoDoOrcamento>(new ProgressoDoOrcamento());

onMounted(() => {

  listarCategs();

  orcamentoClient.buscarProgresso()
    .then((progressoEncontrado: ProgressoDoOrcamento) => {
      progresso.value = progressoEncontrado;
    });

});  

const listarCategs = () => {
  categoriaClient.listarTodas().then((categorias: Categoria[]) => {    
    categs.value = categorias;
  });  
}

const salvar = () => {

  let novosLimites = categs.value.map(c => {
    
    let limite = new NovoLimiteDaCategoria();
    
    limite.idDaCategoria = c.id;    

    limite.valor = typeof c.limite === "number" ? c.limite : String(unformat(c.limite, mascara.value));

    return limite;
    
  });  

  categoriaClient.alterarLimiteDeTodas(novosLimites)
    .then((categsAtualizadas: Categoria[]) => {

      categs.value = categsAtualizadas;

      let isRedirecionar = !isCategsConfiguradas();

      atualizarCategsConfigs("S");
      
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Limites atualizados com sucesso',
        life: 3000,
      });

      if (isRedirecionar){
        router.push("/despesas");      
      }

    });

}

const redirectToMain = () => {
  router.push("/");
}
</script>

<style lang="css" scoped>
.bg-surface {
  background: #f7f9fb;
}

.text-on-surface {
  color: #191c1e;
}

.text-on-surface-variant {
  color: #3c4a42;
}

.text-primary-container {
  color: #10b981;  
}

.bg-surface-container-lowest {
  background: #ffffff;
}

.bg-surface-container-low {
  background: #f2f4f6;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.editorial-shadow {
  box-shadow: 0 10px 30px -5px rgba(16, 185, 129, 0.1);
}
</style>
