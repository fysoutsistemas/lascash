<template>
  <div class="bg-slate-50 text-slate-900">
    <div 
      id="app-card-login" 
      class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen"
    >
      <header class="pt-16 pb-8 px-6 text-center">
        <div 
          class="inline-flex items-center justify-center w-16 
                 h-16 rounded-2xl bg-finance-gradient text-white mb-4 shadow-lg"
        >
          <i class="pi pi-wallet text-3xl"></i>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-800">LarCa$h</h1>
        <p class="text-slate-500 mt-2">Gerindo o patrimônio familiar juntos.</p>
      </header>
      <main class="flex-grow px-8">
        <Form 
          v-slot="$form"
          :initialValues="usuario" 
          :resolver="validatorResolver"
          class="space-y-6" 
          @submit="logar"
        >
          <div class="flex flex-col gap-2">
            <label 
              class="text-sm font-bold text-slate-700 ml-1" 
              for="login"
            >
              Login
            </label>
            <InputText 
              class="w-full" 
              id="login" 
              type="text"
              name="login" 
              v-model="usuario.login"
            />
            <Message
              v-if="$form.login?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.login?.error.message }}
            </Message>
          </div>
          <div class="flex flex-col gap-2">
            <label 
              class="text-sm font-bold text-slate-700 ml-1" 
              for="senha"
            >
              Senha
            </label>
            <InputText 
              class="w-full" 
              id="senha" 
              type="password" 
              name="senha"
              v-model="usuario.senha"
            />
            <Message
              v-if="$form.senha?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.senha?.error.message }}
            </Message>                        
          </div>
          <Button 
            type="submit" 
            label="Entrar"             
            class="w-full border-none shadow-md hover:opacity-90 transition-all bg-vibrant-green"
          />
        </Form>        
      </main>
      <GlobalLoading />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as yup from 'yup';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import Usuario from '@/dto/Usuario';
import LoginClient from '@/client/LoginClient';
import { usePerfilStore } from '@/composables/usePerfilStore';
import { useRouter } from 'vue-router';

const perfilStore = usePerfilStore();

const router = useRouter();

const { registrarToken } = perfilStore;

const loginClient = new LoginClient();

const usuario = ref<Usuario>(new Usuario());

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    login: yup
      .string()
      .required("O login é obrigatório"),
    senha: yup
      .string()
      .required("A senha é obrigatória"),
  })
));

const logar = async ({ valid }: any ) => {

  if (valid){
    
    loginClient.autenticar(usuario.value).then(
      (tokenGerado: string) => {
        registrarToken(tokenGerado);
        router.push("/");
      }
    );
    
  }

}
</script>

<style lang="css" scoped>
#app-card-login {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

/* Updated LarCa$h Green Palette */
.bg-finance-gradient {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.bg-vibrant-green {
  background: #10b981 !important;
  border-color: #10b981 !important;
}

/* PrimeVue Component Overrides */
.p-inputtext {
  border-radius: 12px !important;
  padding: 12px 16px !important;
  border: 1px solid #e2e8f0 !important;
}

.p-button {
  border-radius: 12px !important;
  padding: 12px !important;
  font-weight: 600 !important;
}
</style>