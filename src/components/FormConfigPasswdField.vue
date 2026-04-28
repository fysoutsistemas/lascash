<template>
  <div class="group">
    <label class="block text-xs font-semibold text-on-surface-variant mb-2 ml-1">
      {{ label }}
    </label>
    <div 
      v-if="tipo == 'on-off'"
      class="relative"
    >
      <InputText
        unstyled
        v-model="modelValue as string"
        class="w-full px-4 py-3.5 bg-surface-container-lowest border-none 
               rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface 
               font-medium transition-all outline-none"
        :type="isShowPasswd ? 'password' : 'text'"
      />
      <span
        @click="() => isShowPasswd = !isShowPasswd"
        class="material-symbols-outlined absolute right-4 top-1/2 
               -translate-y-1/2 text-slate-400 hover:cursor-pointer"
      >
       {{ isShowPasswd ? 'visibility_off' : 'visibility' }}
      </span>
    </div>
    <div 
      v-if="tipo != 'on-off'"
      class="relative"
    >
      <InputText         
        unstyled
        v-model="modelValue as string"
        class="w-full px-4 py-3.5 bg-surface-container-lowest border-none 
               rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface 
               font-medium transition-all outline-none"
        type="password"
      />
      <span
        class="material-symbols-outlined absolute right-4 top-1/2 
               -translate-y-1/2 text-slate-400"
      >
       {{ tipo == 'basic' ? 'lock' : tipo == 'confirm' ? 'verified_user' : 'lock' }}
      </span>
    </div>
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

const modelValue = defineModel('modelValue');

const isShowPasswd = ref<boolean>(true);

interface Props {
  label: string,  
  tipo: 'on-off' | 'basic' | 'confirm'
  placeholder?: string,
  nameValidation: string,
  isInvalido: boolean,
  msgDeErro: string
}

const props = withDefaults(defineProps<Props>(), {
  tipo: 'on-off',
  isInvalido: false,
  msgDeErro: ''
});
</script>

<style lang="css" scoped>
.text-on-surface {
  color: #191c1e;
}

.bg-surface-container-lowest {
  background: #ffffff;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.text-on-surface-variant {
  color: #3c4a42;
}
</style>