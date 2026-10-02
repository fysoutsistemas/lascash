<template>
  <div class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen">
    <header class="w-full top-0 sticky z-50 bg-white">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <button 
          @click="redirectToVerificacao()"
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
          <span class="material-symbols-outlined">verified_user</span>
        </span>
        <div class="flex flex-col items-center gap-2">
          <h1 
            class="m-0 text-[1.625rem] font-extrabold text-[#111827] 
                   tracking-[-0.02em] text-center"
          >
            Nova senha
          </h1>
          <p 
            class="m-0 text-sm text-[#64748b] font-medium 
                   text-center leading-[1.5] text-pretty max-w-75"
          >
            Código validado. Crie uma nova senha para <strong>{{ getLogin() }}</strong>
          </p>
        </div>                
      </div>
      <!-- Card de Formulario -->
      <div 
        class="bg-white rounded-4xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] 
              border border-slate-100 p-7 m-6"
      >
        <Form 
          v-slot="$form"
          :initialValues="senhaResetada" 
          :resolver="validatorResolver"
          @submit="alterarSenha"
        >
          <!-- Senha -->
          <FormRegisterField
            id="senha"
            nameValidation="senha"
            label="SENHA"
            estilos="mb-5"
            tipo="password"
            icone="lock"
            placeholder="••••••••"
            v-model:modelValue="senhaResetada.novaSenha"
            :isInvalido="$form.novaSenha?.invalid"
            :msgDeErro="$form.novaSenha?.error?.message"
          />
            
          <!-- Confirmacao de Senha -->
          <FormRegisterField
            id="confirmacao"
            nameValidation="confirmacao"
            label="CONFIRMAR SENHA"            
            tipo="password"
            icone="lock"
            placeholder="••••••••"
            v-model:modelValue="senhaResetada.confirmacao"
            :isInvalido="$form.confirmacao?.invalid"
            :msgDeErro="$form.confirmacao?.error?.message"
          /> 

          <Button 
            class="w-full p-button-success mt-8 !bg-emerald-500 !border-none 
                  hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold py-4 
                  rounded-full flex justify-center items-center gap-2"
            type="submit"
          >
            <i 
              class="pi pi-check text-white" 
              style="font-size: 1.0rem; font-weight: 900;"
            >
            </i>
            <span class="ml-2">Salvar</span>
          </Button>
        </Form>
      </div>
    </main>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { ref } from 'vue';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { useRouter } from 'vue-router';
import { useAtivacaoStore } from '@/composables/useAtivacaoStore';
import { useSweetAlert2 } from '@/composables/useSweetAlert2';
import { plainToInstance } from 'class-transformer';
import SenhaResetada from '@/dto/SenhaResetada';
import ResetDeSenhaClient from '@/client/ResetDeSenhaClient';

const formKey = ref(0);

const router = useRouter();

const senhaResetada = ref<SenhaResetada>(new SenhaResetada());

const alert = useSweetAlert2();

const resetClient = new ResetDeSenhaClient();

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    novaSenha: yup
      .string()
      .required("A nova senha é obrigatória"),
    confirmacao: yup
      .string()
      .oneOf([yup.ref('senha'), undefined], 'As senhas devem ser iguais')
      .required("A confirmação de senha é obrigatória"),
  })
));

const { 
  getLogin,
  getCodigoOTP
} = useAtivacaoStore();

const ativarReset = () => {
  formKey.value++; 
}

const alterarSenha = async ({ valid }: any) => {

  ativarReset();

  if (valid){

    senhaResetada.value.codigoOTP = getCodigoOTP();
    senhaResetada.value.login = getLogin();

    let novaSenha = plainToInstance(SenhaResetada, senhaResetada.value);

    resetClient.processar(novaSenha)
      .then(() => {

        alert.showConfirmWithHTML(
          "Senha alterada!",
          `Tudo certo! Sua nova senha do Larcash já está cadastrada e valendo.</br></br>
          Agora você já pode voltar para o aplicativo, fazer o seu login e continuar 
          organizando suas compras e finanças tranquilamente.`,
          "Logar",
          () => {
            redirectToLogin();
          }
        );

      });


  } 

}

const redirectToLogin = () => {
  router.push("/login");
}

const redirectToVerificacao = () => {  
  router.push({
    name: 'ativacao-conta',
    params: {
      modo: 'reset-senha'
    }
  });
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