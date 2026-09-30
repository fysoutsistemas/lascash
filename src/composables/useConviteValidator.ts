export const useConviteValidator = () => {

  const registrarConvite = (token: string) => {        
    let partesDoConvite = atob(token).split(",");
    localStorage.setItem("convite", token);
    localStorage.setItem("nomeDoChefe", partesDoConvite[1]);
    localStorage.setItem("nomeDaFamilia", partesDoConvite[3]);
  }

  const isConviteValido = (): boolean => {

    let convite = localStorage.getItem("convite") ?? "";

    if (convite && convite.trim() !== ""){
      let validadeInMillis = parseInt(atob(convite).split(",")[4]);
      let agoraInMillis = new Date().getTime();
      return validadeInMillis > agoraInMillis;
    }

    return false;
  }

  const getNomeDoChefe = (): string => {
    return localStorage.getItem("nomeDoChefe") ?? "";
  }

  const getNomeDaFamilia = (): string => {
    return localStorage.getItem("nomeDaFamilia") ?? "";
  }

  return {
    getNomeDoChefe,
    getNomeDaFamilia,
    registrarConvite,
    isConviteValido
  }

}