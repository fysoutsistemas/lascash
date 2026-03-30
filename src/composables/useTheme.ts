import { ref, computed } from 'vue';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// === Utilitários de manipulação de cores ===
const limitarValor = (valor: number, minimo = 0, maximo = 100) => 
  Math.min(maximo, Math.max(minimo, valor));

const converterHexParaRgb = (hex: string) => {
  const resultado = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!resultado) {
    return null;
  }
  
  return { 
    r: parseInt(resultado[1], 16), 
    g: parseInt(resultado[2], 16), 
    b: parseInt(resultado[3], 16) 
  };
};

const converterRgbParaHex = (r: number, g: number, b: number) => {
  const paraHex = (numero: number) => numero.toString(16).padStart(2, '0');
  const rLimitado = limitarValor(Math.round(r), 0, 255);
  const gLimitado = limitarValor(Math.round(g), 0, 255);
  const bLimitado = limitarValor(Math.round(b), 0, 255);
  
  return `#${paraHex(rLimitado)}${paraHex(gLimitado)}${paraHex(bLimitado)}`;
};

const converterRgbParaHsl = (r: number, g: number, b: number) => {
  const rNormalizado = r / 255;
  const gNormalizado = g / 255;
  const bNormalizado = b / 255;
  
  const valorMaximo = Math.max(rNormalizado, gNormalizado, bNormalizado);
  const valorMinimo = Math.min(rNormalizado, gNormalizado, bNormalizado);
  
  let matiz = 0;
  let saturacao = 0;
  const luminosidade = (valorMaximo + valorMinimo) / 2;

  if (valorMaximo !== valorMinimo) {
    const diferenca = valorMaximo - valorMinimo;
    saturacao = luminosidade > 0.5 
      ? diferenca / (2 - valorMaximo - valorMinimo) 
      : diferenca / (valorMaximo + valorMinimo);
      
    switch (valorMaximo) {
      case rNormalizado: 
        matiz = (gNormalizado - bNormalizado) / diferenca + (gNormalizado < bNormalizado ? 6 : 0);
        break;
      case gNormalizado: 
        matiz = (bNormalizado - rNormalizado) / diferenca + 2;
        break;
      default: 
        matiz = (rNormalizado - gNormalizado) / diferenca + 4;
    }
    matiz /= 6;
  }
  
  return { 
    h: matiz * 360, 
    s: saturacao * 100, 
    l: luminosidade * 100 
  };
};

const converterHslParaRgb = (matiz: number, saturacao: number, luminosidade: number) => {
  const matizNormalizada = ((matiz % 360) + 360) % 360;
  const saturacaoNormalizada = limitarValor(saturacao) / 100;
  const luminosidadeNormalizada = limitarValor(luminosidade) / 100;

  if (saturacaoNormalizada === 0) {
    const valor = luminosidadeNormalizada * 255;
    return { r: valor, g: valor, b: valor };
  }

  const q = luminosidadeNormalizada < 0.5 
    ? luminosidadeNormalizada * (1 + saturacaoNormalizada) 
    : luminosidadeNormalizada + saturacaoNormalizada - luminosidadeNormalizada * saturacaoNormalizada;
  const p = 2 * luminosidadeNormalizada - q;

  const calcularComponenteRgb = (p: number, q: number, t: number) => {
    let tNormalizado = t;
    if (tNormalizado < 0) {
      tNormalizado += 1;
    }

    if (tNormalizado > 1) {
      tNormalizado -= 1;
    }

    if (tNormalizado < 1/6) {
      return p + (q - p) * 6 * tNormalizado;
    }

    if (tNormalizado < 1/2) {
      return q;
    }

    if (tNormalizado < 2/3) {
      return p + (q - p) * (2/3 - tNormalizado) * 6;
    }

    return p;
  };

  const r = calcularComponenteRgb(p, q, matizNormalizada/360 + 1/3);
  const g = calcularComponenteRgb(p, q, matizNormalizada/360);
  const b = calcularComponenteRgb(p, q, matizNormalizada/360 - 1/3);
  
  return { r: r * 255, g: g * 255, b: b * 255 };
};

