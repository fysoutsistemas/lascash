import { Expose, Type } from "class-transformer";
import ResumoPorCategoria from "./ResumoPorCategoria";

export default class ResumoGeral {

  private _resumosPorCategoria: ResumoPorCategoria[];

  constructor(
    public totalGasto: number = 0,
    public totalOrcado: number = 0,
    public percentualGasto: number = 0,
    resumosPorCategoria?: ResumoPorCategoria[]
  ){
    this._resumosPorCategoria = resumosPorCategoria ?? [];
  }

  @Expose({ name: 'resumosPorCategoria' })
  @Type(() => ResumoPorCategoria)
  public get resumosPorCategoria(): ResumoPorCategoria[] {
    return this._resumosPorCategoria;
  }

  public set resumosPorCategoria(valor: ResumoPorCategoria[]){
    this._resumosPorCategoria = valor;
  }

}