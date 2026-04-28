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
      <!-- Titulo Principal -->
      <div class="mb-10 mt-10 text-center">
        <h1 class="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
           Crie sua conta
        </h1>
        <p class="text-on-surface-variant font-medium">
          Comece a cuidar do futuro da sua família hoje.
        </p>
      </div>
      <!-- Card de Formulario -->
      <div 
        class="bg-white rounded-4xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] 
               border border-slate-100 p-7 m-6"
      >
        <Form 
          v-slot="$form"
          :initialValues="conta" 
          :resolver="validatorResolver"
          @submit="registrar"
        >
          <!-- Login -->
          <FormRegisterField
            id="login"
            nameValidation="login"
            label="LOGIN"
            estilos="mb-5"
            tipo="text"
            icone="person"
            placeholder="Ex: joao.silva"
            v-model:modelValue="conta.login"
            :isInvalido="$form.login?.invalid"
            :msgDeErro="$form.login?.error?.message"
          />

          <!-- Nome Completo -->
          <FormRegisterField
            id="nomeCompleto"
            nameValidation="nomeCompleto"
            label="NOME COMPLETO"
            estilos="mb-5"
            tipo="text"
            icone="match_word"
            placeholder="Ex: João da Silva"
            v-model:modelValue="conta.nomeCompleto"
            :isInvalido="$form.nomeCompleto?.invalid"
            :msgDeErro="$form.nomeCompleto?.error?.message"
          />

          <!-- Nome da Familia -->
          <FormRegisterField
            id="nomeDaFamilia"
            nameValidation="nomeDaFamilia"
            label="NOME DA FAMÍLIA"
            estilos="mb-5"
            tipo="text"
            icone="family_restroom"
            placeholder="Ex: Silva"
            v-model:modelValue="conta.nomeDaFamilia"
            :isInvalido="$form.nomeDaFamilia?.invalid"
            :msgDeErro="$form.nomeDaFamilia?.error?.message"
          />

          <!-- Orçamento Mensal -->
          <FormRegisterField
            id="orcamentoMensal"
            nameValidation="orcamentoMensal"
            label="ORÇAMENTO MENSAL"
            estilos="mb-5"
            tipo="monetario"
            icone="payments"            
            v-model:modelValue="conta.orcamentoMensal"
            :isInvalido="isValidarCampos && isOrcamentoInvalido"
            :msgDeErro="'O orçamento mensal deve ser positivo'"
            :aoValidarValor="validarOrcamento"
          />
          
          <!-- Senha -->
          <FormRegisterField
            id="senha"
            nameValidation="senha"
            label="SENHA"
            estilos="mb-5"
            tipo="password"
            icone="lock"
            placeholder="••••••••"
            v-model:modelValue="conta.senha"
            :isInvalido="$form.senha?.invalid"
            :msgDeErro="$form.senha?.error?.message"
          />
          
          <!-- Confirmacao de Senha -->
          <FormRegisterField
            id="confirmacao"
            nameValidation="confirmacao"
            label="CONFIRMAR SENHA"            
            tipo="password"
            icone="lock"
            placeholder="••••••••"
            v-model:modelValue="conta.confirmacao"
            :isInvalido="$form.confirmacao?.invalid"
            :msgDeErro="$form.confirmacao?.error?.message"
          />          

          <Button 
            class="w-full p-button-success mt-8 !bg-emerald-500 !border-none 
                   hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold py-4 
                   rounded-full flex justify-center items-center gap-2"
            type="submit"
          >
            Registrar
            <span class="material-symbols-outlined">arrow_forward</span>
          </Button>

        </Form>          
      </div>
      <footer class="flex flex-col items-center gap-2 w-full mt-auto py-8">
        <p 
          class="font-['Inter'] text-xs font-medium text-slate-500"
        >
          © 2026 LarCa$h • Sua Família, Seu Futuro
        </p>
      </footer>
      <GlobalLoading />
    </main>
  </div>  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as yup from 'yup';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { unformat } from 'v-money3';
import { plainToInstance } from 'class-transformer';
import { useRouter } from 'vue-router';
import FormRegisterField from '@/components/FormRegisterField.vue';
import NovaContaDeUsuario from '@/dto/NovaContaDeUsuario';
import ContaDeUsuarioClient from '@/client/ContaDeUsuarioClient';

const contaClient = new ContaDeUsuarioClient();

const router = useRouter();

const mascara = ref({
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
  precision: 2,
  masked: true
});

const formKey = ref(0);

const isValidarCampos = ref<boolean>(false);

const isOrcamentoInvalido = ref<boolean>(false);  

const conta = ref<NovaContaDeUsuario>(new NovaContaDeUsuario());

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    login: yup
      .string()
      .required("O login é obrigatório"),
    nomeCompleto: yup
      .string()
      .required("O nome completo é obrigatório"),    
    nomeDaFamilia: yup
      .string()
      .required("O nome da família é obrigatório"),  
    senha: yup
      .string()
      .required("A senha é obrigatória"),
    confirmacao: yup
      .string()
      .oneOf([yup.ref('senha'), undefined], 'As senhas devem ser iguais')
      .required("A confirmação de senha é obrigatória"),  
  })
));

const ativarReset = () => {
  formKey.value++;
  isValidarCampos.value = false;
}

const validarOrcamento = () => {
  isOrcamentoInvalido.value = conta.value.orcamentoMensal === "0,00";  
}

const registrar = ({ valid }: any ) => {

  isValidarCampos.value = true;

  validarOrcamento();

  ativarReset();

  if (valid){

    if (!isOrcamentoInvalido.value){

      conta.value.orcamentoMensal = String(unformat(conta.value.orcamentoMensal, mascara.value));

      let novaConta = plainToInstance(NovaContaDeUsuario, conta.value);

      contaClient.registrar(novaConta).then(() => {
        router.push("/login");
      });

    }

  }  

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