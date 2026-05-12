import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {


  /* =========================
   * TOAST BASE (GLOBAL)
   * ========================= */
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  /* =========================
   * TOASTS PRO (TIPO ODOO)
   * ========================= */

  success(message: string) {
    this.toast.fire({
      icon: 'success',
      title: message,
      background: '#f0fdf4',
      color: '#166534',
      iconColor: '#22c55e'
    });
  }

  info(message: string) {
    this.toast.fire({
      icon: 'info',
      title: message,
      background: '#eff6ff',
      color: '#1e3a8a',
      iconColor: '#3b82f6'
    });
  }

  warning(message: string) {
    this.toast.fire({
      icon: 'warning',
      title: message,
      background: '#fffbeb',
      color: '#92400e',
      iconColor: '#f59e0b'
    });
  }

  error(message: string) {
    this.toast.fire({
      icon: 'error',
      title: message,
      background: '#fef2f2',
      color: '#991b1b',
      iconColor: '#ef4444'
    });
  }

  /* =========================
   * LOADING (🔥 CLAVE PRO)
   * ========================= */

  loading(message: string = 'Procesando...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }

  /* =========================
   * MODALES PRO
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
      text: message,
      confirmButtonColor: '#dc2626'
    });
  }

  modalWarning(title: string, message: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonColor: '#f59e0b'
    });
  }

  /* =========================
   * CONFIRMACIÓN PRO
   * ========================= */

  confirm(title: string, message: string) {
    return Swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280'
    });
  }

  /* =========================
   * ACCIÓN EXITOSA (MODAL GRANDE)
   * ========================= */

  successModal(title: string, message: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: '#16a34a'
    });
  }
}
