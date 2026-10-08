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
    localStorage.removeItem("flCategsConfigs");
    localStorage.removeItem("flChefeDaFamilia");
    localStorage.removeItem("fotoDoUsuario");
    localStorage.removeItem("qtdeDeMembros");
    localStorage.removeItem("tipoDeConta");
    localStorage.removeItem("telefoneDeAtendimento");
    localStorage.removeItem("flExpirada");
    localStorage.removeItem("diasRestantes");
    localStorage.removeItem("percRestante");
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

  const getFotoDoUsuario = (): string => {
    return localStorage.getItem("fotoDoUsuario") ?? "";
  }

  const getQtdeDeMembros = (): number => {
    return Number(localStorage.getItem("qtdeDeMembros") ?? 1);
  }

  const atualizar = (resumoDaConta: ResumoDaContaDeUsuario) => {
    
    localStorage.setItem("nomeCompleto", resumoDaConta.nomeCompleto);
    localStorage.setItem("nomeDaFamilia", resumoDaConta.nomeDaFamilia);
    localStorage.setItem("flCategsConfigs", resumoDaConta.flCategoriasConfiguradas);
    localStorage.setItem("flChefeDaFamilia", resumoDaConta.flChefeDaFamilia);
    localStorage.setItem("fotoDoUsuario", resumoDaConta.foto);
    localStorage.setItem("qtdeDeMembros", String(resumoDaConta.qtdeDeMembros));
    
    if (resumoDaConta.resumoDaAssinatura){

      let resDaAss = resumoDaConta.resumoDaAssinatura;
      
      localStorage.setItem("tipoDeConta", resDaAss.tipo);
      localStorage.setItem("telefoneDeAtendimento", resDaAss.telefoneDeAtendimento);
      localStorage.setItem("flExpirada", resDaAss.flExpirada);
      localStorage.setItem("diasRestantes", String(resDaAss.diasRestantes));
      localStorage.setItem("percRestante", String(resDaAss.percRestante));

    }

  }

  const atualizarOcultarValores = (isOcultar: boolean) => {  
    localStorage.setItem("isOcultarValores", String(isOcultar));
  }

  const getOcultarValores = (): boolean => {    
    return localStorage.getItem("isOcultarValores") == 'true';
  }

  const atualizarCategsConfigs = (flag: string) => {
    localStorage.setItem("flCategsConfigs", flag);
  }

  const isCategsConfiguradas = (): boolean => {
    return localStorage.getItem("flCategsConfigs") == 'S';
  }

  const isChefeDeFamilia = (): boolean => {
    return localStorage.getItem("flChefeDaFamilia") == 'S';
  }

  const getTipoDeConta = (): string => {
    return localStorage.getItem("tipoDeConta") ?? "Não Informado";
  }

  const getTelefoneDeAtendimento = (): string => {
    return localStorage.getItem("telefoneDeAtendimento") ?? "Não Informado";
  }

  const isAssinaturaExpirada = () : boolean => {
    return localStorage.getItem("flExpirada") == 'S';
  }

  const getDiasRestantes = (): number => {
    return Number(localStorage.getItem("diasRestantes") ?? 0);
  }

  const getPercRestante = () => {
    return Number(localStorage.getItem("percRestante") ?? 0);
  }

  return {
    getTipoDeConta,
    getTelefoneDeAtendimento,
    isAssinaturaExpirada,
    getDiasRestantes,
    getPercRestante,
    registrarToken,
    atualizar,
    logout,
    isTokenValido,
    getToken,
    getLogin,
    getNomeCompleto,
    getNomeDaFamilia,
    getFotoDoUsuario,
    atualizarOcultarValores,
    getOcultarValores,
    atualizarCategsConfigs,
    isCategsConfiguradas,
    isChefeDeFamilia,
    getQtdeDeMembros
  }

};
