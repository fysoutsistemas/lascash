import { Expose, Type } from "class-transformer";

export default class ResumoDaAssinatura {

  private _vencimento: Date | null;

  constructor(
    public tipo: string, 
    public diasRestantes: number,
    public percRestante: number,
    public flExpirada: string,
    public telefoneDeAtendimento: string,
    vencimento?: Date    
  ){
    this._vencimento = vencimento ?? null;
  }

  @Expose({ name: 'vencimento' })
  @Type(() => Date)
  public get vencimento(): Date | null{
    return this._vencimento;
  }
    
  public set vencimento(valor: Date){    
    this._vencimento = valor;
  }

}