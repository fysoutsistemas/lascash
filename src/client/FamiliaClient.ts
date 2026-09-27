import clientHttp from "@/composables/useAxios";
import MembroDaFamilia from "@/dto/MembroDaFamilia";
import { plainToInstance } from "class-transformer";

export default class FamiliaClient {
  
  private URI: string = "/familias";

  public async listarTodos(): Promise<MembroDaFamilia[]> {
  
    let membros: MembroDaFamilia[] = [];
    
    const response = await clientHttp.get(`${this.URI}/membros`);

    response.data.forEach((membro: MembroDaFamilia) => {
      membros.push(plainToInstance(MembroDaFamilia, membro as MembroDaFamilia));
    });

    return membros;

  }

}