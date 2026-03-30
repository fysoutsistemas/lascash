import { Expose, Type } from "class-transformer";
import Categoria from "./Categoria";

export default class ResumoPorCategoria {

  private _categoria: Categoria;

  constructor(
    categoria?: Categoria,
    public gastos: number = 0,
    public percentual: number = 0 
  ){
    this._categoria = categoria ?? new Categoria();
  }

  @Expose({ name: 'categoria' })
  @Type(() => Categoria)
  public get categoria(): Categoria {
    return this._categoria;
  }

  public set categoria(valor: Categoria){
    this._categoria = valor;
  }

}