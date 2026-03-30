import clientHttp from "@/composables/useAxios";
import type Usuario from "@/dto/Usuario";

export default class LoginClient {

  private URI: string = `${import.meta.env.VITE_URL_GOOGLE}`;

  public async autenticar(usuario: Usuario): Promise<string> {
  
    const response = await clientHttp.post(this.URI, usuario, {'params': { 'acao': 'logar'}});

    return response.data.content.token;

  }

}