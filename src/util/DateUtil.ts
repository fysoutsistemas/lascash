/**
 * Classe utilitária para operações com datas
 */
export default class DateUtil {

  /**
   * Converte uma string de data (formato ISO YYYY-MM-DD) para um objeto Date no timezone local
   * Evita o problema de conversão UTC que subtrai horas e muda o dia
   * @param dataString - String de data no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
   * @returns Objeto Date no timezone local
   */
  static parseDataLocal(dataString: string | Date): Date {
    // Se já for um Date, retorna
    if (dataString instanceof Date) {
      return dataString;
    }

    // Se a string contém horário (tem 'T'), use o construtor normal
    if (dataString.includes('T')) {
      return new Date(dataString);
    }

    // Para strings apenas com data (YYYY-MM-DD), cria o Date no timezone local
    const [ano, mes, dia] = dataString.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  /**
   * Formata uma data no padrão brasileiro (dd/mm/aaaa)
   * @param data - Data a ser formatada
   * @returns String no formato dd/mm/aaaa
   */
  static formatarData(data: string | Date): string {
    const dataObj = this.parseDataLocal(data);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dataObj);
  }

  /**
   * Formata uma data com horário no padrão brasileiro (dd/mm/aaaa hh:mm:ss)
   * @param data - Data a ser formatada (string ISO ou objeto Date)
   * @returns String no formato dd/mm/aaaa hh:mm:ss
   */
  static formatarDataHora(data: string | Date): string {
    const dataObj = this.parseDataLocal(data);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(dataObj);
  }

  /**
   * Formata uma data no padrão ISO para APIs (aaaa-mm-dd)
   * @param data - Data a ser formatada
   * @returns String no formato aaaa-mm-dd
   */
  static formatarDataParaAPI(data: Date): string {
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calcula e formata o tempo relativo desde uma data
   * @param data - Data a ser comparada (string ISO ou objeto Date)
   * @returns String descritiva do tempo relativo (ex: "há 5 min", "há 2 dias")
   */
  static formatarHoraRelativa(data: string | Date): string {
    const dataObj = this.parseDataLocal(data);
    const agora = new Date();
    const diffMs = agora.getTime() - dataObj.getTime();
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMinutos < 1) {
      return 'agora mesmo';
    }

    if (diffMinutos < 60) {
      return `há ${diffMinutos} min`;
    }

    if (diffHoras < 24) {
      return `há ${diffHoras}h`;
    }

    if (diffDias < 7) {
      return `há ${diffDias} dia(s)`;
    }
    
    return this.formatarData(dataObj);
  }

  /**
   * Cria uma data subtraindo um número específico de dias
   * @param dias - Número de dias a subtrair
   * @param dataBase - Data base (padrão: hoje)
   * @returns Nova data com os dias subtraídos
   */
  static subtrairDias(dias: number, dataBase: Date = new Date()): Date {
    return new Date(dataBase.getTime() - dias * 24 * 60 * 60 * 1000);
  }

  /**
   * Cria uma data adicionando um número específico de dias
   * @param dias - Número de dias a adicionar
   * @param dataBase - Data base (padrão: hoje)
   * @returns Nova data com os dias adicionados
   */
  static adicionarDias(dias: number, dataBase: Date = new Date()): Date {
    return new Date(dataBase.getTime() + dias * 24 * 60 * 60 * 1000);
  }

  /**
   * Verifica se uma data é anterior a outra
   * @param dataInicial - Primeira data
   * @param dataFinal - Segunda data
   * @returns true se dataInicial for anterior a dataFinal
   */
  static isDataAnterior(dataInicial: Date, dataFinal: Date): boolean {
    return dataInicial < dataFinal;
  }

  /**
   * Verifica se uma data é posterior a outra
   * @param dataInicial - Primeira data
   * @param dataFinal - Segunda data
   * @returns true se dataInicial for posterior a dataFinal
   */
  static isDataPosterior(dataInicial: Date, dataFinal: Date): boolean {
    return dataInicial > dataFinal;
  }

  /**
   * Verifica se duas datas são do mesmo dia
   * @param data1 - Primeira data
   * @param data2 - Segunda data
   * @returns true se as datas forem do mesmo dia
   */
  static isMesmoDia(data1: Date, data2: Date): boolean {
    return data1.getFullYear() === data2.getFullYear() &&
           data1.getMonth() === data2.getMonth() &&
           data1.getDate() === data2.getDate();
  }

  /**
   * Obtém o início do dia (00:00:00) para uma data
   * @param data - Data de referência
   * @returns Nova data com horário zerado
   */
  static inicioDoDia(data: Date): Date {
    const novaData = new Date(data);
    novaData.setHours(0, 0, 0, 0);
    return novaData;
  }

  /**
   * Obtém o fim do dia (23:59:59) para uma data
   * @param data - Data de referência
   * @returns Nova data com horário no final do dia
   */
  static fimDoDia(data: Date): Date {
    const novaData = new Date(data);
    novaData.setHours(23, 59, 59, 999);
    return novaData;
  }

  /**
   * Calcula a diferença em dias entre duas datas
   * @param dataInicial - Data inicial
   * @param dataFinal - Data final
   * @returns Número de dias de diferença
   */
  static diferencaEmDias(dataInicial: Date, dataFinal: Date): number {
    const diffMs = dataFinal.getTime() - dataInicial.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica se uma data está dentro de um intervalo
   * @param data - Data a verificar
   * @param dataInicial - Data inicial do intervalo
   * @param dataFinal - Data final do intervalo
   * @returns true se a data estiver no intervalo
   */
  static isDataNoIntervalo(data: Date, dataInicial: Date, dataFinal: Date): boolean {
    return data >= dataInicial && data <= dataFinal;
  }

  /**
   * Cria um array de datas em um intervalo
   * @param dataInicial - Data inicial
   * @param dataFinal - Data final
   * @returns Array com todas as datas do intervalo
   */
  static criarIntervaloDeDatas(dataInicial: Date, dataFinal: Date): Date[] {
    const datas: Date[] = [];
    const dataAtual = new Date(dataInicial);
    
    while (dataAtual <= dataFinal) {
      datas.push(new Date(dataAtual));
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
    
    return datas;
  }
}