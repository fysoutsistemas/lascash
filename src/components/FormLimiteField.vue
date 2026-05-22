<template>
  <div 
    class="bg-surface-container-lowest rounded-2xl 
           editorial-shadow"
    :class="estilos"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          class="mr-1 w-10 h-10 rounded-full flex items-center justify-center text-white"
          :style="{
            'background-color': `${cor}`
          }"
        >
          <i class="fa-solid" :class="icone"></i>
        </div>
        <label class="font-bold text-on-surface truncate">
          {{ label }}
        </label>
      </div>
      <div class="relative w-32 rounded-xl">
        <span 
          class="absolute left-3 top-1/2 -translate-y-1/2 text-xs 
                 font-bold text-on-surface-variant"
        >
          R$
        </span>
        <money3
          :id="id" 
          v-bind="mascara"
          class="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border-none 
                 rounded-xl text-sm font-bold text-on-surface text-right
                 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
          placeholder="0,00"
          type="text"
          v-model="modelValue"
        >
        </money3>
      </div>    
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mascara = ref({
  decimal: ',',
  thousands: '.',  
  suffix: '',
  precision: 2,
  masked: true
});

const modelValue = defineModel('modelValue');

interface Props {
  label: string,
  cor: string,
  estilos?: string,
  icone: string,
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  estilos: 'p-5 mx-5 my-5'
});
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