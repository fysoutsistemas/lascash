export default class NovaContaDeUsuario {
  constructor(
    public login: string = "",
    public nomeDaFamilia: string = "",
    public orcamentoMensal: string = "0,00",
    public senha: string = "",
    public confirmacao: string = "",
    public nomeCompleto: string = ""
  ){}
}