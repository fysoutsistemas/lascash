<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 bg-white border-t 
           border-slate-200 safe-area-bottom z-50 w-full max-w-md mx-auto"
  >
    <div class="flex justify-around items-center py-3">
      <button 
        v-for="item in items" :key="item.label" 
        :class="{ 
          'text-emerald-600': item.isAtivo,
          'text-slate-400': !item.isAtivo
        }"
        class="flex flex-col items-center gap-1 "
        @click="redirecionar(item)"
      >
        <i 
          class="pi text-xl"
          :class="item.icone"
        >
        </i>
        <span class="text-[10px] font-bold uppercase tracking-wider"> 
          {{ item.label }} 
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/composables/useNavigationStore';

const navigation = useNavigationStore();

const { 
  items,   
  redirecionar  
} = navigation;

</script>