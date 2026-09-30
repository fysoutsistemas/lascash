<template>
  <div class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen">
    <header class="w-full top-0 sticky z-50 bg-white">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <button 
          @click="redirectToTelaAnterior()"
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
          <i class="pi pi-whatsapp" style="font-size: 1.8rem; color: white;"></i>
        </span>
        <div class="flex flex-col items-center gap-2">
          <h1 
            class="m-0 text-[1.625rem] font-extrabold text-[#111827] 
                   tracking-[-0.02em] text-center"
          >
            Ative sua conta
          </h1>
          <p 
            class="m-0 text-sm text-[#64748b] font-medium 
                   text-center leading-[1.5] text-pretty max-w-75"
          >
            Enviamos um código de 6 dígitos pelo WhatsApp para
          </p>
          <strong class="text-[0.96875rem] font-extrabold text-[#0e9d6b]">
            {{ conta?.telefone }}
          </strong>
        </div>
      </div>

      <div 
        class="mt-6.5 bg-[#ffffff] rounded-[1.25rem] p-[22px_18px] mx-4
               shadow-[0_6px_22px_rgba(15,23,42,0.07)] flex flex-col gap-4"
      >
        <span 
          class="text-[0.71875rem] font-extrabold text-[#475569] 
                 uppercase tracking-[0.05em] text-center"
        >
          Código de verificação
        </span>

        <div class="flex gap-2 justify-center">
          <FormCodeField
            id="codigo1" 
            :isInvalido = "isInvalido" 
            proximoCampo="codigo2"
            v-model:modelValue="codigo1"
            @change="atualizarCampos"
          />
          <FormCodeField 
            id="codigo2" 
            :isInvalido = "isInvalido" 
            proximoCampo="codigo3"
            v-model:modelValue="codigo2"
            @change="atualizarCampos"
          />
          <FormCodeField 
            id="codigo3"           
            :isInvalido = "isInvalido" 
            proximoCampo="codigo4"
            v-model:modelValue="codigo3"
            @change="atualizarCampos"
          />
          <FormCodeField 
            id="codigo4" 
            :isInvalido = "isInvalido" 
            proximoCampo="codigo5"
            v-model:modelValue="codigo4"
            @change="atualizarCampos"
          />
          <FormCodeField 
            id="codigo5" 
            :isInvalido = "isInvalido" 
            proximoCampo="codigo6"
            v-model:modelValue="codigo5"
            @change="atualizarCampos"
          />
          <FormCodeField 
            id="codigo6" 
            :isInvalido = "isInvalido" 
            v-model:modelValue="codigo6"
            @change="atualizarCampos"
          />
        </div>

        <div 
          v-if="isInvalido"
          class="flex items-center gap-2 bg-[#fef2f2] border-l-4 
                 border-l-[#ef4444] rounded-[0.625rem] p-[10px_12px]"
        >
          <i class="pi pi-info-circle" style="font-size: 1.0rem; color: red"></i>
          <span class="text-[0.78125rem] font-bold text-[#b91c1c]">
            {{ msgDeErro }}
          </span>
        </div>

        <Button 
          unstyled
          class="w-full p-button-success mt-4 !border-none
                 shadow-lg shadow-emerald-100 font-bold !py-4 
                 rounded-xl flex justify-center items-center text-white"
          :class="{ 
            'hover:!bg-emerald-600': !isDesabilitarBotao(),
            '!bg-emerald-500': !isDesabilitarBotao(),
            '!bg-emerald-500/75': isDesabilitarBotao(),
            'cursor-pointer': !isDesabilitarBotao()
          }"
          @click="ativarConta()"
          :disabled="isDesabilitarBotao()"
        >
          <i 
            class="pi pi-check text-white" 
            style="font-size: 1.0rem; font-weight: 900;"
          >
          </i>
          <span class="ml-2">
            Ativar conta  
          </span>
        </Button>

        <div class="flex flex-col items-center gap-1 border-t border-t-[#f1f5f9] pt-3.5">

          <span class="text-[0.78125rem] text-[#94a3b8] font-semibold">
            Não recebeu o código?            
          </span>

          <Button           
            v-if="!isEmEspera" 
            unstyled
            class="flex items-center gap-1.5 bg-[#dcfce7] 
                   border-none rounded-[0.625rem] p-[9px_15px] text-[0.8125rem] 
                   font-extrabold text-[#15803d] cursor-pointer active:scale-[0.96] 
                   transition"
            
            @click="reenviarCodigo()"
          >
            <i class="pi pi-comment" style="font-size: 1.0rem;"></i>
            Reenviar pelo WhatsApp
          </Button>                

          <span 
            v-if="isEmEspera" 
            class="text-[0.8125rem] font-extrabold text-[#64748b]"
          >
            Reenviar em {{ tempoFormatado }}
          </span>

        </div>
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAtivacaoStore } from '@/composables/useAtivacaoStore';
import { useCronometroDeEspera } from '@/composables/useCronometroDeEspera';
import { plainToInstance } from 'class-transformer';
import { useSweetAlert2 } from '@/composables/useSweetAlert2';
import ContaDeUsuarioClient from '@/client/ContaDeUsuarioClient';
import NovaContaDeUsuario from '@/dto/NovaContaDeUsuario';
import ValidacaoOTPClient from '@/client/ValidacaoOTPClient';
import NovoMembro from '@/dto/NovoMembro';
import ConviteClient from '@/client/ConviteClient';
import { useConviteValidator } from '@/composables/useConviteValidator';

