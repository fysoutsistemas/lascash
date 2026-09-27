import { plainToInstance } from "class-transformer";
import clientHttp from "@/composables/useAxios";
import ResetDeSenha from "@/dto/ResetDeSenha";
import SenhaResetada from "@/dto/SenhaResetada";

export default class ResetDeSenhaClient {

  private URI: string = "/reset-senha";

  public async gerarCodigoOTP(login: string): Promise<void> {
    await clientHttp.post(`${this.URI}/${login}`);
  }

  public async validarCodigoPor(login: string, codigo: string): Promise<ResetDeSenha> {
    let body = { 'login': login, 'codigo': codigo };
    const response = await clientHttp.post(`${this.URI}/verificacao`, body);
    return plainToInstance(ResetDeSenha, response.data as ResetDeSenha);
  }

  public async processar(senhaResetada: SenhaResetada): Promise<void> {
    await clientHttp.patch(this.URI, senhaResetada);
  }

}