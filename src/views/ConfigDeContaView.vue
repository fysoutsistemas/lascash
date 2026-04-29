<template>
  <div class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen">
    <header class="w-full top-0 sticky z-50 bg-white">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <button 
          @click="redirectToMain()"
          class="text-emerald-900 hover:bg-emerald-50 transition-colors p-2 
                 rounded-full active:opacity-80 scale-95 transition-all"
        >
          <span class="material-symbols-outlined">
            arrow_back
          </span>
        </button>
        <div class="text-2xl font-black tracking-tight text-emerald-600">
          Atualizar Dados
        </div>
        <div class="w-10"></div>
      </div>
    </header>
    <main id="main-edicao" class="flex-1 space-y-6 pb-10 bg-surface">
      <Form 
        ref="formRef"
        v-slot="$form"
        :initialValues="contaEditada" 
        :resolver="validatorResolver"
        @submit="salvar"
      >
        <div class="px-6 pt-6 pb-32 max-w-lg mx-auto">
          <!-- Título da tela -->
          <div class="mb-10 flex items-center gap-5">
            <div class="relative">
              <Avatar label="P" class="mr-2" size="xlarge" />
              
              <div 
                class="absolute -bottom-2 -right-2 p-2 rounded-xl
                      bg-surface-container-lowest shadow-lg"
              >
                <span class="material-symbols-outlined text-primary !text-base">
                  edit
                </span>
              </div>
            </div>
            <div>
              <p class="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">
                Configurações de Conta
              </p>
              <h2 class="font-headline font-extrabold text-2xl tracking-tight text-on-surface">
                Dados Pessoais
              </h2>
            </div>
          </div> 

          <div class="bg-surface-container-low p-1 rounded-2xl space-y-5">
            <!-- Dados Pessoais -->
            <section class="space-y-6">
              <div class="bg-surface-container-low p-6 rounded-2xl space-y-5">
                
                <!-- Nome Completo -->
                <FormConfigTextField
                  label="Nome Completo"
                  nameValidation="nomeCompleto"
                  v-model:modelValue="contaEditada.nomeCompleto"
                  :isInvalido="$form.nomeCompleto?.invalid"
                  :msgDeErro="$form.nomeCompleto?.error?.message"
                />

                <!-- Nome da Familia -->
                <FormConfigTextField
                  label="Nome da Família"
                  nameValidation="nomeDaFamilia"
                  v-model:modelValue="contaEditada.nomeDaFamilia"
                  :isInvalido="$form.nomeDaFamilia?.invalid"
                  :msgDeErro="$form.nomeDaFamilia?.error?.message"
                />
                                
              </div>
            </section>          
          </div>
          <div class="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex gap-4 items-start mt-10">
            <span class="material-symbols-outlined text-primary mt-0.5">lock_open</span>
            <div class="space-y-1">
              <h4 class="font-bold text-sm text-primary">Cofre Familiar Ativo</h4>
              <p class="text-xs leading-relaxed text-on-surface-variant">
                As alterações de senha de usuário e nome da família serão sincronizadas 
                com todos os membros do seu círculo privado no 
                <strong>LarCa$h</strong>.
              </p>
            </div>
          </div>

          <section class="mt-12">
            <div class="mb-6">
              <h2 class="font-headline font-extrabold text-2xl tracking-tight text-on-surface">
                Segurança
              </h2>
              <p class="text-sm text-on-surface-variant mt-1">
                Proteja sua jornada financeira familiar.
              </p>
            </div>
          </section>

          <div class="bg-surface-container-low p-1 rounded-2xl space-y-5">
            <section class="space-y-6">
              <div class="bg-surface-container-low p-6 rounded-2xl space-y-5">
                
                <FormConfigPasswdField 
                  v-model:modelValue="contaEditada.senhaAtual"
                  label="Senha Atual"
                  tipo="on-off"
                  nameValidation="senhaAtual"
                  :isInvalido="isSenhaAtualInvalida"
                  :msgDeErro="msgDeErroDaSenhaAtual"
                />

                <FormConfigPasswdField 
                  v-model:modelValue="contaEditada.novaSenha"
                  label="Nova Senha"
                  tipo="basic"
                  nameValidation="novaSenha"
                  :isInvalido="isNovaSenhaInvalida"
                  :msgDeErro="msgDeErroDaNovaSenha"
                />

                <FormConfigPasswdField 
                  v-model:modelValue="contaEditada.confirmacao"
                  label="Confirmar Nova Senha"
                  tipo="confirm"
                  nameValidation="confirmacao"
                  :isInvalido="isConfirmacaoInvalida || isSenhaDiferente"
                  :msgDeErro="msgDeErroDaConfirmacao"
                />

              </div>
            </section>
          </div>
          <div class="mt-12">
            <Button 
              class="w-full p-button-success mt-8 !bg-emerald-500 !border-none 
                    hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold py-4 
                    rounded-full flex justify-center items-center gap-2"
              type="submit"
            >
              Salvar Alterações
              <span class="material-symbols-outlined">check_circle</span>
            </Button>
          </div>        
        </div>
      </Form>
    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as yup from 'yup';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import { useRouter } from 'vue-router';
