import { Expose, Type } from "class-transformer";
import ItemDaListaResumido from "./ItemDaListaResumido";

export default class ListaDeCompraSalva {

  private _itens: ItemDaListaResumido[];

  constructor(
    public id: number = 0,
    public nome: string = "",
    itens: ItemDaListaResumido[]
  ){
    this._itens = itens ?? [];
  }

  @Expose({ name: 'itens' })
  @Type(() => ItemDaListaResumido)
  public get itens(): ItemDaListaResumido[] {
    return this._itens;
  }
  
  public set itens(valor: ItemDaListaResumido[]){
    this._itens = valor;
  }

}