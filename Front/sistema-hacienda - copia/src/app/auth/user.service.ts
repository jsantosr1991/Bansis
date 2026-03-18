
import { Injectable } from '@angular/core';

/**
 * @deprecated ESTE SERVICIO ESTÁ DUPLICADO Y NO CONTIENE LA SESIÓN REAL.
 * Utilizar en su lugar: import { UserService } from 'src/app/services/user.service';
 * 
 * Se mantiene este archivo temporalmente para evitar errores de compilación críticos
 * en partes no detectadas del sistema, pero su uso DEBE evitarse.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {
    console.warn('ALERTA: Se está instanciando el UserService obsoleto en src/app/auth/user.service.ts');
  }

  getUser(): any { return null; }
  getUsername(): string { return 'Invitado (Servicio Obsoleto)'; }
  getCodEmpleado(): number { return 0; }
  getRolId(): number { return 0; }
  getGroupId(): number { return 0; }
  isAuthenticated(): boolean { return false; }
  clearUser(): void {}
  setUser(): void {}
  setUserFromToken(): void {}
}
