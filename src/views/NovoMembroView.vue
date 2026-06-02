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
    <main
      v-if="isTokenValido"
      class="flex-1 space-y-6 pb-10 bg-surface"
    >
      <div class="relative mt-2 mb-8 text-center p-6">
        <div class="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
          <img 
            class="w-full h-full object-cover" 
            src="../assets/Familia.png"
            alt="Familia"
          />          
        </div>
        <p class="font-label text-xs uppercase tracking-widest text-primary font-semibold mb-1">Convite Aceito</p>
        <h2 class="text-3xl font-extrabold font-headline leading-tight tracking-tight mb-2">Crie sua conta</h2>
        <div class="bg-surface-container-low rounded-xl p-4 inline-block text-left">
          <p class="text-sm text-on-surface-variant leading-relaxed">
            Você foi convidado por 
            <span class="font-bold text-primary">{{ nomeDoChefe }}</span> 
            para integrar a 
            <span class="font-bold text-primary">Família {{ nomeDaFamlia }}</span> 
            no LarCa$h.
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
          :initialValues="membro" 
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
            v-model:modelValue="membro.login"
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
            v-model:modelValue="membro.nomeCompleto"
            :isInvalido="$form.nomeCompleto?.invalid"
            :msgDeErro="$form.nomeCompleto?.error?.message"
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
            v-model:modelValue="membro.senha"
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
            v-model:modelValue="membro.confirmacao"
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

          <p class="text-center text-xs text-on-surface-variant mt-6 px-4">
            Ao finalizar, você concorda com os termos de privacidade da família e os regulamentos de gestão compartilhada.
          </p>

        </Form>
      </div>
    </main>
    <main
      v-if="!isTokenValido"
      class="flex-1 w-full max-w-md px-8 pt-24 pb-12 flex 
            flex-col items-center justify-center text-center"
    >
      <div class="relative w-full aspect-square max-w-[280px] mb-3">
        <div class="relative z-10 w-full h-full rounded-2xl overflow-hidden 
                    editorial-shadow bg-surface-container-lowest 
                    flex items-center justify-center p-4"
        >
          <img 
            alt="Cronometro" 
            class="w-full h-full object-cover rounded-xl" 
            src="../assets/Convite-Invalido.png"
          />
        </div>
      </div>
      <div class="space-y-4 mb-12">
        <span class="font-bold text-primary-container uppercase tracking-widest text-[10px]">
          Acesso Expirado
        </span>
        <h1 class="text-4xl font-extrabold text-on-background tracking-tight mt-3">
          Convite Inválido
        </h1>
        <p class="text-on-surface-variant leading-relaxed text-sm px-4">
          O link de convite que você utilizou expirou ou não é mais válido. 
          Por favor, solicite um novo link ao chefe da família.
        </p>
      </div>      
      <div class="w-full space-y-4">
        <Button 
          class="w-full p-button-success mt-8 !bg-emerald-500 !border-none 
                 hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold py-4 
                 rounded-full flex justify-center items-center gap-2"
          @click="redirectToLogin()"
        >
          Ir para o Login
          <span class="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>      
    </main>
    <footer 
      v-if="!isTokenValido"
      class="w-full max-w-md px-8 pb-10 text-center"
    >
      <div class="pt-8 flex flex-col items-center gap-3">
        <div class="flex items-center gap-2 text-outline text-[11px] font-medium tracking-wide">
          <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">
            verified_user
          </span>
          SISTEMA DE GESTÃO COMPARTILHADA SEGURA
        </div>
        <p class="text-outline-variant text-[10px] leading-tight max-w-[240px]">
          Sua segurança é nossa prioridade. Links de convite expiram automaticamente por medidas de proteção.
        </p>
      </div>
    </footer>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { onMounted, ref } from 'vue';
import { plainToInstance } from 'class-transformer';
import { useRouter } from 'vue-router';
import { useConviteValidator } from '@/composables/useConviteValidator';
import ConviteClient from '@/client/ConviteClient';
import NovoMembro from '@/dto/NovoMembro';

const conviteClient = new ConviteClient();

const router = useRouter();

const conviteValidator = useConviteValidator();

const { nomeDoChefe,
        nomeDaFamlia,
        registrarConvite,
        isConviteValido 
      } = conviteValidator;

const formKey = ref(0);

const isValidarCampos = ref<boolean>(false);

const isTokenValido = ref<boolean>(false);  

const membro = ref<NovoMembro>(new NovoMembro())

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    login: yup
      .string()
      .required("O login é obrigatório"),
    nomeCompleto: yup
      .string()
      .required("O nome completo é obrigatório"),
    senha: yup
      .string()
      .required("A senha é obrigatória"),
    confirmacao: yup
      .string()
      .oneOf([yup.ref('senha'), undefined], 'As senhas devem ser iguais')
      .required("A confirmação de senha é obrigatória"),  
  })
));

onMounted(() => {
  registrarConvite(props.token ? props.token : '');
  isTokenValido.value = isConviteValido();
});  

const props = defineProps({
  token: String
});

const registrar = ({ valid }: any ) => {

  isValidarCampos.value = true;

  ativarReset();
  
  if (valid){
    
    let novoMembro = plainToInstance(NovoMembro,  membro.value);
    novoMembro.tokenDoConvite = props.token ? props.token : '';

    conviteClient.registrar(novoMembro)
      .then(() => {
        router.push("/login");
      });

  }  

}  

const ativarReset = () => {
  formKey.value++;
  isValidarCampos.value = false;
}

const redirectToLogin = () => {
  router.push("/login");
}
</script>

<style lang="css" scoped>
.text-primary-container {
  color: #10b981;  
}

.text-outline {
  color: #6c7a71;
}

.text-outline-variant {
  color: #bbcabf;
} 

.bg-surface {
  background: #f7f9fb;
}

.text-on-surface {
  color: #191c1e;
}

.text-on-surface-variant {
  color: #3c4a42;
}

.bg-surface-container-low {
  background: #f2f4f6;
}

.bg-surface-container-lowest {
  background: #ffffff;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>