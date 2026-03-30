import { usePerfilStore } from '@/composables/usePerfilStore';
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { ref } from 'vue';
import { useToastService } from './useToastService';

export const isLoading = ref(false);

const perfilStore = usePerfilStore();

const { isTokenValido, getToken } = perfilStore;

const toast = useToastService();

let contadorDeCarregamento = 0;

const showLoader = () => {
  contadorDeCarregamento++;
  isLoading.value = true;
};

const hideLoader = () => {
  contadorDeCarregamento--;
  if (contadorDeCarregamento <= 0) {
    contadorDeCarregamento = 0;
    isLoading.value = false;
  }
};

const clientHttp = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

clientHttp.interceptors.request.use(
  
  async (config: InternalAxiosRequestConfig) => {

    showLoader();

    if (config.params.acao !== "logar"){
      if (isTokenValido()){        
        config.params.token = getToken();  
      }
    }

    return config;

  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

clientHttp.interceptors.response.use(
  (response: AxiosResponse) => {
    
    hideLoader();

    let isErro = (response.data && response.data.status >= 400 && response.data.status <= 599) 
      || (response.data >= 400 && response.status <= 599);

    if (isErro){

      let msgDeErro = response.data.content ? response.data.content : 'Erro código: ' + response.status;

      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: msgDeErro,
        life: 3000,
      });

      return Promise.reject(msgDeErro);

    }

    return response;
  },
  (error: unknown) => {

    hideLoader();

    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error,
      life: 3000,
    });

    return Promise.reject(error);

  }
);

export default clientHttp;