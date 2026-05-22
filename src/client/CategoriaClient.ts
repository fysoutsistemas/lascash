import clientHttp from "@/composables/useAxios";
import Categoria from "@/dto/Categoria";
import NovoLimiteDaCategoria from "@/dto/NovoLimiteDaCategoria";
import { plainToInstance } from "class-transformer";

export default class CategoriaClient {

  private URI: string = "/categorias";

  public async listarTodas(): Promise<Categoria[]> {
    
    let categorias: Categoria[] = [];

    const response = await clientHttp.get( `${this.URI}/me`);

    response.data.forEach((categoria: Categoria) => {
      categorias.push(plainToInstance(Categoria, categoria as Categoria));
    });

    return categorias;

  }

  public async alterarLimiteDeTodas(limites: NovoLimiteDaCategoria[]): Promise<Categoria[]> {

    let categoriasAtualizadas: Categoria[] = [];

    const response = await clientHttp.put( `${this.URI}/all/me`, limites);

    response.data.forEach((categoria: Categoria) => {
      categoriasAtualizadas.push(plainToInstance(Categoria, categoria as Categoria));
    });

    return categoriasAtualizadas;    

  }

}