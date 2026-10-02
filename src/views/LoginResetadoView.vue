<template>
  <div class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen">
    <header class="w-full top-0 sticky z-50 bg-white">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <button 
          @click="redirectToLogin()"
          class="text-emerald-900 hover:bg-emerald-50 transition-colors p-2 
                 rounded-full active:opacity-80 scale-95 transition-all"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="text-2xl font-black tracking-tight text-emerald-600">
          LarCa$h
        </div>
        <div class="w-10"></div>
      </div>
    </header>
    <main class="flex-1 space-y-6 pb-10 bg-surface">
      <div class="flex flex-col items-center gap-3.5 mt-4.5">
        <span 
          class="bg-gradient-to-br from-[#25d366] to-[#10a878] w-15.5 h-15.5 
                 rounded-[1.125rem] flex items-center justify-center text-[#ffffff] 
                 shadow-[0_8px_20px_rgba(37,211,102,0.32)]"
        >
          <i class="pi pi-key" style="font-size: 1.8rem; color: white;"></i>
        </span>
        <div class="flex flex-col items-center gap-2">
          <h1 
            class="m-0 text-[1.625rem] font-extrabold text-[#111827] 
                   tracking-[-0.02em] text-center"
          >
            Recupere sua senha
          </h1>
          <p 
            class="m-0 text-sm text-[#64748b] font-medium 
                   text-center leading-[1.5] text-pretty max-w-75"
          >
            Informe seu login. Enviaremos um código de verificação para o WhatsApp cadastrado.
          </p>
        </div>        
      </div>

      <div 
        class="mt-6.5 bg-[#ffffff] rounded-[1.25rem] p-[22px_18px] mx-4
               shadow-[0_6px_22px_rgba(15,23,42,0.07)] flex flex-col gap-4"
      >
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="validatorResolver"
          @submit="redirectToAtivacao"
        >
          <!-- Login -->
          <FormRegisterField
            id="login"
            nameValidation="login"
            label="LOGIN"
            estilos="mb-5"
            cssField="lowercase-input"
            tipo="text"
            icone="person"
            placeholder="Ex: joao.silva"
            v-model:modelValue="initialValues.login"
            :isInvalido="$form.login?.invalid"
            :msgDeErro="$form.login?.error?.message"
          />

          <Button 
            class="w-full p-button-success mt-2 !bg-emerald-500 !border-none 
                  hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold py-4 
                  rounded-full flex justify-center items-center gap-2"
            type="submit"
          >
            <i class="pi pi-whatsapp text-white" style="font-size: 1.0rem;"></i>
            Enviar código
          </Button>

        </Form>

      </div>
    </main>
    <footer class="w-full max-w-md px-8 pb-10 text-center bg-surface">
      <div class="pt-8 flex flex-col items-center gap-3">
        <p class="font-['Inter'] text-xs font-medium text-slate-500">
          © 2026 LarCa$h • Sua Família, Seu Futuro
        </p>
      </div>
    </footer>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAtivacaoStore } from '@/composables/useAtivacaoStore';
import { useCronometroDeEspera } from '@/composables/useCronometroDeEspera';
import ResetDeSenhaClient from '@/client/ResetDeSenhaClient';

const router = useRouter();

const resetClient = new ResetDeSenhaClient();

const {
  isEmEspera,
  iniciarCronometro
} = useCronometroDeEspera();

const { 
  salvarInfosDoReset
} = useAtivacaoStore();

const formKey = ref(0);

const initialValues = ref<any>({'login': ''});

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    login: yup
      .string()
      .required("O login é obrigatório")
  })
));

const redirectToAtivacao = ({ valid }: any ) => {

  ativarReset();

  if (valid){

    if (isEmEspera.value){
      redirectToVerificacao();
    }else{

      let loginInformado: string = initialValues.value.login;

      resetClient.gerarCodigoOTP(initialValues.value.login)
        .then((telefoneAnonimizado: string) => {
          salvarInfosDoReset(loginInformado, telefoneAnonimizado);
          iniciarCronometro();
          redirectToVerificacao();
        });

    }
    
  }  

}

const ativarReset = () => {
  formKey.value++; 
}

const redirectToVerificacao = () => {  
  router.push({
    name: 'ativacao-conta',
    params: {
      modo: 'reset-senha'
    }
  });
}

const redirectToLogin = () => {
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