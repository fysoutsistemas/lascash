import clientHttp from "@/composables/useAxios";
import Categoria from "@/dto/Categoria";
import { plainToInstance } from "class-transformer";

export default class CategoriaClient {

  private URI: string = "/categorias";

  public async listarTodas(): Promise<Categoria[]> {
    
    let categorias: Categoria[] = [];

    const response = await clientHttp.get( `${this.URI}/ativas`);

    response.data.forEach((categoria: Categoria) => {
      categorias.push(plainToInstance(Categoria, categoria as Categoria));
    });

    return categorias;

  }

}