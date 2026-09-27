<template>
  <div
    id="lista-membros"
    class="flex flex-col w-full max-w-md mx-auto bg-slate-50 shadow-xl min-h-screen"
  >
    <header class="flex items-center gap-3 p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <Button 
        rounded 
        text 
        class="!w-[34px] !h-[34px] !text-emerald-600" 
        aria-label="Voltar"
        icon="pi pi-arrow-left"
        @click="redirectToListagem()"
      />
      <div class="flex-1 text-center">
        <h1 class="text-[19px] font-extrabold text-emerald-600">
          Notificar Lista
        </h1>
        <p class="mt-0.5 text-[12.5px] text-slate-500">
          {{ lista?.nome }}
        </p>
      </div>
      <span class="w-9 h-9 flex items-center justify-center text-emerald-600">
        <i class="pi pi-megaphone" style="font-size: 1.3rem"></i>
      </span>
    </header>
    <main class="flex-1 p-4 flex flex-col gap-4 pb-[104px]">
      <div 
        class="flex items-center gap-[10px] bg-[#ecfdf5] border-l-[4px] 
               border-l-[#10b981] rounded-[10px] p-[11px_13px]"
      >        
        <i class="pi pi-info-circle" style="font-size: 1.3rem; color: green"></i>
        <span class="text-[12.5px] text-[#065f46] font-semibold leading-[1.45] text-pretty">
          Escolha quem vai receber a lista no WhatsApp.
        </span>
      </div>
      <h2 class="m-[4px_0_0] text-[15px] font-extrabold text-[#1e293b]">
        Membros da família
      </h2>
      <button       
        v-for="membro in membros" :key="membro.login"
        class="flex items-center gap-[12px] bg-[#ffffff] border-[1.5px] 
               border-[#eef2f6] rounded-[14px] p-[13px] cursor-pointer 
               text-left w-full shadow-[0_2px_8px_rgba(15,23,42,0.04)] 
               active:scale-[0.99] transition"
        @click="confirmarEnvio(membro)"       
      >
        <span 
          class="w-[42px] h-[42px] rounded-full bg-[#d1fae5] 
                text-[#047857] flex items-center justify-center 
                text-[17px] font-extrabold shrink-0"
        >
          {{ membro.nomeCompleto.charAt(0) }}
        </span>
        <span class="flex-1 min-w-0 flex flex-col gap-[3px]">
          <strong 
            class="text-[14.5px] font-extrabold text-[#1e293b] leading-[1.25] 
                   overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ membro.nomeCompleto }}
          </strong>
          <span class="text-[12px] text-[#64748b] font-semibold">
            {{ '@' + membro.login }}{{ membro.flChefeDeFamilia == 'S' ? ' · Chefe da Família' : ''}}
          </span>
          <span class="flex items-center gap-[5px] text-[12.5px] text-[#15803d] font-bold">          
            <i class="pi pi-whatsapp" style="font-size: 0.7rem"></i>
            {{ membro.telefone }}
          </span>
        </span>          
      </button>
    </main>
  </div>
  <GlobalLoading />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSweetAlert2 } from '@/composables/useSweetAlert2';
import FamiliaClient from '@/client/FamiliaClient';
import ListaDeCompraClient from '@/client/ListaDeCompraClient';
import MembroDaFamilia from '@/dto/MembroDaFamilia';
import ListaDeCompra from '@/dto/ListaDeCompra';

const router = useRouter();

const alert = useSweetAlert2();

const listaClient = new ListaDeCompraClient();

const familiaClient = new FamiliaClient();

const lista = ref<ListaDeCompra>();

const membros = ref<MembroDaFamilia[]>([]);

onMounted(async () => {
  lista.value = await listaClient.buscarPor(props.idDaLista);
  membros.value = await familiaClient.listarTodos();
});

const props = defineProps<{
  idDaLista: number
}>();



const confirmarEnvio = (membro: MembroDaFamilia) => {

  alert.showQuestionWithHTML(
    "Enviar notificação?",
    `<div style="font-size:14px;line-height:1.55;color:#475569">Notificar 
    <strong>${membro.nomeCompleto}</strong> pelo WhatsApp 
    <strong>${membro.telefone}</strong> com a lista 
    <strong>${lista.value?.nome}</strong> 
    (${lista.value?.qtde} ${lista.value?.qtde === 1 ? 'item' : 'itens'})?</div>`,
    "Sim, notificar",
    () => {
      if (lista.value){
        listaClient.notificar(lista.value.id, membro.login)
          .then(() => {
            alert.showSuccess("Mensagem enviada com sucesso!");
          });  
      }
    }
  );
  
}

const redirectToListagem = () => {
  router.push("/lista-compra/listagem");
}
</script>