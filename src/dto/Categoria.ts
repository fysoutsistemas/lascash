export default class Categoria {
  constructor(
    public id: number = 0,
    public nome: string = "",
    public icone: string = "",
    public cor: string = "",
    public limite: number = 0,
    public status: string = "A"
  ){}  
}