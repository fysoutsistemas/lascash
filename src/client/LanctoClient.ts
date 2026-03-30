import clientHttp from "@/composables/useAxios";
import Categoria from "@/dto/Categoria";
import Lancamento from "@/dto/Lancamento";
import ResumoGeral from "@/dto/ResumoGeral";
import { plainToInstance } from "class-transformer";

export default class LanctoClient {

  private URI: string = `${import.meta.env.VITE_URL_GOOGLE}`;  

  public async buscarResumoGeral(): Promise<ResumoGeral> {

    const response = await clientHttp.get(this.URI, {'params': { 'acao': 'buscar-resumo-geral'}});

    return plainToInstance(ResumoGeral, response.data.content as ResumoGeral);

  }

  public async listarCategorias(): Promise<Categoria[]> {

    const response = await clientHttp.get(this.URI, {'params': { 'acao': 'listar-categs'}});

    let categorias: Categoria[] = [];

    response.data.content.forEach((item: any) => {
      categorias.push(plainToInstance(Categoria, item as Categoria));
    });

    return categorias;

  }

  public async listarTodos(): Promise<Lancamento[]> {
    
    const response = await clientHttp.get(this.URI, {'params': { 'acao': 'listar-lanctos'}});

    let lanctos: Lancamento[] = [];

    response.data.content.forEach((item: any) => {
      lanctos.push(plainToInstance(Lancamento, item as Lancamento));
    });

    return lanctos;

  }  

  public async inserir(novoLancto: Lancamento): Promise<void>{
    await clientHttp.post(this.URI, novoLancto, {'params': { 'acao': 'add-lancto'}});
  }

  public async removerPor(id: string): Promise<void>{
    await clientHttp.post(this.URI, null, {'params': { 'acao': 'del-lancto', 'id': id}});
  }

}