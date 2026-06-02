import clientHttp from "@/composables/useAxios";
import type NovoMembro from "@/dto/NovoMembro";

export default class ConviteClient {

  private URI: string = "/convites";

  public async gerarLink(): Promise<string> {
    let response = await clientHttp.post(this.URI);
    return response.data['link-novo-membro'];
  }

  public async registrar(novoMembro: NovoMembro): Promise<void> {
    await clientHttp.post(`${this.URI}/registrar`, novoMembro);
  }

}
