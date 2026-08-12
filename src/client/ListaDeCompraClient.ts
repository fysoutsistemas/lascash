import clientHttp from "@/composables/useAxios";
import type ItemDoCarrinho from "@/dto/ItemDoCarrinho";
import ListaDeCompra from "@/dto/ListaDeCompra";
import type ListaDeCompraSalva from "@/dto/ListaDeCompraSalva";
import NovaListaDeCompra from "@/dto/NovaListaDeCompra";
import ResumoDaLista from "@/dto/ResumoDaLista";
import { mapearPagina, type IPagina } from "@/util/PaginacaoUtil";
import { plainToInstance } from "class-transformer";

export default class ListaDeCompraClient {

  private URI: string = "/compras";

  public async inserir(novaLista: NovaListaDeCompra): Promise<ListaDeCompra>{
    let response = await clientHttp.post(`${this.URI}`, novaLista);
    response = await clientHttp.get(response.headers['location']);
    return plainToInstance(ListaDeCompra, response.data as ListaDeCompra);
  }

  public async alterar(listaSalva: ListaDeCompraSalva): Promise<ListaDeCompra>{
    const response = await clientHttp.put(`${this.URI}`, listaSalva);
    return plainToInstance(ListaDeCompra, response.data as ListaDeCompra);
  }

  public async buscarPor(id: number): Promise<ListaDeCompra> {
    const response = await clientHttp.get(`${this.URI}/id/${id}`);
    return plainToInstance(ListaDeCompra, response.data as ListaDeCompra);
  }

  public async listarTodasPor(status?: string, pagina?: number): Promise<IPagina<ListaDeCompra>> {
    
    let paramStatus = status == "TODAS" ? null : status;
    
    const params = {
      'status': paramStatus,
      'pagina': pagina
    }

    const response = await clientHttp.get(this.URI, { params });

    return mapearPagina(response, ListaDeCompra);

  }

  public async listarResumos(): Promise<ResumoDaLista[]> {

    let resumos: ResumoDaLista[] = [];

    const response = await clientHttp.get(`${this.URI}/resumos`);

    let total = 0;

    if (response.data){

      response.data.forEach((resumo: ResumoDaLista) => {
        total += resumo.qtde;
      });

    }

    resumos.push(new ResumoDaLista("TODAS", total));

    resumos.push(...response.data);  

    return resumos;

  }

  public async inativarPor(id: number): Promise<ListaDeCompra> {
    const response = await clientHttp.patch(`${this.URI}/${id}/inativa`);
    return plainToInstance(ListaDeCompra, response.data as ListaDeCompra);
  }

  public async encerrarListaPor(idDaLista: number): Promise<void>{
    await clientHttp.put(`${this.URI}/${idDaLista}/encerrar`);
  }

  public async adicionarNoCarrinhoPor(idDaLista: number, item: ItemDoCarrinho): Promise<void> {
    await clientHttp.put(`${this.URI}/${idDaLista}/carrinho`, item);
  }

  public async retirarDoCarrinhoPor(idDaLista: number, idDoProduto: number): Promise<void> {
    await clientHttp.delete(`${this.URI}/${idDaLista}/produto/${idDoProduto}/carrinho`);  
  }

}