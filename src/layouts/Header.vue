<template>
  <header class="bg-white border-b border-slate-200 safe-area-top sticky top-0 z-50">
    <div class="px-5 py-4 flex justify-between items-center">
      <div>
        <h1 class="text-xl font-bold text-emerald-600">LarCa$h</h1>
        <p class="text-xs text-slate-500">Gestor de Orçamento Familiar</p>
      </div>      
      <Avatar 
        class="!bg-emerald-50" 
        size="large" 
        shape="circle"
        @click="toggleUserMenu"
      >
        <i class="pi pi-user text-emerald-600"></i>
      </Avatar>

      <Popover ref="userMenu">
        <div class="w-56">
          <div class="p-2 border-b border-gray-200 min-w-0">
            <div class="text-sm font-medium">{{ getLogin() }}</div>            
          </div>
          <div class="p-1">
            <Button
              icon="pi pi-sign-out"
              label="Sair"
              severity="danger"
              text
              size="small"
              class="w-full text-sm"
              @click="sair"
            />
          </div>
        </div>
      </Popover>
    </div>
  </header>
</template>

<script setup lang="ts">
import { usePerfilStore } from '@/composables/usePerfilStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const perfilStore = usePerfilStore(); 

const { getLogin, logout } = perfilStore;

const userMenu = ref();

const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event);  
};

const sair = () => {
  logout();
  router.push("/login");
}
</script>