<template>
  <div 
    id="home" 
    class="flex flex-col w-full max-w-md mx-auto bg-white shadow-xl min-h-screen"
  >
    <Header
      @aoMudarVisibilidade="atualizarVisibilidade"
    />
    <main class="flex-1 p-4 space-y-6 pb-20">
      <section class="bg-surface-container-low rounded-xl p-6">
        <div class="flex justify-between items-end mb-4">
          <div>
            <h3 class="font-headline font-bold text-lg text-on-surface">
              Progresso do Orçamento
            </h3>
            <p class="text-sm text-on-surface-variant">
              Você gastou {{ progresso.percentualGasto }}% do orçamento
            </p>
          </div>
          <div class="relative group">
            <span class="text-2xl font-headline font-black text-primary">
              {{ progresso.percentualGasto }}%
            </span>
          </div>
        </div>
        <Progressbar 
          :show-value="false" 
          :value="progresso.percentualGasto" 
          style="height: 12px; border-radius: 10px"
        >
        </Progressbar>
        <div 
          class="flex justify-between mt-4 text-[10px] font-bold 
                 uppercase tracking-widest text-on-surface-variant"
        >
          <span>
            Gasto: {{ isOcultar ? '********' : CurrencyUtil.toBRL(progresso.totalGasto) }}
          </span>
          <span>
            Restante: {{ isOcultar ? '********' : CurrencyUtil.toBRL(progresso.totalRestante) }}
          </span>
        </div>
      </section>

      <section 
        v-if="isChefeDeFamilia()"
        class="flex gap-4"
      >
        <Button
          unstyled 
          class="flex-1 h-24 bg-surface-container-low rounded-2xl flex 
                 flex-col items-center justify-center gap-2 hover:bg-surface-container 
                 transition-colors active:scale-95 duration-200 group hover:cursor-pointer"
          @click="toNovoOrcamento()"       
        >
          <div 
            class="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center 
                   justify-center text-green-700 group-hover:bg-[#10b981] 
                   group-hover:text-white transition-all"
          >
            <span class="material-symbols-outlined">
              add
            </span>
          </div>
          <span class="text-[11px] font-bold text-slate-800 text-center leading-tight">
            Novo Orçamento
          </span>
        </Button>
        <Button
          unstyled
          class="flex-1 h-24 bg-surface-container-low rounded-2xl flex flex-col 
                 items-center justify-center gap-2 hover:bg-surface-container 
                 transition-colors active:scale-95 duration-200 group hover:cursor-pointer"
          @click="toAtualizarOrcamento()"       
        >
          <div 
            class="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center 
                   justify-center text-green-700 group-hover:bg-[#10b981] 
                   group-hover:text-white transition-all"
          >
            <span class="material-symbols-outlined">
              edit
            </span>
          </div>
          <span class="text-[11px] font-bold text-slate-800 text-center leading-tight">
            Alterar Orçamento
          </span>
        </Button>
        <Button
          unstyled
          class="flex-1 h-24 bg-surface-container-low rounded-2xl flex flex-col 
                 items-center justify-center gap-2 hover:bg-surface-container 
                 transition-colors active:scale-95 duration-200 group hover:cursor-pointer"
          @click="toEditarLimites()"       
        >
          <div 
            class="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center 
                   justify-center text-green-700 group-hover:bg-[#10b981] 
                   group-hover:text-white transition-all"
          >
            <span class="material-symbols-outlined">
              tune
            </span>
          </div>          
          <span class="text-[11px] font-bold text-slate-800 text-center leading-tight">
            Editar Limites
          </span>
        </Button>
      </section>

      <section v-if="isChefeDeFamilia()">
        <div class="bg-[#10b981]/10 border-l-4 border-[#10b981] rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2 text-on-primary-container">
            <span class="material-symbols-outlined text-lg">
              info
            </span>
            <span class="font-bold text-sm">
              Você sabia?
            </span>
          </div>
          <div class="space-y-2 text-on-surface-variant text-sm leading-relaxed text-justify">
            <p>
              Criar um novo limite de orçamento 
              <b>arquiva</b> 
              automaticamente as transações atuais para o orçamento anterior.
            </p>
            <p>Atualizar o limite atual recalcula instantaneamente todas as porcentagens do seu painel.</p>
          </div>  
        </div>
      </section>

      <section v-if="isChefeDeFamilia()">
        <Button           
          @click="showLinkDialog"
          unstyled
          class="w-full py-5 px-6 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#10b981]/80
                 text-white flex items-center justify-between shadow-lg shadow-primary-container/20 
                 active:scale-[0.98] transition-transform hover:cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span class="material-symbols-outlined">
                person_add
              </span>
            </div>
            <div class="text-left">
              <p class="font-headline font-bold text-lg leading-tight">
                Convidar Familiar
              </p>
              <p class="text-white/80 text-xs">
                Adicione dependentes em segundos
              </p>
            </div>
          </div>
          <span class="material-symbols-outlined">
            chevron_right
          </span>
        </Button>
        <Dialog
          v-model:visible="isShowLink" 
          modal
          class="w-110"
        >
          <template #header>
            <div 
              class="w-14 h-14 bg-primary-container/20 rounded-2xl 
                     flex items-center justify-center"
            >
              <span 
                class="material-symbols-outlined text-primary text-3xl" 
                style="font-variation-settings: 'FILL' 1;"
              >
                group_add
              </span>
            </div>
          </template>
          <div class="space-y-2">
            <h3 class="text-2xl font-bold tracking-tight text-on-surface">
              Expandir a Família
            </h3>
            <p class="text-on-surface-variant leading-relaxed text-sm text-justify">
              Envie este link exclusivo para um membro da sua família. 
              Ao acessar, eles poderão se registrar e conectar-se diretamente à sua conta 
              <span class="font-bold text-emerald-600">LarCa$h</span> para gestão conjunta.
            </p>
          </div>
          <div class="mt-3">
            <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Link de Convite
            </label>
            <div class="relative">
              <InputText
                unstyled
                readonly="true" 
                class="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-4 pr-12 mt-2
                       text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                type="text" 
                v-model="linkDoNovoMembro"
              />
              <div class="absolute right-4 top-1/2 -translate-y-1/2">
                <span class="material-symbols-outlined text-emerald-500 opacity-50">
                  link
                </span>
              </div>
            </div>
          </div>
          <div class="mt-10 mb-5">
            <Button
              class="w-full p-button-success !bg-emerald-500 !border-none 
                     hover:!bg-emerald-600 shadow-lg shadow-emerald-100 font-bold
                     rounded-full flex justify-center items-center"
              icon="pi pi-copy" 
              label="Copiar Link"
              @click="copyLink"
            />
          </div>
        </Dialog>
      </section>
      
      <!-- Painel de instalação PWA -->
      <section 
        v-if="canInstall && !isInstalled"
        class="relative overflow-hidden bg-primary-container rounded-2xl p-6 text-white shadow-xl"
      >
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-3">
            <div class="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
                install_mobile
              </span>
            </div>
            <h3 class="font-bold text-lg leading-tight">Tenha o LarCa$h sempre à mão</h3>
          </div>
          <p class="text-white/80 text-sm mb-6 leading-relaxed">
            Instale nosso aplicativo para ter acesso instantâneo às suas finanças, mesmo offline, e receba notificações em tempo real.
          </p>
          <Button 
            unstyled
            class="w-full bg-white text-primary font-bold py-4 rounded-full flex items-center 
                   justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            @click="promptInstall"       
          >
            <span>Instalar Aplicativo</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </Button>
        </div>
        <!-- Decorative circle -->
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>      
    </main>
    <MenuInferior/>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePerfilStore } from '@/composables/usePerfilStore';
import { useToast } from 'primevue';
import { usePwaUpdate } from '@/composables/usePwaUpdate';
import { usePwaInstall } from '@/composables/usePwaInstall';
import OrcamentoClient from '@/client/OrcamentoClient';
import ProgressoDoOrcamento from '@/dto/ProgressoDoOrcamento';
import CurrencyUtil from '@/util/CurrencyUtil';
import ConviteClient from '@/client/ConviteClient';

const orcamentoClient = new OrcamentoClient();

const conviteClient = new ConviteClient();

const { 
  canInstall, 
  isInstalled, 
  promptInstall 
} = usePwaInstall()

const toast = useToast();

const router = useRouter();

const perfilStore = usePerfilStore();

//Dispara o registro do service worker do PWA
usePwaUpdate();

const { getOcultarValores, isChefeDeFamilia } = perfilStore;

const progresso = ref<ProgressoDoOrcamento>(new ProgressoDoOrcamento());

const isOcultar = ref<boolean>(true);

const isShowLink = ref<boolean>(false);

const linkDoNovoMembro = ref<string>("");

onMounted(() => {  

  isOcultar.value = getOcultarValores();

  orcamentoClient.buscarProgresso()
    .then((progressoEncontrado: ProgressoDoOrcamento) => {
      progresso.value = progressoEncontrado;
    });    

});

const atualizarVisibilidade = (isOcultarValores: boolean) => {
  isOcultar.value = isOcultarValores;
}

const showLinkDialog = () => {
  conviteClient.gerarLink().then((link: string) => {
    linkDoNovoMembro.value = link;
    isShowLink.value = true;
  });
}

const copyLink = async () => {
  console.log(navigator);
  await navigator.clipboard.writeText(linkDoNovoMembro.value);

  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Link copiado com sucesso',
    life: 3000,
  });

}

const toNovoOrcamento = () => {
  router.push({
    name: "orcamento",
    params: {
      modo: 'inclusao'
    }
  });
}

const toAtualizarOrcamento = () => {
  router.push({
    name: "orcamento",
    params: {
      modo: 'atualizacao'
    }
  });
}

const toEditarLimites = () => {
  router.push("/config-categs");
}
</script>

<style lang="css" scoped>
.text-on-surface {
  color: #191c1e;
}

.text-on-surface-variant {
  color: #3c4a42;
}

.text-on-primary-container {
  color: #03442e;
}

.bg-surface-container {
  background: #eceef0;
}

.bg-surface-container-low {
  background: #f2f4f6;
}

.bg-surface-container-lowest {
  background: #ffffff;
}

.bg-secondary-container {
  background: #b7ebce;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.bg-primary-container {
  background: #10b981;
}
</style>