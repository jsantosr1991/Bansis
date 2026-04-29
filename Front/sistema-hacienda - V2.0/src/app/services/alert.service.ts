import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // 🔥 TOAST GLOBAL
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  /* =========================
   * TOASTS (rápidos)
   * ========================= */

  success(message: string) {
    this.toast.fire({
      icon: 'success',
      title: message
    });
  }

  info(message: string) {
    this.toast.fire({
      icon: 'info',
      title: message
    });
  }

  warning(message: string) {
    this.toast.fire({
      icon: 'warning',
      title: message
    });
  }

  error(message: string) {
    this.toast.fire({
      icon: 'error',
      title: message
    });
  }

  /* =========================
   * MODALES (importantes)
   * ========================= */

  modalInfo(title: string, message: string) {
    return Swal.fire({
      icon: 'info',
      title,
      html: message,
      confirmButtonText: 'Entendido'
    });
  }

  modalError(title: string, message: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text: message
    });
  }

  modalWarning(title: string, message: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message
    });
  }

  confirm(title: string, message: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
  }
}
