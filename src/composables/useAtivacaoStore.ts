import { instanceToPlain, plainToInstance } from "class-transformer";
import NovaContaDeUsuario from "@/dto/NovaContaDeUsuario";
import NovoMembro from "@/dto/NovoMembro";

export const useAtivacaoStore = () => {  
  
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

  return {
    getNovoMembro,
    removerMembro,
    salvarMembro,
    getNovaContaDeUsuario,
    removerConta,
    salvarConta
  }

};