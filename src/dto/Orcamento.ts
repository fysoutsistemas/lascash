import { Expose, Type } from "class-transformer";
import Familia from "./Familia";

export default class Orcamento {

  private _familia: Familia;

  constructor(
    public id?: number,
    public limite: string = "0,00",
    familia?: Familia,
    public status: string = "A"
  ){
    this._familia = familia ?? new Familia();
  }

  @Expose({ name: 'familia' })
  @Type(() => Familia)
  public get familia(): Familia {
    return this._familia;
  }

  public set familia(valor: Familia){
    this._familia = valor;
  }

}