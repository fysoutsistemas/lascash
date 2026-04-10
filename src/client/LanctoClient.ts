import clientHttp from "@/composables/useAxios";
import Lancamento from "@/dto/Lancamento";
import PainelFinanceiro from "@/dto/PainelFinanceiro";
import DateUtil from "@/util/DateUtil";
import { plainToInstance } from "class-transformer";

export default class LanctoClient {

  private URI: string = "/lanctos";

  public async buscarUltimoPainel(): Promise<PainelFinanceiro> {
    
    const response = await clientHttp.get(`${this.URI}/painel`);

    return plainToInstance(PainelFinanceiro, response.data as PainelFinanceiro);

  }

  public async inserir(novoLancto: Lancamento): Promise<PainelFinanceiro>{

    novoLancto.data = DateUtil.formatarDataBrParaAPI(novoLancto.data);
    
    await clientHttp.post(this.URI, novoLancto);

    return this.buscarUltimoPainel();

  }

  public async removerPor(id: number): Promise<void>{
    await clientHttp.delete(`${this.URI}/id/${id}`);
  }

}