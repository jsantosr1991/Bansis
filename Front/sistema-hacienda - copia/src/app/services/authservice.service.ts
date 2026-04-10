import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { UserService } from './user.service';

interface JwtPayload {
  username: string; // o usa el nombre real del campo con el username
  rol_id: number;
  group_id: number;// otros campos que incluya el token
  codempleado: string;// otros campos que incluya el token
  empe_nom: string;
  empresa_id: number;
}
interface LoginResponse {
  access_token: string;

  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})


export class AuthserviceService {
  private gruposUsuario: number[] = [];
  private rolesUsuario: number[] = [];
  private gruposMap: { [key: string]: number[] } = {
    administradores: [1],
    sistemas: [2],
    mayordomo: [3],
    jefes: [4],
    fitosanitario: [5],
    gerencia: [6],
    certificaciones: [7],
    empacadora: [8],
    rrhh: [9],
    bodega: [10],
    todos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    campo: [3, 5, 8],
    oficina: [1, 2, 6],

  };
  private rolesMap: { [key: string]: number[] } = {
    superadmin: [1],
    usergerencia: [2],
    userjefefito: [3],
    usermmfito: [4],
    usercampo: [5],
    userjefempacadora: [6],
    userempacadora: [7],
    user: [8],
    userjefevarios: [9],
    todos: [1, 2, 3, 4, 5, 6, 7, 8, 9]

  };
  private baseUrl = environment.apiUrl;

  private permisos$ = new BehaviorSubject<boolean>(false);


  private tokenKey = 'access_token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private userService: UserService) {

    const token = this.getToken();

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        this.userService.setUser({
          username: decoded.username,
          rol_id: decoded.rol_id,
          group_id: decoded.group_id,
          codempleado: decoded.codempleado,
          empe_nom: decoded.empe_nom,
          empresa_id: decoded.empresa_id
        });

        // ✅ Restablecer grupos al recargar la app
        this.setGruposUsuario([decoded.group_id]);

      } catch (e) {
        console.error('Error al decodificar token en constructor', e);
        this.userService.clearUser();
      }
    }

  }
  // ========= SETTERS =========


  setGruposUsuario(grupos: number[]) {
    this.gruposUsuario = [...new Set(grupos)];

  }

  setUserInfo(data: any) {
    const usuario = this.userService.getUser();
    if (!usuario) return;

    usuario.rol_id = data.rol_id;
    usuario.group_id = data.group_id;

    this.userService.setUser(usuario);

    // ?? grupos base + temporal
    const grupos: number[] = [data.group_id];

    if (data.grupo_extra_id) {
      grupos.push(data.grupo_extra_id);
    }


    this.setGruposUsuario(grupos);
  }

  //verifica si el usuario pertnece a un grupo por nombre
  tieneGrupo(nombreGrupo: string): boolean {
    const idsGrupos = this.gruposMap[nombreGrupo];
    //console.log(idsGrupos)
    if (!idsGrupos) return false;

    return this.gruposUsuario.some(id => idsGrupos.includes(id));
  }
  /* tieneRol(nombreRol: string): boolean {
     const idsRoles = this.rolesMap[nombreRol];
    // console.log(idsRoles)
     if (!idsRoles) return false;
 
     const usuario = this.userService.getUser();
     if (!usuario) return false; // 🧩 Evita null
 
     return idsRoles.includes(usuario.rol_id);
   }*/

  tieneRol(nombreRol: string): boolean {
    const idsRoles = this.rolesMap[nombreRol];
    if (!idsRoles) return false;

    const usuario = this.userService.getUser();
    if (!usuario) return false;

    return idsRoles.includes(usuario.rol_id);
  }

  tieneAlgunRol(nombresRoles: string[]): boolean {

    return nombresRoles.some(nombre => this.tieneRol(nombre));
  }

  tieneAlgunGrupo(nombresGrupos: string[]): boolean {

    return nombresGrupos.some(nombre => this.tieneGrupo(nombre));
  }

  login(username: string, password: string): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password })

      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.loggedIn.next(true);

          const decoded = jwtDecode<JwtPayload>(response.access_token);
          this.userService.setUser({
            username: decoded.username,
            rol_id: decoded.rol_id,
            group_id: decoded.group_id,
            codempleado: decoded.codempleado,
            empe_nom: decoded.empe_nom,
            empresa_id: decoded.empresa_id
          });
          const grupos: number[] = [decoded.group_id];
          if ((decoded as any).grupo_extra_id) {
            grupos.push((decoded as any).grupo_extra_id);
          }
          this.setGruposUsuario(grupos);

        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    this.userService.clearUser();
    this.gruposUsuario = []; // << limpiar grupos del usuario anterior
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    this.userService.clearUser();
    this.gruposUsuario = [];
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserInfo(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        //   console.log(decoded)
        return decoded.username; // cambia esto si el campo es distinto, como `username`
      } catch (e) {
        console.error('Token inválido:', e);
        return null;
      }
    }
    return null;
  }

  getUserInfoFromBackend(): Observable<any> {
    const token = this.getToken();
    if (!token) return of(null);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/auth/me`, { headers });
  }

  // ========= DEBUG =========
  getRoles() {
    return this.rolesUsuario;
  }

  getGrupos() {
    return this.gruposUsuario;
  }


  emitirCambioPermisos() {
    this.permisos$.next(true);

  }

  getCambiosPermisos() {
    return this.permisos$.asObservable();
  }


}
