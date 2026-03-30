<template>
  <div v-if="isLoading" class="global-loading-overlay">
    <div class="global-loading-content">
      <ProgressSpinner 
        style="width: 60px; height: 60px"
        strokeWidth="4"
        animationDuration="1s"
      />
      <p class="global-loading-text">Carregando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isLoading } from '@/composables/useAxios';
</script>