/**
 * Classe utilitária para operações com valores monetários
 */
export default class CurrencyUtil {

  /**
   * Formata para o valor monetário em Reais (R$)
   * @param valor - Valor a ser formatado
   * @returns String no formato R$0.000,00
   */
  static toBRL(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  }
}