const converterHslParaHex = (matiz: number, saturacao: number, luminosidade: number) => {
  const { r, g, b } = converterHslParaRgb(matiz, saturacao, luminosidade);
  return converterRgbParaHex(r, g, b);
};

// === Configuração da escala de cores perceptual ===
// Ajustes de luminosidade (em pontos percentuais) baseados no tom 500
const AJUSTES_LUMINOSIDADE: Record<number, number> = {
  50: +38, 100: +31, 200: +23, 300: +15, 400: +8,
  500: 0,
  600: -9, 700: -18, 800: -27, 900: -36, 950: -45
};

// Fatores de saturação: tons claros mantêm saturação; tons escuros reduzem
const FATORES_SATURACAO: Record<number, number> = {
  50: 1.05, 100: 1.02, 200: 1.00, 300: 1.00, 400: 1.00,
  500: 1.00,
  600: 0.69, 700: 0.67, 800: 0.69, 900: 0.67, 950: 0.67
};

const gerarEscalaPerceptual = (corBaseHex: string) => {
  const rgb = converterHexParaRgb(corBaseHex);
  if (!rgb) {
    return {};
  }

  const { h: matiz, s: saturacao, l: luminosidade } = converterRgbParaHsl(rgb.r, rgb.g, rgb.b);
  const escalaDeCores: Record<number, string> = {};

  const tons = Object.keys(AJUSTES_LUMINOSIDADE).map(Number).sort((a, b) => a - b);
  
  tons.forEach((tom) => {
    const ajusteLuminosidade = AJUSTES_LUMINOSIDADE[tom];
    const fatorSaturacao = FATORES_SATURACAO[tom] ?? 1.0;

    const novaLuminosidade = limitarValor(luminosidade + ajusteLuminosidade);
    
    // Realce sutil para tons mais claros
    const realceLuz = tom === 50 ? 0.05 : tom === 100 ? 0.02 : 0;
    const novaSaturacao = limitarValor(
      saturacao * fatorSaturacao + (100 - saturacao) * realceLuz
    );

    escalaDeCores[tom] = converterHslParaHex(matiz, novaSaturacao, novaLuminosidade);
  });

  return escalaDeCores;
};

// === Composable principal ===
const corPrimaria = ref('#00d4aa'); // cor padrão verde

export const useTheme = () => {
  const temaAtual = computed(() => {
    const escalaDeCores = gerarEscalaPerceptual(corPrimaria.value);
    
    return definePreset(Aura, {
      semantic: {
        primary: escalaDeCores
      }
    });
  });

  const atualizarCorPrimaria = (novaCor: string) => {
    const isCorValida = /^#?[0-9a-f]{6}$/i.test(novaCor);
    if (isCorValida) {
      const corNormalizada = novaCor.startsWith('#') ? novaCor : `#${novaCor}`;
      corPrimaria.value = corNormalizada;

      const escalaDeCores = gerarEscalaPerceptual(corNormalizada);
      const elementoRaiz = document.documentElement;

      // Aplicar variáveis CSS customizadas
      Object.entries(escalaDeCores).forEach(([tom, hex]) => {
        elementoRaiz.style.setProperty(`--p-primary-${tom}`, hex);
      });
      elementoRaiz.style.setProperty('--p-primary-color', corNormalizada);

      // Disparar evento personalizado para outras partes da aplicação
      window.dispatchEvent(
        new CustomEvent('mudanca-tema', { 
          detail: { 
            corPrimaria: corNormalizada, 
            escalaDeCores 
          } 
        })
      );
    }
  };

  const resetarTema = () => atualizarCorPrimaria('#00d4aa')

  return {
    corPrimaria: computed(() => corPrimaria.value),
    temaAtual,
    atualizarCorPrimaria,
    resetarTema
  };
};