<template>
  <header class="bg-white border-b border-slate-200 safe-area-top sticky top-0 z-50">
    <div class="px-5 py-4 flex justify-between items-center">
      <div>
        <h1 class="text-xl font-bold text-emerald-600">LarCa$h</h1>
        <p class="text-xs text-slate-500">Gestor de Orçamento Familiar</p>
      </div>
      <div class="w-45 text-right hover:cursor-pointer">
        <span 
          @click="atualizarVisibilidade()"
          class="symbol opacity-40 text-outline text-4xl mr-3"
        >
          {{ isOcultarValores ? 'visibility_off' : 'visibility' }}
        </span>
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
          
          <div class="flex flex-col mb-3">
            <span class="text-on-surface font-bold text-base leading-tight truncate mb-1">
              {{ getNomeCompleto() }}
            </span>
            <span class="text-on-surface-variant text-xs font-medium">
              {{ getLogin() }}
            </span>
          </div>

          <div 
            class="flex items-center gap-2 px-3 py-2 bg-primary/5 
                   rounded-xl border border-primary/10"
          >
            <span class="material-symbols-outlined text-primary text-sm">
              family_restroom
            </span>
            <span class="text-primary text-[11px] font-bold uppercase tracking-wider truncate">
              Família {{ getNomeDaFamilia() }}
            </span>
          </div>
          
          <div class="mt-5 border-t-1 border-gray-200">
            <Button
              icon="pi pi-cog"
              label="Configurações da Conta"
              severity="secondary"
              text
              size="small"
              class="text-sm mt-3"
              @click="redirectToConfig"
            />
          </div>

          <div class="mt-1">
            <Button
              icon="pi pi-sign-out"
              label="Sair"
              severity="danger"
              text
              size="small"
              class="text-sm"
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNavigationStore } from '@/composables/useNavigationStore';

const navigation = useNavigationStore();

const router = useRouter();

const perfilStore = usePerfilStore(); 

const { 
  getLogin, 
  getNomeCompleto,
  getNomeDaFamilia,
  logout,
  atualizarOcultarValores,
  getOcultarValores 
} = perfilStore;

const { resetarNavegacao } = navigation;

const userMenu = ref();

const isOcultarValores = ref<boolean>(true);

const emit = defineEmits<{
  aoMudarVisibilidade: [ isOcultarValores: boolean ]
}>();

onMounted(() => {
  isOcultarValores.value = getOcultarValores();
});

const atualizarVisibilidade = () => {
  isOcultarValores.value = !isOcultarValores.value;
  atualizarOcultarValores(isOcultarValores.value);  
  emit("aoMudarVisibilidade", isOcultarValores.value)
}

const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event);  
};

const redirectToConfig = () => {
  resetarNavegacao();
  router.push("/config-conta");
}

const sair = () => {
  logout();
  resetarNavegacao();
  router.push("/login");
}
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