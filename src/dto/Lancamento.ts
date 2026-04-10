import { Expose, Type } from "class-transformer";
import Categoria from "./Categoria";

export default class Lancamento {

  private _categoria: Categoria;

  constructor(
    public id: number = 0,
    public descricao: string = "",
    public data: string = "",
    public valor: string = "0,00",
    categoria?: Categoria
  ){
    this._categoria = categoria ?? new Categoria();
  }

  @Expose({ name: 'categoria' })
  @Type(() => Categoria)
  public get categoria(): Categoria {
    return this._categoria;
  }
  
  public set categoria(valor: Categoria) {
    this._categoria = valor;
  }

}