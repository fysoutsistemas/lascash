import { instanceToPlain, plainToInstance } from "class-transformer";
import NovaContaDeUsuario from "@/dto/NovaContaDeUsuario";

export const useAtivacaoStore = () => {  
  
  const salvarConta = (novaConta: NovaContaDeUsuario) => {
    localStorage.setItem("novaContaDeUsuario", JSON.stringify(instanceToPlain(novaConta)));    
  }

  const removerConta = () => {        
    localStorage.removeItem("novaContaDeUsuario");  
  }

  const getNovaContaDeUsuario = (): NovaContaDeUsuario | null => {

    if (localStorage.getItem("novaContaDeUsuario") != null){
      let contaJson = JSON.parse(localStorage.getItem("novaContaDeUsuario") ?? ""); 
      return plainToInstance(NovaContaDeUsuario, contaJson as NovaContaDeUsuario);
    }

    return null;

  }

  return {
    getNovaContaDeUsuario,
    removerConta,
    salvarConta
  }

};