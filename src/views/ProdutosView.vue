<template>
  <div
    id="painel-compras"
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
        <h1 class="text-[19px] font-extrabold text-emerald-600">Cadastrar Produtos</h1>
      </div>
      <span class="w-9 h-9 flex items-center justify-center text-emerald-600">
        <i class="pi pi-folder text-3xl"></i>
      </span>
    </header>
    <main class="flex-1 p-4 flex flex-col gap-[18px] mb-20">

      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFilePicked" />
      
      <Form
        :key="formKey"
        ref="formRef"
        v-slot="$form"
        :initialValues="produto" 
        :resolver="validatorResolver" 
        @submit="salvar" 
        class="bg-white rounded-[18px] p-[18px] flex flex-col gap-3.5
               shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
      >
        <div id="campos-cadastro" class="flex items-center gap-2">
          <span 
            class="w-[26px] h-[26px] rounded-lg bg-amber-100 text-amber-600 
                   flex items-center justify-center"
          >
            <i class="pi pi-box text-3xl"></i>
          </span>
          <h2 class="text-[15.5px] font-extrabold text-slate-800">
            {{ produto.id > 0 ? 'Editar Produto' : 'Novo Produto' }}
          </h2>
        </div>

        <div class="flex gap-3 items-stretch">
          <div class="relative w-[84px] h-[84px] shrink-0">
            <button 
              type="button"            
              class="w-[84px] h-[84px] rounded-[14px] border-2 border-dashed 
                    border-amber-300 bg-amber-50 bg-cover bg-center flex flex-col 
                    items-center justify-center gap-1 text-amber-600 
                    active:scale-[0.96] transition shrink-0 overflow-hidden"
              :style="produto.foto ? { backgroundImage: 'url(' + produto.foto + ')' } : {}"       
              @click="pickFormPhoto"       
            >
              <template v-if="!produto.foto">              
                <i class="pi pi-camera text-3xl" style="font-size: 1.5rem"></i>
                <span class="text-[9.5px] font-bold leading-none">FOTO</span>
              </template>
            </button>
            <button 
              v-if="produto.foto != ''" 
              type="button" 
              @click="produto.foto = ''" 
              title="Remover imagem"
              class="absolute -left-1.5 -bottom-1.5 flex items-center gap-1 
                    bg-white border-[1.5px] border-red-200 rounded-full pl-1.5 
                    pr-2 py-0.5 text-[10px] font-extrabold text-red-500 
                    shadow active:scale-90 transition"
            >
              <i class="pi pi-times text-sm"></i> 
              Remover
            </button>
          </div>
          <div class="flex-1 flex flex-col gap-1.5">
            <label 
              class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide"
            >
              Descrição
            </label>
            <InputText 
              id="descricao"
              v-model="produto.descricao" 
              name="descricao"
              type="text"
              placeholder="Ex.: Arroz integral 1kg" 
              class="w-full flex-1" 
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
        </div>
        <div class="flex flex-col gap-3">
          <div class="flex-1 flex flex-col gap-1.5">
            <label 
              class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide"
            >
              Preço Estimado
            </label>
            <money3 
              id="valor"
              v-model="produto.precoEstimado" 
              v-bind="mascara" 
              class="p-inputtext p-component p-inputtext-sm p-inputfield-sm"
            >
            </money3>
          </div>
          <div class="flex-1 flex flex-col gap-1.5">
            <label 
              class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide"
            >
              Categoria
            </label>
            <Select 
              id="categoria"
              v-model="produto.categoria" 
              :options="categs" 
              optionLabel="nome" 
              placeholder="Selecione..." 
              class="w-full"
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
              Campo obrigatório
            </Message>
          </div>
        </div>
        <div class="flex gap-2.5 mt-1">
          <Button 
            v-if="produto.id > 0" 
            type="button" 
            severity="secondary" 
            @click="cancelarEdicao" 
            class="!justify-center !bg-slate-100 !border-0 !text-slate-600 
                   !rounded-xl !py-3.5 !px-4 !font-extrabold"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            class="!flex-1 !justify-center !bg-gradient-to-br !from-emerald-500 truncate
                   !to-emerald-600 !border-0 !rounded-xl !py-3.5 !text-white !font-extrabold"
            icon="pi pi-check"       
            :label="produto.id > 0 ? 'Salvar Alterações' : 'Salvar Produto'"
          />
        </div>
      </Form>

      <div 
        class="flex items-center gap-2.5 bg-white border-[1.5px] 
               border-slate-200 rounded-xl px-3.5"
      >
        <i class="pi pi-search text-slate-400"></i>
        <InputText
          unstyled 
          v-model="filtroPorNome" 
          placeholder="Filtrar por descrição..." 
          class="flex-1 border-none bg-transparent py-3 
                 text-sm text-slate-800 focus:ring-primary/0"
          @input="listarPorDescricao()"
        />
      </div>

      <div 
        v-if="produtoDaVisualizacao" 
        @click="produtoDaVisualizacao = null" 
        class="fixed inset-0 z-[80] bg-slate-950/85 flex items-center justify-center p-6"
      >
        <div @click.stop class="bg-white rounded-[18px] p-3.5 max-w-full flex flex-col gap-3 shadow-2xl">
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

      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h2 class="text-[15px] font-extrabold text-slate-800">
            Produtos Salvos
          </h2>
          <span 
            class="text-xs font-bold text-emerald-600 
                   bg-emerald-100 px-2.5 py-1 rounded-full"
          >
            {{ produtosFiltrados.length }} produtos
          </span>
        </div>
      </section>

      <div 
        v-if="produtosFiltrados.length == 0" 
        class="bg-white border-[1.5px] border-dashed border-slate-200 rounded-2xl 
               px-5 py-8 flex flex-col items-center gap-2 text-center"
      >
        <span 
          class="w-12 h-12 rounded-[14px] bg-slate-100 text-slate-400 
                 flex items-center justify-center"
        >
          <i class="pi pi-folder text-slate-400" style="font-size: 1.5rem"></i>
        </span>
        <p v-if="filtroPorNome.trim()" class="text-[13.5px] text-slate-500 font-semibold">
          Nenhum produto encontrado para essa descrição.
        </p>
        <p v-else class="text-[13.5px] text-slate-500 font-semibold">
          Nenhum produto cadastrado ainda.<br>Preencha o formulário acima para começar.
        </p>
      </div>

      <div 
        v-for="p in produtosFiltrados" :key="p.id" 
        class="card-enter bg-white rounded-2xl p-3 items-center
               flex gap-3 shadow-[0_3px_12px_rgba(15,23,42,0.05)]"
      >
        <button           
          class="w-[60px] h-[60px] rounded-xl bg-slate-100 bg-cover bg-center 
                 flex items-center justify-center text-slate-400 active:scale-95 
                 transition shrink-0 overflow-hidden"
          :style="p.foto ? { backgroundImage: 'url(' + p.foto + ')' } : {}"
          @click="aoSelecionarFoto(p as Produto)"
          :disabled="!p.foto"
        >
          <i v-if="!p.foto" class="pi pi-camera text-3xl"></i>
        </button>
        <div class="flex-1 min-w-0 flex flex-col gap-1.5">
          <strong 
            class="text-[14.5px] font-bold text-slate-800 
                   leading-tight truncate"
          >
            {{ p.descricao }}
          </strong>
          <div class="flex items-center gap-2 flex-wrap">
            <span 
              class="text-[11px] font-extrabold px-2.5 py-[3px] rounded-full"              
              :style="{
                'background-color': p.categoria.cor
              }"
            >
              <span class="text-extrabold">{{ p.categoria.nome }}</span>
            </span>
            <span class="text-[13.5px] font-extrabold text-emerald-600">
              {{ p.precoEstimado == "" ? 'R$0,00' : CurrencyUtil.toBRL(Number(p.precoEstimado)) }}
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <Button
            text 
            class="!w-[34px] !h-[34px] !bg-amber-100 !text-amber-600" 
            aria-label="Editar"
            icon="pi pi-pencil"            
            @click="editar(p as Produto)"
          />
          <Button 
            text 
            severity="danger" 
            class="!w-[34px] !h-[34px] !bg-red-50 !text-red-500"             
            aria-label="Remover"
            icon="pi pi-trash"
            @click="remover(p as Produto)"
          />
        </div>
      </div>
    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { onMounted, ref } from 'vue';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { useRouter } from 'vue-router';
