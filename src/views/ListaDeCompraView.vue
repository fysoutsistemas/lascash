<template>
  <div
    id="painel-lista"
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
          {{ isEmEdicao ? 'Editar Lista' : 'Montar Lista' }}
        </h1>
        <p class="mt-0.5 text-[12.5px] text-slate-500">
          {{ isEmEdicao ? 'Atualize os produtos e a quantidade' : 'Selecione os produtos do catálogo' }}
        </p>
      </div>
      <span class="w-9 h-9 flex items-center justify-center text-emerald-600">
        <i class="pi pi-check-square text-3xl"></i>
      </span>
    </header>
    <main class="flex-1 p-4 flex flex-col gap-4 pb-[104px]">
      <Form
        ref="formRef"
        id="camposDaLista"
        v-slot="$form"
        :initialValues="lista" 
        :resolver="validatorResolver" 
        @submit="salvar" 
        class="bg-white rounded-[18px] p-[18px] flex flex-col gap-3.5
               shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
      >
        <section 
          class="bg-white flex flex-col rounded-[18px] px-[18px] py-4 
                 shadow-[0_4px_16px_rgba(15,23,42,0.06)] gap-2.5"
        >
          <label 
            class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide"
          >
            Nome da lista
          </label>
          <InputText 
            id="nome"
            v-model="lista.nome" 
            name="nome"
            type="text"
            placeholder="Ex: Compras da Semana" 
            class="w-full flex-1" 
            @blur="() => isAlterado = lista.nome != nomeInicialDaLista"
          />
          <Message
            v-if="$form.nome?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.nome?.error.message }}
          </Message>
        </section>  
      
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

        <section class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h2 class="text-[15px] font-extrabold text-slate-800">
              Catálogo de Produtos
            </h2>
            <span 
              class="text-xs font-bold text-emerald-600 
                     bg-emerald-100 px-2.5 py-1 rounded-full"
            >
              {{ produtosFiltrados.length }} no catálogo
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
          v-for="produto in produtosFiltrados" :key="produto.id" 
          @click="alternarSelecaoDo(produto as Produto)"
          class="flex items-center gap-3 rounded-2xl p-3 border-[1.5px] text-left 
                 w-full active:scale-[0.99] transition cursor-pointer"
          :class="isSelecionado(produto as Produto) 
                  ? 'bg-emerald-50 border-emerald-300' 
                  : 'bg-white border-slate-100'"
        >
          <span class="relative w-6 h-6 shrink-0">
            <span 
              class="w-6 h-6 rounded-[7px] border-2 flex items-center justify-center text-white"
              :class="isSelecionado(produto as Produto) 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'bg-white border-slate-300'"
            >            
              <i v-if="isSelecionado(produto as Produto)" class="pi pi-check text-white"></i>
            </span>
            <span 
              v-if="isSelecionado(produto as Produto)" 
              class="absolute -top-2 -left-2 min-w-[18px] h-[18px] px-1 rounded-full 
                     bg-emerald-600 text-white text-[10.5px] font-extrabold 
                     flex items-center justify-center shadow"
            >
              {{ getOrdem(produto as Produto) }}
            </span>
          </span>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <strong class="text-[14.5px] font-bold text-slate-800 leading-tight truncate">
              {{ produto.descricao }}
            </strong>
            <div class="flex items-center gap-2 flex-wrap">
              <span 
                class="text-[11px] font-extrabold px-2.5 py-[3px] rounded-full" 
                :style="{
                  'background-color': produto.categoria.cor
                }"
              >
                {{ produto.categoria.nome }}
              </span>
              <span class="text-[13.5px] font-extrabold text-emerald-600">
                {{ 
                   produto.precoEstimado == "" 
                  ? 'R$0,00' 
                  : CurrencyUtil.toBRL(Number(produto.precoEstimado)) 
                }}
              </span>
            </div>
          </div>
          <div class="flex flex-col items-center gap-1 shrink-0">
            <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Qtd</span>
            <div 
              class="flex items-center rounded-[9px] overflow-hidden" 
              :class="isSelecionado(produto as Produto) ? 'bg-emerald-100' : 'bg-slate-100'"
            >
              <button 
                type="button"
                @click.stop="atualizarQtdeDo(produto as Produto, -1)" 
                class="w-7 h-7 flex items-center justify-center text-[17px] 
                       font-extrabold active:scale-90 transition" 
                :class="isSelecionado(produto as Produto) ? 'text-emerald-700' : 'text-slate-400'"
              >
                −
              </button>
              <span 
                class="min-w-[22px] text-center text-sm font-extrabold" 
                :class="isSelecionado(produto as Produto) ? 'text-emerald-700' : 'text-slate-400'"
              >
                {{ getQtde(produto as Produto) }}
              </span>
              <button 
                type="button"
                class="w-7 h-7 flex items-center justify-center text-[17px] 
                       font-extrabold active:scale-90 transition" 
                :class="isSelecionado(produto as Produto) ? 'text-emerald-700' : 'text-slate-400'"
                @click.stop="atualizarQtdeDo(produto as Produto, 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </Form>  
    </main>

    <footer 
      class="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3.5 
             flex items-center gap-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]"
    >
      <div class="flex-1 flex flex-col">
        <strong class="text-[15px] font-extrabold text-slate-800">
          {{ 
             itensSelecionados.length === 1 
             ? '1 produto selecionado' 
             : itensSelecionados.length + ' produtos selecionados' 
          }}
        </strong>
        <span class="text-[12.5px] text-slate-500">
          Total estimado: {{ CurrencyUtil.toBRL(totalDaLista) }}
        </span>
      </div>
      <Button 
        type="submit"
        form="camposDaLista"
        :disabled="false" 
        class="!justify-center !bg-gradient-to-br !from-emerald-500 !to-emerald-600 
               !border-0 !rounded-xl !px-5 !py-3 !text-white !font-extrabold"
        icon="pi pi-plus"
        :label="isEmEdicao ? 'Salvar' : 'Criar Lista'"
      />
    </footer>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { onMounted, ref } from 'vue';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { useRouter } from 'vue-router';
