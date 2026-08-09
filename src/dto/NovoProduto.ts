import { Expose, Type } from "class-transformer";
import CategoriaDoProduto from "./CategoriaDoProduto";

export default class NovoProduto {

  private _categoria: CategoriaDoProduto;

  constructor(
    public descricao: string = "",
    public foto: string = "",
    public precoEstimado = "0,00",
    categoria?: CategoriaDoProduto,
  ){
    this._categoria = categoria ?? new CategoriaDoProduto();
  }

  @Expose({ name: 'categoria' })
  @Type(() => CategoriaDoProduto)
  public get categoria(): CategoriaDoProduto {
    return this._categoria;
  }
  
  public set categoria(valor: CategoriaDoProduto){
    this._categoria = valor;
  }  

}  