import { usePerfilStore } from '@/composables/usePerfilStore';
import { useToastService } from '@/composables/useToastService';
import { plainToInstance } from 'class-transformer';
import type ResumoDaContaDeUsuario from '@/dto/ResumoDaContaDeUsuario';
import ContaDeUsuarioEditada from '@/dto/ContaDeUsuarioEditada';
import ContaDeUsuarioClient from '@/client/ContaDeUsuarioClient';

const contaClient = new ContaDeUsuarioClient();

const router = useRouter();

const toast = useToastService();

const perfilStore = usePerfilStore();

const {
  getNomeCompleto,
  getNomeDaFamilia,
  atualizar
} = perfilStore;  

const formKey = ref(0);

const formRef = ref();

const isSenhaAtualInvalida = ref<boolean>(false);

const isConfirmacaoInvalida = ref<boolean>(false);

const isNovaSenhaInvalida = ref<boolean>(false);

const isSenhaDiferente = ref<boolean>(false);  

const msgDeErroDaSenhaAtual = ref<string>("")

const msgDeErroDaNovaSenha = ref<string>("")

const msgDeErroDaConfirmacao = ref<string>("");

const contaEditada = ref<ContaDeUsuarioEditada>(new ContaDeUsuarioEditada());

const validatorResolver = ref(yupResolver(
  yup.object().shape({
    nomeCompleto: yup
      .string()
      .required("O nome completo é obrigatório"),    
    nomeDaFamilia: yup
      .string()
      .required("O nome da família é obrigatório"),
  })
));

onMounted(() => {  
  contaEditada.value.nomeCompleto = getNomeCompleto();  
  contaEditada.value.nomeDaFamilia = getNomeDaFamilia();
  formRef.value.reset();
});

const ativarReset = () => {
  formKey.value++;
}

const isSenhasValidas = (): boolean => {  
  return !isNovaSenhaInvalida.value && !isSenhaAtualInvalida.value && !isConfirmacaoInvalida.value;
}

const validarSenhas = () => {

  isSenhaAtualInvalida.value = false;
  msgDeErroDaSenhaAtual.value = "";
  isNovaSenhaInvalida.value = false;
  msgDeErroDaNovaSenha.value = "";
  isConfirmacaoInvalida.value = false;
  msgDeErroDaConfirmacao.value = "";
  isSenhaDiferente.value = false;

  if (contaEditada.value.senhaAtual !== ""){

    if (contaEditada.value.novaSenha == ""){
      isNovaSenhaInvalida.value = true;
      msgDeErroDaNovaSenha.value = "A nova senha é obrigatória"
    }else if (contaEditada.value.confirmacao == ""){
      isConfirmacaoInvalida.value = true;
      msgDeErroDaConfirmacao.value = "A confirmação é obrigatória";
    }else if (contaEditada.value.novaSenha != contaEditada.value.confirmacao){
      isSenhaDiferente.value = true;
      msgDeErroDaConfirmacao.value = "As senhas devem ser iguais"
    }

  }else if (contaEditada.value.novaSenha !== ""){

    isSenhaAtualInvalida.value = true;
    msgDeErroDaSenhaAtual.value = "A senha atual é obrigatória"

  }else if (contaEditada.value.confirmacao !== ""){

    isSenhaAtualInvalida.value = true;
    msgDeErroDaSenhaAtual.value = "A senha atual é obrigatória"
    
    isNovaSenhaInvalida.value = true;
    msgDeErroDaNovaSenha.value = "A nova senha é obrigatória"

  }

}

const limparCamposDeSenha = () => {
  isSenhaAtualInvalida.value = false;
  contaEditada.value.senhaAtual = "";
  isNovaSenhaInvalida.value = false;
  contaEditada.value.novaSenha = "";
  isConfirmacaoInvalida.value = false;
  contaEditada.value.confirmacao = "";
}

const salvar = ({ valid }: any ) => {
  
  validarSenhas();

  if (valid && isSenhasValidas()){
    let contaAlterada = plainToInstance(ContaDeUsuarioEditada, contaEditada.value);
    contaClient.atualizar(contaAlterada).then((resumo: ResumoDaContaDeUsuario) => {
      atualizar(resumo);
      limparCamposDeSenha();
      ativarReset(); 
      document.getElementById("main-edicao")?.scrollIntoView();
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: "Dados salvos com sucesso",
        life: 3000,
      });     
    });
    
  }
}

const redirectToMain = () => {
  router.push("/");
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

.bg-surface-container-lowest {
  background: #ffffff;
}

.bg-surface-container-low {
  background: #f2f4f6;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>