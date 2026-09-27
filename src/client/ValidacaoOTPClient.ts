import clientHttp from "@/composables/useAxios";

export default class ValidacaoOTPClient {

  private URI: string = "/validacoes-otp";

  public async gerarCodigoOTP(login: string, telefone: string): Promise<void> {
    let body = { 'login': login, 'telefone': telefone };
    await clientHttp.post(`${this.URI}/nova-conta`, body);
  }

}