import { useConfirm, useToast } from 'primevue';
import { unformat } from 'v-money3';
import { plainToInstance } from 'class-transformer';
import CurrencyUtil from '@/util/CurrencyUtil';
import CategoriaDoProdClient from '@/client/CategoriaDoProdClient';
import ProdutoClient from '@/client/ProdutoClient';
import CategoriaDoProduto from '@/dto/CategoriaDoProduto';
import Produto from '@/dto/Produto';
import FileUtil from '@/util/FileUtil';

const router = useRouter();

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

const formRef = ref();

const fileInput = ref<any | null>(null);

const isValidarCampos = ref<boolean>(false);

const isCategoriaInvalida = ref<boolean>(false);

const produtoClient = new ProdutoClient();

const categoriaClient = new CategoriaDoProdClient();

const categs = ref<CategoriaDoProduto[]>([]);

const produtos = ref<Produto[]>([]);

const produtosFiltrados = ref<Produto[]>([]);

const produto = ref<Produto>(new Produto());

const produtoDaVisualizacao = ref<Produto | null>(null);

const filtroPorNome = ref<string>("");

let photoTarget: any = null;

const tamanhoMaximoDaFoto = 0.5;// 500kb

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    descricao: yup
      .string()
      .required("A descrição é obrigatória"),
  })
));

