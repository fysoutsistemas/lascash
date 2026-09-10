import { plainToInstance } from "class-transformer";
import clientHttp from "@/composables/useAxios";
import IndicadoresGerais from "@/dto/IndicadoresGerais";
import GastoOrcPorCateg from "@/dto/GastoOrcPorCateg";

export default class IndicadoresGeraisClient {

  private URI: string = "/indicadores";

  public async buscarPor(ano: number, mes: number): Promise<IndicadoresGerais>{
    let response = await clientHttp.get(`${this.URI}/gerais/ano/${ano}/mes/${mes}/me`);
    return plainToInstance(IndicadoresGerais, response.data as IndicadoresGerais);
  }

  public async listarGastosPor(idDoOrcamento: number): Promise<GastoOrcPorCateg[]>{
    
    let gastos: GastoOrcPorCateg[] = [];

    const response = await clientHttp.get(`${this.URI}/gerais/orcamento/${idDoOrcamento}`);

    if (response.data){

      response.data.forEach((gasto: GastoOrcPorCateg) => {
        gastos.push(plainToInstance(GastoOrcPorCateg, gasto as GastoOrcPorCateg));
      });

    }

    return gastos;

  }

}