import { ref } from 'vue';
import { usePerfilStore } from '@/composables/usePerfilStore';
import { instanceToPlain } from 'class-transformer';
import { useSweetAlert2 } from './useSweetAlert2';
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import router from "@/router";

export const isLoading = ref(false);

const perfilStore = usePerfilStore();

const { 
  isTokenValido, 
  getToken 
} = perfilStore;

const alert = useSweetAlert2();

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

    if  (config.url !== "/auth" && config.url !== "/contas-usuarios/registrar" 
          && config.url !== "/validacoes-otp/nova-conta" 
          && config.url !== "/convites/registrar"){

      if (isTokenValido()){
        config.headers['Authorization'] = `Bearer ${getToken()}`;
        config.headers['ngrok-skip-browser-warning'] = 'true';
      }else{        
        router.push("/login");
      }

    }

    return config;

  },
  (error) => {

    hideLoader();

    alert.showError(error);

    return Promise.reject(error);

  }
);

clientHttp.interceptors.response.use(

  (response: AxiosResponse) => {
    hideLoader();    
    return response;
  },
  (error) => {

    hideLoader();

    if (axios.isAxiosError(error)){

      if (error.status === 401){
        router.push("/login");
      }else{

        let msg = error.status === 400 
                  ? error.response?.data.erros[0].mensagem 
                  : error.message;

        alert.showError(msg);

      }

    }else{
      alert.showError(error);
    }

    return Promise.reject(error);

  }

);

export default clientHttp;