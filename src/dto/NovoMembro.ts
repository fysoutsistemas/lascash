export default class NovoMembro {
  constructor(
    public login: string = "",
    public senha: string = "",
    public confirmacao: string = "",
    public nomeCompleto: string = "",
    public tokenDoConvite: string = ""
  ){}
}