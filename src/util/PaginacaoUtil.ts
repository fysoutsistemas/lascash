import type { AxiosResponse } from 'axios';
import { plainToInstance, Type, type ClassConstructor } from 'class-transformer';

export interface IPagina<T> {
    totalDeItens: number;
    paginaAtual: number;
    totalDePaginas: number;
    listagem: T[];
}

const criarPaginaDe = <T>(tipoDoItem: ClassConstructor<T>): new () => IPagina<T> => {
    class Pagina implements IPagina<T> {
        totalDeItens!: number;
        paginaAtual!: number;
        totalDePaginas!: number;

        @Type(() => tipoDoItem)
        listagem!: T[];
    }
    return Pagina;
};

export const mapearPagina = <T>(response: AxiosResponse, tipoDoItem: ClassConstructor<T>): IPagina<T> => {
    if (response.status === 204) {
        return {
            totalDeItens: 0,
            paginaAtual: 0,
            totalDePaginas: 0,
            listagem: []
        };
    }

    const ClassePagina = criarPaginaDe(tipoDoItem);
    return plainToInstance(ClassePagina, response.data);
};