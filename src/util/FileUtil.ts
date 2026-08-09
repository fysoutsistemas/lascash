
export default class FileUtil {

  static isTamanhoLiberado(base64File: string, tamanhoMaximo: number): boolean {
    return tamanhoMaximo >= this.getSize(base64File);
  }

  static getSize(base64File: string): number {

    if (base64File){

      // Remove o prefixo Data URL caso exista (ex: "data:image/png;base64,")
      const base64Data = base64File.includes(',') ? base64File.split(',')[1] : base64File;

      // Conta a quantidade de caracteres de preenchimento '=' no final da string
      const paddingMatches = base64Data.match(/=/g);
      const padding = paddingMatches ? paddingMatches.length : 0;

      // Cada 4 caracteres em Base64 representam 3 bytes de dados reais
      const bytes = (base64Data.length * 3) / 4 - padding;

      // Converte de Bytes para Megabytes (1024 * 1024)
      const sizeInMB = bytes / (1024 * 1024);

      //Converte os 6 primeiros digitos do resultado
      return Number(sizeInMB.toFixed(1));

    }

    return 0;

  }

}