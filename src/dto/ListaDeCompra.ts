import { Expose, Type } from "class-transformer";
import Familia from "./Familia";
import ItemDaLista from "./ItemDaLista";

export default class ListaDeCompra {

  private _dataDeMovto: Date;

  private _familia: Familia;
  
  private _itens: ItemDaLista[]

  constructor(
    public id: number = 0,
    public nome: string = "",
    public qtde: number = 0,
    public totalEstimado: number = 0.0,
    public totalDaCompra: number = 0.0,
    public difDeTotais: number = 0.0,
    public status: string = "NOVA",
    familia?: Familia,
    dataDeMovto?: Date,
    public flAtivo: string = "A",
    itens?: ItemDaLista[],
    public loginCriador: string = "",
    public loginComprador: string = ""
  ){
    this._familia = familia ?? new Familia();
    this._dataDeMovto = dataDeMovto ?? new Date();
    this._itens = itens ?? [];
  }

  @Expose({ name: 'familia' })
  @Type(() => Familia)
  public get familia(): Familia {
    return this._familia;
  }
    
  public set familia(valor: Familia){
    this._familia = valor;
  }

  @Expose({ name: 'dataDeMovto' })
  @Type(() => Date)
  public get dataDeMovto(): Date {
    return this._dataDeMovto;
  }

  public set dataDeMovto(valor: Date){    
    this._dataDeMovto = valor;
  }

  @Expose({ name: 'itens' })
  @Type(() => ItemDaLista)
  public get itens(): ItemDaLista[] {
    return this._itens;
  }

  public set itens(valor: ItemDaLista[]){
    this._itens = valor;
  }

}