import { ref } from "vue"

export const useConviteValidator = () => {

  const nomeDoChefe = ref<string>("");

  const nomeDaFamlia = ref<string>("");

  const convite = ref<string>("");

  const registrarConvite = (token: string) => {
    convite.value = token;
    let partesDoConvite = atob(convite.value).split(",");
    nomeDoChefe.value = partesDoConvite[1];
    nomeDaFamlia.value = partesDoConvite[3];
  }

  const isConviteValido = (): boolean => {

    if (convite.value && convite.value.trim() !== ""){
      let validadeInMillis = parseInt(atob(convite.value).split(",")[4]);
      let agoraInMillis = new Date().getTime();
      return validadeInMillis > agoraInMillis;
    }

    return false;
  }

  return {
    nomeDoChefe,
    nomeDaFamlia,
    registrarConvite,
    isConviteValido
  }

}