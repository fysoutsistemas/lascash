import { Expose, Type } from "class-transformer";
import CategoriaDoProduto from "./CategoriaDoProduto";
import Familia from "./Familia";

export default class Produto {

  private _dataDaUltimaCompra: Date;

  private _familia: Familia;

  private _categoria: CategoriaDoProduto;

  constructor(
    public id: number = 0,
    public descricao: string = "",
    public foto: string = "",
    public precoEstimado = "0,00",
    dataDaUltimaCompra?: Date,
    public status: string = "A",
    familia?: Familia,
    categoria?: CategoriaDoProduto,
    public loginDoCriador: string = ""
  ){
    this._familia = familia ?? new Familia();
    this._dataDaUltimaCompra = dataDaUltimaCompra ?? new Date();
    this._categoria = categoria ?? new CategoriaDoProduto();
  }

  @Expose({ name: 'familia' })
  @Type(() => Familia)
  public get familia(): Familia {
     return this._familia;
  }
  
  public set familia(valor: Familia){
    this._familia = valor;
  }

  @Expose({ name: 'categoria' })
  @Type(() => CategoriaDoProduto)
  public get categoria(): CategoriaDoProduto {
     return this._categoria;
  }
  
  public set categoria(valor: CategoriaDoProduto){
    this._categoria = valor;
  }

  @Expose({ name: 'dataDaUltimaCompra' })
  @Type(() => Date)
  public get dataDaUltimaCompra(): Date {
    return this._dataDaUltimaCompra;
  }

  public set dataDaUltimaCompra(valor: Date){    
    this._dataDaUltimaCompra = valor;
  }

}