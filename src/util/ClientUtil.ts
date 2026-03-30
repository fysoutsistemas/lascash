import clientHttp from "@/composables/useAxios";
import type { AxiosResponse } from "axios";
import { plainToInstance, type ClassConstructor } from "class-transformer";
import { mapearPagina, type IPagina } from "@/util/PaginacaoUtil";

/**
 * Busca o recurso criado a partir do header Location da resposta.
 * Padrão utilizado após operações POST que retornam 201 Created.
 */
export const buscarRecursoCriado = async <T>(
  response: AxiosResponse,
  tipo?: ClassConstructor<T>
): Promise<T> => {
  const location = response.headers.location;
  const resultado = await clientHttp.get(location);

  if (tipo) {
    return plainToInstance(tipo, resultado.data as T);
  }

  return resultado.data;
};

/**
 * Transforma a resposta em uma instância da classe especificada.
 */
export const transformarResposta = <T>(
  response: AxiosResponse,
  tipo: ClassConstructor<T>
): T => {
  return plainToInstance(tipo, response.data as T);
};

/**
 * Transforma a resposta paginada em IPagina<T>.
 */
export const transformarRespostaPaginada = <T>(
  response: AxiosResponse,
  tipo: ClassConstructor<T>
): IPagina<T> => {
  return mapearPagina(response, tipo);
};

/**
 * Extrai os dados da resposta sem transformação.
 */
export const extrairDados = <T>(response: AxiosResponse): T => {
  return response.data;
};
