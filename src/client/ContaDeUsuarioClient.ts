import clientHttp from "@/composables/useAxios";
import ContaDeUsuarioEditada from "@/dto/ContaDeUsuarioEditada";
import NovaContaDeUsuario from "@/dto/NovaContaDeUsuario";
import ResumoDaContaDeUsuario from "@/dto/ResumoDaContaDeUsuario";
import { plainToInstance } from "class-transformer";

export default class ContaDeUsuarioClient {

  private URI: string = "/contas-usuarios";

  public async registrar(novaConta: NovaContaDeUsuario): Promise<void> {
    await clientHttp.post(`${this.URI}/registrar`, novaConta);
  }

  public async atualizar(contaEditada: ContaDeUsuarioEditada): Promise<ResumoDaContaDeUsuario> {
    const response = await clientHttp.put(`${this.URI}/me`, contaEditada);
    return plainToInstance(ResumoDaContaDeUsuario, response.data as ResumoDaContaDeUsuario);
  }

  public async buscarResumo(): Promise<ResumoDaContaDeUsuario> {
    const response = await clientHttp.get(`${this.URI}/me`);
    return plainToInstance(ResumoDaContaDeUsuario, response.data as ResumoDaContaDeUsuario);
  }

}