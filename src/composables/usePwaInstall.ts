import type { BeforeInstallPromptEvent } from "@/types/pwa";
import { onBeforeUnmount, onMounted, ref } from "vue";

export const usePwaInstall = () => {

  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);

  const canInstall = ref<boolean>(false);

  const isInstalled = ref<boolean>(false);

  const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
    e.preventDefault();
    deferredPrompt.value = e;
    canInstall.value = true;
    console.log('handleBeforeInstallPrompt', e);
  }

  const handleAppInstalled = () => {
    isInstalled.value = true
    canInstall.value = false
    deferredPrompt.value = null
  }

  const promptInstall = async () => {

    if (deferredPrompt.value) {

      // Abre o diálogo nativo de instalação.
      await deferredPrompt.value.prompt();
  
      // Espera a escolha do usuário.
      const { outcome } = await deferredPrompt.value.userChoice;

      console.log('Resultado da instalação:', outcome); // 'accepted' | 'dismissed'
  
      // O evento só pode ser usado uma vez.
      deferredPrompt.value = null;

      canInstall.value = false;

    }

  }

  onMounted(() => {

    // Detecta se já está rodando como app instalado (standalone).
    isInstalled.value = window.matchMedia('(display-mode: standalone)').matches;

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', handleAppInstalled);

  })

  onBeforeUnmount(() => {
    
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.removeEventListener('appinstalled', handleAppInstalled);

  })

  return { 
    canInstall, 
    isInstalled, 
    promptInstall 
  }

}