import clientHttp from "@/composables/useAxios";
import Orcamento from "@/dto/Orcamento";
import ProgressoDoOrcamento from "@/dto/ProgressoDoOrcamento";
import { plainToInstance } from "class-transformer";

export default class OrcamentoClient {
  
  private URI: string = "/orcamentos";

  public async inserir(novoOrcamento: Orcamento): Promise<void> {
    await clientHttp.post(`${this.URI}/me`, novoOrcamento);
  }

  public async alterar(limite: number): Promise<Orcamento> {
    const response = await clientHttp.put(`${this.URI}/me`, { 'limite': limite });
    return plainToInstance(Orcamento, response.data as Orcamento);
  }

  public async buscarProgresso(): Promise<ProgressoDoOrcamento> {
    const response = await clientHttp.get(`${this.URI}/progresso/me`);
    return plainToInstance(ProgressoDoOrcamento, response.data as ProgressoDoOrcamento);
  }

}