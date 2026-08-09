import { Expose, Type } from "class-transformer";
import Produto from "./Produto";

export default class ItemDaLista {

  private _produto: Produto;

  constructor(
    public ordem: number = 0,
    produto?: Produto,
    public preco: number = 0.0,
    public qtde: number = 0.0,
    public subtotal: number = 0.0,
    public flagNoCarrinho: string = "N"
  ){
    this._produto = produto ?? new Produto();
  }

  @Expose({ name: 'produto' })
  @Type(() => Produto)
  public get produto(): Produto {
    return this._produto;
  }

  public set produto(valor: Produto){
    this._produto = valor;
  }

}