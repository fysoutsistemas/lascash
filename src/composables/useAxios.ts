import { usePerfilStore } from '@/composables/usePerfilStore';
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { ref } from 'vue';
import { useToastService } from './useToastService';
import { useRouter } from 'vue-router';
import { instanceToPlain } from 'class-transformer';

export const isLoading = ref(false);

const perfilStore = usePerfilStore();

const router = useRouter();

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

    config.headers['Content-Type'] = "application/json";
    
    //Caso encontre um body, converter ele para json utilizando
    //os decorators criados para os atributos
    if (config.data && typeof config.data === 'object'){
      config.data = instanceToPlain(config.data);    
    }    

    if  (config.url !== "/auth"){

      if (isTokenValido()){
        config.headers['Authorization'] = `Bearer ${getToken()}`;
      }else{
        router.push("/login");
      }

    }

    return config;

  },
  (error) => {
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

clientHttp.interceptors.response.use(
  (response: AxiosResponse) => {
    hideLoader();    
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