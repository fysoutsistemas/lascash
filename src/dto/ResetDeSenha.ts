import { Expose, Type } from "class-transformer";

export default class ResetDeSenha {

  private _dataDeMovto: Date | null;

  private _validoAte: Date | null;

  private _proximoEnvio: Date | null;

  constructor(
    public login: string = "",
    public codigoOTP: string = "",
    dataDeMovto?: Date,
    validoAte?: Date,
    proximoEnvio?: Date,
    public flResetada: string = ""
  ){
    this._dataDeMovto = dataDeMovto ?? null;
    this._validoAte = validoAte ?? null;
    this._proximoEnvio = proximoEnvio ?? null;
  }

  @Expose({ name: 'dataDeMovto' })
  @Type(() => Date)
  public get dataDeMovto(): Date | null{
    return this._dataDeMovto;
  }
    
  public set dataDeMovto(valor: Date){    
    this._dataDeMovto = valor;
  }

  @Expose({ name: 'validoAte' })
  @Type(() => Date)
  public get validoAte(): Date | null{
    return this._validoAte;
  }
    
  public set validoAte(valor: Date){    
    this._validoAte = valor;
  }

  @Expose({ name: 'proximoEnvio' })
  @Type(() => Date)
  public get proximoEnvio(): Date | null{
    return this._proximoEnvio;
  }
    
  public set proximoEnvio(valor: Date){    
    this._proximoEnvio = valor;
  }

}