import { Expose, Type } from "class-transformer";
import ResumoDeComprasDaCateg from "./ResumoDeComprasDaCateg";

export default class DashboardDeCompras {

  private _resumosPorCateg: ResumoDeComprasDaCateg[];

  constructor(
    public totalComprado: number = 0.0,
    public totalDeListas: number = 0,
    public periodoEmDias: number = 0,
    resumosPorCateg?: ResumoDeComprasDaCateg[]
  ){
    this._resumosPorCateg = resumosPorCateg ?? [];
  }

  @Expose({ name: 'resumosPorCateg' })
  @Type(() => ResumoDeComprasDaCateg)
  public get resumosPorCateg(): ResumoDeComprasDaCateg[] {
    return this._resumosPorCateg;
  }

  public set resumosPorCateg(valor: ResumoDeComprasDaCateg[]){
    this._resumosPorCateg = valor;
  }

}