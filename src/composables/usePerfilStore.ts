import type ResumoDaContaDeUsuario from "@/dto/ResumoDaContaDeUsuario";

export const usePerfilStore = () => {

  const registrarToken = (token: string) => {
    if (token && token.trim() !== ""){      
      let login = atob(token).split(",")[0];
      localStorage.setItem("login", login);
      localStorage.setItem("token", token);
      localStorage.setItem("isOcultarValores", "true");
    }
  }

  const logout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    localStorage.removeItem("nomeCompleto");
    localStorage.removeItem("nomeDaFamilia");
  }

  const isTokenValido = (): boolean => {

    let token = localStorage.getItem("token");

    if (token && token.trim() !== ""){            
      let validadeInMillis = parseInt(atob(token).split(",")[1]);
      let agoraInMillis = new Date().getTime();
      return validadeInMillis > agoraInMillis;
    }

    return false;
    
  }

  const getToken = (): string => {
    return localStorage.getItem("token") ?? "";
  }

  const getLogin = (): string => {
    return localStorage.getItem("login") ?? "Não Informado";
  }

  const getNomeCompleto = (): string => {
    return localStorage.getItem("nomeCompleto") ?? "Não Informado";
  }

  const getNomeDaFamilia = (): string => {
    return localStorage.getItem("nomeDaFamilia") ?? "Não Informada";
  }

  const atualizar = (resumoDaConta: ResumoDaContaDeUsuario) => {
    localStorage.setItem("nomeCompleto", resumoDaConta.nomeCompleto);
    localStorage.setItem("nomeDaFamilia", resumoDaConta.nomeDaFamilia);
  }

  const atualizarOcultarValores = (isOcultar: boolean) => {  
    localStorage.setItem("isOcultarValores", String(isOcultar));
  }

  const getOcultarValores = (): boolean => {    
    return localStorage.getItem("isOcultarValores") == 'true';
  }

  return {
    registrarToken,
    atualizar,
    logout,
    isTokenValido,
    getToken,
    getLogin,
    getNomeCompleto,
    getNomeDaFamilia,
    atualizarOcultarValores,
    getOcultarValores
  }

};
