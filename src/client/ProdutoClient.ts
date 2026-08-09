import clientHttp from "@/composables/useAxios";
import NovoProduto from "@/dto/NovoProduto";
import Produto from "@/dto/Produto";
import ProdutoSalvo from "@/dto/ProdutoSalvo";
import { plainToInstance } from "class-transformer";

export default class ProdutoClient {

  private URI: string = "/produtos";

  public async salvar(produto: Produto): Promise<Produto> {
    if (produto.id == 0){
      let novoProduto = new NovoProduto();
      novoProduto.descricao = produto.descricao;
      novoProduto.precoEstimado = produto.precoEstimado;
      novoProduto.foto = produto.foto;
      novoProduto.categoria = produto.categoria;
      return await this.inserir(novoProduto);
    }else{
      let produtoSalvo = new ProdutoSalvo();
      produtoSalvo.id = produto.id;
      produtoSalvo.descricao = produto.descricao;
      produtoSalvo.precoEstimado = produto.precoEstimado
      produtoSalvo.foto = produto.foto;
      produtoSalvo.categoria = produto.categoria;
      return await this.alterar(produtoSalvo);
    }
  }

  private async inserir(novoProduto: NovoProduto): Promise<Produto> {
    let response = await clientHttp.post(`${this.URI}`, novoProduto);
    response = await clientHttp.get(response.headers['location']);
    return plainToInstance(Produto, response.data as Produto);
  }

  private async alterar(produtoSalvo: ProdutoSalvo): Promise<Produto> {
    const response = await clientHttp.put(`${this.URI}`, produtoSalvo);
    return plainToInstance(Produto, response.data as Produto);
  }

  public async inativarPor(id: number): Promise<Produto> {
    const response = await clientHttp.patch(`${this.URI}/${id}/inativo`);
    return plainToInstance(Produto, response.data as Produto);
  }

  public async buscarPor(id: number): Promise<Produto> {
    const response = await clientHttp.get(`${this.URI}/id/${id}`);
    return plainToInstance(Produto, response.data as Produto);
  }

  public async listarAtivos(): Promise<Produto[]> {

    let produtos: Produto[] = [];

    const response = await clientHttp.get(`${this.URI}/ativos`);

    if (response.data){

      response.data.forEach((produto: Produto) => {
        produtos.push(plainToInstance(Produto, produto as Produto));
      });

    }

    return produtos;

  }

}