const router = useRouter();

const alert = useSweetAlert2();

const contaClient = new ContaDeUsuarioClient();

const conviteClient = new ConviteClient();

const validacaoClient = new ValidacaoOTPClient();

const {
  tempoFormatado,
  isEmEspera,  
  iniciarCronometro
} = useCronometroDeEspera();

const {
  getNovoMembro, 
  getNovaContaDeUsuario, 
  removerMembro,
  removerConta 
} = useAtivacaoStore();

const {
  getNomeDaFamilia
} = useConviteValidator();

const conta = ref<NovaContaDeUsuario>();

const membro = ref<NovoMembro>();

const isInvalido = ref<boolean>(false);

const msgDeErro = ref<string>("");

const codigo1 = ref<string>("");
const codigo2 = ref<string>("");
const codigo3 = ref<string>("");
const codigo4 = ref<string>("");
const codigo5 = ref<string>("");
const codigo6 = ref<string>("");

onMounted(() => {

  if (props.modo){

    if (props.modo === "chefe-familia"){
      conta.value = getNovaContaDeUsuario() as NovaContaDeUsuario;
    }else if (props.modo === "membro-familia"){
      membro.value = getNovoMembro() as NovoMembro;
    }

  }

});

const props = defineProps({
  modo: String
});  

const ativarConta = () => {
  
  if (isCodigoInformado()){
    
    let codigoOTP = codigo1.value + codigo2.value + codigo3.value 
        + codigo4.value + codigo5.value + codigo6.value;        

    if (props.modo === "chefe-familia"){

      if (conta.value){      
  
        conta.value.codigoOTP = codigoOTP;
  
        let novaConta = plainToInstance(NovaContaDeUsuario, conta.value);
  
        contaClient.registrar(novaConta)
          .then(() => {
  
            alert.showConfirmWithHTML(
              "Conta ativada!",
              `A conta da família <strong>${novaConta.nomeDaFamilia.trim()}
              </strong> está ativa. Faça login para começar.`,
              "Ir para o login",
              () => { 
                removerConta();
                redirectToLogin(); 
              }
            );
            
          })
          .catch((_)=>{          
            isInvalido.value = true;
            msgDeErro.value = "Código inválido. Confira a mensagem no WhatsApp."
            limparCampos();
          });
  
      }

    }else if (props.modo === "membro-familia"){

      if (membro.value){
        
        membro.value.codigoOTP = codigoOTP;

        let novoMembro = plainToInstance(NovoMembro,  membro.value);

        conviteClient.registrar(novoMembro)
          .then(() => {

            alert.showConfirmWithHTML(
              "Conta ativada!",
              `A família <strong>${getNomeDaFamilia().trim()}
              </strong> te aceitou com sucesso. Faça login para começar.`,
              "Ir para o login",
              () => { 
                removerMembro();
                redirectToLogin(); 
              }
            );
            
          })
          .catch((_)=>{          
            isInvalido.value = true;
            msgDeErro.value = "Código inválido. Confira a mensagem no WhatsApp."
            limparCampos();
          });

      }

    }

  }else{
    isInvalido.value = true;
    msgDeErro.value = "Digite os 6 dígitos do código.";
  }

}

const atualizarCampos = () => {
  isInvalido.value = false;
}

const isDesabilitarBotao = (): boolean => {
  return codigo1.value.trim() === "" || codigo2.value.trim() === ""
      || codigo3.value.trim() === "" || codigo4.value.trim() === ""
      || codigo5.value.trim() === "" || codigo6.value.trim() === "";
}

const limparCampos = () => {
  codigo1.value = "";
  codigo2.value = "";
  codigo3.value = "";
  codigo4.value = "";
  codigo5.value = "";
  codigo6.value = "";
}

const reenviarCodigo = () => {

  if (conta.value){

    validacaoClient.gerarCodigoOTP(conta.value.login, conta.value.telefone)
      .then(() => {
        iniciarCronometro();
      }); 

  }else if (membro.value){

    validacaoClient.gerarCodigoOTP(membro.value.login, membro.value.telefone)
      .then(() => {
        iniciarCronometro();
      }); 

  }

}

const isCodigoInformado = () => {
  return codigo1.value.trim() !== "" && codigo2.value.trim() !== "" 
      && codigo3.value.trim() !== "" && codigo4.value.trim() !== "" 
      && codigo5.value.trim() !== "" && codigo6.value.trim() !== "";
}

const redirectToTelaAnterior = () => {
  if (props.modo === "chefe-familia"){
    redirectToNovaConta();
  }else if (props.modo === "membro-familia"){
    redirectToNovoMembro();
  }
}

const redirectToNovaConta = () => {
  router.push("/nova-conta");
}

const redirectToNovoMembro = () => {
  router.push({
    name: 'novo-membro',
    params: {
      token: membro.value?.tokenDoConvite
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