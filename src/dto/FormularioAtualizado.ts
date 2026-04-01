import { Expose, Type } from "class-transformer";
import Lancamento from "./Lancamento";
import ResumoGeral from "./ResumoGeral";

export default class FormularioAtualizado {

  private _resumoGeral: ResumoGeral;

  private _lanctos: Lancamento[];

  constructor(
    resumoGeral?: ResumoGeral,
    lanctos?: Lancamento[]
  ){
    this._resumoGeral = resumoGeral ?? new ResumoGeral();
    this._lanctos = lanctos ?? [];
  }

  @Expose({ name: 'resumoGeral' })
  @Type(() => ResumoGeral)
  public get resumoGeral(): ResumoGeral {
    return this._resumoGeral;
  }

  public set resumoGeral(valor: ResumoGeral){
    this._resumoGeral = valor;
  }

  @Expose({ name: 'lanctos' })
  @Type(() => Lancamento)
  public get lanctos(): Lancamento[] {
    return this._lanctos;
  }

  public set lanctos(valor: Lancamento[]){
    this._lanctos = valor;
  }

}