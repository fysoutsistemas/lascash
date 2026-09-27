<template>
  <InputText 
    unstyled
    class="w-12 h-14.5 rounded-xl text-center text-2xl border-3           
           focus:ring-0 focus:bg-[#ecfdf5] focus:border-[#10b981]
           focus:outline-none font-extrabold text-[#0f172a] p-0
           bg-[#f8fafc] border-[#e6e9f0]"
    :class="{ 
      'bg-[#fef2f2]': isInvalido,       
      'border-[#fca5a5]': isInvalido,      
    }"
    maxLength="1"
    v-model="modelValue as string"    
    @focus="aoFocar"
    @keyup="aoDigitar"
  />
</template>

<script setup lang="ts">
const modelValue = defineModel('modelValue');

interface Props {
  isInvalido: boolean,
  proximoCampo?: string,
  aoValidarValor?: Function
}

const props = withDefaults(defineProps<Props>(), {
  isInvalido: false,
  proximoCampo: ""
});

const aoFocar = (e: any) => {
  e.target.select();  
}

const aoDigitar = () => {
  if (modelValue.value && props.proximoCampo !== ""){
    document.getElementById(props.proximoCampo)?.focus();
  }
}
</script>