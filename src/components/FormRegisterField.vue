<template>
  <div 
    class="flex flex-col gap-2"
    :class="estilos"
  >
    <label 
      class="text-xs font-semibold text-on-surface-variant ml-1"
    >
      {{ label }}
    </label>
    <div class="relative group">
      <div 
        v-if="tipo == 'monetario'"
        class="absolute left-4 top-1/2 -translate-y-1/2 
               text-on-surface font-semibold pointer-events-none"
      >
        R$
      </div>
      <money3 
        v-if="tipo == 'monetario'"
        v-bind="mascara"
        class="w-full bg-surface-container-low border-none rounded-xl pl-11 
               pr-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 
               focus:ring-primary/20 transition-all outline-none" 
        placeholder="0,00" 
        type="text"
        v-model="modelValue"
        @change="aoValidarValor"
      >
      </money3>
      <InputText
        unstyled
        v-if="tipo != 'monetario' && tipo != 'telefone'"
        class="w-full bg-surface-container-low border-none rounded-xl 
               px-4 py-3.5 text-on-surface placeholder:text-outline 
               focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
        :class="cssField"
        :placeholder="placeholder" 
        :type="tipo"
        :name="nameValidation"
        v-model="modelValue"
      />
      <InputText
        unstyled  
        v-if="tipo == 'telefone'"
        class="w-full bg-surface-container-low border-none rounded-xl 
               px-4 py-3.5 text-on-surface placeholder:text-outline 
               focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
        v-model="modelValue"
        v-maska
        :name="nameValidation"
        data-maska="+55 (##) #####-####"
        placeholder="+55 (99) 99999-9999"        
        @maska="onMaska"
      />      
      <span 
        class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 
               text-outline group-focus-within:text-primary transition-colors"
      >
        {{ icone }}
      </span>
    </div>
    <span 
      v-if="tipo == 'monetario'"
      class="text-[10px] text-on-surface-variant italic ml-1"
    >
      * Estimativa inicial para o planejamento familiar
    </span>
    <Message
      v-if="isInvalido"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ msgDeErro }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { vMaska } from 'maska/vue'
import type { MaskaDetail } from 'maska'

const mascara = ref({
  decimal: ',',
  thousands: '.',  
  suffix: '',
  precision: 2,
  masked: true
});

const modelValue = defineModel<string>('modelValue');

const unmaskedValue = ref<string>('');

interface Props {
  label: string,
  estilos?: string,
  cssField?: string,
  tipo: 'text' | 'password' | 'monetario' | 'telefone'
  icone: string,  
  placeholder?: string,  
  nameValidation: string
  id: string,
  isInvalido: boolean,
  msgDeErro: string
  aoValidarValor?: Function
}

const props = withDefaults(defineProps<Props>(), {
  tipo: 'text',
  isInvalido: false,
  msgDeErro: ''  
});

// Evento disparado pela biblioteca toda vez que o input muda
const onMaska = (event: CustomEvent<MaskaDetail>) => {
  unmaskedValue.value = event.detail.unmasked
}
</script>

<style lang="css" scoped>
.text-on-surface {
  color: #191c1e;
}

.text-on-surface-variant {
  color: #3c4a42;
}

.text-outline {
  color: #6c7a71;
}

.bg-surface-container-lowest {
  background: #ffffff;
}

.bg-surface-container-low {
  background: #f2f4f6;
}
</style>