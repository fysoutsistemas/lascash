export default class ResumoDeComprasDaCateg {
  constructor(
    public nome: string = "",
    public cor: string = "",
    public total: number = 0.0,
    public percentual: number = 0,
    //Esses atributos não são enviados pela API
    //Foram criados para apoiar na plotagem de grafico
    public dasharray: string = "",
    public dashoffset: string = ""
  ){}
}