import { useConfirm, useToast } from 'primevue';
import ProdutoClient from '@/client/ProdutoClient';
import ListaDeCompraClient from '@/client/ListaDeCompraClient';
import ListaDeCompra from '@/dto/ListaDeCompra';
import type Produto from '@/dto/Produto';
import CurrencyUtil from '@/util/CurrencyUtil';
import ItemDaListaResumido from '@/dto/ItemDaListaResumido';
import ListaDeCompraSalva from '@/dto/ListaDeCompraSalva';
import NovaListaDeCompra from '@/dto/NovaListaDeCompra';

const formRef = ref();

const router = useRouter();

const toast = useToast();

const confirmacao = useConfirm();

const isEmEdicao = ref<boolean>(false);

const produtoClient = new ProdutoClient();

const listaDeCompraClient = new ListaDeCompraClient();

const lista = ref<ListaDeCompra>(new ListaDeCompra());

const produtos = ref<Produto[]>([]);

const produtosFiltrados = ref<Produto[]>([]);

const itensSelecionados = ref<ItemDaListaResumido[]>([]);

const filtroPorNome = ref<string>("");

const totalDaLista = ref<number>(0.0);

const isAlterado = ref<boolean>(false);

const nomeInicialDaLista = ref<string>("");

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    nome: yup
      .string()
      .required("O nome é obrigatório"),
  })
));

onMounted(async () => {

  isEmEdicao.value = props.idDaLista != undefined;

  produtos.value = await produtoClient.listarAtivos();

  produtosFiltrados.value = produtos.value;
  
  if (isEmEdicao.value){

    lista.value = await listaDeCompraClient.buscarPor(props.idDaLista as number);

    formRef.value.setValues({ ...lista.value });

    nomeInicialDaLista.value = lista.value.nome;

    itensSelecionados.value = lista.value.itens.map(il => {
      return new ItemDaListaResumido(il.produto.id, il.qtde, il.ordem);
    });

    atualizarTotal();

  }  

});

