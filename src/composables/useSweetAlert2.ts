import Swal, { type SweetAlertIcon } from "sweetalert2";

export const useSweetAlert2 = () => {

  const showError = (msg: string, titulo = "Erro", textConfirm = "OK") => {
    showMsg('error', titulo, msg, textConfirm);
  }

  const showInfo = (msg: string, titulo = "Info", textConfirm = "OK") => {
    showMsg('info', titulo, msg, textConfirm);
  }
  
  const showSuccess = (msg: string, titulo = "Sucesso", textConfirm = "OK") => {
    showMsg('success', titulo, msg, textConfirm);
  }

  const showWarn = (msg: string, titulo = "Aviso", textConfirm = "OK") => {
    showMsg('success', titulo, msg, textConfirm);
  }

  const showMsg = (
    tipo: SweetAlertIcon, 
    titulo: string, 
    msg: string, 
    textConfirm = "OK"
  ) => {
    Swal.fire({
      icon: tipo,
      title: titulo,
      text: msg,
      confirmButtonText: textConfirm,
      buttonsStyling: false,
      customClass: { 
        popup: 'larcash-popup', 
        confirmButton: 'larcash-confirm' 
      }
    });
  }

  return {
    showSuccess,
    showError,
    showWarn,
    showInfo
  }

}