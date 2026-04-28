<template>
  <div
    class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen"
  >
    <Header/>
    <main class="flex-1 p-4 space-y-6 pb-20">
      <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-plus-circle text-emerald-500"></i> 
          Novo Lançamento
        </h2>
        <div class="space-y-4">

          <Form
            :key="formKey"
            v-slot="$form"
            :initialValues="lancto" 
            :resolver="validatorResolver"
            class="space-y-6" 
            @submit="lancar"
          >
          
            <div class="flex flex-col gap-1">
              <label 
                class="text-xs font-medium text-slate-500 ml-1"
              >
                Categoria
              </label>
              <Select
                id="categoria" 
                v-model="lancto.categoria"
                :options="categs" 
                optionLabel="nome"
                placeholder="Selecionar Categoria" 
                fluid
                showClear
                size="small"
                :class="{ 'p-invalid': isValidarCampos && isCategoriaInvalida }"
                @change="validarCategoria"
              />
              <Message
                v-if="isValidarCampos && isCategoriaInvalida"
                severity="error"
                size="small"
                variant="simple"
              >
                A categoria é obrigatória
              </Message>
            </div>

            <div class="flex flex-col gap-1">
              <label 
                class="text-xs font-medium text-slate-500 ml-1"
              >
                Descrição
              </label>
              <InputText
                id="descricao"
                v-model="lancto.descricao"
                name="descricao"
                type="text" 
                placeholder="Descrição do gasto" 
                size="small"
              />
              <Message
                v-if="$form.descricao?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.descricao?.error.message }}
              </Message>
            </div>
          
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label 
                  class="text-xs font-medium text-slate-500 ml-1"
                >
                  Data
                </label> 
                <InputMask 
                  id="data" 
                  v-model="lancto.data"
                  name="data"
                  placeholder="DD/MM/AAAAA" 
                  mask="99/99/9999" 
                  size="small"
                />
                <Message
                  v-if="$form.data?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ $form.data?.error.message }}
                </Message>
              </div>              
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-500 ml-1">Valor (R$)</label>                
                <money3 
                  id="valor"
                  v-model="lancto.valor" 
                  v-bind="mascara" 
                  class="p-inputtext p-component p-inputtext-sm p-inputfield-sm"
                >
                </money3>
              </div>
            </div>

            <Button 
              class="w-full p-button-success mt-4 !bg-emerald-500 !border-none 
                    hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold py-4 
                    rounded-full flex justify-center items-center gap-2" 
              icon="pi pi-check" 
              label="Adicionar Lançamento"
              type="submit"
            />

          </Form>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-semibold">Progresso de Gastos Mensal</h2>
          <i class="pi pi-chart-bar text-emerald-500"></i>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-end">
            <div>
              <span class="text-xs text-slate-500 block mb-0.5">Gasto:</span>
              <span class="text-lg font-bold text-slate-800">
                {{ CurrencyUtil.toBRL(painel.resumoGeral.totalGasto) }}
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500 block mb-0.5">Limite:</span>
              <span class="text-sm font-semibold text-emerald-600">
                {{ CurrencyUtil.toBRL(painel.resumoGeral.totalOrcado) }}
              </span>
            </div>
          </div>
          <Progressbar 
            :show-value="false" 
            :value="painel.resumoGeral.percentualGasto" 
            style="height: 12px; border-radius: 10px"
          >
          </Progressbar>
          <p class="text-[11px] text-slate-400 text-center">
            Você utilizou 
            <span class="font-bold text-slate-600">
              {{ painel.resumoGeral.percentualGasto }}%
            </span> 
            do seu orçamento mensal.
          </p>
        </div>
      </section>

      <section class="space-y-3" data-purpose="category-summary">
        <h2 class="text-lg font-semibold px-1">
          Resumo por Categoria
        </h2>
        <div class="grid grid-cols-3 gap-3">
          <div 
            :key="resumo.categoria.id" 
            v-for="resumo in painel.resumoGeral.resumosPorCategoria"
            class="bg-white p-4 rounded-2xl border border-slate-100 
                   flex flex-col items-center text-center shadow-sm"             
          >
            <div class="relative w-16 h-16 mb-3">
              <svg width="60px" height="60px" viewBox="0 0 36 36">
                <path 
                  class="stroke-slate-200" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke-width="3"
                >
                </path>
                <path 
                  :stroke="resumo.categoria.cor" 
                  :stroke-dasharray="resumo.percentual + ', 100'" 
                  class="transition-all duration-500" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke-linecap="round" 
                  stroke-width="3"
                >
                </path>
              </svg>
              <div 
                class="absolute inset-0 flex items-center justify-center 
                        text-[10px] font-bold text-slate-500"
              >
                {{ resumo.percentual }}%
              </div>
            </div>

            <span class="text-xs font-bold text-slate-800 truncate w-full mb-1">
              {{ resumo.categoria.nome }}
            </span>

            <div class="flex flex-col gap-0.5">
              <p class="text-[10px] text-slate-400">
                Gasto: 
                <span 
                  class="font-medium"
                  :class="{ 
                    'text-emerald-700': resumo.gastos <= resumo.categoria.limite, 
                    'text-red-700': resumo.gastos > resumo.categoria.limite 
                  }"
                >
                  {{ CurrencyUtil.toBRL(resumo.gastos) }}
                </span>
              </p>
              <p class="text-[10px] text-slate-400">
                Limite: 
                <span class="text-slate-700 font-medium">
                  {{ CurrencyUtil.toBRL(resumo.categoria.limite) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
        <div class="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
          <h2 class="text-lg font-semibold">
            <i class="pi pi-calculator text-emerald-500"></i>
            Lançamentos
          </h2>
          <span class="text-base text-red-600 font-bold">
            Total: {{ CurrencyUtil.toBRL(painel.resumoGeral.totalGasto) }}
          </span>
        </div>

        <div class="divide-y divide-slate-200">
          <div 
            :key="lancto.id" 
            class="p-4 flex justify-between items-center active:bg-slate-50 transition-colors" 
            v-for="lancto in painel.lancamentos"
          >
            <div class="flex items-center gap-3">              
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white"
                :style="{
                  'background-color': getCorDaCategoria(lancto as Lancamento)
                }"
              >
                <i :class="getIconeDaCategoria(lancto as Lancamento)"></i>
              </div>              
              <div>
                <p class="font-medium text-sm text-slate-800">{{ lancto.categoria.nome }}</p>
                <p class="text-xs text-slate-400">{{ DateUtil.formatarData(lancto.data) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-bold text-slate-700">{{ CurrencyUtil.toBRL(Number(lancto.valor)) }}</span>
              <button 
                class="p-2 text-slate-300 hover:text-red-500"
                @click="remover(lancto as Lancamento)"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
          <div class="p-10 text-center text-slate-400" v-if="painel.lancamentos.length === 0">
            <i class="pi pi-inbox text-3xl mb-2"></i>
            <p>Sem transações ainda</p>
          </div>
        </div>
      </section>
    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { onMounted, ref } from 'vue';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { plainToInstance } from 'class-transformer';
import { useConfirm, useToast } from 'primevue';
import { unformat } from 'v-money3';
import LanctoClient from '@/client/LanctoClient';
import Lancamento from '@/dto/Lancamento';
import Categoria from '@/dto/Categoria';
import DateUtil from '@/util/DateUtil';
import CurrencyUtil from '@/util/CurrencyUtil';
import PainelFinanceiro from '@/dto/PainelFinanceiro';
import CategoriaClient from '@/client/CategoriaClient';

const confirmacao = useConfirm();

const toast = useToast();

const mascara = ref({
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
  precision: 2,
  masked: true
});

const formKey = ref(0);

const isValidarCampos = ref<boolean>(false);

const isCategoriaInvalida = ref<boolean>(false);

const lanctoClient = new LanctoClient();

const categoriaClient = new CategoriaClient();

const categs = ref<Categoria[]>([]);

const lancto = ref<Lancamento>(new Lancamento());

const painel = ref<PainelFinanceiro>(new PainelFinanceiro());

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    descricao: yup
      .string()
      .required("A descrição é obrigatória"),
    data: yup
      .string()
      .required("A data é obrigatória"),
  })
));

