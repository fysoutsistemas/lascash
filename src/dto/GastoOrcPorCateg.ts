export default class GastoOrcPorCateg {
  constructor(
    public idDaCategoria: number = 0,
    public nomeDaCategoria: string = "",
    public corDaCategoria: string = "",    
    public limite: number = 0.0,
    public percGastoDoOrc: number = 0,
    public percGastoDaCateg: number = 0,
    public totalGasto: number = 0.0
  ){}
}