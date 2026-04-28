<template>
  <div>
    <header class="p-4 bg-white border-b border-slate-200">  
      <h1 class="text-xl font-bold text-primary p-2 w-full text-center">LarCa$h</h1>
    </header>    
    <main class="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">      
      <div class="relative mb-8">
        <div class="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center relative">
          <span 
            class="symbol text-primary text-[120px] opacity-20"
          >
            savings
          </span>
          <div class="absolute inset-0 flex items-center justify-center">
            <span 
              class="symbol text-primary text-8xl"
            >
              search
            </span>
          </div>
        </div>        
      </div>

      <!-- Text Content -->
      <div class="max-w-md space-y-4">
        <h2 class="text-7xl font-extrabold text-primary/30 tracking-tighter">404</h2>
        <h3 class="text-2xl font-bold text-slate-900 leading-tight">
          Ops! Página não encontrada
        </h3>
        <p class="text-slate-600 text-lg leading-relaxed">
          Parece que o caminho que você tentou acessar não existe ou foi movido.
        </p>
      </div>

      <!-- Action Button -->
      <div class="mt-10 w-full max-w-xs">
        <Button          
          class="w-full text-white font-bold py-4 px-8 !rounded-full shadow-lg
                 !bg-emerald-500 hover:!bg-emerald-600 my-8"
          @click="redirecionarParaHome"       
        >
          <span class="material-symbols-outlined">home</span>
          Voltar para o Início
        </Button>
      </div>
    </main>    
    <footer class="pt-20 text-center">
      <div class="flex flex-col items-center gap-2 opacity-50">
        <div class="flex items-center gap-1">
          <span 
            class="text-primary text-xl" 
            style="font-variation-settings: 'FILL' 1"
          >
            account_balance_wallet
          </span>
          <span class="text-slate-900 font-bold tracking-tight">LarCa$h</span>
        </div>
        <p class="text-xs text-slate-500">© 2026 Gestão Financeira Familiar</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/composables/useNavigationStore';
import { useRouter } from 'vue-router';

const navigation = useNavigationStore();

const router = useRouter();

const { resetarNavegacao } = navigation;

const redirecionarParaHome = () => {
  resetarNavegacao();
  router.push("/");
}
  
</script>