onMounted(() => {
  listarCategs();
  listarProdutos();
});  

const ativarReset = () => {
  formKey.value++;
  isValidarCampos.value = false;
  formRef.value.reset();
}

const validarCategoria = () => {
  isCategoriaInvalida.value = produto.value.categoria == null || produto.value.categoria.id == 0;  
}

const salvar = ({ valid }: any) => {
  
  isValidarCampos.value = true;

  validarCategoria();

  if (valid){

    if (!isCategoriaInvalida.value){

      if (produto.value.precoEstimado){
        produto.value.precoEstimado = String(unformat(produto.value.precoEstimado, mascara.value));
      }

      let prod = plainToInstance(Produto, produto.value);

      produtoClient.salvar(prod).then((_: Produto) => {

        produto.value = new Produto();
        
        ativarReset();

        listarProdutos();

        filtroPorNome.value = "";

        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto salvo com sucesso',
          life: 3000,
        });        

      });

    }  

  }  

}

const editar = (produtoSelecionado: Produto) => {
  produto.value = plainToInstance(Produto, produtoSelecionado);
  formRef.value.setValues({ ...produto.value });
  isCategoriaInvalida.value = false;
  document.getElementById("painel-compras")?.scrollIntoView();
}

const remover = (produtoSelecionado: Produto) => {

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
    accept: async () => {

      await produtoClient.inativarPor(produtoSelecionado.id);
      
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Produto removido com sucesso',
        life: 3000,
      });

      listarProdutos();
    }
  });  

} 

const cancelarEdicao = () => {
  produto.value = new Produto();
}

const aoSelecionarFoto = (produtoSelecionado: Produto) => {
  produtoDaVisualizacao.value = plainToInstance(Produto, produtoSelecionado);
}

const pickFormPhoto = () => { 
  photoTarget = 'form'; 
  fileInput.value.value = ''; 
  fileInput.value.click(); 
};

const onFilePicked = (e: any) => {
  
  const file = e.target.files[0]; 

  if (file){

    const reader = new FileReader();

    reader.onload = (ev: any) => {

      let base64File = ev.target.result;

      if (FileUtil.isTamanhoLiberado(base64File, tamanhoMaximoDaFoto)){

        if (photoTarget === 'form') {
          produto.value.foto = ev.target.result;
        } else { 
  
          const p = produtos.value.find(x => x.id === photoTarget); 
        
          if (p) {
            p.foto = ev.target.result; 
          }  
  
        }

      } else {

        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: "A foto do produto não deve ser maior que 500kb",
          life: 3000,
        });

      } 


    };

    reader.readAsDataURL(file);

  }

};

const listarPorDescricao = () => {
  produtosFiltrados.value = produtos.value.filter(p => {
    return p.descricao.toUpperCase().includes(filtroPorNome.value.toUpperCase());
  });  
}

const listarProdutos = () => {
  produtoClient.listarAtivos().then((prods: Produto[]) => {
    produtos.value = prods;
    produtosFiltrados.value = prods;
  });
}

const listarCategs = () => {
  categoriaClient.listarAtivas().then((categorias: CategoriaDoProduto[]) => {
    categs.value = categorias;
  });
} 

const redirectToPainel = () => {
  router.push("/painel-compras");
}
</script>