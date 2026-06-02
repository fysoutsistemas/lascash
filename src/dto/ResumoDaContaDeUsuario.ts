export default class ResumoDaContaDeUsuario {
  constructor(
    public login: string = "",
    public nomeCompleto: string = "",
    public nomeDaFamilia: string = "",
    public flCategoriasConfiguradas: string = "N",
    public flChefeDaFamilia: string = "N"
  ){}
}