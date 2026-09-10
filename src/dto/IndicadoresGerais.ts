import { Expose, Type } from "class-transformer";
import GastoOrcPorCateg from './GastoOrcPorCateg';
import MaiorGastoDeProduto from './MaiorGastoDeProduto';
import ResumoGeralDeOrc from "./ResumoGeralDeOrc";
import EconomiaEmCompras from "./EconomiaEmCompras";
import ResumoGeralDeCompras from "./ResumoGeralDeCompras";
import MaiorGastoDoOrc from "./MaiorGastoDoOrc";

export default class IndicadoresGerais {
  
  private _resumosGeraisDeOrc: ResumoGeralDeOrc[];

  private _gastosOrcPorCategs: GastoOrcPorCateg[];

  private _maiorGastoDoOrc: MaiorGastoDoOrc;

  private _economiaEmCompras: EconomiaEmCompras | null;

  private _resumoGeralDeCompras: ResumoGeralDeCompras;

  private _maioresGastosDeProd: MaiorGastoDeProduto[];

  constructor(
    public ano: number = 0,
    public mes: number = 0,
    resumosGeraisDeOrc?: ResumoGeralDeOrc[],
    gastosOrcPorCategs?: GastoOrcPorCateg[],
    maiorGastoDoOrc?: MaiorGastoDoOrc,
    economiaEmCompras?: EconomiaEmCompras,
    resumoGeralDeCompras?: ResumoGeralDeCompras,
    maioresGastosDeProd?: MaiorGastoDeProduto[]
  ){
    this._resumosGeraisDeOrc = resumosGeraisDeOrc ?? [];
    this._gastosOrcPorCategs = gastosOrcPorCategs ?? [];
    this._maiorGastoDoOrc = maiorGastoDoOrc ?? new MaiorGastoDoOrc();
    this._economiaEmCompras = economiaEmCompras ?? null;
    this._resumoGeralDeCompras = resumoGeralDeCompras ?? new ResumoGeralDeCompras();
    this._maioresGastosDeProd = maioresGastosDeProd ?? [];
  }

  @Expose({ name: 'maioresGastosDeProd' })
  @Type(() => MaiorGastoDeProduto)
  public get maioresGastosDeProd(): MaiorGastoDeProduto[] {
    return this._maioresGastosDeProd;
  }
      
  public set maioresGastosDeProd(valor: MaiorGastoDeProduto[]){
    this._maioresGastosDeProd = valor;
  }    

  @Expose({ name: 'resumoGeralDeCompras' })
  @Type(() => ResumoGeralDeCompras)
  public get resumoGeralDeCompras(): ResumoGeralDeCompras {
    return this._resumoGeralDeCompras;
  }
      
  public set resumoGeralDeCompras(valor: ResumoGeralDeCompras){
    this._resumoGeralDeCompras = valor;
  }

  @Expose({ name: 'economiaEmCompras' })
  @Type(() => EconomiaEmCompras)
  public get economiaEmCompras(): EconomiaEmCompras {
    return this._economiaEmCompras;
  }
      
  public set economiaEmCompras(valor: EconomiaEmCompras){
    this._economiaEmCompras = valor;
  } 

  @Expose({ name: 'maiorGastoDoOrc' })
  @Type(() => MaiorGastoDoOrc)
  public get maiorGastoDoOrc(): MaiorGastoDoOrc {
    return this._maiorGastoDoOrc;
  }
      
  public set maiorGastoDoOrc(valor: MaiorGastoDoOrc){
    this._maiorGastoDoOrc = valor;
  }  

  @Expose({ name: 'gastosOrcPorCategs' })
  @Type(() => GastoOrcPorCateg)
  public get gastosOrcPorCategs(): GastoOrcPorCateg[] {
    return this._gastosOrcPorCategs;
  }
      
  public set gastosOrcPorCategs(valor: GastoOrcPorCateg[]){
    this._gastosOrcPorCategs = valor;
  }  

  @Expose({ name: 'resumosGeraisDeOrc' })
  @Type(() => ResumoGeralDeOrc)
  public get resumosGeraisDeOrc(): ResumoGeralDeOrc[] {
    return this._resumosGeraisDeOrc;
  }
      
  public set resumosGeraisDeOrc(valor: ResumoGeralDeOrc[]){
    this._resumosGeraisDeOrc = valor;
  }

}