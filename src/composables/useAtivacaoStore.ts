import { instanceToPlain, plainToInstance } from "class-transformer";
import NovaContaDeUsuario from "@/dto/NovaContaDeUsuario";
import NovoMembro from "@/dto/NovoMembro";

export const useAtivacaoStore = () => {
  
  const salvarCodigoOTP = (codigo: string) => {
    localStorage.setItem("codigoOTP", codigo);
  }

  const salvarInfosDoReset = (login: string, telefone: string) => {
    localStorage.setItem("telefone", telefone);
    localStorage.setItem("login", login);
  }
  
  const salvarMembro = (novoMembro: NovoMembro) => {
    localStorage.setItem("novoMembro", JSON.stringify(instanceToPlain(novoMembro)));
  }

  const salvarConta = (novaConta: NovaContaDeUsuario) => {
    localStorage.setItem("novaContaDeUsuario", JSON.stringify(instanceToPlain(novaConta)));
  }

  const removerMembro = () => {
    localStorage.removeItem("novoMembro");  
  }

  const removerConta = () => {        
    localStorage.removeItem("novaContaDeUsuario");  
  }

  const removerReset = () => {
    localStorage.removeItem("codigoOTP");
    localStorage.removeItem("telefone");
    localStorage.removeItem("login");
  }

  const getNovoMembro = (): NovoMembro | null => {

    if (localStorage.getItem("novoMembro") != null){
      let membroJson = JSON.parse(localStorage.getItem("novoMembro") ?? "");
      return plainToInstance(NovoMembro, membroJson as NovoMembro);
    }

    return null;

  }  

  const getNovaContaDeUsuario = (): NovaContaDeUsuario | null => {

    if (localStorage.getItem("novaContaDeUsuario") != null){
      let contaJson = JSON.parse(localStorage.getItem("novaContaDeUsuario") ?? ""); 
      return plainToInstance(NovaContaDeUsuario, contaJson as NovaContaDeUsuario);
    }

    return null;

  }

  const getTelefone = (): string => {
    return localStorage.getItem("telefone") ?? "";
  }

  const getLogin = (): string => {
    return localStorage.getItem("login") ?? "";
  }

  const getCodigoOTP = (): string => {
    return localStorage.getItem("codigoOTP") ?? "";
  }

  return {
    getCodigoOTP,
    getTelefone,
    getLogin,
    getNovoMembro,
    removerMembro,
    salvarMembro,
    getNovaContaDeUsuario,
    removerConta,
    salvarConta,
    salvarInfosDoReset,
    salvarCodigoOTP,
    removerReset
  }

};