import clientHttp from "@/composables/useAxios";
import CategoriaDoProduto from "@/dto/CategoriaDoProduto";
import { plainToInstance } from "class-transformer";

export default class CategoriaDoProdClient {

  private URI: string = "/categs-produtos";

  public async listarAtivas(): Promise<CategoriaDoProduto[]>{

    let categorias: CategoriaDoProduto[] = [];

    const response = await clientHttp.get( `${this.URI}/ativas`);

    response.data.forEach((categoria: CategoriaDoProduto) => {
      categorias.push(plainToInstance(CategoriaDoProduto, categoria as CategoriaDoProduto));
    });

    return categorias;

  }

}