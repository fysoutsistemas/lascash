import { Expose, Type } from "class-transformer";
import Lancamento from "./Lancamento";
import ResumoGeral from "./ResumoGeral";

export default class PainelFinanceiro {

  private _resumoGeral: ResumoGeral;

  private _lancamentos: Lancamento[];

  constructor(
    resumoGeral?: ResumoGeral,
    lancamentos?: Lancamento[]
  ){
    this._resumoGeral = resumoGeral ?? new ResumoGeral();
    this._lancamentos = lancamentos ?? [];
  }

  @Expose({ name: 'resumoGeral' })
  @Type(() => ResumoGeral)
  public get resumoGeral(): ResumoGeral {
    return this._resumoGeral;
  }

  public set resumoGeral(valor: ResumoGeral){
    this._resumoGeral = valor;
  }

  @Expose({ name: 'lancamentos' })
  @Type(() => Lancamento)
  public get lancamentos(): Lancamento[] {
    return this._lancamentos;
  }

  public set lancamentos(valor: Lancamento[]){
    this._lancamentos = valor;
  }

}