export default class SenhaResetada {
  constructor(
    public login: string = "",
    public codigoOTP: string = "",
    public novaSenha: string = "",
    public confirmacao: string = ""
  ){}
}