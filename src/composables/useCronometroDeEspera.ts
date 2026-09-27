import { computed, ref } from "vue";

const tempoInicial = ref<number>(60);

const tempoRestante = ref<number>(0);

const isEmEspera = ref<boolean>(false);

let intervalo: ReturnType<typeof setInterval> | null = null;

const pararCronometro = (): void => {

  isEmEspera.value = false;

  if (intervalo !== null) {
    clearInterval(intervalo);
    intervalo = null;
  }

};

export const useCronometroDeEspera = () => {  

  const iniciarCronometro = (tempo: number = 60): void => {

    if (!isEmEspera.value){

      tempoInicial.value = tempo;

      tempoRestante.value = tempoInicial.value;

      isEmEspera.value = true;

      intervalo = setInterval(() => {
        if (tempoRestante.value > 0) {
          tempoRestante.value--;
        } else {
          pararCronometro();
        }
      }, 1000);

    }

  };  

  const tempoDecorrido = computed<number>(() => tempoInicial.value - tempoRestante.value);

  const tempoFormatado = computed<string>(() => {

    const minutos = Math.floor(tempoRestante.value / 60);
    
    const segundos = tempoRestante.value % 60;
    
    const minutosStr = String(minutos).padStart(2, '0');
    
    const segundosStr = String(segundos).padStart(2, '0');
    
    return `${minutosStr}:${segundosStr}`;

  });

  return {
    tempoFormatado,
    tempoRestante,
    tempoDecorrido,
    isEmEspera,
    iniciarCronometro,
    pararCronometro
  }

}