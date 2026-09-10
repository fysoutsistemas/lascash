import { Expose, Type } from "class-transformer";
import DiagnosticoDoOrc from "./DiagnosticoDoOrc";

export default class ResumoGeralDeOrc {

  private _dataDeInicio: Date;

  private _dataDeTermino: Date | null;

  private _dataDeTerminoProjetada: Date | null;

  private _diagnostico: DiagnosticoDoOrc;

  constructor(
    public idDoOrcamento: number = 0,
    dataDeInicio?: Date, 
    public diasDecorridos: number = 0, 
    public totalGasto: number = 0.0,
    public percGasto: number = 0,
    public totalDisponivel: number = 0.0,
    public limite: number = 0.0,
    public mediaDeGastoDia: number = 0.0,
    dataDeTermino?: Date,
    public diasRestantes: number = 0,
    dataDeTerminoProjetada?: Date,
    diagnostico?: DiagnosticoDoOrc
  ){
    this._dataDeInicio = dataDeInicio ?? new Date();
    this._dataDeTermino = dataDeTermino ?? null;
    this._dataDeTerminoProjetada = dataDeTerminoProjetada ?? null;    
    this._diagnostico = diagnostico ?? new DiagnosticoDoOrc();
  }

  @Expose({ name: 'diagnostico' })
  @Type(() => DiagnosticoDoOrc)
  public get diagnostico(): DiagnosticoDoOrc {
    return this._diagnostico;
  }
  
  public set diagnostico(valor: DiagnosticoDoOrc){    
    this._diagnostico = valor;
  }

  @Expose({ name: 'dataDeInicio' })
  @Type(() => Date)
  public get dataDeInicio(): Date {
    return this._dataDeInicio;
  }
  
  public set dataDeInicio(valor: Date){    
    this._dataDeInicio = valor;
  }

  @Expose({ name: 'dataDeTermino' })
  @Type(() => Date)
  public get dataDeTermino(): Date {
    return this._dataDeTermino;
  }
  
  public set dataDeTermino(valor: Date){    
    this._dataDeTermino = valor;
  }

  @Expose({ name: 'dataDeTerminoProjetada' })
  @Type(() => Date)
  public get dataDeTerminoProjetada(): Date {
    return this._dataDeTerminoProjetada;
  }
  
  public set dataDeTerminoProjetada(valor: Date){    
    this._dataDeTerminoProjetada = valor;
  }

}