//Declara uma propriedade numérica e opcional
//Será lido na montagem do componente
const props = defineProps<{
  idDaLista?: number
}>();

const salvar = ({ valid }: any) => {
    
  if (valid){

    if (isEmEdicao.value){

      let listaSalva = new ListaDeCompraSalva(lista.value.id, 
          lista.value.nome, itensSelecionados.value);

      listaDeCompraClient.alterar(listaSalva).then((_: ListaDeCompra) => {

        filtroPorNome.value = "";

        isAlterado.value = false;
        
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Lista atualizada com sucesso',
          life: 3000,
        });

      });

    }else{

      let novaLista = new NovaListaDeCompra(lista.value.nome, itensSelecionados.value);

      listaDeCompraClient.inserir(novaLista).then((listaSalva: ListaDeCompra) => {

        lista.value.id = listaSalva.id;

        isEmEdicao.value = true;

        isAlterado.value = false;

        filtroPorNome.value = "";

        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Lista criada com sucesso',
          life: 3000,
        });

      });

    }

  }

  document.getElementById("painel-lista")?.scrollIntoView();

}  

const alternarSelecaoDo = (prodSel: Produto) => {

  let indice = itensSelecionados.value.findIndex(item => prodSel.id == item.idDoProduto);

  if (indice >= 0){
    itensSelecionados.value.splice(indice, 1);
  }else{
    itensSelecionados.value.push(new ItemDaListaResumido(prodSel.id, 1));
  }

  atualizarTotal();

  isAlterado.value = true;
  
}

const isSelecionado = (prodSel: Produto): boolean => {
  return itensSelecionados.value.findIndex(item => prodSel.id == item.idDoProduto) >= 0;
}

const getOrdem = (prodSel: Produto): number => {
  let indice = itensSelecionados.value.findIndex(item => prodSel.id == item.idDoProduto);
  if (indice >= 0){
    itensSelecionados.value[indice].ordem = indice + 1;
    return itensSelecionados.value[indice].ordem;
  }
  return -1;
} 

const getQtde = (prodSel: Produto): number => {
  let indice = itensSelecionados.value.findIndex(item => prodSel.id == item.idDoProduto);
  return indice >= 0 ? itensSelecionados.value[indice].qtde : 1;
} 

const atualizarTotal = () => {

  //Atualiza o total da lista
  totalDaLista.value = 0.0;

  itensSelecionados.value.forEach((item: ItemDaListaResumido) => {
    let indice = produtos.value.findIndex(p => p.id == item.idDoProduto);
    totalDaLista.value += item.qtde * Number(produtos.value[indice].precoEstimado);
  });    

}

const atualizarQtdeDo = (prodSel: Produto, delta: number) => {
  
  let indice = itensSelecionados.value.findIndex(item => prodSel.id == item.idDoProduto);  
  
  if (indice >= 0){
    
    let novaQtde = itensSelecionados.value[indice].qtde + delta;

    if (novaQtde > 0){
      itensSelecionados.value[indice].qtde = novaQtde;
    }

  }else{
    itensSelecionados.value.push(new ItemDaListaResumido(prodSel.id, 1));
  }

  atualizarTotal();

  isAlterado.value = true;

}

const listarPorDescricao = () => {
  produtosFiltrados.value = produtos.value.filter(p => {
    return p.descricao.toUpperCase().includes(filtroPorNome.value.toUpperCase());
  });  
}

const redirectToPainel = () => {

  if (isAlterado.value){

    confirmacao.require({    
      message: 'Deseja sair da tela? Suas alterações serão PERDIDAS!',
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
        router.push("/painel-compras");    
      }
    });  

  }else{
    router.push("/painel-compras");
  }

}
</script>