<template>
  <div class="group">
    <label class="block text-xs font-semibold text-on-surface-variant mb-2 ml-1">
      {{ label }}
    </label>
    <InputText
      unstyled
      class="w-full px-4 py-3.5 bg-surface-container-lowest border-none 
             rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface 
             font-medium transition-all outline-none" 
      :placeholder="placeholder"
      type="text"
      :name="nameValidation"
      v-model="modelValue as string"
    />
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
const modelValue = defineModel('modelValue');

interface Props {
  label: string,  
  placeholder?: string,  
  nameValidation: string,
  isInvalido: boolean,
  msgDeErro: string
}

const props = withDefaults(defineProps<Props>(), {
  isInvalido: false,
  msgDeErro: ''
});
</script>

<style lang="css" scoped>
.text-on-surface {
  color: #191c1e;
}

.text-on-surface-variant {
  color: #3c4a42;
}

.bg-surface-container-lowest {
  background: #ffffff;
}
</style>