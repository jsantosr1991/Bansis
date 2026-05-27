
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interface/Usuario';

export interface User {
  username: string;
  rol_id: number;
  group_id: number;
  codempleado: string;
  empresa_id: number;
  empe_nom: string;
  // otros campos si quieres
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;
  private user: User | null = null;

  constructor(private http: HttpClient) { }

  setUserFromToken(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.user = {
      username: payload.username,
      codempleado: payload.codempleado,
      rol_id: payload.rol_id,
      group_id: payload.group_id,
      empe_nom: payload.empe_nom,
      empresa_id: payload.empresa_id
    };
  }

  setUser(user: User) {
    this.user = user;

  }

  getUser(): User | null {

    return this.user;
  }

  getUsername(): string | null {
    return this.user?.username ?? 'Invitado';
  }
  getRolId(): number {
    return this.user?.rol_id ?? 0;
  }
  getCodEmpleado(): string | null {
    return this.user?.codempleado ?? '';
  }
  getCodEmpresa(): number {
    return this.user?.empresa_id ?? 0;
  }
  getNomEmpresa(): string | null {
    return this.user?.empe_nom ?? 'Invitado';
  }


  getGroupId(): number {
    return this.user?.group_id ?? 0;
  }

  clearUser() {
    this.user = null;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getlistadminsitrativos');
  }

  getAdministrativos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getlistadminsitrativos');
  }
  getRol(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/listarol');
  }
  getGrupo(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/listagrupo');
  }

  // 🔍 Buscar usuario por nombre o apellido
  buscarUsuario(search: string): Observable<any[]> {
    const url = `${this.baseUrl}/listadminsitrativos?search=${search}`;

    return this.http.get<any[]>(`${this.baseUrl}/listadminsitrativos?search=${search}`);

  }
  buscarOtrosEmpleados(search: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/listaempleados?search=${search}`);
  }

  guardarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrarusuario`, usuario);
  }
  // ✏️ Actualizar usuario
  actualizarUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizarusuario/${id}`, usuario);
  }
  actualizarStatus(id: number, status: number) {
    return this.http.put(`${this.baseUrl}/actualizarusuario/${id}`, { status });
  }
  //
  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/privilegios');
  }

  otorgarPrivilegio(data: any): Observable<any> {

    return this.http.post(this.baseUrl + '/privilegios', data);
  }

  desactivarPrivilegio(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/privilegios/desactivar/${id}`, {});
  }

  obtenerActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/privilegios?activo=1`);
  }

  generarUsername(base: string) {
    return this.http.post<any>(
      `${this.baseUrl}/generar-username`,
      { base }
    );
  }


}
