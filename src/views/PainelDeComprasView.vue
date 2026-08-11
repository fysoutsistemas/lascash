<template>
  <div
    id="paine-compras"
    class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen"
  >
    <Header/>
    <main class="flex flex-col gap-4 p-4 flex-1">
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
            Cadastrar Produtos
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
            <i class="pi pi-folder text-3xl"></i>
          </span>
          <span 
            class="text-xs font-bold text-gray-700 text-center leading-snug"
          >
            Listas Criadas
          </span>
        </button>
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
import { useRouter } from 'vue-router';

const router = useRouter();

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