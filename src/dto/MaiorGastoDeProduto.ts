export default class MaiorGastoDeProduto {
  constructor(
    public idDoProduto: number = 0,
    public descricaoDoProd: string = "",
    public nomeDaCategoria: string = "",
    public corDaCategoria: string = "",    
    public qtdeComprada: number = 0,
    public totalComprado: number = 0.0    
  ){}
}