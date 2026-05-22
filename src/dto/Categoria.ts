export default class Categoria {
  constructor(
    public id: number = 0,
    public nome: string = "",
    public icone: string = "",
    public cor: string = "",
    public limite: string = "0,00",
    public status: string = "A"
  ){}  
}