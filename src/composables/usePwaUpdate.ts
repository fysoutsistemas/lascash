import { useRegisterSW } from 'virtual:pwa-register/vue';

export const usePwaUpdate = () => {

  const {
    needRefresh,
    offlineReady,
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration){
      console.log("Service Worker registrado: ", swUrl);
      console.log("Registration recebido: ", registration);
    },
    onRegisterError(error) {
      console.log("Ocorreu um erro ao registrar o SW: ", error);
    },
  });

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker
  }

}