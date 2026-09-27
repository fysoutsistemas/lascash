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
      allowOutsideClick: false,
      allowEscapeKey: false,
      buttonsStyling: false,
      customClass: { 
        popup: 'larcash-popup', 
        confirmButton: 'larcash-confirm' 
      }
    });
  }

  const showConfirmWithHTML = (
    titulo: string,
    html: string,
    textConfirm: string = "Sim",
    funcao: Function  
  ) => {
    Swal.fire({
      icon: 'success',
      title: titulo,
      html: html,      
      confirmButtonText: textConfirm,            
      buttonsStyling: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'larcash-popup',
        confirmButton: 'larcash-confirm',       
      }
    }).then(r => { 
      funcao();
    });
  }

  const showQuestionWithHTML = (
    titulo: string,
    html: string,
    textConfirm: string = "Sim",
    funcao: Function
  ) => {
    Swal.fire({
      icon: 'question',
      title: titulo,
      html: html,
      showCancelButton: true,
      confirmButtonText: textConfirm,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: { 
        popup: 'larcash-popup', 
        confirmButton: 'larcash-confirm', 
        cancelButton: 'larcash-cancel' 
      }
    }).then(r => { 
      if (r.isConfirmed){
        funcao();
      }
    });
  }

  return {
    showConfirmWithHTML,
    showQuestionWithHTML,
    showSuccess,
    showError,
    showWarn,
    showInfo
  }

}