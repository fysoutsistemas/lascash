import clientHttp from "@/composables/useAxios";
import type SolicitacaoDeToken from "@/dto/SolicitacaoDeToken";

export default class LoginClient {

  private URI: string = "/auth";

  public async autenticar(solicitacao: SolicitacaoDeToken): Promise<string> {

    solicitacao.login = solicitacao.login.toLowerCase();
  
    const response = await clientHttp.post(this.URI, solicitacao);

    return response.data.token;

  }

}