onMounted(() => {
  
  listarCategs();    
  
  lancto.value.data = DateUtil.formatarData(new Date());

  lanctoClient.buscarUltimoPainel()
    .then((painelEncontrado: PainelFinanceiro) => {
      painel.value = painelEncontrado;
    });    

});

const ativarReset = () => {
  formKey.value++;
  isValidarCampos.value = false;
}

const validarCategoria = () => {
  isCategoriaInvalida.value = lancto.value.categoria == null || lancto.value.categoria.id == 0;  
}

const lancar = ({ valid }: any) => {

  isValidarCampos.value = true;

  validarCategoria();

  if (valid){        

    if (!isCategoriaInvalida.value){      

      lancto.value.valor = String(unformat(lancto.value.valor, mascara.value));

      let novoLancto = plainToInstance(Lancamento, lancto.value);
  
      lanctoClient.inserir(novoLancto).then((painelResultante: PainelFinanceiro) => {
        
        painel.value = painelResultante;
        
        limparCampos();
    
        ativarReset();
  
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Lançamento criado com sucesso',
          life: 3000,
        });
  
      });  

    }    

  }     

}

const remover = (lanctoSelecionado: Lancamento) => {
  
  confirmacao.require({    
    message: 'Deseja realmente remover?',
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
    accept: () => {
      
      lanctoClient.removerPor(lanctoSelecionado.id).then(() => {

        lanctoClient.buscarUltimoPainel()
          .then((painelEncontrado: PainelFinanceiro) => {

            painel.value = painelEncontrado;

            toast.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Lançamento removido com sucesso',
              life: 3000,
            });

          });
        
      });

    }
  });

}

const listarCategs = () => {
  categoriaClient.listarTodas().then((categorias: Categoria[]) => {
    categs.value = categorias;
  });
}

const limparCampos = () => {
  lancto.value = new Lancamento();
  lancto.value.data = DateUtil.formatarData(Date());
}

const getCorDaCategoria = (lanctoSelecionado: Lancamento): any => {
  let categoria = categs.value.find(c => c.nome == lanctoSelecionado.categoria.nome);
  return categoria?.cor;
}

const getIconeDaCategoria = (lanctoSelecionado: Lancamento) => {
  let categoria = categs.value.find(c => c.nome == lanctoSelecionado.categoria.nome);
  return 'fa-solid ' + categoria?.icone;
}
</script>