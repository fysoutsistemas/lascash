import { ToastEventBus } from "primevue";

export const useToastService = () => {

  const add = (params: any) => {
    ToastEventBus.emit('add', params);
  }

  return { add };
}