import { Expose, Type } from "class-transformer";
import ResumoDaAssinatura from "./ResumoDaAssinatura";

export default class ResumoDaContaDeUsuario {

  private _resumoDaAssinatura: ResumoDaAssinatura | null

  constructor(
    public login: string = "",
    public nomeCompleto: string = "",
    public nomeDaFamilia: string = "",
    public flCategoriasConfiguradas: string = "N",
    public flChefeDaFamilia: string = "N",
    public foto: string,
    public qtdeDeMembros: number = 0,
    resumoDaAssinatura?: ResumoDaAssinatura
  ){
    this._resumoDaAssinatura = resumoDaAssinatura ?? null;
  }

  @Expose({ name: 'resumoDaAssinatura' })
  @Type(() => ResumoDaAssinatura)
  public get resumoDaAssinatura(): ResumoDaAssinatura | null {
    return this._resumoDaAssinatura;
  }
    
  public set resumoDaAssinatura(valor: ResumoDaAssinatura) {
    this._resumoDaAssinatura = valor;
  }

}